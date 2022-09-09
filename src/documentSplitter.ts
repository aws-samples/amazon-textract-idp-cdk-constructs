import * as path from 'path';
import { Duration } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';

export interface DocumentSplitterProps {
  /** Lambda function memory configuration (may need to increase for larger documents) */
  readonly lambdaMemoryMB?:number;
  /** Lambda function timeout (may need to increase for larger documents) */
  readonly lambdaTimeout?:number;
  /** Lambda log level */
  readonly lambdaLogLevel?:string;
  /** Bucketname to output data to */
  readonly s3OutputBucket:string;
  /** The prefix to use to output files to */
  readonly s3OutputPrefix:string;
}
/**
 * This construct takes in a manifest definition with just the s3Path:
 *
 * example s3Path:
 * {"s3Path": "s3://bucketname/prefix/image.png"}
 *
 *
 * then it generated single page versions of the multi-page file.
 * For PDF the output are single PDF files, for TIFF the output are single TIFF files.
 *
 * Example (Python)
 * ```python
  ```

 *
 */
export class DocumentSplitter extends sfn.StateMachineFragment {
  public readonly startState: sfn.State;
  public readonly endStates: sfn.INextable[];
  constructor(parent: Construct, id: string, props: DocumentSplitterProps) {
    super(parent, id);

    var lambdaMemoryMB = props.lambdaMemoryMB === undefined ? 10240 : props.lambdaMemoryMB;
    var lambdaTimeout = props.lambdaTimeout === undefined ? 900 : props.lambdaTimeout;
    var lambdaLogLevel = props.lambdaLogLevel === undefined ? 'DEBUG' : props.lambdaLogLevel;

    const splitterFunction = new lambda.DockerImageFunction(this, 'DocumentSplitterFunction', {
      code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../lambda/document_splitter/')),
      memorySize: lambdaMemoryMB,
      architecture: lambda.Architecture.X86_64,
      timeout: Duration.seconds(lambdaTimeout),
      environment: {
        S3_OUTPUT_BUCKET: props.s3OutputBucket,
        S3_OUTPUT_PREFIX: props.s3OutputPrefix,
        LOG_LEVEL: lambdaLogLevel,
      },
    });
    splitterFunction.addToRolePolicy(new iam.PolicyStatement({ actions: ['s3:GetObject', 's3:PutObject'], resources: ['*'] }));

    const splitterInvoke = new tasks.LambdaInvoke(this, id, {
      lambdaFunction: splitterFunction,
      timeout: Duration.seconds(900),
      outputPath: '$.Payload',
    });
    this.startState=splitterInvoke;
    this.endStates=[splitterInvoke];
  }
}
