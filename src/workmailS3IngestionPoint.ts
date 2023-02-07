import * as path from 'path';
import { Duration } from 'aws-cdk-lib';
import { IRole, ManagedPolicy, PolicyDocument, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { CfnPermission, DockerImageFunction, Function } from 'aws-cdk-lib/aws-lambda';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export interface WorkmailS3IngestionPointProps {
  /** Bucket name to output data to */
  readonly s3OutputBucket:string;
  /** The prefix to use to output files to */
  readonly s3OutputPrefix:string;
  /** Region where WorkMailail instance exists */
  readonly workmailRegion: string;
  /** Account number for WorkMail instance */
  readonly workmailAccountNumber: string;
  /** Lambda function memory configuration (may need to increase for larger documents) */
  readonly lambdaMemoryMB?: number;
  /** Lambda function timeout (may need to increase for larger documents) */
  readonly lambdaTimeout?: number;
}

export class WorkmailS3IngestionPoint extends Construct {
  private workmailAccountNumber: string;
  private workmailRegion: string;
  private s3OutputPrefix: string;
  private s3OutputBucket: string;
  constructor(scope: Construct, id: string, readonly props: WorkmailS3IngestionPointProps) {
    super(scope, id);
    const { workmailRegion, workmailAccountNumber, s3OutputBucket, s3OutputPrefix } = props;
    if (!workmailAccountNumber || !workmailRegion || !s3OutputBucket || !s3OutputPrefix) {
      throw new Error('workmailAccountNumber and workmailRegion are required');
    }
    this.workmailAccountNumber = workmailAccountNumber;
    this.workmailRegion = workmailRegion;
    this.s3OutputBucket = props.s3OutputBucket;
    this.s3OutputPrefix = props.s3OutputPrefix;

    const WorkMailARN = `arn:aws:workmailmessageflow:${this.workmailRegion}:${this.workmailAccountNumber}:message/*/*/*`;

    const lambdaMemoryMB = props?.lambdaMemoryMB === undefined ? 10240 : props.lambdaMemoryMB;
    const lambdaTimeout = props?.lambdaTimeout === undefined ? 900 : props.lambdaTimeout;

    const workMailGetMsgPolicy = new PolicyDocument({
      statements: [
        new PolicyStatement({
          actions: ['workmailmessageflow:GetRawMessageContent'],
          resources: [WorkMailARN],
        }),
        new PolicyStatement({
          resources: ['*'],
          actions: [
            's3:Object',
            's3:PutObject',
            's3:PutObjectAcl',
          ],
        }),
      ],
    });

    const workmailServicesRole: IRole = new Role(this, 'WorkmailServicesRole', {
      assumedBy: new ServicePrincipal('amazonaws.com'),
      inlinePolicies: {
        WorkMailGetMsgPolicy: workMailGetMsgPolicy,
      },
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
    });

    /**
     * Lambda to download files from workMail and insert them into S3
     */
    const downloadPdfToS3Lambda: Function = new DockerImageFunction(
      this,
      'downloadPdfToS3Lambda',
      {
        code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../lambda/workmail_s3/')),
        memorySize: lambdaMemoryMB,
        architecture: lambda.Architecture.X86_64,
        timeout: Duration.seconds(lambdaTimeout),
        environment: {
          S3_OUTPUT_BUCKET: this.s3OutputBucket,
          S3_OUTPUT_PREFIX: this.s3OutputPrefix,
        },
        role: workmailServicesRole,
      },
    );

    new CfnPermission(this, 'workmailPermission', {
      action: 'lambda:InvokeFunction',
      functionName: downloadPdfToS3Lambda.functionName,
      principal: `workmail.${this.node.tryGetContext('region')}.amazonaws.com`,
    });

  }
}