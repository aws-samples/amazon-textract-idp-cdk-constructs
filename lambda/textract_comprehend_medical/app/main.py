import json
import uuid
import boto3
import os
import traceback
import trp
import logging
from urllib.parse import urlparse
from fhir_doc_assembler import FhirDocAssembler
from send_to_healthlake import send_to_healthlake

logger = logging.getLogger('SendToHealthlake')
logger.addHandler(logging.StreamHandler())
logger.setLevel(getattr(logging, os.getenv('LOG_LEVEL', 'INFO')))
client =  boto3.client('s3')


# Broken out into separate Lambda function in case there are slow-downs in textract,
# the document is very large, or in general if the time needed for Textract exceeds
# the 15-minute limit of Lambda.  Also, no need to leave a Lambda function running
# while it actively polls Textract when Textract is perfectly happy notifying us on
# SNS when it's ready for us to come back :-)

def handler(event, context):
    logger.debug(event)
    try:
        if event.get('textract_result'):
            doc_id = uuid.uuid4()
            output_json = event['textract_result']['TextractOutputJsonPath']
            bucket = urlparse(output_json).hostname
            object_key = urlparse(output_json).path[1:]
            logger.debug(f'Bucket: {bucket}')
            logger.debug(f'Key: {object_key}')
            resp = client.get_object(Bucket=bucket, Key=object_key)
            blocks = json.loads(resp['Body'].read())
            document = trp.Document(blocks)
            assembler = FhirDocAssembler()
            logger.info(f'The document has {len(document.pages)} pages')
            logger.info(f'Unique ID for this document is: {doc_id}')
            for page in document.pages:
                send_to_healthlake(assembler.get_fhir_doc(page.text, doc_id))
                logger.debug(f"Adding attachment {page.text}")
        else:
            raise RuntimeError('Invalid lambda event.')
    except Exception as e:
        traceback.print_exc()
        raise e
