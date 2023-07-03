import * as path from 'path';
import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

export interface SFExecutionsStartThrottleProps {
  /** Executions concurrency, default is 100 */
  readonly executionsConcurrencyThreshold?: number;
  /** State Machine ARN */
  readonly stateMachineArn: string;
  /** Status table - DynamoDB table with status information for the document execution */
  readonly documentStatusTable?: dynamodb.ITable;
  /** List of PolicyStatements to attach to the Lambda function.  */
  readonly inputPolicyStatements?: iam.PolicyStatement[];

  /** List of PolicyStatements to attach to the Lambda function.  */
  readonly eventSource?: lambda.IEventSource[];

  /** log level for Lambda function, supports DEBUG|INFO|WARNING|ERROR|FATAL
   * @default = DEBUG
   */
  readonly lambdaLogLevel?: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'FATAL';
  /** Lambda Function Timeout in seconds, default 300 */
  readonly lambdaTimeout?: number;
  /** Memory allocated to Lambda function, default 512 */
  readonly lambdaMemory?: number;

  /** Bucketname and prefix to read document from
  /** location of input S3 objects - if left empty will generate rule for s3 access to all [*] */
  readonly s3InputBucket?: string;
  /** prefix for input S3 objects - if left empty will generate rule for s3 access to all in bucket */
  readonly s3InputPrefix?: string;
}

/**
 * This construct starts State Machine executions based on events, but limits the number of concurrent running executions to a threshold number
 * - S3
 * - API Gateway
 * - SQS
 *
 * This version does not yet support passing in a manifest for configuration of Textract features. That will be a future enhancement.
 * The following resources are created:
 * - Lambda function
 * - DynamoDB table. For every document pass in an entry in a DynamoDB table is created with a status (RECEIVED, QUEUED, IN_PROGRESS)
 *
 */
export class SFExecutionsStartThrottle extends Construct {
  public executionsStartThrottleFunction: lambda.IFunction;
  public documentStatusTable?: dynamodb.ITable;
  public documentQueue?: sqs.IQueue;

  constructor(
    parent: Construct,
    id: string,
    props: SFExecutionsStartThrottleProps,
  ) {
    super(parent, id);

    var lambdaLogLevel =
      props.lambdaLogLevel === undefined ? 'DEBUG' : props.lambdaLogLevel;
    var lambdaTimeout =
      props.lambdaTimeout === undefined ? 300 : props.lambdaTimeout;
    var lambdaMemory =
      props.lambdaMemory === undefined ? 512 : props.lambdaMemory;
    var executionsConcurrencyThreshold =
      props.executionsConcurrencyThreshold === undefined
        ? 100
        : props.executionsConcurrencyThreshold;
    var s3InputPrefix =
      props.s3InputPrefix === undefined ? '' : props.s3InputPrefix;

    this.documentQueue = new sqs.Queue(this, 'DocumentQueue');

    // Create DynamoTable for state, if not passed in
    // It allows for the same document to be processed multiple times, in which case the number will be increased
    if (props.documentStatusTable === undefined) {
      this.documentStatusTable = new dynamodb.Table(
        this,
        'IDPDocumentStatusTable',
        {
          partitionKey: {
            name: 'dp',
            type: dynamodb.AttributeType.STRING,
          },
          sortKey: {
            name: 'ddi',
            type: dynamodb.AttributeType.NUMBER,
          },
          billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
          removalPolicy: RemovalPolicy.DESTROY,
        },
      );
    } else {
      this.documentStatusTable = props.documentStatusTable;
    }

    this.executionsStartThrottleFunction = new lambda.DockerImageFunction(
      this,
      'ExecutionsStartThrottle',
      {
        code: lambda.DockerImageCode.fromImageAsset(
          path.join(__dirname, '../lambda/executions_start_throttle/'),
        ),
        memorySize: lambdaMemory,
        timeout: Duration.seconds(lambdaTimeout),
        architecture: lambda.Architecture.X86_64,
        environment: {
          LOG_LEVEL: lambdaLogLevel,
          STATE_MACHINE_ARN: props.stateMachineArn,
          EXECUTIONS_THRESHOLD: executionsConcurrencyThreshold?.toString(),
          DOCUMENT_STATUS_TABLE: this.documentStatusTable.tableName,
          DOCUMENT_QUEUE_URL: this.documentQueue.queueUrl,
        },
      },
    );

    this.executionsStartThrottleFunction.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['states:StartExecution', 'states:ListExecutions'],
        resources: [props.stateMachineArn],
      }),
    );

    this.executionsStartThrottleFunction.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          'dynamodb:Query',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
        ],
        resources: [this.documentStatusTable.tableArn],
      }),
    );
    if (props.eventSource) {
      props.eventSource.forEach((eventSource) => {
        this.executionsStartThrottleFunction.addEventSource(eventSource);
      });
    }

    //  check to clear the SQS queue every minute
    const rule_scheduled = new events.Rule(this, 'Rule', {
      schedule: events.Schedule.rate(Duration.minutes(1)),
    });

    rule_scheduled.addTarget(
      new targets.LambdaFunction(this.executionsStartThrottleFunction),
    );

    // trigger when another state machine finishes
    const rule_state_change = new events.Rule(this, 'StateChange', {
      eventPattern: {
        source: ['aws.states'],
        detailType: ['Step Functions Execution Status Change'],
        detail: {
          status: ['Succeeded', 'Failed', 'TimedOut'],
          stateMachineArn: [props.stateMachineArn],
        },
      },
    });

    rule_state_change.addTarget(new targets.LambdaFunction(this.executionsStartThrottleFunction));

    /** ################ INPUT BUCKET POLICIES */
    if (props.inputPolicyStatements === undefined) {
      if (props.s3InputBucket === undefined) {
        this.executionsStartThrottleFunction.addToRolePolicy(
          new iam.PolicyStatement({
            actions: ['s3:GetObject', 's3:ListBucket'],
            resources: ['*'],
          }),
        );
      } else {
        this.executionsStartThrottleFunction.addToRolePolicy(
          new iam.PolicyStatement({
            actions: ['s3:GetObject'],
            resources: [
              path.join(`arn:aws:s3:::${props.s3InputBucket}`, '/*'),
              path.join(
                `arn:aws:s3:::${props.s3InputBucket}`,
                s3InputPrefix,
                '/*',
              ),
            ],
          }),
        );
        this.executionsStartThrottleFunction.addToRolePolicy(
          new iam.PolicyStatement({
            actions: ['s3:ListBucket'],
            resources: [path.join(`arn:aws:s3:::${props.s3InputBucket}`)],
          }),
        );
      }
    } else {
      for (var policyStatement of props.inputPolicyStatements) {
        this.executionsStartThrottleFunction.addToRolePolicy(policyStatement);
      }
    }
  }
}
