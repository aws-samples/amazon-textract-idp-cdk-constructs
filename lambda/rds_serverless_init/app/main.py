import logging
import os
import boto3
import json

logger = logging.getLogger(__name__)
__version__ = "0.0.1"

rds_data = boto3.client('rds-data')


def on_create(event, context, secret_arn, cluster_arn):
    physical_id = 'initPostgresql'
    rds_data.execute_statement(
        secretArn=secret_arn,
        database='postgres',
        resourceArn=cluster_arn,
        sql=
        "CREATE TABLE if not exists textractcsvimport (createtime timestamp, classification varchar(512), \
        filename text, \
        page decimal(10), \
        key text, \
        key_confidence varchar(25), \
        value text, \
        value_confidence varchar(25), \
        key_bb_top varchar(25), \
        key_bb_height varchar(25), \
        k_bb_width varchar(25), \
        k_bb_left varchar(25), \
        v_bb_top varchar(25), \
        v_bb_height varchar(25), \
        v_bb_width varchar(25), \
        v_bb_left varchar(25));"

        #     page_number, key_name, key_confidence, value_name, value_confidence, key-bounding-box.top, key-bounding-box.height, k-bb.width, k-bb.left, value-bounding-box.top, v-bb.height, v-bb.width, v-bb.left
    )
    return { 'PhysicalResourceId': physical_id }


def on_update(event, context, secret_arn, cluster_arn):
    physical_id = 'initPostgresql'
    rds_data.execute_statement(
        secretArn=secret_arn,
        database='postgres',
        resourceArn=cluster_arn,
        sql=
        "CREATE TABLE if not exists textractcsvimport (createtime timestamp, classification varchar(512), \
        filename text, \
        page decimal(10), \
        key text, \
        key_confidence varchar(25), \
        value text, \
        value_confidence varchar(25), \
        key_bb_top varchar(25), \
        key_bb_height varchar(25), \
        k_bb.width varchar(25), \
        k_bb_left varchar(25), \
        v_bb_top varchar(25), \
        v_bb_height varchar(25), \
        v_bb_width varchar(25), \
        v_bb_left varchar(25));"

        #     page_number, key_name, key_confidence, value_name, value_confidence, key-bounding-box.top, key-bounding-box.height, k-bb.width, k-bb.left, value-bounding-box.top, v-bb.height, v-bb.width, v-bb.left
    )
    print("update resource %s with props %s" % (physical_id))


def on_delete(event, context):
    physical_id = 'initPostgresql'
    print("delete resource %s" % physical_id)

def lambda_handler(event, context):
    log_level = os.environ.get('LOG_LEVEL', 'INFO')
    logger.setLevel(log_level)
    logger.info(json.dumps(event))
    logger.debug(f"version: {__version__}")
    logger.debug(f"boto3 version: {boto3.__version__}")
    logger.info(event)
    cluster_arn = os.environ.get('CLUSTER_ARN', '')
    secret_arn = os.environ.get('SECRET_ARN', '')
    logger.info(f'SECRET_ARN: {secret_arn}\nCLUSTER_ARN: {cluster_arn}')
    if not secret_arn:
        raise ValueError(f'no SECRET_ARN defined: {secret_arn}')
    if not cluster_arn:
        raise ValueError(f'no CLUSTER_ARN defined: {cluster_arn}')
    request_type = event['RequestType'].lower()
    if request_type == 'create':
        return on_create(event=event,
                         context=context,
                         cluster_arn=cluster_arn,
                         secret_arn=secret_arn)
    if request_type == 'update':
        return on_update(event=event,
                         context=context,
                         cluster_arn=cluster_arn,
                         secret_arn=secret_arn)
    if request_type == 'delete':
        return on_delete(event=event, context=context)
    raise Exception(f'Invalid request type: {request_type}')
