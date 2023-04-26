import json
import requests
import os
import boto3
import logging
from requests_auth_aws_sigv4 import AWSSigV4

logger = logging.getLogger('SendToHealthlake')
logger.addHandler(logging.StreamHandler())
logger.setLevel(getattr(logging, os.getenv('LOG_LEVEL', 'INFO')))


def send_to_healthlake(fhir_doc):
    session = boto3.session.Session()
    auth = AWSSigV4("healthlake", session=session)
    if DATA_STORE_ENDPOINT := os.environ.get('HEALTHLAKE_ENDPOINT'):
        DATA_STORE_ENDPOINT += "DocumentReference"
    else:
        logger.error('Missing Healthlake Endpoint. Unbale to continue')
        raise ValueError('Missing Healthlake Endpoint env.var.')
    # Calling data store FHIR endpoint using SigV4 auth
    logger.debug(f"Sending to HealthLake {json.dumps(fhir_doc)}")
    resp = requests.post(DATA_STORE_ENDPOINT, json=fhir_doc, auth=auth)
    resp.raise_for_status()
