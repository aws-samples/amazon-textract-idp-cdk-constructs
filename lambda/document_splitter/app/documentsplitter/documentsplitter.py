from typing import Tuple, List
from PyPDF2 import PdfFileReader, PdfFileWriter
from PIL import Image, ImageSequence
import io
import boto3
import os
import logging
import sys

logger = logging.getLogger(__name__)
s3 = boto3.client('s3')
s3_resource = boto3.resource('s3')


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


def split_and_save_pages(s3_path: str, mime: str, s3_output_bucket: str,
                         s3_output_prefix: str) -> List[str]:
    """returns files saved on S3"""
    output_file_list: List[str] = list()
    if mime == 'application/pdf':
        file_bytes = get_file_from_s3(s3_path=s3_path)
        with io.BytesIO(file_bytes) as input_pdf_file:
            pdf_reader = PdfFileReader(input_pdf_file)
            for page_number in range(0, pdf_reader.numPages):
                page_in_mem = io.BytesIO()
                writer = PdfFileWriter()
                writer.addPage(pdf_reader.getPage(pageNumber=page_number))
                writer.write(page_in_mem)
                logger.debug(f"len page_in_mem: {sys.getsizeof(page_in_mem)}")
                s3_source_filename, _ = os.path.splitext(
                    os.path.basename(s3_path))
                file_name = f"{page_number+1}.pdf"
                output_bucket_key = os.path.join(s3_output_prefix,
                                                 s3_source_filename, file_name)
                page_in_mem.seek(0)
                s3.put_object(Body=page_in_mem,
                              Bucket=s3_output_bucket,
                              Key=output_bucket_key)
                output_file_list.append(file_name)
            return output_file_list
    elif mime == 'image/tiff':
        file_bytes = get_file_from_s3(s3_path=s3_path)
        f = io.BytesIO(file_bytes)
        img = Image.open(f)
        for page_number, page in enumerate(ImageSequence.Iterator(img)):
            page_in_mem = io.BytesIO()
            page.save(page_in_mem, format="tiff")
            file_name = f"{page_number+1}.tiff"
            page_in_mem.seek(0)
            s3_source_filename, _ = os.path.splitext(os.path.basename(s3_path))
            output_bucket_key = os.path.join(s3_output_prefix,
                                             s3_source_filename, file_name)
            s3.put_object(Body=page_in_mem,
                          Bucket=s3_output_bucket,
                          Key=output_bucket_key)
            output_file_list.append(file_name)
    elif mime in ['image/png', 'image/jpeg']:
        source_s3_bucket, source_s3_key = split_s3_path_to_bucket_and_key(
            s3_path)
        suffix = mime.split('/')[1]
        file_name = f"1.{suffix}"
        output_bucket_key = os.path.join(s3_output_prefix, file_name)
        s3_resource.meta.client.copy(
            {
                'Bucket': source_s3_bucket,
                'Key': source_s3_key
            }, s3_output_bucket, output_bucket_key)
        output_file_list.append(file_name)
    else:
        raise ValueError(f"unsupported mime type: {mime}")
    return output_file_list
