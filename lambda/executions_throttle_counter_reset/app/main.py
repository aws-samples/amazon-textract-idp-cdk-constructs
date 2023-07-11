"""
kicks off Step Function executions
"""
import json
import logging
import os
from pynamodb.models import Model
from pynamodb.attributes import UnicodeAttribute, NumberAttribute

import boto3

logger = logging.getLogger(__name__)

step_functions_client = boto3.client(service_name='stepfunctions')


class ExecutionsCounterModel(Model):

    class Meta:
        table_name = os.environ['EXECUTIONS_COUNTER_TABLE']
        region = boto3.Session().region_name

    name = UnicodeAttribute(hash_key=True, attr_name='n')
    execution_count = NumberAttribute(attr_name="c", default=0)


def get_number_of_executions(state_machine_arn) -> int:
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
    """This Lambda gets the current RUNNING workflows and updates the
    ExecutionsCounter table with that number. If we don't do that there is a risk that over time the counter is out of sync with the actual number. The process does not have to be super accurate rgdg the number, but should also not be too far off."""
    # GET ENVIRONMENT VARIABLES
    log_level = os.environ.get('LOG_LEVEL', 'INFO')
    logger.setLevel(log_level)
    logger.info(f"LOG_LEVEL: {log_level}")
    logger.info(json.dumps(event))

    state_machine_arn = os.environ.get('STATE_MACHINE_ARN', None)
    if not state_machine_arn:
        raise Exception("no STATE_MACHINE_ARN set")
    logger.info(f"STATE_MACHINE_ARN: {state_machine_arn}")

    number_of_executions = get_number_of_executions(
        state_machine_arn=state_machine_arn)
    try:
        executions_counter_model = ExecutionsCounterModel.get(
            state_machine_arn)
    except ExecutionsCounterModel.DoesNotExist:
        executions_counter_model = ExecutionsCounterModel(state_machine_arn)
    executions_counter_model.update(actions=[
        ExecutionsCounterModel.execution_count.set(number_of_executions)
    ])
