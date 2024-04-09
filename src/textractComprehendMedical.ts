import * as path from 'path';
import { Duration } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';

export interface TextractComprehendMedicalProps {
  /** memory of Lambda function (may need to increase for larger documents) */
  readonly lambdaMemoryMB?: number;
  readonly lambdaTimeout?: number;
  readonly textractComprehendMedicalFunction?: lambda.IFunction;
  readonly lambdaLogLevel?: string;
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
export class TextractComprehendMedical extends sfn.StateMachineFragment {
  public readonly startState: sfn.State;
  public readonly endStates: sfn.INextable[];
  public readonly textractComprehendMedicalFunction: lambda.IFunction;

  constructor(parent: Construct, id: string, props: TextractComprehendMedicalProps) {
    super(parent, id);

    var lambdaMemoryMB = props.lambdaMemoryMB === undefined ? 1024 : props.lambdaMemoryMB;
    var lambdaTimeout = props.lambdaTimeout === undefined ? 900 : props.lambdaTimeout;
    var lambdaLogLevel = props.lambdaLogLevel === undefined ? 'INFO' : props.lambdaLogLevel;
    var s3InputPrefix = props.s3InputPrefix === undefined ? 'uploads' : props.s3InputPrefix;

    this.textractComprehendMedicalFunction = new lambda.DockerImageFunction(
      this,
      'TextractComprehendMedical',
      {
        code: lambda.DockerImageCode.fromImageAsset(
          path.join(__dirname, '../lambda/textract_comprehend_medical/'),
        ),
        architecture: lambda.Architecture.X86_64,
        memorySize: lambdaMemoryMB,
        timeout: Duration.seconds(lambdaTimeout),
        environment: {
          LOG_LEVEL: lambdaLogLevel,
        },
      },
    );

    if (props.inputPolicyStatements === undefined) {
      if (props.s3InputBucket === undefined) {
        this.textractComprehendMedicalFunction.addToRolePolicy(
          new iam.PolicyStatement({
            actions: ['s3:GetObject', 's3:ListBucket'],
            resources: ['*'],
          }),
        );
      } else {
        this.textractComprehendMedicalFunction.addToRolePolicy(
          new iam.PolicyStatement({
            actions: ['s3:GetObject', 's3:ListBucket'],
            resources: [
              path.join(`arn:aws:s3:::${props.s3InputBucket}`, s3InputPrefix, '/'),
              path.join(`arn:aws:s3:::${props.s3InputBucket}`, s3InputPrefix, '/*'),
            ],
          }),
        );
      }
      this.textractComprehendMedicalFunction.addToRolePolicy(
        new iam.PolicyStatement({
          actions: ['comprehendmedical:Start*'],
          resources: ['*'],
        }),
      );
    } else {
      for (var policyStatement of props.inputPolicyStatements) {
        this.textractComprehendMedicalFunction.addToRolePolicy(policyStatement);
      }
    }
    const textractComprehendMedicalLambdaInvoke = new tasks.LambdaInvoke(this, id, {
      lambdaFunction: this.textractComprehendMedicalFunction,
      outputPath: '$.Payload',
    });
    this.startState = textractComprehendMedicalLambdaInvoke;
    this.endStates = [textractComprehendMedicalLambdaInvoke];
  }
}
