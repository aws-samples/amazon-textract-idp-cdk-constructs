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
  /** Executions concurrency, default is 100
   * should be set to whatever the bottleneck of the workflow is
   * For Textract Asynchronous APIs, that would be the number of concurrent jobs that can be processed
   * For Textract Synchronous APIs, that would be the TPS for the API
  */
  readonly executionsConcurrencyThreshold?: number;
  /** State Machine ARN */
  readonly stateMachineArn: string;
  /** Status table - DynamoDB table with status information for the document execution */
  readonly documentStatusTable?: dynamodb.ITable;
  /** Step Functions Executions Counter - DynamoDB table with current count of executions */
  readonly executionsCounterTable?: dynamodb.ITable;
  /** List of PolicyStatements to attach to the Lambda function.  */
  readonly inputPolicyStatements?: iam.PolicyStatement[];

  /** SQS Batch size when catchup up on queued documents (max 10, which is also the default) */
  readonly sqsBatch?: number;
  /** List of PolicyStatements to attach to the Lambda function.  */
  readonly eventSource?: lambda.IEventSource[];

  /** log level for Lambda function, supports DEBUG|INFO|WARNING|ERROR|FATAL
   * @default = INFO
   */
  readonly lambdaLogLevel?: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'FATAL';
  /** Lambda Function Timeout in seconds, default 300 */
  readonly lambdaTimeout?: number;
  /** Memory allocated to Lambda function, default 512 */
  readonly lambdaMemory?: number;

  /** log level for Lambda function, supports DEBUG|INFO|WARNING|ERROR|FATAL
   * @default = DEBUG
   */
  readonly lambdaQueueWorkerLogLevel?: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'FATAL';
  /** Lambda Function Timeout in seconds, default 300 */
  readonly lambdaQueueWorkerTimeout?: number;
  /** Memory allocated to Lambda function, default 512 */
  readonly lambdaQueueWorkerMemory?: number;
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
  public executionsThrottleCounterResetFunction: lambda.IFunction;
  public executionsQueueWorkerFunction: lambda.IFunction;
  public documentStatusTable?: dynamodb.ITable;
  public documentQueue?: sqs.IQueue;
  public executionsCounterTable?: dynamodb.ITable;


  constructor(
    parent: Construct,
    id: string,
    props: SFExecutionsStartThrottleProps,
  ) {
    super(parent, id);

    var lambdaLogLevel =
      props.lambdaLogLevel === undefined ? 'INFO' : props.lambdaLogLevel;
    var lambdaTimeout =
      props.lambdaTimeout === undefined ? 300 : props.lambdaTimeout;
    var lambdaMemory =
      props.lambdaMemory === undefined ? 512 : props.lambdaMemory;
    var lambdaQueueWorkerLogLevel =
      props.lambdaQueueWorkerLogLevel === undefined ? 'INFO' : props.lambdaQueueWorkerLogLevel;
    var lambdaQueueWorkerTimeout =
      props.lambdaQueueWorkerTimeout === undefined ? 300 : props.lambdaQueueWorkerTimeout;
    var lambdaQueueWorkerMemory =
      props.lambdaQueueWorkerMemory === undefined ? 512 : props.lambdaQueueWorkerMemory;
    var executionsConcurrencyThreshold =
      props.executionsConcurrencyThreshold === undefined
        ? 100
        : props.executionsConcurrencyThreshold;
    var sqsBatch =
      props.sqsBatch === undefined
        ? 10
        : props.sqsBatch;
    var s3InputPrefix =
      props.s3InputPrefix === undefined ? '' : props.s3InputPrefix;

    // use FIFO and message deduplication, with 14 day retention
    this.documentQueue = new sqs.Queue(this, 'DocumentQueue', { fifo: true, contentBasedDeduplication: true, retentionPeriod: Duration.seconds(1209600) });

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

    if (props.executionsCounterTable === undefined) {
      this.executionsCounterTable = new dynamodb.Table(
        this,
        'IDPExecutionsCounterTable',
        {
          partitionKey: {
            name: 'n',
            type: dynamodb.AttributeType.STRING,
          },
          billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
          removalPolicy: RemovalPolicy.DESTROY,
        },
      );
    } else {
      this.executionsCounterTable = props.executionsCounterTable;
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
          EXECUTIONS_COUNTER_TABLE: this.executionsCounterTable.tableName,
          DOCUMENT_QUEUE_URL: this.documentQueue.queueUrl,
        },
      },
    );

    this.executionsQueueWorkerFunction = new lambda.DockerImageFunction(
      this,
      'ExecutionsQueueWorker',
      {
        code: lambda.DockerImageCode.fromImageAsset(
          path.join(__dirname, '../lambda/executions_queue_worker/'),
        ),
        memorySize: lambdaQueueWorkerMemory,
        timeout: Duration.seconds(lambdaQueueWorkerTimeout),
        architecture: lambda.Architecture.X86_64,
        environment: {
          LOG_LEVEL: lambdaQueueWorkerLogLevel,
          STATE_MACHINE_ARN: props.stateMachineArn,
          EXECUTIONS_THRESHOLD: executionsConcurrencyThreshold?.toString(),
          SQS_BATCH: sqsBatch.toString(),
          DOCUMENT_STATUS_TABLE: this.documentStatusTable.tableName,
          EXECUTIONS_COUNTER_TABLE: this.executionsCounterTable.tableName,
          DOCUMENT_QUEUE_URL: this.documentQueue.queueUrl,
        },
      },
    );
    /** This function is called periodically to reset the executions counter to the actual currently running workflows,
     * because the DynamoDB access is not 100 % accurate (https://aws.amazon.com/blogs/database/implement-resource-counters-with-amazon-dynamodb/ Approach 1)
     */
    this.executionsThrottleCounterResetFunction = new lambda.DockerImageFunction(
      this,
      'ExecutionsThrottleCounterReset',
      {
        code: lambda.DockerImageCode.fromImageAsset(
          path.join(__dirname, '../lambda/executions_throttle_counter_reset/'),
        ),
        memorySize: 128,
        timeout: Duration.seconds(900),
        architecture: lambda.Architecture.X86_64,
        environment: {
          LOG_LEVEL: lambdaQueueWorkerLogLevel,
          STATE_MACHINE_ARN: props.stateMachineArn,
          EXECUTIONS_COUNTER_TABLE: this.executionsCounterTable.tableName,
        },
      },
    );
    this.executionsStartThrottleFunction.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['states:StartExecution'],
        resources: [props.stateMachineArn],
      }),
    );

    this.executionsQueueWorkerFunction.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['states:StartExecution'],
        resources: [props.stateMachineArn],
      }),
    );
    this.executionsThrottleCounterResetFunction.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['states:ListExecutions'],
        resources: [props.stateMachineArn],
      }),
    );
    this.executionsStartThrottleFunction.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['sqs:SendMessage'],
        resources: [this.documentQueue.queueArn],
      }),
    );

    this.executionsQueueWorkerFunction.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['sqs:ReceiveMessage', 'sqs:DeleteMessage'],
        resources: [this.documentQueue.queueArn],
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
        resources: [this.documentStatusTable.tableArn, this.executionsCounterTable.tableArn],
      }),
    );
    this.executionsThrottleCounterResetFunction.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
        ],
        resources: [this.executionsCounterTable.tableArn],
      }),
    );
    this.executionsQueueWorkerFunction.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          'dynamodb:Query',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
        ],
        resources: [this.documentStatusTable.tableArn, this.executionsCounterTable.tableArn],
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
      new targets.LambdaFunction(this.executionsQueueWorkerFunction),
    );

    // trigger when another state machine finishes
    const rule_state_change = new events.Rule(this, 'StateChange', {
      eventPattern: {
        source: ['aws.states'],
        detailType: ['Step Functions Execution Status Change'],
        detail: {
          status: ['SUCCEEDED', 'FAILED', 'TIMED_OUT', 'ABORTED'],
          stateMachineArn: [props.stateMachineArn],
        },
      },
    });

    rule_state_change.addTarget(new targets.LambdaFunction(this.executionsQueueWorkerFunction));

    // Scheduler to reset the executions counter every 5 minutes
    const rule_counter_reset_scheduled = new events.Rule(this, 'RuleExecutionsThrottleCounterReset', {
      schedule: events.Schedule.rate(Duration.minutes(5)),
    });

    rule_counter_reset_scheduled.addTarget(
      new targets.LambdaFunction(this.executionsThrottleCounterResetFunction),
    );

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
