# Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import json
import logging
import os
import boto3
from datetime import datetime
import json
import textractmanifest as tm
import filetype
from documentsplitter.documentsplitter import split_and_save_pages, split_s3_path_to_bucket_and_key
from typing import Tuple, Optional

s3_client = boto3.client('s3')

logger = logging.getLogger(__name__)
version = "0.0.14"


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
        o = s3_client.get_object(Bucket=s3_bucket, Key=s3_key, Range=range)
    else:
        o = s3_client.get_object(Bucket=s3_bucket, Key=s3_key)
    return o.get('Body').read()


def get_mime_for_file(file_bytes: bytes) -> Optional[str]:
    """
    possible formats: image/tiff, image/jpeg, application/pdf, image/png or 
    """
    kind = filetype.guess(file_bytes)
    if kind is None:
        return None
    else:
        return kind.mime


def parse_manifest(s3_path: str) -> tm.IDPManifest:
    s3_bucket, s3_key = split_s3_path_to_bucket_and_key(s3_path)
    o = s3_client.get_object(Bucket=s3_bucket, Key=s3_key)
    file_content = o.get('Body').read().decode('utf-8')
    return tm.IDPManifestSchema().loads(file_content)  #type: ignore


def lambda_handler(event, _):
    # Accepts a manifest file, with an s3Path and will split the document into individual pages

    log_level = os.environ.get('LOG_LEVEL', 'INFO')
    logger.setLevel(log_level)
    logger.info(f"version: {version}")
    logger.info(f"amazon-textract-idp-cdk-manifest: {tm.__version__}")
    logger.info(json.dumps(event))

    s3_output_bucket = os.environ.get('S3_OUTPUT_BUCKET', None)
    if not s3_output_bucket:
        raise Exception("no S3_OUTPUT_BUCKET set")

    s3_output_prefix = os.environ.get('S3_OUTPUT_PREFIX', None)
    if not s3_output_prefix:
        raise Exception("no S3_OUTPUT_PREFIX set")

    max_number_of_pages_per_doc = int(
        os.environ.get('MAX_NUMBER_OF_PAGES_PER_DOC', "1"))

    logger.debug(f"S3_OUTPUT_BUCKET: {s3_output_bucket} \
     S3_OUTPUT_PREFIX: {s3_output_prefix} \
     MAX_NUMBER_OF_PAGES_PER_DOC: {max_number_of_pages_per_doc}")

    supported_mime_types = [
        'application/pdf', 'image/png', 'image/jpeg', 'image/tiff'
    ]

    if 'manifest' in event:
        manifest: tm.IDPManifest = tm.IDPManifestSchema().load(
            event['manifest'])  #type: ignore
    else:
        manifest: tm.IDPManifest = tm.IDPManifestSchema().load(
            event)  #type: ignore

    s3_path = manifest.s3_path

    if 'mime' in event:
        mime = event['mime']
    else:
        first_file_bytes = get_file_from_s3(s3_path=s3_path,
                                            range='bytes=0-2000')
        mime = get_mime_for_file(file_bytes=first_file_bytes)

    if mime and mime in supported_mime_types:
        timestamp = datetime.utcnow().isoformat()
        s3_filename, _ = os.path.splitext(os.path.basename(manifest.s3_path))
        full_output_prefix = os.path.join(s3_output_prefix, s3_filename,
                                          timestamp)
        output_file_list = split_and_save_pages(
            s3_path=s3_path,
            mime=mime,
            s3_output_bucket=s3_output_bucket,
            s3_output_prefix=full_output_prefix,
            max_number_of_pages=max_number_of_pages_per_doc)
    else:
        raise Exception(f"not supported Mime type: {mime}")
    logger.info(f"return: {manifest}")

    result_value = {
        "documentSplitterS3OutputPath": full_output_prefix,
        "documentSplitterS3OutputBucket": s3_output_bucket,
        "pages": output_file_list,
        "mime": mime,
        "originFileURI": manifest.s3_path
    }

    return result_value
