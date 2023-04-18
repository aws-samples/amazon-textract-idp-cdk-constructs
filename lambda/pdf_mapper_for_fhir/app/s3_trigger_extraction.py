import boto3
import os
import traceback

SNS_ARN = os.environ.get('SNS_ARN')
ROLE_ARN = os.environ.get('ROLE_ARN')

client_textract = boto3.client('textract')

def handler(event, context):
    try:
        if not (bucket := event['Records'][0]['s3']['bucket']['name']):
            raise ValueError("Unable to continue. Missing Bucket env var")
        if not (key_name := event['Records'][0]['s3']['object']['key']):
            raise ValueError("Unable to continue. Missing Object Key.")

        print(f'Bucket:{bucket}, Key: {key_name}')

        resp = client_textract.start_document_text_detection(
            DocumentLocation={
                'S3Object': {
                    'Bucket': bucket,
                    'Name': f"{key_name}"
                }
            },
            NotificationChannel={
                'SNSTopicArn': SNS_ARN,
                'RoleArn': ROLE_ARN
            },
            OutputConfig={
                'S3Bucket': bucket
            }
        )
        print(f"Sent to Textract. Job ID is {resp['JobId']}")

    except Exception as e:
        traceback.print_exc()
        raise e
