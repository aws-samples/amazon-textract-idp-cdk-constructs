import boto3
import logging
import json
import os
import uuid
from datetime import datetime, timedelta
import time

logger = logging.getLogger(__name__)

region = os.environ['AWS_REGION']
dynamo_db_client = boto3.client("dynamodb")
step_functions_client = boto3.client(service_name='stepfunctions')
a2i = boto3.client('sagemaker-a2i-runtime')
"""
Preprocessing Lamda Function for Creating a Human Review Loop
- Prepopulate DynamoDB for Review Job
- Create A2I Human Review Loop
"""


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
        if 'Payload' in event and 'a2iInputPath' in event['Payload']:
            # FIXME: hard coded result location
            a2i_input_path = event['Payload']['a2iInputPath']
        else:
            a2i_input_path = ""
        if a2i_flow_definition_arn == "DEV" or a2i_input_path == "DEV":
            response = {
                'HumanLoopCreation':
                'skipped (a2i_input_path and/or a2i_flow_definitiona are "None". doing development testing)',
                'human_loop_result': "DEV"
            }
            step_functions_client.send_task_success(
                taskToken=task_token, output=json.dumps(response))

        response = {'HumanLoopCreation': 'Failure'}

        uuid_key = str(uuid.uuid4())
        loop = {
            'humanLoopName': uuid_key,
            'imageTime': str(datetime.now().timestamp()).replace(".", ""),
            'humanLoopStatus': 'Pending',
            'humanAnswers': [],
            'taskObject': a2i_input_path,
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
                                                cause=str(e)[:250])
