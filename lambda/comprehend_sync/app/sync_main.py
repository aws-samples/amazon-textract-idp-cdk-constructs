# Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import json
import logging
import os
import time
import boto3
import textractmanifest as tm

from botocore.exceptions import ClientError
from typing import List, Tuple

logger = logging.getLogger(__name__)
version = "0.0.1"
s3 = boto3.client('s3')
step_functions_client = boto3.client(service_name='stepfunctions')
sqs = boto3.client('sqs')

comprehend = boto3.client("comprehend")


def split_s3_path_to_bucket_and_key(s3_path: str) -> Tuple[str, str]:
    if len(s3_path) > 7 and s3_path.lower().startswith("s3://"):
        s3_bucket, s3_key = s3_path.replace("s3://", "").split("/", 1)
        return (s3_bucket, s3_key)
    else:
        raise ValueError(
            f"s3_path: {s3_path} is no s3_path in the form of s3://bucket/key."
        )


def get_file_from_s3(s3_path: str, range=None) -> bytes:
    s3_bucket, s3_key = split_s3_path_to_bucket_and_key(s3_path)
    if range:
        o = s3.get_object(Bucket=s3_bucket, Key=s3_key, Range=range)
    else:
        o = s3.get_object(Bucket=s3_bucket, Key=s3_key)
    return o.get('Body').read()


def send_failure_to_step_function(exception_class, error, cause, token,
                                  message):
    error = "not_handled_exception"
    cause = str(exception_class)
    try:
        step_functions_client.send_task_failure(taskToken=token,
                                                error=error,
                                                cause=cause)
    except step_functions_client.exceptions.InvalidToken:
        logger.error(f"InvalidToken for message: {message} ")
    except step_functions_client.exceptions.TaskDoesNotExist:
        logger.error(f"TaskDoesNotExist for message: {message} ")
    except step_functions_client.exceptions.TaskTimedOut:
        logger.error(f"TaskTimedOut for message: {message} ")


def lambda_handler(event, _):
    log_level = os.environ.get('LOG_LEVEL', 'INFO')
    logger.setLevel(log_level)
    logger.info(f"version: {version}")
    logger.info(json.dumps(event))

    sqs_queue_url = os.environ.get('SQS_QUEUE_URL', None)
    if not sqs_queue_url:
        raise Exception("no SQS_QUEUE_URL set")

    comprehend_classifier_arn = os.environ.get('COMPREHEND_CLASSIFIER_ARN',
                                               None)
    if not comprehend_classifier_arn:
        raise Exception("no COMPREHEND_CLASSIFIER_ARN set")

    logger.debug(f"LOG_LEVEL: {log_level} \n \
                COMPREHEND_CLASSIFIER_ARN: {comprehend_classifier_arn} \n \
                SQS_QUEUE_URL: {sqs_queue_url}")

    processing_status: bool = True
    files_with_failures: List[str] = list()

    token = event['Token']
    execution_id = event['ExecutionId']

    if not "Payload" in event:
        raise ValueError("Need Payload with manifest to process message.")

    manifest: tm.IDPManifest = tm.IDPManifestSchema().load(
        message["Payload"]['manifest'])  #type: ignore

    s3_path = manifest.s3_path
    payload = event['Payload']

    if 'txt_output_location' in payload and "TextractOutputCSVPath" in payload[
            'txt_output_location']:
        s3_input_text = payload['txt_output_location']['TextractOutputCSVPath']
    else:
        raise ValueError(
            f"no ['txt_output_location']['TextractOutputCSVPath'] to get the text file from "
        )

    logger.info(f"s3_path: {s3_path} \n \
                    s3_input_text: {s3_input_text} \n\
                token: {token} \n \
                execution_id: {execution_id}")

    try:
        text = get_file_from_s3(s3_path=s3_input_text).decode('utf-8')[0:4900]

        start_time = round(time.time() * 1000)
        response = comprehend.classify_document(
            Text=text, EndpointArn=comprehend_classifier_arn)
        logger.debug(f"comprehend result: {response}")

        classification_result = "NONE"
        for c in response['Classes']:
            if c['Score'] > 0.50:
                classification_result = c['Name']
                break

        call_duration = round(time.time() * 1000) - start_time
        logger.info(
            f"comprehend_sync_generic_call_duration_in_ms: {call_duration}")
        try:
            step_functions_client.send_task_success(
                taskToken=token,
                output=json.dumps({"documentType": classification_result}))
        except step_functions_client.exceptions.InvalidToken:
            logger.error(f"InvalidToken for message: {event} ")
        except step_functions_client.exceptions.TaskDoesNotExist:
            logger.error(f"TaskDoesNotExist for message: {event} ")
        except step_functions_client.exceptions.TaskTimedOut:
            logger.error(f"TaskTimedOut for message: {event} ")
        except step_functions_client.exceptions.InvalidOutput:
            logger.error(f"InvalidOutput for message: {event} ")

    except comprehend.exceptions.TooManyRequestsException:
        # try again, will throw Exception for Lambda and not delete from queue
        processing_status = False
        files_with_failures.append(s3_path)
        logger.error(f"TooManyRequestsException for: {s3_path} to Comprehend.")
    except comprehend.exceptions.TextSizeLimitExceededException as e:
        logger.error(e, exc_info=True)
        send_failure_to_step_function(e, 'TextSizeLimitExceededException',
                                      str(e), token, event)
    except comprehend.exceptions.InvalidRequestException as e:
        logger.error(e, exc_info=True)
        send_failure_to_step_function(e, 'InvalidRequestException', str(e),
                                      token, event)
    except ClientError as e:
        if e.response['Error']['Code'] == 'ThrottlingException':
            processing_status = False
            files_with_failures.append(s3_path)
            logger.error(
                f"ThrottlingException - failed to send: {s3_path} to Comprehend."
            )
        else:
            logger.error(e, exc_info=True)
    except Exception as e:
        send_failure_to_step_function(e, 'unhandled', str(e), token, event)

    if not processing_status:
        raise Exception(
            f"files with failures: {[x for x in files_with_failures]}")
