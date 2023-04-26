import * as path from 'path';
import { Duration } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';

export interface SearchablePDFProps {
  /** memory of Lambda function (may need to increase for larger documents) */
  readonly lambdaMemoryMB?: number;
  readonly lambdaTimeout?: number;
  readonly searchablePDFFunction?: lambda.IFunction;
  readonly s3TextractOutputBucket?: string;
  readonly s3PDFBucket?: string;
  /** prefix for the incoming document. Will be used to create role */
  readonly s3InputPrefix?: string;
  /** List of PolicyStatements to attach to the Lambda function for S3 GET and LIST. */
  readonly inputPolicyStatements?: [iam.PolicyStatement];
}
/**
 * This construct takes in a JSON with two s3 Paths, s3TextractOutput, s3PDFBucket
 *
 * example s3Path:
 * {"s3TextractOutput": "s3://bucketname/prefix/1"}
 * {"s3PDFBucket": "s3://bucketname/prefix/document.pdf"}
  ```

 *
 */
export class SearchablePDF extends sfn.StateMachineFragment {
  public readonly startState: sfn.State;
  public readonly endStates: sfn.INextable[];
  public readonly searchablePDFFunction: lambda.IFunction;

  constructor(parent: Construct, id: string, props: SearchablePDFProps) {
    super(parent, id);

    var lambdaMemoryMB =
      props.lambdaMemoryMB === undefined ? 1024 : props.lambdaMemoryMB;
    var lambdaTimeout =
      props.lambdaTimeout === undefined ? 900 : props.lambdaTimeout;
    var s3InputPrefix =
      props.s3InputPrefix === undefined ? '' : props.s3InputPrefix;

    this.searchablePDFFunction = new lambda.DockerImageFunction(
      this,
      'SearchablePDF',
      {
        code: lambda.DockerImageCode.fromImageAsset(
          path.join(__dirname, '../lambda/searchablePDF/'),
        ),
        architecture: lambda.Architecture.X86_64,
        memorySize: lambdaMemoryMB,
        timeout: Duration.seconds(lambdaTimeout),
      },
    );

    if (props.inputPolicyStatements === undefined) {
      if (props.s3TextractOutputBucket === undefined) {
        this.searchablePDFFunction.addToRolePolicy(
          new iam.PolicyStatement({
            actions: ['s3:GetObject', 's3:ListBucket', 's3:PutObject'],
            resources: ['*'],
          }),
        );
      } else {
        this.searchablePDFFunction.addToRolePolicy(
          new iam.PolicyStatement({
            actions: ['s3:GetObject', 's3:ListBucket', 's3:PutObject'],
            resources: [
              path.join(`arn:aws:s3:::${props.s3TextractOutputBucket}`, s3InputPrefix, '/'),
              path.join(`arn:aws:s3:::${props.s3TextractOutputBucket}`, s3InputPrefix, '/*'),
            ],
          }),
        );
      }
    } else {
      for (var policyStatement of props.inputPolicyStatements) {
        this.searchablePDFFunction.addToRolePolicy(policyStatement);
      }
    }
    // TODO I don't think I am calling this correctly here.....
    const searchablePDFLambdaInvoke = new tasks.LambdaInvoke(this, id, {
      lambdaFunction: this.searchablePDFFunction,
      timeout: Duration.seconds(100),
      // do I need to pass the event info in here?
      outputPath: '$.Payload',
    });
    this.startState = searchablePDFLambdaInvoke;
    this.endStates = [searchablePDFLambdaInvoke];
  }
}
