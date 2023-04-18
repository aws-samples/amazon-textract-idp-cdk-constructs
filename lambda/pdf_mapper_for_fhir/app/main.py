import json
import uuid
import boto3
import os
import traceback
import trp
import logging
from fhir_doc_assembler import FhirDocAssembler
from send_to_healthlake import send_to_healthlake

logger = logging.getLogger('SendToHealthlake')
logger.addHandler(logging.StreamHandler())
logger.setLevel(getattr(logging, os.getenv('LOG_LEVEL', 'INFO')))
client_textract = boto3.client('textract')


# Broken out into separate Lambda function in case there are slow-downs in textract,
# the document is very large, or in general if the time needed for Textract exceeds
# the 15-minute limit of Lambda.  Also, no need to leave a Lambda function running
# while it actively polls Textract when Textract is perfectly happy notifying us on
# SNS when it's ready for us to come back :-)

def handler(event, context):
    try:
        if event.get('Records'):
            sns_arn = os.environ.get('SNS_ARN')
            role_arn = os.environ.get('ROLE_ARN')
            logger.info('Lambda invoked by an S3 event trigger')
            logger.debug(f'SNS ARN: {sns_arn}')
            logger.debug(f'Role ARN: {role_arn}')
            jobs = []
            for record in event["Records"]:
                if not (bucket := record['s3']['bucket']['name']):
                    raise ValueError("Unable to continue. Missing Bucket env var")
                if not (key_name := record['s3']['object']['key']):
                    raise ValueError("Unable to continue. Missing Object Key.")

                logger.info(f'Bucket:{bucket}, Key: {key_name}')

                resp = client_textract.start_document_text_detection(
                    DocumentLocation={
                        'S3Object': {
                            'Bucket': bucket,
                            'Name': f"{key_name}"
                        }
                    },
                    NotificationChannel={
                        'SNSTopicArn': sns_arn,
                        'RoleArn': role_arn
                    },
                    OutputConfig={
                        'S3Bucket': bucket
                    }
                )
                logger.info(f"Sent to Textract. Job ID is {resp['JobId']}")
                jobs.append(resp['JobId'])
            return resp['JobId']

        elif event.get('API') == 'StartDocumentTextDetection':
            job_id = event.get('JobId')
            status = event.get("Status")
            logger.info(f"Handling job ID {job_id} with status {status}")

            logger.info('Textract document processing completed request')
            if status != "SUCCEEDED":
                logger.info("Status wasn't \"SUCCEEDED\".")
                return {"Message": "Failed to process the document request"}

            get_doc_args = {"JobId": job_id}
            doc_id = uuid.uuid4()
            blocks = []
            while True:
                resp = client_textract.get_document_text_detection(**get_doc_args)
                if resp['JobStatus'] in ['SUCCEEDED', 'PARTIAL_SUCCESS']:
                    for block in resp["Blocks"]:
                        block_type = block["BlockType"]
                        if block_type == "PAGE":
                            logger.debug(f"Page {block['Page']}")
                        elif block_type == "LINE":
                            logger.debug(f"Line {block['Text']}")

                    blocks += resp['Blocks']
                    if next_token := resp.get('NextToken'):
                        get_doc_args["NextToken"] = next_token
                    else:
                        break
                else:
                    logger.debug(f'Job status: {resp["JobStatus"]}')
                    raise RuntimeError("job status wasn't succeeded or partial success")

            document = trp.Document({'Blocks': blocks})
            assembler = FhirDocAssembler()
            logger.info(f'The document has {len(document.pages)} pages')
            logger.info(f'Unique ID for this document is: {doc_id}')
            for page in document.pages:
                send_to_healthlake(assembler.get_fhir_doc(page.text, doc_id))
                logger.debug(f"Adding attachment {page.text}")

    except Exception as e:
        traceback.print_exc()
        raise e
