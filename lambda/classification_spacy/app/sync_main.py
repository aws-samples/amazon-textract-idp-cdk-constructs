# Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import json
import logging
import os
import time
import boto3
import textractmanifest as tm
import spacy as sp

from typing import Tuple

# TODO: find a way to make this a parameter during deployment, but also be able to load during initializing of the Lambda
spacy_nlp = sp.load("en_textcat_demo")

logger = logging.getLogger(__name__)
version = "0.0.1"
s3 = boto3.client('s3')
step_functions_client = boto3.client(service_name='stepfunctions')


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
        o = s3.get_object(Bucket=s3_bucket, Key=s3_key, Range=range)
    else:
        o = s3.get_object(Bucket=s3_bucket, Key=s3_key)
    return o.get('Body').read()


def send_failure_to_step_function(exception_class, error, cause, token,
                                  message):
    error = "not_handled_exception"
    cause = str(exception_class)
    try:
        step_functions_client.send_task_failure(taskToken=token,
                                                error=error,
                                                cause=cause)
    except step_functions_client.exceptions.InvalidToken:
        logger.error(f"InvalidToken for message: {message} ")
    except step_functions_client.exceptions.TaskDoesNotExist:
        logger.error(f"TaskDoesNotExist for message: {message} ")
    except step_functions_client.exceptions.TaskTimedOut:
        logger.error(f"TaskTimedOut for message: {message} ")


def lambda_handler(event, _):
    log_level = os.environ.get('LOG_LEVEL', 'INFO')
    logger.setLevel(log_level)
    logger.info(f"version: {version}")
    logger.info(json.dumps(event))

    logger.debug(f"LOG_LEVEL: {log_level} \n ")

    message = event
    token = message['Token']
    execution_id = message['ExecutionId']

    if not "Payload" in message:
        raise ValueError("Need Payload with manifest to process message.")

    manifest: tm.IDPManifest = tm.IDPManifestSchema().load(
        message["Payload"]['manifest'])  #type: ignore

    s3_path = manifest.s3_path
    payload = message['Payload']

    if 'txt_output_location' in payload and "TextractOutputCSVPath" in payload[
            'txt_output_location']:
        s3_input_text = payload['txt_output_location']['TextractOutputCSVPath']
    else:
        raise ValueError(
            f"no ['txt_output_location']['TextractOutputCSVPath'] to get the text file from "
        )

    logger.info(f"s3_path: {s3_path} \n \
                    s3_input_text: {s3_input_text} \n\
                token: {token} \n \
                execution_id: {execution_id}")

    try:
        text = get_file_from_s3(s3_path=s3_input_text).decode('utf-8')[0:4900]

        start_time = round(time.time() * 1000)

        spacy_result = spacy_nlp(text)
        categories = spacy_result.cats
        # output: {'AWS_PAYSTUBS': 3.0901937861926854e-06, 'AWS_OTHER': 0.9999514818191528, 'AWS_W2': 4.53636675956659e-05}

        logger.debug(f"spacy result: {categories}")

        classification_result = "NONE"
        for c in categories:
            if categories[c] > 0.50:
                classification_result = c
                break
        logger.debug(f"spacy classification: {classification_result}")

        call_duration = round(time.time() * 1000) - start_time
        logger.info(f"spacy_sync_generic_call_duration_in_ms: {call_duration}")
        try:
            step_functions_client.send_task_success(
                taskToken=token,
                output=json.dumps({"documentType": classification_result}))
        except step_functions_client.exceptions.InvalidToken:
            logger.error(f"InvalidToken for message: {message} ")
        except step_functions_client.exceptions.TaskDoesNotExist:
            logger.error(f"TaskDoesNotExist for message: {message} ")
        except step_functions_client.exceptions.TaskTimedOut:
            logger.error(f"TaskTimedOut for message: {message} ")
        except step_functions_client.exceptions.InvalidOutput:
            logger.error(f"InvalidOutput for message: {message} ")

    except Exception as e:
        logger.error(f"InvalidToken for message: {message} ")
        step_functions_client.send_task_failure(taskToken=token,
                                                error='unhandled',
                                                cause=str(e)[:250])
