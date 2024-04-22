import json
import uuid
import boto3
import os
import traceback
import trp
import logging
from urllib.parse import urlparse

logger = logging.getLogger('SendToComprehendMedical')
logger.addHandler(logging.StreamHandler())
logger.setLevel(getattr(logging, os.getenv('LOG_LEVEL', 'INFO')))
client = boto3.client('s3')
cm_client = boto3.client('comprehendmedical')
cm_job_types = [('ICD10', 'start_icd10_cm_inference_job'),
                ('SNOMEDCT', 'start_snomedct_inference_job'),
                ('RXNORM', 'start_rx_norm_inference_job'),
                ('DETECT_ENTITIES_V2', 'start_entities_detection_v2_job'),
                ('DETECT_PHI', 'start_phi_detection_job')]


# Broken out into separate Lambda function in case there are slow-downs in textract,
# the document is very large, or in general if the time needed for Textract exceeds
# the 15-minute limit of Lambda.  Also, no need to leave a Lambda function running
# while it actively polls Textract when Textract is perfectly happy notifying us on
# SNS when it's ready for us to come back :-)

def handler(event, context):
    start_job = None
    job_type = os.getenv('COMPREHEND_MEDICAL_JOB_TYPE')
    for job in cm_job_types:
        if job_type == job[0]:
            start_job = getattr(cm_client, job[1])
    if not start_job:
        logger.info('There is no valid COMPREHEND_MEDICAL_JOB_TYPE set.')
        return

    try:
        if event.get('textract_result'):
            output_json = event['textract_result']['TextractOutputJsonPath']
            bucket = urlparse(output_json).hostname
            object_key = urlparse(output_json).path[1:]
            logger.debug(f'Bucket: {bucket}')
            logger.debug(f'Key: {object_key}')
            resp = client.get_object(Bucket=bucket, Key=object_key)
            blocks = json.loads(resp['Body'].read())
            document = trp.Document(blocks)
            logger.info(f'The document has {len(document.pages)} pages')
            # TODO We can add Bedrock here to send multiple pages to CM based on the context
            text_content = ""
            job_name = f'job-{uuid.uuid4()}'
            object_name = f'textract-output/text/{job_type}/{job_name}/{job_name}.txt'
            for page in document.pages:
                text_content += page.text
            client.put_object(Bucket=bucket, Key=object_name, Body=str.encode(text_content))
            start_job(
                InputDataConfig={
                    'S3Bucket': bucket,
                    'S3Key': f'textract-output/text/{job_type}/{job_name}'
                },
                OutputDataConfig={
                    'S3Bucket': bucket,
                    'S3Key': f'cm-output/json/{job_type}/{job_name}'
                },
                JobName=job_name,
                DataAccessRoleArn=os.getenv('COMPREHEND_MEDICAL_ROLE'),
                LanguageCode='en'
            )
        else:
            raise RuntimeError('Invalid lambda event.')
    except Exception as e:
        traceback.print_exc()
        raise e