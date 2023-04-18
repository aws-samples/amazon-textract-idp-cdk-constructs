sam build
echo  "Testing S3 bucket notification"
job_id=$(sam local invoke -n env.json -e events/event.json)
echo "Testing Textract processing with job_id $job_id"
event_job="{\"JobId\": $job_id, \"Status\": \"SUCCEEDED\", \"API\": \"StartDocumentTextDetection\" }"
echo "$event_job" | sam local invoke -n env.json -e -
