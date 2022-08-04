# Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import json
import logging
import os
import boto3
import json
import textractmanifest as tm
from documentsplitter.documentsplitter import split_and_save_pages, split_s3_path_to_bucket_and_key

s3 = boto3.client('s3')

logger = logging.getLogger(__name__)
version = "0.0.14"


def parse_manifest(s3_path: str) -> tm.IDPManifest:
    s3_bucket, s3_key = split_s3_path_to_bucket_and_key(s3_path)
    o = s3.get_object(Bucket=s3_bucket, Key=s3_key)
    file_content = o.get('Body').read().decode('utf-8')
    return tm.IDPManifestSchema().loads(file_content)  #type: ignore


def lambda_handler(event, _):
    # Accepts a manifest file (https://github.com/schadem/schadem-tidp-manifest) with an s3Path and will split the document into individual pages

    log_level = os.environ.get('LOG_LEVEL', 'INFO')
    logger.setLevel(log_level)
    logger.info(f"version: {version}")
    logger.info(f"schadem-tidp-manifest version: {tm.__version__}")
    logger.info(json.dumps(event))

    s3_output_bucket = os.environ.get('S3_OUTPUT_BUCKET', None)
    if not s3_output_bucket:
        raise Exception("no S3_OUTPUT_BUCKET set")

    s3_output_prefix = os.environ.get('S3_OUTPUT_PREFIX', None)
    if not s3_output_prefix:
        raise Exception("no S3_OUTPUT_PREFIX set")

    supported_mime_types = [
        'application/pdf', 'image/png', 'image/jpeg', 'image/tiff'
    ]

    manifest: tm.IDPManifest = tm.IDPManifestSchema().load(
        event["Payload"]['manifest'])  #type: ignore

    mime: str = ""
    if 'mime' in event["Payload"]:
        mime = event['Payload']['mime']

    if mime and mime in supported_mime_types:
        output_file_list = split_and_save_pages(
            s3_path=manifest.s3_path,
            mime=mime,
            s3_output_bucket=s3_output_bucket,
            s3_output_prefix=s3_output_prefix)
    else:
        raise Exception(f"not supported Mime type: {mime}")
    logger.info(f"return: {manifest}")

    result_value = {
        "documentSplitterS3OutputPath": s3_output_prefix,
        "pages": [output_file_list]
    }

    return result_value
