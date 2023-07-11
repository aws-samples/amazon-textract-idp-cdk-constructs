import json
import logging
import os
import uuid
from urllib.parse import unquote_plus
import textractmanifest as tm
import re
import time
import marshmallow
from pynamodb.models import Model
from pynamodb.attributes import UnicodeAttribute, NumberAttribute

import boto3

logger = logging.getLogger(__name__)

step_functions_client = boto3.client(service_name='stepfunctions')
sqs_client = boto3.client(service_name='sqs')
sqs_fifo_message_group_id = str(uuid.uuid4())


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
        attr_name='s'
    )  # (RECEIVED, QUEUED, IN_PROGRESS, SUCCESSFUL, FAILED, ABORTED, TIMED_OUT)
    workflow_execution_id = UnicodeAttribute(
        null=True, attr_name='wid')  # (set when IN_PROGRESS)


class ExecutionsCounterModel(Model):

    class Meta:
        table_name = os.environ['EXECUTIONS_COUNTER_TABLE']
        region = boto3.Session().region_name

    name = UnicodeAttribute(hash_key=True, attr_name='n')
    execution_count = NumberAttribute(attr_name="c", default=0)


def get_number_of_executions(state_machine_arn) -> int:
    try:
        executions_counter_model = ExecutionsCounterModel.get(
            state_machine_arn)
    except ExecutionsCounterModel.DoesNotExist:
        executions_counter_model = ExecutionsCounterModel(state_machine_arn)
    return int(executions_counter_model.execution_count)


def get_manifest_from_message(message: str) -> tm.IDPManifest:
    try:
        manifest: tm.IDPManifest = tm.IDPManifestSchema().loads(
            message)  #type: ignore
    except marshmallow.exceptions.ValidationError:  #type: ignore
        logger.error(message)
        raise ValueError(f"validation error for message: {message}")
    except TypeError as e:
        logger.error(f"TypeError for message: {message}")
        raise e

    return manifest


def create_manifest_list(event) -> list[tm.IDPManifest]:
    '''From the event create a list of manifest messages that are used to start the workflow'''
    logger.debug("start create_manifest_list")
    manifest_list: list[tm.IDPManifest] = list()
    if 'Records' in event:
        for record in event['Records']:
            event_source = record["eventSource"]
            if event_source == "aws:s3":
                manifest_list.append(
                    tm.IDPManifest(
                        os.path.join(
                            "s3://", record['s3']['bucket']['name'],
                            unquote_plus(record['s3']['object']['key']))))
            elif event_source == "aws:sqs":
                manifest = get_manifest_from_message(json.loads(
                    record["body"]))
                if not manifest.meta_data or not isinstance(
                        manifest.meta_data, list):
                    meta_data: list[tm.MetaData] = list()
                    manifest.meta_data = meta_data

                manifest.meta_data.append(
                    tm.MetaData(key="ReceiptHandle",
                                value=record['ReceiptHandle']))
                manifest_list.append(manifest)
            else:
                raise Exception(
                    'unsupported event_source: {}'.format(event_source))

    logger.debug(
        f"end: create_manifest_list: len(manifest_list): {len(manifest_list)}")
    return manifest_list


def lambda_handler(event, _):
    # GET ENVIRONMENT VARIABLES
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

    executions_counter_table = os.environ.get('EXECUTIONS_COUNTER_TABLE', None)
    if not executions_counter_table:
        raise Exception("no EXECUTIONS_COUNTER_TABLE set")

    logger.info(f"STATE_MACHINE_ARN: {state_machine_arn} \
        DOCUMENT_QUEUE_URL: {document_queue_url} \
        DOCUMENT_STATUS_TABLE: {document_status_table} \
        EXECUTIONS_COUNTER_TABLE: { executions_counter_table} \
        EXECUTIONS_THRESHOLD: {executions_threshold}")
    # Check if counter item exists

    # Check source of event and create a list of manifest files
    manifest_list: list[tm.IDPManifest] = create_manifest_list(event)

    for manifest in manifest_list:
        logger.debug(f"processing manifest: {manifest}")
        # Get orginal filename and duplicate index information from DDB
        #
        # this is a new document
        document_status_query_result = DocumentStatusModel.query(
            manifest.s3_path, scan_index_forward=False, limit=1)

        try:
            document_status = next(document_status_query_result)
            # if document_path already exists, create a new one
            #FIXME there is potential for race conditions here, when another process does for the same document_path reads at the same time before we update the ddi
            current_max_index = document_status.document_duplicate_index
            document_status = DocumentStatusModel(
                document_path=manifest.s3_path,
                document_duplicate_index=current_max_index + 1,
                status="RECEIVED",
                insert_timestamp=round(time.time() * 1000))
            document_status.save()
        except StopIteration:
            # there is potential for race conditions here
            document_status = DocumentStatusModel(
                document_path=manifest.s3_path,
                document_duplicate_index=0,
                status="RECEIVED",
                insert_timestamp=round(time.time() * 1000))
            document_status.save()

        if not manifest.meta_data or not isinstance(manifest.meta_data, list):
            manifest.meta_data = list()

        # The ddi (document duplicate index) increases for every document that already exists.
        manifest.meta_data.append(
            tm.MetaData(key="ddi",
                        value=str(document_status.document_duplicate_index)))

        # if too many running executions, queue
        number_of_executions = get_number_of_executions(
            state_machine_arn=state_machine_arn)
        if number_of_executions >= executions_threshold:
            # write to queue, only if no retry
            # set status in DDB to QUEUED (with timestamp)
            logger.debug(
                f"too many executions running (number_of_executions: {number_of_executions} >= threshold {executions_threshold}). Going to queue."
            )

            sqs_client.send_message(
                QueueUrl=document_queue_url,
                MessageBody=tm.IDPManifestSchema().dumps(manifest),
                MessageGroupId=sqs_fifo_message_group_id)

            document_status.update(actions=[
                DocumentStatusModel.queued_timestamp.set(
                    round(time.time() * 1000)),
                DocumentStatusModel.status.set("QUEUED"),
            ])
        else:
            logger.debug(
                f"(number_of_executions: {number_of_executions} < threshold {executions_threshold}). Going to start workflow."
            )
            workflow_execution_name = os.path.basename(
                manifest.s3_path) + "-" + str(uuid.uuid4())

            workflow_execution_name = re.sub(r'[^A-Za-z0-9-_]', '',
                                             workflow_execution_name)
            workflow_execution_name = workflow_execution_name[:80]
            sfn_response = step_functions_client.start_execution(
                stateMachineArn=state_machine_arn,
                name=workflow_execution_name,
                input=tm.IDPManifestSchema().dumps(manifest))

            # Get current count and increase
            try:
                executions_counter_model = ExecutionsCounterModel.get(
                    state_machine_arn)
            except ExecutionsCounterModel.DoesNotExist:
                executions_counter_model = ExecutionsCounterModel(
                    state_machine_arn)

            executions_counter_model.update(
                actions=[ExecutionsCounterModel.execution_count.add(1)])

            if "executionArn" in sfn_response:
                document_status.update(actions=[
                    DocumentStatusModel.workflow_timestamp.set(
                        round(time.time() * 1000)),
                    DocumentStatusModel.status.set("IN_PROGRESS"),
                    DocumentStatusModel.workflow_execution_id.set(
                        sfn_response["executionArn"])
                ])
                logger.debug(f"workflow started and DDB updated.")
                # delete message from queue, when received from Queue
                receipt_handle_list = [
                    x.value for x in manifest.meta_data
                    if 'ReceiptHandle' in x.key
                ]
                if receipt_handle_list and len(receipt_handle_list) > 1:
                    logger.warning(
                        f"more than 1 receipt handle: {receipt_handle_list}")

                if receipt_handle_list:
                    sqs_client.delete_message(
                        QueueUrl=document_queue_url,
                        ReceiptHandle=receipt_handle_list[0])
                    logger.debug(
                        f"deleted message from queue for manifest: {manifest}")
                else:
                    logger.debug(f"no receipt handle")

            else:
                logger.error(sfn_response)
                raise Exception("no 'executionArn' in sfn_response.")
            logger.debug(sfn_response)
