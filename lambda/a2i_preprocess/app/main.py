import boto3
import logging
import json
import os
import uuid
from datetime import datetime, timedelta
from typing import Tuple
import time

logger = logging.getLogger(__name__)

region = os.environ['AWS_REGION']
dynamo_db_client = boto3.client("dynamodb")
step_functions_client = boto3.client(service_name='stepfunctions')
a2i = boto3.client('sagemaker-a2i-runtime')
s3 = boto3.resource("s3")
s3_client = boto3.client('s3')
"""
Preprocessing Lamda Function for Creating a Human Review Loop
- Prepopulate DynamoDB for Review Job
- Create A2I Human Review Loop
"""


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
        o = s3_client.get_object(Bucket=s3_bucket, Key=s3_key, Range=range)
    else:
        o = s3_client.get_object(Bucket=s3_bucket, Key=s3_key)
    return o.get('Body').read()


def lambda_handler(event, _):
    log_level = os.environ.get('LOG_LEVEL', 'INFO')
    logger.setLevel(log_level)
    logger.info(json.dumps(event))

    a2i_flow_definition_arn = os.environ.get('A2I_FLOW_DEFINITION_ARN')
    logger.info(f"A2I_FLOW_DEFINITION_ARN: {a2i_flow_definition_arn}")
    token_store_ddb = os.environ.get('TOKEN_STORE_DDB', None)
    if not token_store_ddb:
        raise Exception("no TOKEN_STORE_DDB set")

    logger.info(f"LOG_LEVEL: {log_level} \n \
        TOKEN_STORE_DDB: {token_store_ddb} \n \
        A2I_FLOW_DEFINITION_ARN: {a2i_flow_definition_arn}")

    task_token = event['Token']
    execution_id = event['ExecutionId']

    try:
        if not 'Payload' in event and 'textract_result' in event[
                'Payload'] and not 'TextractOutputJsonPath' in event[
                    'Payload']['textract_result']:
            raise ValueError(
                f"no 'TextractOutputJsonPath' in event['textract_result]")
        # FIXME: hard coded result location
        s3_path = event['Payload']['textract_result']['TextractOutputJsonPath']
        textract_json = get_file_from_s3(s3_path=s3_path).decode('utf-8')
        response = {'HumanLoopCreation': 'Failure'}

        uuid_key = str(uuid.uuid4())
        loop = {
            'humanLoopName': uuid_key,
            'imageTime': str(datetime.now().timestamp()).replace(".", ""),
            'humanLoopStatus': 'Pending',
            'humanAnswers': [],
            'taskObject': textract_json,
        }

        logger.debug(f"uuid_key: {uuid_key}")
        ddb_response = dynamo_db_client.put_item(
            TableName=token_store_ddb,
            Item={
                "ID": {
                    'S': uuid_key
                },
                "Type": {
                    'S': "A2I"
                },
                "Token": {
                    'S': task_token
                },
                "WorkflowId": {
                    'S': execution_id
                },
                "ttltimestamp": {
                    'N':
                    str(
                        int(time.time()) +
                        int(timedelta(days=7).total_seconds()))
                }
            })
        logger.debug(f"ddb_response: {ddb_response}")
        logger.debug(f"loop: {json.dumps(loop)}")
        if a2i_flow_definition_arn != "None":
            res = a2i.start_human_loop(
                    HumanLoopName     = uuid_key,
                    FlowDefinitionArn = a2i_flow_definition_arn,
                    HumanLoopInput    = \
                    {
                        'InputContent' : json.dumps(loop)
                    }
                    )
            logger.info(f'A2I Response: {res}')
            response = {'HumanLoopCreation': 'Success'}
        else:
            response = {
                'HumanLoopCreation':
                'skipped (doing development testing, passing through Textract post processing json)',
                'human_loop_result': "some text"
            }
            step_functions_client.send_task_success(
                taskToken=task_token, output=json.dumps(response))
        return response
    except Exception as e:
        logger.error(e, exc_info=True)
        step_functions_client.send_task_failure(taskToken=task_token,
                                                error=str(type(e)),
                                                cause=str(e))
