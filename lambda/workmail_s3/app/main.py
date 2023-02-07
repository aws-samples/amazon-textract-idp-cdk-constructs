from email.message import Message
from botocore.exceptions import ClientError
import boto3
import email
import os
import uuid
from email import policy
from base64 import b64decode

workmail_message_flow = boto3.client('workmailmessageflow')
s3 = boto3.client('s3')

def download_email(message_id):
    """
    This method downloads full email MIME content using GetRawMessageContent API and uses email.parser class
    for parsing it into Python email.message.EmailMessage class.
    Reference:
        https://docs.python.org/3.7/library/email.message.html#email.message.EmailMessage
        https://docs.python.org/3/library/email.parser.html
    Parameters
    ----------
    message_id: string, required
        message_id of the email to download
    Returns
    -------
    email.message.Message
        EmailMessage representation the downloaded email
    """
    response = workmail_message_flow.get_raw_message_content(messageId=message_id)
    email_content = response['messageContent'].read()
    email_generation_policy = policy.SMTP.clone(refold_source='none')
    print("Downloaded email from WorkMail successfully")
    return email.message_from_bytes(email_content, policy=email_generation_policy)


def lambda_handler(event, context):
    from_address = event['envelope']['mailFrom']['address']
    subject = event['subject']
    flow_direction = event['flowDirection']
    message_id = event['messageId']
    print(f"Received email with message ID {message_id}, flowDirection {flow_direction}, from {from_address} with Subject {subject}")

    try:
        raw_msg = workmail_message_flow.get_raw_message_content(messageId=message_id)
        parsed_msg: Message = email.message_from_bytes(raw_msg['messageContent'].read())

        parsed_email = download_email(message_id)
        key = str(uuid.uuid4())
        s3_output_bucket = os.environ.get('S3_OUTPUT_BUCKET')
        s3_output_prefix = os.environ.get('S3_OUTPUT_PREFIX')

        if not s3_output_bucket or not s3_output_prefix:
            raise ValueError(
                f"no s3_output_bucket: {s3_output_bucket} or s3_output_prefix: {s3_output_prefix} defined."
            )
        logger.debug(f"LOG_LEVEL: {log_level} \n \
                    S3_OUTPUT_BUCKET: {s3_output_bucket} \n \
                    S3_OUTPUT_PREFIX: {s3_output_prefix} \n \
                    TEXTRACT_API: {textract_api} \n  ")


        # Can take in multiple pdf attachments
        if parsed_email.is_multipart():
            # Walk over message parts of this multipart email.
            for part in parsed_email.walk():
                content_type = part.get_content_type()
                content_disposition = str(part.get_content_disposition())
                file_name = part.get_filename()
                if 'attachment' in content_disposition and part.is_attachment() and "application/pdf" in part.get_content_type():
                    fp = open('/tmp/' + file_name, 'wb')
                    fp.write(part.get_payload(decode=True))
                    fp.close()
                    print('ATTACHMENT - ' , fp)

                    s3.upload_file('/tmp/' + file_name,  Bucket=s3_output_bucket, Key=file_name)
                    print('Finished upload to S3 ' , fp)

    except ClientError as e:
        if e.response['Error']['Code'] == 'MessageFrozen':
            # Redirect emails are not eligible for update, handle it gracefully.
            print(f"Message {message_id} is not eligible for update. This is usually the case for a redirected email")
        else:
            # Send some context about this error to Lambda Logs
            print(e)
            if e.response['Error']['Code'] == 'ResourceNotFoundException':
                print(f"Message {message_id} does not exist. Messages in transit are no longer accessible after 1 day")
            elif e.response['Error']['Code'] == 'InvalidContentLocation':
                print('WorkMail could not access the updated email content. See https://docs.aws.amazon.com/workmail/latest/adminguide/update-with-lambda.html')
            raise(e)

    return {
        'actions': [
            {
                'allRecipients': True,  # For all recipients
                'action': {'type': 'DEFAULT'}  # let the email be sent normally
            }
        ]
    }
