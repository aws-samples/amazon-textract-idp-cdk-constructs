# Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import json
import logging
import os
import boto3
import csv

from typing import Tuple

logger = logging.getLogger(__name__)

region = os.environ['AWS_REGION']
step_functions_client = boto3.client(service_name='stepfunctions')
s3 = boto3.client('s3')
rds_data = boto3.client('rds-data')

__version__ = "0.0.4"


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


class ServiceUnavailableError(Exception):
    pass


class ForbiddenException(Exception):
    pass


class InternalServerErrorException(Exception):
    pass


class StatementTimeoutException(Exception):
    pass


class BadRequestException(Exception):
    pass


def get_entry(row):
    timestamp = row[0].split('+', 1)[0].replace('T', ' ')
    entry = [{
        'name': 'createtime',
        'typeHint': 'TIMESTAMP',
        'value': {
            'stringValue': timestamp
        }
    }, {
        'name': 'classification',
        'value': {
            'stringValue': row[1]
        }
    }, {
        'name': 'filename',
        'value': {
            'stringValue': row[2]
        }
    }, {
        'name': 'page',
        'value': {
            'longValue': int(row[3])
        }
    }, {
        'name': 'key',
        'value': {
            'stringValue': row[4]
        }
    }, {
        'name': 'key_confidence',
        'value': {
            'stringValue': row[5]
        }
    }, {
        'name': 'value',
        'value': {
            'stringValue': row[6]
        }
    }, {
        'name': 'value_confidence',
        'value': {
            'stringValue': row[7]
        }
    }, {
        'name': 'key_bb_top',
        'value': {
            'stringValue': row[8]
        }
    }, {
        'name': 'key_bb_height',
        'value': {
            'stringValue': row[9]
        }
    }, {
        'name': 'k_bb_width',
        'value': {
            'stringValue': row[10]
        }
    }, {
        'name': 'k_bb_left',
        'value': {
            'stringValue': row[11]
        }
    }, {
        'name': 'v_bb_top',
        'value': {
            'stringValue': row[12]
        }
    }, {
        'name': 'v_bb_height',
        'value': {
            'stringValue': row[13]
        }
    }, {
        'name': 'v_bb_width',
        'value': {
            'stringValue': row[14]
        }
    }, {
        'name': 'v_bb_left',
        'value': {
            'stringValue': row[15]
        }
    }]
    return entry


def lambda_handler(event, _):
    log_level = os.environ.get('LOG_LEVEL', 'INFO')
    logger.setLevel(log_level)
    logger.info(json.dumps(event))
    logger.info(f"version: {__version__}\n \
        boto3 version: {boto3.__version__}")

    cluster_arn = os.environ.get('CLUSTER_ARN', None)
    secret_arn = os.environ.get('SECRET_ARN', None)
    if not secret_arn:
        raise Exception("no SECRET_ARN set")

    logger.info(f"LOG_LEVEL: {log_level} \n \
                SECRET_ARN: {secret_arn} \n \
                CLUSTER_ARN: {cluster_arn} \n \
                ")

    database = 'postgres'
    sql = 'INSERT INTO textractcsvimport VALUES (:createtime, :classification, :filename, :page, :key, :key_confidence, \
           :value, :value_confidence, :key_bb_top, :key_bb_height, \
            :k_bb_width, :k_bb_left, :v_bb_top, :v_bb_height, :v_bb_width, :v_bb_left);'

    token = event['Token']
    payload = event['Payload']
    csv_output_location_path = payload['csv_output_location'][
        'TextractOutputCSVPath']

    try:
        # load CSV into memory and send to PostgreSQL
        # Serverless does not support load from S3 and creating a complete postgres db lead to VPC creation and so on
        # This was ok for now
        csv_binary = get_file_from_s3(csv_output_location_path)
        csv_decoded = csv_binary.decode('utf-8').splitlines(True)
        csv_lines = csv.reader(csv_decoded)
        batch_size = 500
        params = []

        for line in csv_lines:
            entry = get_entry(line)
            params.append(entry)

            if (len(params) == batch_size):
                response = rds_data.batch_execute_statement(
                    secretArn=secret_arn,
                    database=database,
                    resourceArn=cluster_arn,
                    sql=sql,
                    parameterSets=params)
                if 'updateResults' in response:
                    logger.info(
                        f"csv_to_aurora_insert_rows:{len(response['updateResults'])}"
                    )
                params = []
        if (len(params) > 0):
            response = rds_data.batch_execute_statement(
                secretArn=secret_arn,
                database=database,
                resourceArn=cluster_arn,
                sql=sql,
                parameterSets=params)
            if 'updateResults' in response:
                logger.info(
                    f"csv_to_aurora_insert_rows:{len(response['updateResults'])}"
                )
        step_functions_client.send_task_success(
            taskToken=token,
            output=json.dumps({"CSVToAurora": f"number of records: bla"}))
    except rds_data.exceptions.BadRequestException as e:
        logger.error(e, exc_info=True)
        step_functions_client.send_task_failure(taskToken=token,
                                                error='BadRequestException',
                                                cause=str(e)[:250])
    except rds_data.exceptions.StatementTimeoutException as e:
        logger.error(e, exc_info=True)
        raise StatementTimeoutException("StatementTimeoutException")
    except rds_data.exceptions.InternalServerErrorException as e:
        logger.error(e, exc_info=True)
        raise InternalServerErrorException("InternalServerErrorException")
    except rds_data.exceptions.ForbiddenException as e:
        logger.error(e, exc_info=True)
        step_functions_client.send_task_failure(taskToken=token,
                                                error='Exception',
                                                cause=str(e)[:250])
    except step_functions_client.exceptions.TaskDoesNotExist as e:
        logger.error(e, exc_info=True)
        step_functions_client.send_task_failure(taskToken=token,
                                                error='Exception',
                                                cause=str(e)[:250])
    except step_functions_client.exceptions.TaskTimedOut as e:
        logger.error(e, exc_info=True)
        step_functions_client.send_task_failure(taskToken=token,
                                                error='Exception',
                                                cause=str(e)[:250])
        logger.error(f"TaskTimedOut for event: {event} ")
    except step_functions_client.exceptions.InvalidOutput:
        # Not sure if to delete here or not, could be a bug in the code that a hot fix could solve, but don't want to retry infinite, which can cause run-away-cost. For now, delete
        logger.error(f"InvalidOutput for event: {event} ")
    except Exception as e:
        logger.error(e, exc_info=True)
        step_functions_client.send_task_failure(taskToken=token,
                                                error='Exception',
                                                cause=str(e)[:250])
