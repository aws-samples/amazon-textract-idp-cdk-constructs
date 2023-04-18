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
# the 15 minute limit of Lambda.  Also, no need to leave a Lambda function running
# while it actively polls Textract when Textract is perfectly happy notifying us on
# SNS when it's ready for us to come back :-)

def handler(event, context):
    try:
        for record in event["Records"]:
            message_str = record["Sns"]["Message"]
            message_obj = json.loads(message_str)
            job_id = message_obj["JobId"]
            status = message_obj["Status"]
            logger.info(f"Handling job ID {job_id} with status {status}")

        if status != "SUCCEEDED":
            logger.info("Status wasn't \"SUCCEEDED\".")

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
