# Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import json
import logging
import os
import io
import csv
import boto3
from typing import Tuple, List
from textractprettyprinter.t_pretty_print import convert_queries_to_list_trp2, convert_form_to_list_trp2, convert_lending_from_trp2, convert_signatures_to_list_trp2, convert_table_to_list
import trp.trp2 as t2
import trp as t1
import trp.trp2_lending as tl
import datetime
import textractmanifest as tm

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


def create_meta_data_dict(manifest: tm.IDPManifest) -> dict:
    meta_data_dict: dict = dict()
    if manifest.meta_data:
        for meta_data in manifest.meta_data:
            logger.debug(f"meta_data: {meta_data}")
            meta_data_dict[meta_data.key] = meta_data.value
    return meta_data_dict


# TODO: This method gets way too big, have to modularize it
def lambda_handler(event, _):
    """ takes and even which includes a location to a Textract JSON schema file and generates CSV based on Query results + FORMS results
     in the form of
     filename, page, datetime, key, value
     The OUTPUT_FEATURES include FORMS, QUERIES, TABLES, SIGNATURES
     The output files for FORMS and QUERIES and SIGNATURES are combined into one single CSV
     The output files for TABLES are individual csv's with a counter starting at 1 for the top most CSV file
     """

    log_level = os.environ.get('LOG_LEVEL', 'INFO')
    logger.setLevel(log_level)
    logger.debug(f"version: {version}")
    logger.debug(json.dumps(event))
    csv_s3_output_prefix = os.environ.get('CSV_S3_OUTPUT_PREFIX')
    output_type = os.environ.get('OUTPUT_TYPE', 'CSV')
    output_features = os.environ.get('OUTPUT_FEATURES', 'FORMS,QUERIES,TABLES,SIGNATURES')
    output_features_list = [x.strip() for x in output_features.split(',')]
    csv_s3_output_bucket = os.environ.get('CSV_S3_OUTPUT_BUCKET')
    textract_api = os.environ.get('TEXTRACT_API', 'GENERIC')
    meta_data_to_append = os.environ.get('META_DATA_TO_APPEND', '')
    meta_data_to_append_list = meta_data_to_append.split(',')
    logger.debug(f"meta_data_to_append_list: {meta_data_to_append_list}")

    logger.debug(f"CSV_S3_OUTPUT_PREFIX: {csv_s3_output_prefix} \n\
        CSV_S3_OUTPUT_BUCKET: {csv_s3_output_bucket} \n\
            OUTPUT_TYPE: {output_type} \n \
            OUTPUT_FEATURES: {output_features_list} \n \
    TEXTRACT_API: {textract_api} \n\
    META_DATA_TO_APPEND: {meta_data_to_append}")

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
        manifest: tm.IDPManifest = tm.IDPManifestSchema().load(  #type: ignore
            event['Payload']['manifest']
        ) if 'manifest' in event['Payload'] else tm.IDPManifest()
        meta_data_dict = create_meta_data_dict(manifest=manifest)
        values_to_append: List[str] = [
            meta_data_dict[meta_data_name_to_append]
            for meta_data_name_to_append in meta_data_to_append_list
            if meta_data_name_to_append in meta_data_dict
        ]
        logger.debug(f"value_to_append: {values_to_append}")
        # FIXME: hard coded result location
        s3_path = event['Payload']['textract_result']['TextractOutputJsonPath']
        base_filename = os.path.basename(s3_path)
        base_filename_no_suffix, _ = os.path.splitext(base_filename)
        file_json = get_file_from_s3(s3_path=s3_path).decode('utf-8')

        result_value = ""
        if textract_api == 'GENERIC':
            classification = ""
            if 'classification' in event['Payload'] and event['Payload'][
                    'classification'] and 'documentType' in event['Payload'][
                        'classification']:
                classification = event['Payload']['classification'][
                    'documentType']

            trp2_doc: t2.TDocument = t2.TDocumentSchema().load(
                json.loads(file_json))  #type: ignore
            timestamp = datetime.datetime.now().astimezone().replace(
                microsecond=0).isoformat()
            if output_type == 'CSV':
                key_value_list = list()
                if 'FORMS' in output_features_list:
                    logger.debug("creating FORMS")
                    key_value_list = convert_form_to_list_trp2(
                        trp2_doc=trp2_doc)
                queries_value_list = list()
                if 'QUERIES' in output_features_list:
                    logger.debug("creating QUERIES")
                    queries_value_list = convert_queries_to_list_trp2(
                        trp2_doc=trp2_doc)  #type: ignore
                signatures_value_list = list()
                if 'SIGNATURES' in output_features_list:
                    logger.debug("creating SIGNATURES")
                    signatures_value_list = convert_signatures_to_list_trp2(
                        trp2_doc=trp2_doc)  #type: ignore
                csv_output = io.StringIO()
                csv_writer = csv.writer(csv_output,
                                        delimiter=",",
                                        quotechar='"',
                                        quoting=csv.QUOTE_MINIMAL)
                for page in key_value_list:
                    csv_writer.writerows(
                        [[timestamp, classification, base_filename] + x +
                         values_to_append for x in page])
                for page in queries_value_list:
                    csv_writer.writerows(
                        [[timestamp, classification, base_filename] + x +
                         values_to_append for x in page])
                for page in signatures_value_list:
                    csv_writer.writerows(
                        [[timestamp, classification, base_filename] + x +
                         values_to_append for x in page])
                s3_output_key = f"{csv_s3_output_prefix}/{timestamp}/{base_filename_no_suffix}.csv"
                result_value = csv_output.getvalue()
                if 'TABLES' in output_features_list:
                    logger.debug("creating TABLES")
                    t1_doc = t1.Document(json.loads(file_json))
                    page_index = 0
                    for page in t1_doc.pages:
                        page_index += 1
                        table_index = 0
                        for table in page.tables:
                            table_index += 1
                            table_list = convert_table_to_list(
                                table)  #type: ignore
                            csv_output = io.StringIO()
                            csv_writer = csv.writer(csv_output,
                                                    delimiter=",",
                                                    quotechar='"',
                                                    quoting=csv.QUOTE_MINIMAL)
                            csv_writer.writerows(table_list)
                            s3_table_output_key = f"{csv_s3_output_prefix}/{timestamp}/{base_filename_no_suffix}_table_p{page_index}_n{table_index}.csv"
                            s3_client.put_object(Body=bytes(
                                csv_output.getvalue().encode('UTF-8')),
                                                 Bucket=csv_s3_output_bucket,
                                                 Key=s3_table_output_key)
            elif output_type == 'LINES':
                s3_output_key = f"{csv_s3_output_prefix}/{timestamp}/{base_filename_no_suffix}.txt"
                for page in trp2_doc.pages:
                    result_value += t2.TDocument.get_text_for_tblocks(
                        trp2_doc.lines(page=page))
                logger.debug(f"got {len(result_value)}")
            else:
                raise ValueError(f"output_type '{output_type}' not supported.")
        elif textract_api == 'LENDING':
            trp2_lending_doc: tl.TFullLendingDocument = tl.TFullLendingDocumentSchema(
            ).load(json.loads(file_json))  #type: ignore
            timestamp = datetime.datetime.now().astimezone().replace(
                microsecond=0).isoformat()
            result_value = ""
            if output_type == 'CSV':
                lending_array = convert_lending_from_trp2(trp2_lending_doc)
                if values_to_append:
                    [x.extend(values_to_append) for x in lending_array]
                csv_output = io.StringIO()
                csv_writer = csv.writer(csv_output,
                                        delimiter=",",
                                        quotechar='"',
                                        quoting=csv.QUOTE_MINIMAL)
                csv_writer.writerows(lending_array)
                s3_output_key = f"{csv_s3_output_prefix}/{timestamp}/{base_filename_no_suffix}.csv"
                result_value = csv_output.getvalue()
            elif output_type == 'LINES':
                raise Exception(
                    "LINES is not supported with LENDING at the moment.")
            else:
                raise ValueError(f"output_type '{output_type}' not supported.")
        elif textract_api == 'ANALYZEID':
            raise Exception("ANALYZEID not implemented yet")
        else:
            raise Exception("textract_api value unknown")

        s3_client.put_object(Body=bytes(result_value.encode('UTF-8')),
                             Bucket=csv_s3_output_bucket,
                             Key=s3_output_key)
        logger.debug(
            f"TextractOutputCSVPath: s3://{csv_s3_output_bucket}/{s3_output_key}"
        )
        step_functions_client.send_task_success(
            taskToken=task_token,
            output=json.dumps({
                "TextractOutputCSVPath":
                f"s3://{csv_s3_output_bucket}/{s3_output_key}"
            }))
    except Exception as e:
        logger.error(e, exc_info=True)
        step_functions_client.send_task_failure(taskToken=task_token,
                                                error=str(type(e)),
                                                cause=str(e))
