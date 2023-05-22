# Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import datetime
import json
import logging
import os
import time
import uuid
import boto3

from botocore.config import Config
import botocore.exceptions 

from typing import List

import textractcaller as tc
import textractmanifest as tm

logger = logging.getLogger(__name__)

config = Config(retries={'max_attempts': 0, 'mode': 'standard'})

region = os.environ['AWS_REGION']
dynamo_db_client = boto3.client("dynamodb")
step_functions_client = boto3.client(service_name='stepfunctions')
textract = boto3.client("textract", config=config)

__version__ = "0.0.4"


def convert_manifest_queries_config_to_caller(
        queries_config: List[tm.Query]) -> tc.QueriesConfig:
    if queries_config:
        return tc.QueriesConfig(queries=[
            tc.Query(text=x.text, alias=x.alias, pages=x.pages)
            for x in queries_config
        ])
    else:
        return tc.QueriesConfig(queries=[])


def convert_manifest_features_to_caller(
        features: List[str]) -> List[tc.Textract_Features]:
    if features:
        return [tc.Textract_Features[x] for x in features]
    else:
        return []


class LimitExceededException(Exception):
    pass


class ThrottlingException(Exception):
    pass


class InternalServerError(Exception):
    pass


class ProvisionedThroughputExceededException(Exception):
    pass

class ConnectionClosedException(Exception):
    pass

def lambda_handler(event, _):
    log_level = os.environ.get('LOG_LEVEL', 'INFO')
    logger.setLevel(log_level)
    logger.info(json.dumps(event))
    logger.info(f"version: {__version__}\n \
        textractmanifest version: {tm.__version__}\n \
        boto3 version: {boto3.__version__}\n \
        textractcaller version: {tc.__version__}.")
    notification_sns = os.environ.get('NOTIFICATION_SNS', None)
    if not notification_sns:
        raise Exception("no NOTIFICATION_SNS set")

    s3_output_bucket = os.environ.get('S3_OUTPUT_BUCKET', None)
    if not s3_output_bucket:
        raise Exception("no S3_OUTPUT_BUCKET set")

    s3_temp_output_prefix = os.environ.get('S3_TEMP_OUTPUT_PREFIX', None)
    if not s3_temp_output_prefix:
        raise Exception("no S3_TEMP_OUTPUT_PREFIX set")

    notification_role_arn = os.environ.get('NOTIFICATION_ROLE_ARN', None)
    if not notification_role_arn:
        raise Exception("no NOTIFICATION_ROLE_ARN set")

    token_store_ddb = os.environ.get('TOKEN_STORE_DDB', None)
    if not token_store_ddb:
        raise Exception("no TOKEN_STORE_DDB set")

    textract_api = os.environ.get('TEXTRACT_API', 'GENERIC')

    logger.info(f"LOG_LEVEL: {log_level} \n \
                NOTIFICATION_SNS: {notification_sns} \n \
                NOTIFICATION_ROLE_ARN: {notification_role_arn} \n \
                S3_TEMP_OUTPUT_PREFIX: {s3_temp_output_prefix} \n \
                S3_OUTPUT_BUCKET: {s3_output_bucket} \n \
                TOKEN_STORE_DDB: {token_store_ddb} \n \
                TEXTRACT_API: {textract_api} \n \
                ")

    token = event['Token']
    logger.info(f"token: {token}")

    if not "Payload" in event:
        raise ValueError("Need Payload with manifest to process message.")

    manifest: tm.IDPManifest = tm.IDPManifestSchema().load(
        event["Payload"]['manifest'])  #type: ignore

    number_of_pages: int = 1
    if 'numberOfPages' in event["Payload"]:
        number_of_pages = int(event['Payload']['numberOfPages'])

    s3_path = manifest.s3_path

    logger.info(f"s3_path: {s3_path} \n \
                token: {token} \n \
                ")

    uuid_key = str(uuid.uuid4())
    logger.debug(f"uuid_key: {uuid_key}")
    # TODO: check if item already exists in case of retries
    ddb_response = dynamo_db_client.put_item(
        TableName=token_store_ddb,
        Item={
            "ID": {
                'S': uuid_key
            },
            "Type": {
                'S': "textract_async"
            },
            "Token": {
                'S': token
            },
            "timestampMS": {
                'N': str(round(time.time() * 1000))
            },
            "numberOfPages": {
                'N': str(number_of_pages)
            },
            "ttltimestamp": {
                'N':
                str(
                    int(time.time()) +
                    int(datetime.timedelta(days=7).total_seconds()))
            }
        })
    logger.debug(f"ddb_response: {ddb_response}")
    nc: tc.NotificationChannel = tc.NotificationChannel(
        role_arn=notification_role_arn, sns_topic_arn=notification_sns)
    output_config: tc.OutputConfig = tc.OutputConfig(
        s3_bucket=s3_output_bucket, s3_prefix=s3_temp_output_prefix)
    logger.debug(f"NotificationChannel: {nc}")
    logger.debug(f"OutputConfig: {output_config}")
    try:
        logger.info(
            f"textract_async_{textract_api}_number_of_pages_send_to_process: {number_of_pages}"
        )
        if textract_api == 'GENERIC':
            response = tc.call_textract(
                input_document=s3_path,
                boto3_textract_client=textract,
                output_config=output_config,
                notification_channel=nc,
                job_tag=uuid_key,
                return_job_id=True,
                force_async_api=True,
                features=convert_manifest_features_to_caller(
                    manifest.textract_features),
                queries_config=convert_manifest_queries_config_to_caller(
                    manifest.queries_config))
        elif textract_api == 'EXPENSE':
            response = tc.call_textract_expense(
                input_document=s3_path,
                boto3_textract_client=textract,
                output_config=output_config,
                notification_channel=nc,
                job_tag=uuid_key,
                return_job_id=True,
                force_async_api=True,
            )
        elif textract_api == 'LENDING':
            response = tc.call_textract_lending(
                input_document=s3_path,
                boto3_textract_client=textract,
                output_config=output_config,
                notification_channel=nc,
                job_tag=uuid_key,
                return_job_id=True,
            )
        else:
            raise ValueError(f"unsupported Textract API: {textract_api}")

        logger.info(f"textract_async_{textract_api}_job_started")
        logger.debug(f"Textract-response: {response}")
    # When we can not recover from an exception, respond to workflow as failed
    except textract.exceptions.InvalidS3ObjectException:
        cause = f"InvalidS3ObjectException for object: {s3_path}"
        error = "InvalidS3ObjectException"
        logger.error(cause)
        step_functions_client.send_task_failure(taskToken=token,
                                                error=error,
                                                cause=cause[:250])
    except textract.exceptions.InvalidParameterException:
        error = f"InvalidParameterException"
        cause = f"textract.exceptions.InvalidParameterException: for manifest: {manifest}"
        logger.error(cause)
        step_functions_client.send_task_failure(taskToken=token,
                                                error=error,
                                                cause=cause[:250])
    except textract.exceptions.InvalidKMSKeyException:
        error = f"InvalidKMSKeyException"
        cause = f"textract.exceptions.InvalidKMSKeyException: for manifest: {manifest}"
        logger.error(cause)
    except textract.exceptions.UnsupportedDocumentException:
        error = f"UnsupportedDocumentException"
        cause = f"textract.exceptions.UnsupportedDocumentException: for manifest: {manifest}"
        logger.error(cause)
        step_functions_client.send_task_failure(taskToken=token,
                                                error=error,
                                                cause=cause[:250])
    except textract.exceptions.DocumentTooLargeException:
        error = f"DocumentTooLargeException"
        cause = f"textract.exceptions.DocumentTooLargeException: for manifest: {manifest}"
        logger.error(cause)
        step_functions_client.send_task_failure(taskToken=token,
                                                error=error,
                                                cause=cause[:250])
    except textract.exceptions.BadDocumentException:
        error = f"BadDocumentException"
        cause = f"textract.exceptions.BadDocumentException: for manifest: {manifest}"
        logger.error(cause)
        step_functions_client.send_task_failure(taskToken=token,
                                                error=error,
                                                cause=cause[:250])
    except textract.exceptions.AccessDeniedException:
        error = f"AccessDeniedException"
        cause = f"textract.exceptions.AccessDeniedException: for manifest: {manifest}"
        logger.error(cause)
        step_functions_client.send_task_failure(taskToken=token,
                                                error=error,
                                                cause=cause[:250])
    except textract.exceptions.IdempotentParameterMismatchException:
        error = f"IdempotentParameterMismatchException"
        cause = f"textract.exceptions.IdempotentParameterMismatchException: for manifest: {manifest}"
        logger.error(cause)
        step_functions_client.send_task_failure(taskToken=token,
                                                error=error,
                                                cause=cause[:250])
    except textract.exceptions.ProvisionedThroughputExceededException as e:
        logger.warning(
            f"textract.exceptions.ProvisionedThroughputExceededException")
        raise ProvisionedThroughputExceededException(
            'ProvisionedThroughputExceededException')
    except textract.exceptions.InternalServerError:
        logger.warning(f"textract.exceptions.InternalServerError")
        raise InternalServerError('InternalServerError')
    except textract.exceptions.ThrottlingException:
        logger.warning(f"textract.exceptions.ThrottlingException")
        raise ThrottlingException('ThrottlingException')
    except textract.exceptions.LimitExceededException:
        logger.warning(f"textract.exceptions.LimitExceededException")
        raise LimitExceededException('LimitExceededException')
    except botocore.exceptions.ConnectionClosedError:
        logger.warning(f"ConnectionClosedException")
        raise ConnectionClosedException('ConnectionClosedException')
    except Exception as e:
        error = "not_handled_exception"
        cause = str(e)
        logger.error(e, exc_info=True)
        step_functions_client.send_task_failure(taskToken=token,
                                                error=error,
                                                cause=cause[:250])
