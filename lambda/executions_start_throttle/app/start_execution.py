"""
kicks off Step Function executions 
"""
import json
import logging
import os
import uuid
from urllib.parse import unquote_plus
import textractmanifest as tm
import re
import time
from pynamodb.models import Model
from pynamodb.attributes import UnicodeAttribute, NumberAttribute

import boto3

logger = logging.getLogger(__name__)

step_functions_client = boto3.client(service_name='stepfunctions')
sqs_client = boto3.client(service_name='sqs')


class DocumentStatusModel(Model):

    class Meta:
        table_name = os.environ['DOCUMENT_STATUS_TABLE']
        region = boto3.Session().region_name

    document_path = UnicodeAttribute(hash_key=True, attr_name='dp')
    document_duplicate_index = NumberAttribute(range_key=True,
                                               default=0,
                                               attr_name='ddi')
    insert_timestamp = NumberAttribute(null=True, attr_name="its")
    queued_timestamp = NumberAttribute(null=True, attr_name='qts')
    workflow_timestamp = NumberAttribute(null=True, attr_name='wts')
    finished_timestamp = NumberAttribute(null=True, attr_name='fts')
    status = UnicodeAttribute(
        attr_name='s')  # (RECEIVED, QUEUED, IN_PROGRESS, SUCCESSFUL, FAILED)
    workflow_execution_id = UnicodeAttribute(
        null=True, attr_name='wid')  # (set when IN_PROGRESS)


def get_number_of_executions(state_machine_arn):
    total_number_of_executions = 0

    next_token = None
    next = True
    while next:
        if next_token:
            response = step_functions_client.list_executions(
                stateMachineArn=state_machine_arn,
                nextToken=next_token,
                statusFilter="RUNNING"
            )  # List all executions for the state machine
        else:
            response = step_functions_client.list_executions(
                stateMachineArn=state_machine_arn, statusFilter="RUNNING")

        # Retrieve "numberOfPages" output for each execution
        total_number_of_executions += len(response['executions'])

        if 'nextToken' in response:
            next_token = response['nextToken']
        else:
            next = False
    return total_number_of_executions


def lambda_handler(event, _):
    log_level = os.environ.get('LOG_LEVEL', 'INFO')
    logger.setLevel(log_level)
    logger.info(f"LOG_LEVEL: {log_level}")
    logger.info(json.dumps(event))

    state_machine_arn = os.environ.get('STATE_MACHINE_ARN', None)
    if not state_machine_arn:
        raise Exception("no STATE_MACHINE_ARN set")
    logger.info(f"STATE_MACHINE_ARN: {state_machine_arn}")

    document_queue_url = os.environ.get('DOCUMENT_QUEUE_URL', None)
    if not document_queue_url:
        raise Exception("no DOCUMENT_QUEUE_URL set")

    document_status_table = os.environ.get('DOCUMENT_STATUS_TABLE', None)
    if not document_status_table:
        raise Exception("no DOCUMENT_STATUS_TABLE set")

    executions_threshold = int(os.environ.get('EXECUTIONS_THRESHOLD', 100))
    if not executions_threshold:
        raise Exception("no EXECUTIONS_THRESHOLD set")

    logger.info(f"STATE_MACHINE_ARN: {state_machine_arn} \
        DOCUMENT_QUEUE_URL: {document_queue_url} \
        DOCUMENT_STATUS_TABLE: {document_status_table} \
        EXECUTIONS_THRESHOLD: {executions_threshold}")

    s3_bucket = ""
    s3_key = ""

    # check if Scheduled Event
    # "detail-type": "Scheduled Event", "source": "aws.events"
    if 'source' in event and event[
            'source'] == "aws.events" and 'detailed-type' in event and event[
                'detailed-type'] == "Scheduled Event":
        sqs_message = sqs_client.receive_message(QueueUrl=document_queue_url,
                                                 MaxNumberOfMessages=1)
        if 'Messages' in sqs_message and sqs_message['Messages']:
            manifest: tm.IDPManifest = tm.IDPManifestSchema().load(
                sqs_message['Messages'][0])  #type: ignore

    for record in event['Records']:
        event_source = record["eventSource"]
        if event_source == "aws:s3":
            s3_bucket = record['s3']['bucket']['name']
            s3_key = unquote_plus(record['s3']['object']['key'])
        elif event_source == "aws:sqs":
            # for manifest pass in, try to serialize here and if fails fall back to getting bucket and key
            message = json.loads(record["body"])
            s3_bucket = message['bucket']
            s3_key = message['key']
        else:
            logger.error('unsupported event_source: {}'.format(event_source))

        original_filename = os.path.join("s3://", s3_bucket, s3_key)
        # Get original filename and duplicate index information from DDB
        #
        document_status_query_result = DocumentStatusModel.query(
            original_filename, scan_index_forward=False, limit=1)
        try:
            document_status = next(document_status_query_result)
            # if document_path already exists, create a new one
            # there is potential for race conditions here
            current_max_index = document_status.document_duplicate_index
            document_status = DocumentStatusModel(
                document_path=original_filename,
                document_duplicate_index=current_max_index + 1,
                status="RECEIVED",
                insert_timestamp=round(time.time() * 1000))
            document_status.save()
        except StopIteration:
            # there is potential for race conditions here
            document_status = DocumentStatusModel(
                document_path=original_filename,
                document_duplicate_index=0,
                status="RECEIVED",
                insert_timestamp=round(time.time() * 1000))
            document_status.save()

        if s3_bucket and s3_key:
            manifest: tm.IDPManifest = tm.IDPManifest()
            manifest.s3_path = original_filename
            meta_data: list[tm.MetaData] = list()
            meta_data.append(
                tm.MetaData(key="document_duplicate_index",
                            value=str(
                                document_status.document_duplicate_index)))
            manifest.meta_data = list()

            logger.debug(f"manifest: {tm.IDPManifestSchema().dumps(manifest)}")

            # if too many running executions, queue
            if get_number_of_executions(state_machine_arn=state_machine_arn
                                        ) >= executions_threshold:
                # write to queue
                # set status in DDB to QUEUED (with timestamp)
                sqs_client.send_message(
                    QueueUrl=document_queue_url,
                    MessageBody=tm.IDPManifestSchema().dumps(manifest))

                document_status.update(actions=[
                    DocumentStatusModel.queued_timestamp.set(
                        round(time.time() * 1000)),
                    DocumentStatusModel.status.set("QUEUED"),
                ])

            workflow_execution_name = os.path.basename(s3_key) + "-" + str(
                uuid.uuid4())

            workflow_execution_name = re.sub(r'[^A-Za-z0-9-_]', '',
                                             workflow_execution_name)
            workflow_execution_name = workflow_execution_name[:80]
            response = step_functions_client.start_execution(
                stateMachineArn=state_machine_arn,
                name=workflow_execution_name,
                input=tm.IDPManifestSchema().dumps(manifest))
            if "executionArn" in response:
                document_status.update(actions=[
                    DocumentStatusModel.workflow_timestamp.set(
                        round(time.time() * 1000)),
                    DocumentStatusModel.status.set("IN_PROGRESS"),
                    DocumentStatusModel.workflow_execution_id.set(
                        response["executionArn"])
                ])
            else:
                logger.error(response)
                raise Exception("no 'executionArn' in response.")
            logger.debug(response)
        else:
            raise ValueError(
                f"no s3_bucket: {s3_bucket} and/or s3_key: {s3_key} given.")
