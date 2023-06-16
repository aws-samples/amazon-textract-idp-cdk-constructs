from typing import Tuple, List
from PyPDF2 import PdfReader, PdfWriter
from PIL import Image
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


def split_and_save_pages(s3_path: str,
                         mime: str,
                         s3_output_bucket: str,
                         s3_output_prefix: str,
                         max_number_of_pages=1) -> List[str]:
    """takes a document ('application/pdf', 'image/tiff', 'image/png', 'image/jpeg') then stores single page files to s3_output_bucket under the s3_output_prefix with a _<page_number> and returns the list of file names """
    # object key is <start-page>-<end-page>.suffix
    output_file_list: List[str] = list()
    if mime == 'application/pdf':
        file_bytes = get_file_from_s3(s3_path=s3_path)
        with io.BytesIO(file_bytes) as input_pdf_file:
            pdf_reader = PdfReader(input_pdf_file)
            current_number_of_pages_collected = 0
            current_start_page = 1
            writer = PdfWriter()
            page_number = 1
            page_in_mem = io.BytesIO()
            for page_number in range(1, len(pdf_reader.pages) + 1):
                page_in_mem = io.BytesIO()
                writer.add_page(pdf_reader.pages[page_number - 1])
                writer.write(page_in_mem)
                logger.debug(f"len page_in_mem: {sys.getsizeof(page_in_mem)}")
                current_number_of_pages_collected += 1
                if current_number_of_pages_collected == max_number_of_pages:
                    file_name = f"{current_start_page}-{page_number}.pdf"
                    output_bucket_key = os.path.join(s3_output_prefix,
                                                     file_name)
                    page_in_mem.seek(0)
                    s3.put_object(Body=page_in_mem,
                                  Bucket=s3_output_bucket,
                                  Key=output_bucket_key)
                    output_file_list.append(file_name)
                    # reset the counters
                    writer = PdfWriter()
                    current_start_page = page_number + 1
                    current_number_of_pages_collected = 0
            else:
                if page_in_mem:
                    file_name = f"{current_start_page}-{page_number}.pdf"
                    output_bucket_key = os.path.join(s3_output_prefix,
                                                     file_name)
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
        page = 0
        current_start_page = 1
        #
        while True:
            images_for_chunk = []
            for _ in range(max_number_of_pages):
                try:
                    img.seek(page)
                    images_for_chunk.append(img.copy())
                    page += 1
                except EOFError:
                    # End of file, exit the loop
                    break

            # Upload the current chunk if it has any images
            if images_for_chunk:
                # Create an in-memory bytes buffer to store the chunk
                byte_io = io.BytesIO()
                images_for_chunk[0].save(byte_io,
                                         format='TIFF',
                                         save_all=True,
                                         append_images=images_for_chunk[1:])
                byte_io.seek(0)

                # Construct object key and upload to S3
                file_name = f"{current_start_page}-{page}.tiff"
                output_bucket_key = os.path.join(s3_output_prefix, file_name)
                output_file_list.append(file_name)
                s3.put_object(Body=byte_io,
                              Bucket=s3_output_bucket,
                              Key=output_bucket_key)
                current_start_page = page + 1
            else:
                # No more images left to process, exit the loop
                break
        #
    elif mime in ['image/png', 'image/jpeg']:
        source_s3_bucket, source_s3_key = split_s3_path_to_bucket_and_key(
            s3_path)
        suffix = mime.split('/')[1]
        file_name = f"1-1.{suffix}"
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
