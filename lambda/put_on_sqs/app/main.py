# Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import json
import logging
import os
import boto3
import json

logger = logging.getLogger(__name__)
__version__ = "0.0.1"
sqs_client = boto3.client('sqs')


def lambda_handler(event, _):
    log_level = os.environ.get('LOG_LEVEL', 'INFO')
    logger.setLevel(log_level)
    logger.debug(json.dumps(event))
    logger.debug(f"version: {__version__}")
    logger.debug(f"boto3 version: {boto3.__version__}")

    sqs_queue_url = os.environ.get('SQS_QUEUE_URL', '')
    if not sqs_queue_url:
        raise ValueError(f'no SQS_QUEUE defined: {sqs_queue_url}')

    response = sqs_client.send_message(QueueUrl=sqs_queue_url,
                                       MessageBody=json.dumps(event))
    logger.debug(response)
