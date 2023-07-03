from pynamodb.models import Model
from pynamodb.attributes import UnicodeAttribute, NumberAttribute
import boto3
import time


class DocumentStatusModel(Model):

    class Meta:
        table_name = "TestDynamoDBTable"
        region = boto3.Session().region_name
        host = 'http://localhost:8000'

    document_path = UnicodeAttribute(hash_key=True)
    document_duplicate_index = NumberAttribute(range_key=True, default=0)
    insert_timestamp = NumberAttribute(null=True)
    queued_timestamp = NumberAttribute(null=True)
    finished_timestamp = NumberAttribute(null=True)
    status = UnicodeAttribute(
    )  # (RECEIVED, QUEUED, IN_PROGRESS, SUCCESSFUL, FAILED)
    workflow_execution_id = UnicodeAttribute(
        null=True)  # (set when IN_PROGRESS)


def test_simple_stuff():
    if not DocumentStatusModel.exists():
        DocumentStatusModel.create_table(read_capacity_units=1,
                                         write_capacity_units=1,
                                         wait=True)
    document_path = "S3:///blabla/foofoo.jpg"

    # empty query
    query_result = DocumentStatusModel.query(document_path,
                                             scan_index_forward=False,
                                             limit=1)

    for r in query_result:
        print("WHAAAAAAT? There are items?")
        print(r.attribute_values)
        break

    first_item: DocumentStatusModel = DocumentStatusModel(
        document_path=document_path,
        document_duplicate_index=0,
        status="RECEIVED")
    first_item.save()

    get_first_item = DocumentStatusModel.get(hash_key=document_path,
                                             range_key=0)

    # get_first_item.update(
    #     actions=[DocumentStatusModel.document_duplicate_index.add(1)])

    third_item = DocumentStatusModel(document_path=document_path,
                                     document_duplicate_index=2,
                                     status="RECEIVED")
    third_item.save()

    get_first_item.update(actions=[
        DocumentStatusModel.insert_timestamp.set(round(time.time() * 1000))
    ])

    query_result = DocumentStatusModel.query(document_path,
                                             scan_index_forward=False,
                                             limit=1)
    for r in query_result:
        print(r.attribute_values)

    DocumentStatusModel.delete_table()
