# Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import json
import logging
import os
import io
import csv
import boto3
from typing import Tuple
import json
import textractmanifest as tm
from textractprettyprinter.t_pretty_print import convert_queries_to_list_trp2, convert_form_to_list_trp2
import trp.trp2 as t2
import datetime

logger = logging.getLogger(__name__)
version = "0.0.3"
s3_client = boto3.client('s3')
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
        o = s3_client.get_object(Bucket=s3_bucket, Key=s3_key, Range=range)
    else:
        o = s3_client.get_object(Bucket=s3_bucket, Key=s3_key)
    return o.get('Body').read()


def lambda_handler(event, _):
    # takes and even which includes a location to a Textract JSON schema file and generates CSV based on Query results + FORMS results
    # in the form of
    # filename, page, datetime, key, value

    log_level = os.environ.get('LOG_LEVEL', 'INFO')
    logger.setLevel(log_level)
    logger.debug(f"version: {version}")
    logger.debug(json.dumps(event))
    csv_s3_output_prefix = os.environ.get('CSV_S3_OUTPUT_PREFIX')
    output_type = os.environ.get('OUTPUT_TYPE', 'CSV')
    csv_s3_output_bucket = os.environ.get('CSV_S3_OUTPUT_BUCKET')

    logger.info(f"CSV_S3_OUTPUT_PREFIX: {csv_s3_output_prefix} \n\
        CSV_S3_OUTPUT_BUCKET: {csv_s3_output_bucket} \n\
            OUTPUT_TYPE: {output_type}")
    task_token = event['Token']
    try:
        if not csv_s3_output_prefix or not csv_s3_output_bucket:
            raise ValueError(
                f"require CSV_S3_OUTPUT_PREFIX and CSV_S3_OUTPUT_BUCKET")
        if not 'Payload' in event and 'textract_result' in event[
                'Payload'] and not 'TextractOutputJsonPath' in event[
                    'Payload']['textract_result']:
            raise ValueError(
                f"no 'TextractOutputJsonPath' in event['textract_result]")
        # FIXME: hard coded result location
        s3_path = event['Payload']['textract_result']['TextractOutputJsonPath']
        classification = ""
        if 'classification' in event['Payload'] and event['Payload'][
                'classification'] and 'documentType' in event['Payload'][
                    'classification']:
            classification = event['Payload']['classification']['documentType']

        base_filename = os.path.basename(s3_path)
        base_filename_no_suffix, _ = os.path.splitext(base_filename)
        file_json = get_file_from_s3(s3_path=s3_path).decode('utf-8')
        trp2_doc: t2.TDocument = t2.TDocumentSchema().load(
            json.loads(file_json))  #type: ignore
        timestamp = datetime.datetime.now().astimezone().replace(
            microsecond=0).isoformat()
        result_value = ""
        if output_type == 'CSV':
            key_value_list = convert_form_to_list_trp2(
                trp2_doc=trp2_doc)  #type: ignore
            queries_value_list = convert_queries_to_list_trp2(
                trp2_doc=trp2_doc)  #type: ignore
            csv_output = io.StringIO()
            csv_writer = csv.writer(csv_output,
                                    delimiter=",",
                                    quotechar='"',
                                    quoting=csv.QUOTE_MINIMAL)
            for page in key_value_list:
                csv_writer.writerows(
                    [[timestamp, classification, base_filename] + x
                     for x in page])
            for page in queries_value_list:
                csv_writer.writerows(
                    [[timestamp, classification, base_filename] + x
                     for x in page])
            csv_s3_output_key = f"{csv_s3_output_prefix}/{timestamp}/{base_filename_no_suffix}.csv"
            result_value = csv_output.getvalue()
        elif output_type == 'LINES':
            csv_s3_output_key = f"{csv_s3_output_prefix}/{timestamp}/{base_filename_no_suffix}.txt"
            for page in trp2_doc.pages:
                result_value += t2.TDocument.get_text_for_tblocks(
                    trp2_doc.lines(page=page))
            logger.debug(f"got {len(result_value)}")
        else:
            raise ValueError(f"output_type '${output_type}' not supported: ")

        s3_client.put_object(Body=bytes(result_value.encode('UTF-8')),
                             Bucket=csv_s3_output_bucket,
                             Key=csv_s3_output_key)
        logger.debug(
            f"TextractOutputCSVPath: s3://{csv_s3_output_bucket}/{csv_s3_output_key}"
        )
        step_functions_client.send_task_success(
            taskToken=task_token,
            output=json.dumps({
                "TextractOutputCSVPath":
                f"s3://{csv_s3_output_bucket}/{csv_s3_output_key}"
            }))
    except Exception as e:
        logger.error(e, exc_info=True)
        step_functions_client.send_task_failure(taskToken=task_token,
                                                error=str(type(e)),
                                                cause=str(e))
