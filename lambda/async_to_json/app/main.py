# Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import json
import logging
import os
import time
from datetime import datetime
import boto3
import textractcaller as tc
import textractmanifest as tm

from urllib.parse import urlparse
from botocore.config import Config

logger = logging.getLogger(__name__)

config = Config(retries={'max_attempts': 0, 'mode': 'standard'})

region = os.environ['AWS_REGION']
step_functions_client = boto3.client(service_name='stepfunctions')
s3 = boto3.client(service_name='s3')

__version__ = "0.0.1"


def lambda_handler(event, _):
    log_level = os.environ.get('LOG_LEVEL', 'INFO')
    logger.setLevel(log_level)
    logger.info(json.dumps(event))
    logger.info(f"version: {__version__}\n \
        textractmanifest version: {tm.__version__}\n \
        boto3 version: {boto3.__version__}\n \
        textractcaller version: {tc.__version__}.")

    textract_api = os.environ.get('TEXTRACT_API', "GENERIC")
    s3_output_bucket = os.environ.get('S3_OUTPUT_BUCKET', None)
    if not s3_output_bucket:
        raise Exception("no S3_OUTPUT_BUCKET set")

    s3_output_prefix = os.environ.get('S3_OUTPUT_PREFIX', None)
    if not s3_output_prefix:
        raise Exception("no S3_OUTPUT_PREFIX set")

    logger.info(f"LOG_LEVEL: {log_level} \n \
                S3_OUTPUT_PREFIX: {s3_output_prefix} \n \
                S3_OUTPUT_BUCKET: {s3_output_bucket} \n \
                TEXTRACT_API: {textract_api} \
                ")

    manifest: tm.IDPManifest = tm.IDPManifestSchema().load(
        event['manifest'])  #type: ignore
    output_location = event['textract_result']['TextractTempOutputJsonPath']
    oc_s3_bucket = urlparse(output_location).netloc
    job_id = os.path.basename(urlparse(output_location).path)
    oc_s3_prefix = os.path.dirname(urlparse(output_location).path)
    output_config = tc.OutputConfig(s3_bucket=oc_s3_bucket,
                                    s3_prefix=oc_s3_prefix)
    start_time = round(time.time() * 1000)
    if textract_api=='GENERIC':
        full_json = tc.get_full_json_from_output_config(
            output_config=output_config, job_id=job_id, s3_client=s3)
    elif textract_api=='LENDING':
        full_json = tc.get_full_json_lending_from_output_config(
            output_config=output_config, job_id=job_id, s3_client=s3,
            subfolder="detailedResponse"
        )

    s3_filename, _ = os.path.splitext(os.path.basename(manifest.s3_path))

    call_duration = round(time.time() * 1000) - start_time
    logger.info(f"textract_async_to_json_call_duration_in_ms: {call_duration}")
    output_bucket_key = s3_output_prefix + "/" + s3_filename + datetime.utcnow(
    ).isoformat() + "/" + s3_filename + ".json"

    logger.info("before saving to S3")
    s3.put_object(Body=bytes(json.dumps(full_json, indent=4).encode('UTF-8')),
                  Bucket=s3_output_bucket,
                  Key=output_bucket_key)
    logger.info("after saving to S3")

    event["textract_result"]["TextractOutputJsonPath"]=f"s3://{s3_output_bucket}/{output_bucket_key}"

    return event
