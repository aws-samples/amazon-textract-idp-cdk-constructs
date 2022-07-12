import json
import boto3
import os
import logging

logger = logging.getLogger(__name__)

dynamo_db_client = boto3.client("dynamodb")
step_functions_client = boto3.client(service_name='stepfunctions')

# s3 = boto3.resource('s3')


#Post processing lambda function. Post annotated coordinates to the DDB after the human review.
def lambda_handler(event, _):
    log_level = os.environ.get('LOG_LEVEL', 'INFO')
    logger.setLevel(log_level)
    logger.info(json.dumps(event))

    token_store_ddb = os.environ.get('TOKEN_STORE_DDB', None)
    if not token_store_ddb:
        raise Exception("no TOKEN_STORE_DDB set")

    logger.info(
        f"LOG_LEVEL: {log_level} \n TOKEN_STORE_DDB: {token_store_ddb} \n ")

    human_loop_name = event['detail']['humanLoopName']
    human_loop_result_path = event['detail']["humanLoopOutput"]["outputS3Uri"]
    human_loop_creation_time = event['detail']["creationTime"]
    human_loop_status = event['detail']["humanLoopStatus"]
    human_loop_failure_reason = ""
    if 'failureReason' in event['detail']:
        human_loop_failure_reason = event['detail']['failureReason']
    human_loop_failure_code = ""
    if 'failureCode' in event['detail']:
        human_loop_failure_code = event['detail']['failureCode']
    ddb_response = dynamo_db_client.get_item(
        TableName=token_store_ddb, Key={"ID": {
            'S': human_loop_name
        }})
    logger.debug(f"ddb_response: {ddb_response}")
    task_token = ddb_response['Item']['Token']['S']

    # url = urlparse.urlparse(human_loop_result)
    # bucket = url.netloc
    # key = url.path
    # content_object = s3.Object(bucket, key.lstrip("/"))
    # file_content = content_object.get()['Body'].read().decode('utf-8')
    # human_loop_output_json = json.loads(file_content)
    # human_answers = human_loop_output_json["humanAnswers"]

    response = {
        'humanLoopStatus': human_loop_status,
        'humanLoopResultPath': human_loop_result_path,
        'humanLoopCreationTime': human_loop_creation_time,
    }
    if human_loop_status == 'Failed':
        step_functions_client.send_task_failure(
            taskToken=task_token,
            error=human_loop_failure_reason[:250],
            cause=human_loop_failure_code)
    else:
        step_functions_client.send_task_success(taskToken=task_token,
                                                output=json.dumps(response))
