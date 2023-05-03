# Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0
from io import BytesIO
import json
import logging
from typing import List, Tuple

import boto3
import fitz
import trp
from trp.t_pipeline import order_blocks_by_geo
from trp.trp2 import TDocument, TDocumentSchema

logger = logging.getLogger(__name__)
version = "0.0.5"
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

    textract_s3_byte = get_file_from_s3(tesxtract_result.get('TextractOutputJsonPath'))
    logger.info(f"Get File {tesxtract_result.get('TextractOutputJsonPath')}")

    logger.info("Reading PDF")
    # Read the PDF 
    pdfdoc = fitz.open("pdf", stream=BytesIO(pdf_obj))

    logger.info("Reading the JSON")
    #Read the JSON
    textract_json = json.loads(textract_s3_byte)
    temp_doc = TDocumentSchema().load(textract_json)

    logger.info("Loading into TRP and Ordering Blocks by Geo")
    #Load into TRP and Order Blocks
    ordered_doc = order_blocks_by_geo(temp_doc)
    trp_doc = trp.Document(TDocumentSchema().dump(ordered_doc))

    logger.info("Parsing the Text and writing to PDF Hidden Layer")
    # parse the detect text into words and write to PDF
        
    font = fitz.Font("Courier")
    font_size = 12
    for i, page in enumerate(pdfdoc):
        tPage = trp_doc.pages[i]
        tw = fitz.TextWriter(page.rect)
        lines = list(tPage.lines)
        words = [
            {
                "xmin": round(word.geometry.boundingBox.left * page.rect.width), 
                "ymin": round(word.geometry.boundingBox.top * page.rect.height),
                "xmax": round(round(word.geometry.boundingBox.left * page.rect.width) + (word.geometry.boundingBox.width * page.rect.width)),
                "ymax": round(round(word.geometry.boundingBox.top * page.rect.height) + (word.geometry.boundingBox.height * page.rect.height)),
                "text": word.text
             } 
            for line in lines for word in line.words
            ]
        for word in words:
            tw.append(pos=(word.get('xmin'), word.get('ymax')), text=word.get('text'), font=font, fontsize=font_size)                
        tw.write_text(page, render_mode=0, color=(0, 1, 0))
    s3_bucket, s3_key = split_s3_path_to_bucket_and_key(manifest.get('s3Path'))
    outputKey = f"pdf_output/{s3_key.split('/')[-1].split('.')[0]}_searchable.pdf"
    logger.info(f"Saving to {s3_bucket}/{outputKey}")
    bytes_ = BytesIO(pdfdoc.write())
    s3.put_object(Body=bytes_, Bucket=s3_bucket, Key=outputKey)

    return {"message": f"Finished Saving to {s3_bucket}/{outputKey}"}
