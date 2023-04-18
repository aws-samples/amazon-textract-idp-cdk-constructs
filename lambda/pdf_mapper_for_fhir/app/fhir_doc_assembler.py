import base64


class FhirDocAssembler():
    def __init__(self):
        self.attachments = []

    # def add_attachment(self, raw_text):
    #     encoded_text = base64.b64encode(str.encode(raw_text)).decode('utf-8')
    #     self.attachments.append({
    #         'attachment': {
    #             'data': encoded_text,
    #             'contentType': 'text/plain'
    #         }
    #     })

    def get_fhir_doc(self, raw_text, doc_id):
        encoded_text = base64.b64encode(str.encode(raw_text)).decode('utf-8')
        return {
            'resourceType': 'DocumentReference',
            'status': 'superseded',
            'subject': {
                "reference": ' '
            },
            'content': [
                {
                    'attachment': {
                        'data': encoded_text,
                        'contentType': 'text/plain'
                    }
                }
            ],
            "relatesTo": [
                {
                    "code": "appends",
                    "target": {
                        "reference": f"DocumentReference/{doc_id}"
                    }
                }
            ],
        }
