import * as path from 'path';
import { Duration } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';

export interface TextractDPPOCDeciderProps {
  /** memory of Lambda function (may need to increase for larger documents) */
  readonly lambdaMemoryMB?:number;
  readonly lambdaTimeout?:number;
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
 * Example::
 *         decider_task_id = tcdk.TextractPOCDecider(
            self,
            f"InsuranceDecider",
        )

 *
 */
export class TextractPOCDecider extends sfn.StateMachineFragment {
  public readonly startState: sfn.State;
  public readonly endStates: sfn.INextable[];
  constructor(parent: Construct, id: string, props: TextractDPPOCDeciderProps) {
    super(parent, id);

    var lambdaMemoryMB = props.lambdaMemoryMB === undefined ? 1024 : props.lambdaMemoryMB;
    var lambdaTimeout = props.lambdaTimeout === undefined ? 900 : props.lambdaTimeout;

    const deciderFunction = new lambda.DockerImageFunction(this, 'TextractDecider', {
      code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../lambda/decider/')),
      memorySize: lambdaMemoryMB,
      timeout: Duration.seconds(lambdaTimeout),
    });
    deciderFunction.addToRolePolicy(new iam.PolicyStatement({ actions: ['s3:GetObject'], resources: ['*'] }));

    const deciderLambdaInvoke = new tasks.LambdaInvoke(this, id, {
      lambdaFunction: deciderFunction,
      timeout: Duration.seconds(100),
      outputPath: '$.Payload',
    });
    this.startState=deciderLambdaInvoke;
    this.endStates=[deciderLambdaInvoke];
  }
}
