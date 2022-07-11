import textractmanifest as tm
import csv
from typing import List

# AWS_PAYSTUBS
paystub_query_list: List[List[str]] = [
    ["PAYSTUB_PERIOD_START_DATE", "What is the Pay Period Start Date?"],
    ["PAYSTUB_PERIOD_END_DATE", "What is the Pay Period End Date?"],
    ["PAYSTUB_PERIOD_PAY_DATE", "What is the Pay Date?"],
    ["PAYSTUB_PERIOD_EMPLOYEE_NAME", "What is the Employee Name?"],
    ["PAYSTUB_PERIOD_COMPANY_NAME", "What is the company Name?"],
    ["PAYSTUB_PERIOD_CURRENT_GROSS_PAY", "What is the Current Gross Pay?"],
    ["PAYSTUB_PERIOD_YTD_GROSS_PAY", "What is the YTD Gross Pay?"],
    ["PAYSTUB_PERIOD_REGULAR_HOURLY_RATE", "What is the regular hourly rate?"],
    ["PAYSTUB_PERIOD_HOLIDAY_RATE", "What is the holiday rate?"]
]

queries: List[tm.Query] = list()
for query in paystub_query_list:
    queries.append(tm.Query(alias=query[0], text=query[1]))

paystub_manifest = tm.IDPManifest(queries_config=queries,
                                  textract_features=['QUERIES'])

# W2

w2_query_list: List[List[str]] = [
    ['W2_FORM_YEAR', 'What is the form year?'],
    ['W2_FORM_TYPE', 'What is the form type?'],
    ['W2_EMPLOYEE_SSN', 'What is the Employee SSN?'],
    ['W2_EMPLOYER_NAME', 'What is the Employer Name?'],
    ['W2_WAGES_TIPS_OTHER', 'What is wages, tips, other compensation amount?'],
    [
        'W2_FEDERAL_INCOME_TAX',
        'What is the Federal Income Tax withheld amount?'
    ],
    ['W2_SS_WAGES', 'What is the social security wages amount?'],
    ['W2_SS_TAX', 'What is the social security Taxes withheld amount?'],
    ['W2_12a_VALUE_TYPE', 'What is the value type in Box 12a?'],
    ['W2_12a_VALUE_AMOUNT', 'What is the value amount in Box 12a?'],
    ['W2_12b_VALUE_TYPE', 'What is the value type in Box 12b?'],
    ['W2_12b_VALUE_AMOUNT', 'What is the value amount in Box 12b?'],
    ['W2_12c_VALUE_TYPE', 'What is the value type in Box 12c?'],
    ['W2_13_STATUTORY', 'Is Box 13 Statutory employee selected?'],
    ['W2_13_RETIREMENT_PLAN', 'Is Box 13 Retirement plan selected?'],
    ['W2_13_THIRD_PARTY_SICK_PAY', 'Is Box 13 Third-party sick pay selected?'],
]

queries: List[tm.Query] = list()
for query in w2_query_list:
    queries.append(tm.Query(alias=query[0], text=query[1]))

w2_manifest = tm.IDPManifest(queries_config=queries,
                             textract_features=['FORMS', 'QUERIES'])

bank_statements_list: List[List[str]] = [
    ['AWS_BANK_STATEMENTS_ACCOUNT_NAME', 'What is the Customer/Account Name?'],
    ['AWS_BANK_STATEMENTS_BANK_NAME', 'What is the Bank Name?'],
    ['AWS_BANK_STATEMENTS_ACCOUNT_NUMBER', 'What is the Account Number?'],
    ['AWS_BANK_STATEMENTS_ACCOUNT_TYPE', 'What is the Account Type?'],
    [
        'AWS_BANK_STATEMENTS_BEGINNING_BALANCE',
        'What is the Beginning Balance?'
    ],
    ['AWS_BANK_STATEMENTS_TOTAL_DEPOSITS', 'What is the Total Deposits?'],
    ['AWS_BANK_STATEMENTS_TOTAL_WITHDRAWALS', 'What is the Total Withdrawal?'],
    [
        'AWS_BANK_STATEMENTS_ENDING_BALANCE',
        'What is the Ending balance?',
    ],
    [
        'AWS_BANK_STATEMENTS_AVERAGE_BALANCE',
        'What is the Average balance?',
    ],
]
queries: List[tm.Query] = list()
for query in bank_statements_list:
    queries.append(tm.Query(alias=query[0], text=query[1]))

bank_statements_manifest = tm.IDPManifest(queries_config=queries,
                                          textract_features=['QUERIES'])

# WRITE default_config.csv
with open("default_config.csv", 'w') as output_csv:
    csv_writer = csv.writer(output_csv, quoting=csv.QUOTE_MINIMAL)

    csv_writer.writerow(
        ['AWS_PAYSTUBS',
         tm.IDPManifestSchema().dumps(paystub_manifest)])
    csv_writer.writerow(['AWS_W2', tm.IDPManifestSchema().dumps(w2_manifest)])
    csv_writer.writerow([
        'AWS_BANK_STATEMENTS',
        tm.IDPManifestSchema().dumps(bank_statements_manifest)
    ])
