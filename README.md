# Amazon Textract IDP CDK Constructs

<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> All classes are under active development and subject to non-backward compatible changes or removal in any
> future version. These are not subject to the [Semantic Versioning](https://semver.org/) model.
> This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

# Context

This CDK Construct can be used as Step Function task and call Textract in Asynchonous mode for DetectText and AnalyzeDocument APIs.

For samples on usage, look at [Amazon Textact IDP CDK Stack Samples](https://github.com/aws-samples/amazon-textract-idp-cdk-stack-samples)

## Input

Expects a Manifest JSON at 'Payload'.
Manifest description: https://pypi.org/project/schadem-tidp-manifest/

Example call in Python

```python
        textract_async_task = t_async.TextractGenericAsyncSfnTask(
            self,
            "textract-async-task",
            s3_output_bucket=s3_output_bucket,
            s3_temp_output_prefix=s3_temp_output_prefix,
            integration_pattern=sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
            lambda_log_level="DEBUG",
            timeout=Duration.hours(24),
            input=sfn.TaskInput.from_object({
                "Token":
                sfn.JsonPath.task_token,
                "ExecutionId":
                sfn.JsonPath.string_at('$$.Execution.Id'),
                "Payload":
                sfn.JsonPath.entire_payload,
            }),
            result_path="$.textract_result")
```



## Output

Adds the "TextractTempOutputJsonPath" to the Step Function ResultPath. At this location the Textract output is stored as individual JSON files. Use the CDK Construct schadem-cdk-construct-sfn-textract-output-config-to-json to combine them to one single JSON file.

example with ResultPath = textract_result (like configured above):

```
"textract_result": {
    "TextractTempOutputJsonPath": "s3://schademcdkstackpaystuban-schademcdkidpstackpaystu-bt0j5wq0zftu/textract-temp-output/c6e141e8f4e93f68321c17dcbc6bf7291d0c8cdaeb4869758604c387ce91a480"
  }
```

## Spacy Classification

Expect a Spacy textcat model at the root of the directory. Call the script <TO_INSERT) to copy a public one which classifies Paystub and W2.

aws s3 cp s3://amazon-textract-public-content/constructs/en_textcat_demo-0.0.0.tar.gz .

