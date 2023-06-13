import * as path from 'path';
import { Duration } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';

export interface TextractAsyncToJSONProps {
  /** Bucketname to output data to */
  readonly s3OutputBucket: string;
  /** The prefix to use for the output files */
  readonly s3OutputPrefix: string;
  /** memory of Lambda function (may need to increase for larger documents), set to 10240 (max) atm, decrease for smaller workloads */
  readonly lambdaMemoryMB?: number;
  /** memory of Lambda function (may need to increase for larger documents) */
  readonly lambdaTimeout?: number;
  /** log level for Lambda function, supports DEBUG|INFO|WARNING|ERROR|FATAL */
  readonly lambdaLogLevel? : 'DEBUG'|'INFO'|'WARNING'|'ERROR'|'FATAL';
  /** Which Textract API was used to create the OutputConfig?
   * GENERIC and LENDING are supported.
   *
   * @default - GENERIC */
  readonly textractAPI?: 'GENERIC' | 'LENDING';
  /** location of input S3 objects - if left empty will generate rule for s3 access to all [*] */
  readonly s3InputBucket?: string;
  /** prefix for input S3 objects - if left empty will generate rule for s3 access to all in bucket */
  readonly s3InputPrefix?: string;
  /** List of PolicyStatements to attach to the Lambda function.  */
  readonly inputPolicyStatements?: iam.PolicyStatement[];
  /** List of PolicyStatements to attach to the Lambda function.  */
  readonly outputPolicyStatements?: iam.PolicyStatement[];
}

/**
 * combines the potentially paginated response from async Textract calls and stores as one combines JSON.
 *
 * This construct is not memory optimzed (yet) and will combine all JSON by loading them to memory.
 * Large responses could exceed the memory potentially, the memory size is set to Lambda max.
 *
 * Reduce the memory size to your needs if your processing does not yield large responses to save Lamda cost.
 *
 *
 * Input: "textract_result"."TextractTempOutputJsonPath"
 * Output: "TextractOutputJsonPath"
 *
 * Example (Python)
 * ```python
    textract_async_to_json = tcdk.TextractAsyncToJSON(
        self,
        "TextractAsyncToJSON2",
        s3_output_prefix=s3_output_prefix,
        s3_output_bucket=s3_output_bucket)
  ```
 */
export class TextractAsyncToJSON extends sfn.StateMachineFragment {
  public readonly startState : sfn.State;
  public readonly endStates : sfn.INextable[];
  public readonly asyncToJSONFunction: lambda.IFunction;
  constructor(parent : Construct, id : string, props : TextractAsyncToJSONProps) {
    super(parent, id);

    var lambdaLogLevel = props.lambdaLogLevel === undefined ? 'DEBUG' : props.lambdaLogLevel;
    var lambdaTimeout = props.lambdaTimeout === undefined ? 900 : props.lambdaTimeout;
    var lambdaMemoryMB = props.lambdaMemoryMB === undefined ? 10240 : props.lambdaMemoryMB;
    var textractAPI = props.textractAPI === undefined ? 'GENERIC' : props.textractAPI;

    var s3OutputPrefix =
      props.s3OutputPrefix === undefined ? '' : props.s3OutputPrefix;
    var s3InputPrefix =
      props.s3InputPrefix === undefined ? '' : props.s3InputPrefix;

    this.asyncToJSONFunction = new lambda.DockerImageFunction(this, 'TextractAsyncToJSON', {
      code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../lambda/async_to_json/')),
      memorySize: lambdaMemoryMB,
      architecture: lambda.Architecture.X86_64,
      environment: {
        S3_OUTPUT_BUCKET: props.s3OutputBucket,
        S3_OUTPUT_PREFIX: props.s3OutputPrefix,
        LOG_LEVEL: lambdaLogLevel,
        TEXTRACT_API: textractAPI,
      },
      timeout: Duration.seconds(lambdaTimeout),
    });
    /** ################ INPUT BUCKET POLICIES */
    if (props.inputPolicyStatements === undefined) {
      if (props.s3InputBucket === undefined) {
        this.asyncToJSONFunction.addToRolePolicy(
          new iam.PolicyStatement({
            actions: ['s3:GetObject', 's3:ListBucket'],
            resources: ['*'],
          }),
        );
      } else {
        this.asyncToJSONFunction.addToRolePolicy(
          new iam.PolicyStatement({
            actions: ['s3:GetObject'],
            resources: [
              path.join(`arn:aws:s3:::${props.s3InputBucket}`, s3InputPrefix, '/*'),
            ],
          }),
        );
        this.asyncToJSONFunction.addToRolePolicy(
          new iam.PolicyStatement({
            actions: ['s3:ListBucket'],
            resources: [
              path.join(`arn:aws:s3:::${props.s3InputBucket}`),
            ],
          }),
        );
      }
    } else {
      for (var policyStatement of props.inputPolicyStatements) {
        this.asyncToJSONFunction.addToRolePolicy(policyStatement);
      }
    }
    /** ##################### OUTPUT BUCKET POLICIES */
    if (props.outputPolicyStatements === undefined) {
      if (props.s3OutputBucket === undefined) {
        this.asyncToJSONFunction.addToRolePolicy(
          new iam.PolicyStatement({
            actions: ['s3:PutObject'],
            resources: ['*'],
          }),
        );
      } else {
        this.asyncToJSONFunction.addToRolePolicy(
          new iam.PolicyStatement({
            actions: ['s3:PutObject'],
            resources: [
              path.join(`arn:aws:s3:::${props.s3OutputBucket}`, s3OutputPrefix, '/'),
              path.join(`arn:aws:s3:::${props.s3OutputBucket}`, s3OutputPrefix, '/*'),
            ],
          }),
        );
      }
    } else {
      for (var policyStatement of props.outputPolicyStatements) {
        this.asyncToJSONFunction.addToRolePolicy(policyStatement);
      }
    }

    const asyncToJSON = new tasks.LambdaInvoke(this, id, {
      lambdaFunction: this.asyncToJSONFunction,
      timeout: Duration.seconds(900),
      outputPath: '$.Payload',
    });
    this.startState = asyncToJSON;
    this.endStates = [asyncToJSON];
  }
}
