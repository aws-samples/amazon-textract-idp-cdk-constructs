# Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import json
import logging
import os
import boto3
import filetype
from typing import Tuple, Optional
from pypdf import PdfReader
from PIL import Image, ImageSequence
import io
import json
import textractmanifest as tm

logger = logging.getLogger(__name__)
version = "0.0.14"
s3_client = boto3.client('s3')

# TODO: add file size check and page limit check, resize if file size too large


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


def get_number_of_pages(file_bytes: bytes, mime: str) -> int:
    if mime == 'application/pdf':
        with io.BytesIO(file_bytes) as input_pdf_file:
            pdf_reader = PdfReader(input_pdf_file)
            return len(pdf_reader.pages)
    elif mime == 'image/tiff':
        num_pages = 0
        f = io.BytesIO(file_bytes)
        img = Image.open(f)
        for _, _ in enumerate(ImageSequence.Iterator(img)):
            num_pages += 1
        return num_pages
    elif mime in ['image/png', 'image/jpeg']:
        return 1
    else:
        raise ValueError(f"unsupported mime type: {mime}")


def lambda_handler(event, _):
    # Accepts a manifest file, will enrich with information if possible
    # add
    #    "mime": mime,
    #    "classification": manifest.classification,
    #    "numberOfPages": numberOfPages

    supported_mime_types = [
        'application/pdf', 'image/png', 'image/jpeg', 'image/tiff'
    ]
    log_level = os.environ.get('LOG_LEVEL', 'INFO')
    logger.setLevel(log_level)
    logger.info(f"version: {version}")
    logger.info(f"amazon-textract-idp-cdk-manifest version: {tm.__version__}")
    logger.info(json.dumps(event))

    original_manifest: tm.IDPManifest = tm.IDPManifestSchema().load(
        event)  #type: ignore

    # only get first 2000 bytes to identify the mime type
    if original_manifest.document_pages:
        # this should be an ID document, so we set the first page
        s3_path = original_manifest.document_pages[0]
    else:
        s3_path = original_manifest.s3_path

    first_file_bytes = get_file_from_s3(s3_path=s3_path, range='bytes=0-2000')
    mime = get_mime_for_file(file_bytes=first_file_bytes)
    logger.debug(f"initial mime: {mime}")

    if not mime or mime not in supported_mime_types:
        # could be a manifest file
        try:
            manifest = parse_manifest(s3_path=s3_path)
        except json.decoder.JSONDecodeError:
            raise Exception(
                f"Document is not supported mime type '{mime}' and also not a manifest file"
            )

        if manifest.classification == 'IDENTITY':
            file_bytes = get_file_from_s3(s3_path=manifest.document_pages[0])
        else:
            file_bytes = get_file_from_s3(s3_path=manifest.s3_path)
        mime = get_mime_for_file(file_bytes=file_bytes)
        logger.info(f"document mime: {mime}")
        if not mime:
            raise Exception(f"not supported Mime type: {mime}")
        numberOfPages = get_number_of_pages(file_bytes=file_bytes, mime=mime)
    elif mime and mime in supported_mime_types:
        # this is a doc
        manifest = original_manifest
        file_bytes = get_file_from_s3(s3_path=manifest.s3_path)
        numberOfPages = get_number_of_pages(file_bytes=file_bytes, mime=mime)
    else:
        raise Exception(f"not supported Mime type: {mime}")
    logger.info(f"return: {manifest}")

    result_value = {
        "manifest": tm.IDPManifestSchema().dump(manifest),
        "mime": mime,
        "classification": manifest.classification,
        "numberOfPages": numberOfPages
    }

    if manifest and manifest.queries_config:
        result_value['numberOfQueries'] = len(manifest.queries_config)

    return result_value
