"""
kicks off Step Function executions
"""
import json
import logging
import os
import uuid
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


def get_messages_from_queue_and_create_manifest_list(
        document_queue_url, sqs_batch) -> list[tm.IDPManifest]:
    logger.debug('get_messages_from_queue_and_create_manifest_list')

    manifest_list: list[tm.IDPManifest] = list()
    sqs_messages = sqs_client.receive_message(QueueUrl=document_queue_url,
                                              MaxNumberOfMessages=sqs_batch)
    if 'Messages' in sqs_messages and sqs_messages['Messages']:
        logger.debug(
            f"received {len(sqs_messages['Messages'])} messages from queue")
        for message in sqs_messages['Messages']:
            manifest: tm.IDPManifest = get_manifest_from_message(
                message['Body'])
            receipt_handle = message['ReceiptHandle']

            if not manifest.meta_data or not isinstance(
                    manifest.meta_data, list):
                manifest.meta_data = list()

            manifest.meta_data.append(
                tm.MetaData(key="ReceiptHandle", value=receipt_handle))
            manifest_list.append(manifest)
    return manifest_list


def create_manifest_list(event,
                         document_queue_url,
                         state_machine_arn,
                         sqs_batch=1) -> list[tm.IDPManifest]:
    # Event can be 'Scheduled Event' or  'Step Functions Execution Status Change'
    logger.debug("start create_manifest_list")
    manifest_list: list[tm.IDPManifest] = list()
    if 'source' in event:
        if event['source'] == "aws.events" and 'detail-type' in event and event[
                'detail-type'] == "Scheduled Event":
            return get_messages_from_queue_and_create_manifest_list(
                document_queue_url, sqs_batch)
        if event['source'] == "aws.states" and 'detail-type' in event and event[
                'detail-type'] == 'Step Functions Execution Status Change':
            # update DDB with status and finish time
            manifest: tm.IDPManifest = tm.IDPManifestSchema().loads(
                event['detail']['input'])  #type: ignore
            document_duplication_index = [
                x.value for x in manifest.meta_data if x.key == 'ddi'
            ]
            status = event['detail']['status']
            if not document_duplication_index:
                logger.error("can not get document status from DDB for event.")
            else:
                document_status = DocumentStatusModel.get(
                    manifest.s3_path, int(document_duplication_index[0]))
                document_status.update(actions=[
                    DocumentStatusModel.finished_timestamp.set(
                        round(time.time() * 1000)),
                    DocumentStatusModel.status.set(status),
                ])
                logger.debug(
                    f"received Step Function Status Update and updated the status in DDB to '{status}'."
                )

            executions_counter_model = ExecutionsCounterModel.get(
                state_machine_arn)
            if not executions_counter_model:
                executions_counter_model = ExecutionsCounterModel(
                    state_machine_arn)
            executions_counter_model.update(
                actions=[ExecutionsCounterModel.execution_count.add(-1)])

            return get_messages_from_queue_and_create_manifest_list(
                document_queue_url, sqs_batch)

    logger.debug(
        f"end: create_manifest_list: len(manifest_list): {len(manifest_list)}")
    return manifest_list


def lambda_handler(event, _):
    """This Lambda is started based on a scheduled event and on Step Function executions ending and then processes an SQS queue backlog"""
    # GET ENVIRONMENT VARIABLES
    log_level = os.environ.get('LOG_LEVEL', 'INFO')
    logger.setLevel(log_level)
    logger.info(f"LOG_LEVEL: {log_level}")
    logger.info(json.dumps(event))

    state_machine_arn = os.environ.get('STATE_MACHINE_ARN', None)
    if not state_machine_arn:
        raise Exception("no STATE_MACHINE_ARN set")

    document_queue_url = os.environ.get('DOCUMENT_QUEUE_URL', None)
    if not document_queue_url:
        raise Exception("no DOCUMENT_QUEUE_URL set")

    document_status_table = os.environ.get('DOCUMENT_STATUS_TABLE', None)
    if not document_status_table:
        raise Exception("no DOCUMENT_STATUS_TABLE set")

    executions_threshold = int(os.environ.get('EXECUTIONS_THRESHOLD', 100))
    if not executions_threshold:
        raise Exception("no EXECUTIONS_THRESHOLD set")

    sqs_batch = int(os.environ.get('SQS_BATCH', 10))
    if not sqs_batch:
        raise Exception("no SQS_BATCH set")

    logger.info(f"STATE_MACHINE_ARN: {state_machine_arn} \
        DOCUMENT_QUEUE_URL: {document_queue_url} \
        DOCUMENT_STATUS_TABLE: {document_status_table} \
        SQS_BATCH: {sqs_batch} \
        EXECUTIONS_THRESHOLD: {executions_threshold}")

    # Check source of event and create a list of manifest files
    manifest_list: list[tm.IDPManifest] = create_manifest_list(
        event,
        document_queue_url=document_queue_url,
        sqs_batch=sqs_batch,
        state_machine_arn=state_machine_arn)

    for manifest in manifest_list:
        logger.debug(f"processing manifest: {manifest}")
        # Get orginal filename and duplicate index information from DDB
        #
        # Check if manifest has ddi (document_duplication_index), before counting up
        # We are retrying, therefore has to have a ddi
        document_duplication_index = list()
        if manifest.meta_data:
            document_duplication_index = [
                x.value for x in manifest.meta_data if x.key == 'ddi'
            ]
        else:
            logger.error(f"No ddi in meta_data, fail the process.")

        document_status = DocumentStatusModel.get(
            manifest.s3_path, int(document_duplication_index[0]))
        if document_status.status in [
                'SUCCEEDED', 'FAILED', 'TIMED_OUT', 'ABORTED'
        ]:
            # must be duplicate from SQS, delete from queue
            # TODO: remove from queue
            pass

        # START EXECUTIONS OR QUEUE
        # if too many running executions, queue
        number_of_executions = get_number_of_executions(
            state_machine_arn=state_machine_arn)
        if number_of_executions >= executions_threshold:
            # write to queue, only if no retry
            # set status in DDB to QUEUED (with timestamp)
            logger.debug(
                f"too many executions running (number_of_executions: {number_of_executions} >= threshold {executions_threshold}). Will leave on queue."
            )
            return
        else:
            logger.debug(
                f"(number_of_executions: {number_of_executions} < threshold {executions_threshold}). Going to start workflow."
            )

            ### TODO: check status of manifest in DDB potentially to check for duplicates
            # cost could be an issue, but duplicate processing could be as well
            # maybe have to go FIFO
            # I assume that is the reason for the -2
            # if I do a scheduler that resets to the actual number of workflows, that could be good enough
            # potentially
            workflow_execution_name = os.path.basename(
                manifest.s3_path) + "-" + str(uuid.uuid4())

            workflow_execution_name = re.sub(r'[^A-Za-z0-9-_]', '',
                                             workflow_execution_name)
            workflow_execution_name = workflow_execution_name[:80]
            sfn_response = step_functions_client.start_execution(
                stateMachineArn=state_machine_arn,
                name=workflow_execution_name,
                input=tm.IDPManifestSchema().dumps(manifest))
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
