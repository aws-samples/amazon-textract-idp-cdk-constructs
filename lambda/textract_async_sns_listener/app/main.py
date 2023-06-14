"""
SQS_Task_Token_Listener Lambda in Step Functions
Listens to SQS queue for TaskTokens and calls StepFunctions
"""
import json
import logging
import os
import boto3
import time

logger = logging.getLogger(__name__)

step_functions_client = boto3.client(service_name='stepfunctions')
dynamo_db_client = boto3.client('dynamodb')
textract = boto3.client('textract')
s3 = boto3.client('s3')
__version__ = "0.0.1"


def lambda_handler(event, _):

    log_level = os.environ.get('LOG_LEVEL', 'INFO')
    logger.setLevel(log_level)
    logger.info(json.dumps(event))
    logger.debug(f"this lambda version: {__version__}")
    logger.debug(f"boto3_version: {boto3.__version__}")

    textract_api = os.environ.get('TEXTRACT_API', 'GENERIC')

    token_store_ddb = os.environ.get('TOKEN_STORE_DDB', None)
    if not token_store_ddb:
        raise Exception("no TOKEN_STORE_DDB set")

    s3_output_bucket = os.environ.get('S3_OUTPUT_BUCKET')

    s3_temp_output_prefix = os.environ.get('S3_TEMP_OUTPUT_PREFIX', None)
    if not s3_temp_output_prefix:
        raise Exception("no S3_TEMP_OUTPUT_PREFIX set")

    if not s3_output_bucket:
        raise ValueError(f"no s3_output_bucket: {s3_output_bucket} ")

    logger.info(f"LOG_LEVEL: {log_level} \n \
                TOKEN_STORE_DDB: {token_store_ddb} \n \
                OUTPUT_BUCKET: {s3_output_bucket} \n \
                TEXTRACT_API: {textract_api} \n \
                S3_TEMP_OUTPUT_PREFIX: {s3_temp_output_prefix}")

    for record in event['Records']:
        if "eventSource" in record and record["eventSource"] == "aws:sqs":
            body = json.loads(record["body"])
            message = json.loads(body['Message'])
        elif "EventSource" in record and record["EventSource"] == "aws:sns":
            message = json.loads(record['Sns']['Message'])
            logger.debug(f"message: {message}")
        else:
            raise Exception("not supported event source.")

        job_status = message['Status']
        job_tag = message['JobTag']
        job_id = message['JobId']
        logger.info(
            f"job_tag: '{job_tag}, job_id: {job_id}, job_status: {job_status}'"
        )

        ddb_response = dynamo_db_client.get_item(TableName=token_store_ddb,
                                                 Key={"ID": {
                                                     'S': job_tag
                                                 }})
        logger.debug(f"ddb_response: {ddb_response}")
        job_start_time = float(ddb_response['Item']['timestampMS']['N'])
        logger.debug(f"job_start_time: {job_start_time}")
        job_duration_in_ms = round(time.time() * 1000) - job_start_time

        number_of_pages = 0
        if 'numberOfPages' in ddb_response['Item']:
            number_of_pages = ddb_response['Item']['numberOfPages']['N']

        logger.info(
            f"textract_async_{textract_api}_job_duration_in_ms: {job_duration_in_ms}"
        )
        logger.info(
            f"textract_async_{textract_api}_number_of_pages_processed: {number_of_pages}"
        )
        task_token = ddb_response['Item']['Token']['S']

        if job_status == 'SUCCEEDED':
            logger.debug(f"job SUCCEEDED")
            result_location = f"s3://{s3_output_bucket}/{s3_temp_output_prefix}/{job_id}"
            try:
                step_functions_client.send_task_success(
                    taskToken=task_token,
                    output=json.dumps(
                        {"TextractTempOutputJsonPath": result_location}))
            except step_functions_client.exceptions.InvalidToken:
                logger.error(f"InvalidToken for message: {message} ")
            except step_functions_client.exceptions.TaskDoesNotExist:
                logger.error(f"TaskDoesNotExist for message: {message} ")
            except step_functions_client.exceptions.TaskTimedOut:
                logger.error(f"TaskTimedOut for message: {message} ")
            except step_functions_client.exceptions.InvalidOutput:
                logger.error(f"InvalidOutput for message: {message} ")
        else:
            logger.error(f"task failure: {job_status}")
            try:
                step_functions_client.send_task_failure(taskToken=task_token,
                                                        error=job_status,
                                                        cause="see output")
            except step_functions_client.exceptions.InvalidToken:
                logger.error(f"InvalidToken for message: {message} ")
            except step_functions_client.exceptions.TaskDoesNotExist:
                logger.error(f"TaskDoesNotExist for message: {message} ")
            except step_functions_client.exceptions.TaskTimedOut:
                logger.error(f"TaskTimedOut for message: {message} ")
