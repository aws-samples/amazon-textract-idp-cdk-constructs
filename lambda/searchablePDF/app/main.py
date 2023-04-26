# Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0
from io import BytesIO
import json
import logging
from typing import List, Tuple

import boto3
import fitz
import trp

logger = logging.getLogger(__name__)
version = "0.0.3"
s3 = boto3.client('s3')
step_functions_client = boto3.client(service_name='stepfunctions')

def split_s3_path_to_bucket_and_key(s3_path: str) -> Tuple[str, str]:
    if len(s3_path) <= 7 or not s3_path.lower().startswith("s3://"):
        raise ValueError(
            f"s3_path: {s3_path} is no s3_path in the form of s3://bucket/key."
        )
    s3_bucket, s3_key = s3_path.replace("s3://", "").split("/", 1)
    return (s3_bucket, s3_key)


def get_file_from_s3(s3_path: str, range=None) -> bytes:
    s3_bucket, s3_key = split_s3_path_to_bucket_and_key(s3_path)
    if range:
        o = s3.get_object(Bucket=s3_bucket, Key=s3_key, Range=range)
    else:
        o = s3.get_object(Bucket=s3_bucket, Key=s3_key)
    return o.get('Body').read()

def lambda_handler(event, _):
    logger.setLevel('INFO')
    logger.info(f"version: {version}")
    logger.info(json.dumps(event))

    manifest = event.get("manifest")
    tesxtract_result = event.get("textract_result")

    # Get the files
    pdf_obj = get_file_from_s3(manifest.get('s3Path'))    

    logger.info(f"Get File {manifest.get('s3Path')}")

    textract_res = get_file_from_s3(tesxtract_result.get('TextractOutputJsonPath'))
    logger.info(f"Get File {tesxtract_result.get('TextractOutputJsonPath')}")

    logger.info("Reading PDF")
    # Read the PDF 
    pdfdoc = fitz.open("pdf", stream=BytesIO(pdf_obj))

    logger.info("Reading the JSON")
    #Read the JSON
    response = dict(json.loads(textract_res.decode('utf-8')))

    logger.info("Loading into TRP")
    #Load into TRP
    trp_doc = trp.Document(response)

    logger.info("Parsing the Text and writing to PDF Hidden Layer")
    # parse the detect text into lines
    font = fitz.Font("Courier")
    for i,page in enumerate(pdfdoc):
        tPage = trp_doc.pages[i]
        tw = fitz.TextWriter(page.rect)
        lines = [line for line in tPage.lines]
        words = [{"left": word.geometry.boundingBox.left, "top": word.geometry.boundingBox.top, "text": word.text} for line in lines for word in line.words]
        for word in words:
            xmin = round(word['left'] * page.rect.width)
            ymin = round(word['top'] * page.rect.height)        
            tw.append(pos=(xmin, ymin), text=word['text'], font=font, fontsize=11)                       
        tw.write_text(page, render_mode=3)
    s3_bucket, s3_key = split_s3_path_to_bucket_and_key(manifest.get('s3Path'))
    outputKey = f"pdf_output/{s3_key.split('/')[-1].split('.')[0]}_searchable.pdf"
    logger.info(f"Saving to {s3_bucket}/{outputKey}")
    bytes_ = BytesIO(pdfdoc.write())
    s3.put_object(Body=bytes_, Bucket=s3_bucket, Key=outputKey)

    return {"message": f"Finished Saving to {s3_bucket}/{outputKey}"}
