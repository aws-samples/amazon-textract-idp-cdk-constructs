import * as path from 'path';
import { Duration } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';

export interface TextractPdfMapperForFhirProps {
  /** memory of Lambda function (may need to increase for larger documents) */
  readonly lambdaMemoryMB?: number;
  readonly lambdaTimeout?: number;
  readonly pdfMapperForFhirFunction?: lambda.IFunction;
  readonly lambdaLogLevel?: string;
  readonly healthlakeEndpoint?: string;
  readonly s3InputBucket?: string;
  /** prefix for the incoming document. Will be used to create role */
  readonly s3InputPrefix?: string;
  /** List of PolicyStatements to attach to the Lambda function for S3 GET and LIST. */
  readonly inputPolicyStatements?: iam.PolicyStatement[];
}

/**
 * This construct takes in a manifest definition or a plain JSON with a s3Path:
 *
 * example s3Path:
 * {"s3Path": "s3://bucketname/prefix/image.png"}
 *
 *
 * Then it generated the numberOfPages attribute and the mime on the context.
 * The mime types checked against the supported mime types for Textract and if fails, will raise an Exception failing the workflow.
 *
 * Example (Python)
 * ```python
 decider_task_id = tcdk.TextractPOCDecider(
 self,
 f"InsuranceDecider",
 )
 ```

 *
 */
export class TextractPdfMapperForFhir extends sfn.StateMachineFragment {
  public readonly startState: sfn.State;
  public readonly endStates: sfn.INextable[];
  public readonly pdfMapperForFhirFunction: lambda.IFunction;

  constructor(parent: Construct, id: string, props: TextractPdfMapperForFhirProps) {
    super(parent, id);

    var lambdaMemoryMB = props.lambdaMemoryMB === undefined ? 1024 : props.lambdaMemoryMB;
    var lambdaTimeout = props.lambdaTimeout === undefined ? 900 : props.lambdaTimeout;
    var lambdaLogLevel = props.lambdaLogLevel === undefined ? 'INFO' : props.lambdaLogLevel;
    var healthlakeEndpoint = props.healthlakeEndpoint === undefined ? '' : props.healthlakeEndpoint;
    var s3InputPrefix = props.s3InputPrefix === undefined ? 'uploads' : props.s3InputPrefix;

    this.pdfMapperForFhirFunction = new lambda.DockerImageFunction(
      this,
      'TextractPdfMapperForFhir',
      {
        code: lambda.DockerImageCode.fromImageAsset(
          path.join(__dirname, '../lambda/pdf_mapper_for_fhir/'),
        ),
        architecture: lambda.Architecture.X86_64,
        memorySize: lambdaMemoryMB,
        timeout: Duration.seconds(lambdaTimeout),
        environment: {
          HEALTHLAKE_ENDPOINT: healthlakeEndpoint,
          LOG_LEVEL: lambdaLogLevel,
        },
      },
    );

    if (props.inputPolicyStatements === undefined) {
      if (props.s3InputBucket === undefined) {
        this.pdfMapperForFhirFunction.addToRolePolicy(
          new iam.PolicyStatement({
            actions: ['s3:GetObject', 's3:ListBucket'],
            resources: ['*'],
          }),
        );
      } else {
        this.pdfMapperForFhirFunction.addToRolePolicy(
          new iam.PolicyStatement({
            actions: ['s3:GetObject', 's3:ListBucket'],
            resources: [
              path.join(`arn:aws:s3:::${props.s3InputBucket}`, s3InputPrefix, '/'),
              path.join(`arn:aws:s3:::${props.s3InputBucket}`, s3InputPrefix, '/*'),
            ],
          }),
        );
      }
      this.pdfMapperForFhirFunction.addToRolePolicy(
        new iam.PolicyStatement({
          actions: ['healthlake:CreateResource'],
          resources: ['*'],
        }),
      );
    } else {
      for (var policyStatement of props.inputPolicyStatements) {
        this.pdfMapperForFhirFunction.addToRolePolicy(policyStatement);
      }
    }
    const pdfMapperForFhirLambdaInvoke = new tasks.LambdaInvoke(this, id, {
      lambdaFunction: this.pdfMapperForFhirFunction,
      timeout: Duration.seconds(600),
      outputPath: '$.Payload',
    });
    this.startState = pdfMapperForFhirLambdaInvoke;
    this.endStates = [pdfMapperForFhirLambdaInvoke];
  }
}
