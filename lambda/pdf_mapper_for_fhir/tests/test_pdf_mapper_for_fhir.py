import json
import io
import os
import boto3

current_folder = os.path.dirname(os.path.realpath(__file__))


def test_serializer_manifest(caplog):
    s3_bucket = 'sdx-textract-us-east-1'
    s3_key = 'sample_manifest.json'
    s3_client = boto3.client('s3')
    o = s3_client.get_object(Bucket=s3_bucket, Key=s3_key)
    file_content = o.get('Body').read().decode('utf-8')
    json_content = json.loads(file_content)
    assert json_content
    assert json_content['s3Path']
    assert json_content['textractFeatures']
    assert len(json_content['textractFeatures']) == 3
