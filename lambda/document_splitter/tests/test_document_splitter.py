import sys
import os
import logging

sys.path.append(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "../app"))

from documentsplitter.documentsplitter import split_and_save_pages  #pyright: ignore

current_folder = os.path.dirname(os.path.realpath(__file__))


def test_splitter_multi_page_pdf(caplog):
    caplog.set_level(logging.DEBUG)
    caplog.set_level(logging.WARNING, logger='botocore')
    caplog.set_level(logging.WARNING, logger='boto3')

    s3_path = 's3://sdx-textract-us-east-1/50-page-book.pdf'
    page_list = split_and_save_pages(s3_path=s3_path,
                                     mime='application/pdf',
                                     s3_output_bucket='sdx-textract-us-east-1',
                                     s3_output_prefix='document_splitter_test')
    assert page_list
    assert len(page_list) == 51


def test_splitter_multi_page_tiff(caplog):
    caplog.set_level(logging.DEBUG)
    caplog.set_level(logging.WARNING, logger='botocore')
    caplog.set_level(logging.WARNING, logger='boto3')

    s3_path = 's3://sdx-textract-us-east-1/multi_page_tiff.tiff'
    page_list = split_and_save_pages(s3_path=s3_path,
                                     mime='image/tiff',
                                     s3_output_bucket='sdx-textract-us-east-1',
                                     s3_output_prefix='document_splitter_test')
    assert page_list
    assert len(page_list) == 2


def test_splitter_single_page_tiff(caplog):
    caplog.set_level(logging.DEBUG)
    caplog.set_level(logging.WARNING, logger='botocore')
    caplog.set_level(logging.WARNING, logger='boto3')

    s3_path = 's3://sdx-textract-us-east-1/employmentapp.tiff'
    page_list = split_and_save_pages(s3_path=s3_path,
                                     mime='image/tiff',
                                     s3_output_bucket='sdx-textract-us-east-1',
                                     s3_output_prefix='document_splitter_test')
    assert page_list
    assert len(page_list) == 1


def test_splitter_single_page_jpeg(caplog):
    caplog.set_level(logging.DEBUG)
    caplog.set_level(logging.WARNING, logger='botocore')
    caplog.set_level(logging.WARNING, logger='boto3')

    s3_path = 's3://sdx-textract-us-east-1/w2-example.jpeg'
    page_list = split_and_save_pages(s3_path=s3_path,
                                     mime='image/jpeg',
                                     s3_output_bucket='sdx-textract-us-east-1',
                                     s3_output_prefix='document_splitter_test')
    assert page_list
    assert len(page_list) == 1


def test_splitter_single_page_png(caplog):
    caplog.set_level(logging.DEBUG)
    caplog.set_level(logging.WARNING, logger='botocore')
    caplog.set_level(logging.WARNING, logger='boto3')

    s3_path = 's3://sdx-textract-us-east-1/w2-example.png'
    page_list = split_and_save_pages(s3_path=s3_path,
                                     mime='image/png',
                                     s3_output_bucket='sdx-textract-us-east-1',
                                     s3_output_prefix='document_splitter_test')
    assert page_list
    assert len(page_list) == 1
