import trp.trp2 as t2
from textractprettyprinter.t_pretty_print import convert_queries_to_list_trp2
import os
import json


def test_queries_generate_list(caplog):
    SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
    input_filename = os.path.join(SCRIPT_DIR, '../Paystub_1_reMars.json')

    with open(input_filename) as input_doc:
        trp2_doc: t2.TDocument = t2.TDocumentSchema().load(
            json.load(input_doc))  #type: ignore
        queries_value_list = convert_queries_to_list_trp2(
            trp2_doc=trp2_doc)  #type: ignore

        for i in queries_value_list:
            print(i)
