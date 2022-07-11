import * as path from 'path';
import { Duration, Aws, ArnFormat, Stack } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { FilterPattern, ILogGroup, MetricFilter } from 'aws-cdk-lib/aws-logs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { LambdaInvoke } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';

export function validatePatternSupported(integrationPattern: sfn.IntegrationPattern, supportedPatterns: sfn.IntegrationPattern[]) {
  if (! supportedPatterns.includes(integrationPattern)) {
    throw new Error(`Unsupported service integration pattern. Supported Patterns: ${supportedPatterns}. Received: ${integrationPattern}`);
  }
}
/**
 * Suffixes corresponding to different service integration patterns
 *
 * Key is the service integration pattern, value is the resource ARN suffix.
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html
 */
const resourceArnSuffix: Record<sfn.IntegrationPattern, string> = {
  [sfn.IntegrationPattern.REQUEST_RESPONSE]: '',
  [sfn.IntegrationPattern.RUN_JOB]: '.sync',
  [sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN]: '.waitForTaskToken',
};
export function integrationResourceArn(service: string, api: string, integrationPattern ?:sfn.IntegrationPattern): string {
  if (! service || ! api) {
    throw new Error("Both 'service' and 'api' must be provided to build the resource ARN.");
  }
  return `arn:${
    Aws.PARTITION
  }:states:::${service}:${api}` + (integrationPattern ? resourceArnSuffix[integrationPattern] : '');
}
export interface TextractGenericSyncSfnTaskProps extends sfn.TaskStateBaseProps {
  // TODO: pass in lambda memory configs and timeouts as parameters as well
  readonly s3OutputBucket : string;
  /** The prefix to use for the output files */
  readonly s3OutputPrefix : string;
  /** location of input S3 objects - if left empty will generate rule for s3 access to all [*] */
  readonly s3InputBucket?: string;
  /** prefix for input S3 objects - if left empty will generate rule for s3 access to all [*] */
  readonly s3InputPrefix?: string;
  /** Log level, can be DEBUG, INFO, WARNING, ERROR, FATAL */
  readonly lambdaLogLevel? : 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'FATAL';
  /** Lambda Function Timeout in seconds, default 300 */
  readonly lambdaTimeout? : number;
  /** Memory allocated to Lambda function, default 512 */
  readonly lambdaMemory? : number;
  /**not implemented yet */
  readonly enableMonitoring? : boolean;
  /** not implemented yet */
  readonly enableDashboard? : boolean;
  /** not implemented yet */
  readonly customFunction? : LambdaInvoke;
  readonly textractAsyncCallMaxRetries?: number;
  /**default is 1.1 */
  readonly textractAsyncCallBackoffRate?: number;
  /**default is 1 */
  readonly textractAsyncCallInterval?: number;
  readonly workflowTracingEnabled? : boolean;
  /** how long can we wait for the process (default is 48 hours (60*48=2880)) */
  readonly textractStateMachineTimeoutMinutes? : number;
  readonly textractAPI?: 'GENERIC' | 'ANALYZEID' | 'EXPENSE';
  /**
       * The JSON input for the execution, same as that of StartExecution.
       *
       * @see https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html
       *
       * @default - The state input (JSON path '$')
       */
  readonly input? : sfn.TaskInput;

  /**
          * The name of the execution, same as that of StartExecution.
          *
          * @see https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html
          *
          * @default - None
          */
  readonly name? : string;

  /**
          * Pass the execution ID from the context object to the execution input.
          * This allows the Step Functions UI to link child executions from parent executions, making it easier to trace execution flow across state machines.
          *
          * If you set this property to `true`, the `input` property must be an object (provided by `sfn.TaskInput.fromObject`) or omitted entirely.
          *
          * @see https://docs.aws.amazon.com/step-functions/latest/dg/concepts-nested-workflows.html#nested-execution-startid
          *
          * @default - false
          */
  readonly associateWithParent? : boolean;
}

/**
 * Calls Textract synchronous API.
 * Supports the Textract APIs:  'GENERIC' | 'ANALYZEID' | 'EXPENSE'
 * When GENERIC is called with features in the manifest definition, will call the AnalzyeDocument API.
 * Takes the configuration from "Payload"."manifest"
 * Will retry on recoverable errors based on textractAsyncCallMaxRetries
 * errors for retry: ['ThrottlingException', 'LimitExceededException', 'InternalServerError', 'ProvisionedThroughputExceededException'],
 *
 * Input: "Payload"."manifest"
 * Output: Textract JSON Schema at  s3_output_bucket/s3_output_prefix
 *
 * Example::
 *         textract_sync_task = tcdk.TextractGenericSyncSfnTask(
            self,
            "TextractSync",
            s3_output_bucket=document_bucket.bucket_name,
            s3_output_prefix=s3_output_prefix,
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

 */
export class TextractGenericSyncSfnTask extends sfn.TaskStateBase {
  private static readonly SUPPORTED_INTEGRATION_PATTERNS = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.RUN_JOB,
    sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
  ];

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private readonly integrationPattern : sfn.IntegrationPattern;
  public stateMachine : sfn.IStateMachine;
  public textractSyncLambdaLogGroup:ILogGroup;
  public version:string;
  public textractSyncCallFunction:lambda.IFunction;
  public syncDurationMetric:cloudwatch.IMetric;
  public syncNumberPagesMetric:cloudwatch.IMetric;
  public syncNumberPagesSendMetric:cloudwatch.IMetric;
  public syncTimedOutMetric:cloudwatch.IMetric;

  constructor(scope : Construct, id : string, private readonly props : TextractGenericSyncSfnTaskProps) {
    super(scope, id, props);

    this.version = '0.0.1';
    this.integrationPattern = props.integrationPattern || sfn.IntegrationPattern.REQUEST_RESPONSE;
    validatePatternSupported(this.integrationPattern, TextractGenericSyncSfnTask.SUPPORTED_INTEGRATION_PATTERNS);

    if (this.integrationPattern === sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN && !sfn.FieldUtils.containsTaskToken(props.input)) {
      throw new Error('Task Token is required in `input` for callback. Use JsonPath.taskToken to set the token.');
    }

    if (this.props.associateWithParent && props.input && props.input.type !== sfn.InputType.OBJECT) {
      throw new Error('Could not enable `associateWithParent` because `input` is taken directly from a JSON path. Use `sfn.TaskInput.fromObject` instead.');
    }

    if (!props.s3OutputBucket || !props.s3OutputPrefix) {
      throw new Error('no s3OutputBucket and s3OutputPrefix passed in');
    }

    if (!props.s3OutputBucket || !props.s3OutputPrefix) {
      throw new Error('no s3OutputBucket and s3OutputPrefix passed in');
    }

    var textractAPI = props.textractAPI === undefined ? 'GENERIC' : props.textractAPI;
    var textractStateMachineTimeoutMinutes = props.textractStateMachineTimeoutMinutes === undefined ? 2880 : props.textractStateMachineTimeoutMinutes;
    var lambdaLogLevel = props.lambdaLogLevel === undefined ? 'DEBUG' : props.lambdaLogLevel;
    var lambdaTimeout = props.lambdaTimeout === undefined ? 300 : props.lambdaTimeout;
    var lambdaMemory = props.lambdaMemory === undefined ? 300 : props.lambdaMemory;
    var textractAsyncCallMaxRetries = props.textractAsyncCallMaxRetries === undefined ? 100 : props.textractAsyncCallMaxRetries;
    var textractAsyncCallBackoffRate = props.textractAsyncCallBackoffRate === undefined ? 1.1 : props.textractAsyncCallBackoffRate;
    var textractAsyncCallInterval = props.textractAsyncCallInterval === undefined ? 1 : props.textractAsyncCallInterval;

    this.textractSyncCallFunction = new lambda.DockerImageFunction(this, 'TextractSyncCall', {
      code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../lambda/textract_sync/')),
      memorySize: lambdaMemory,
      timeout: Duration.seconds(lambdaTimeout),
      environment: {
        S3_OUTPUT_BUCKET: props.s3OutputBucket,
        S3_OUTPUT_PREFIX: props.s3OutputPrefix,
        LOG_LEVEL: lambdaLogLevel,
        TEXTRACT_API: textractAPI,
      },
    });
    const textractSyncCallTask = new tasks.LambdaInvoke(this, 'TextractSyncCallTask', { lambdaFunction: this.textractSyncCallFunction });
    textractSyncCallTask.addRetry({
      maxAttempts: textractAsyncCallMaxRetries,
      backoffRate: textractAsyncCallBackoffRate,
      interval: Duration.seconds(textractAsyncCallInterval),
      errors: ['ThrottlingException', 'LimitExceededException', 'InternalServerError', 'ProvisionedThroughputExceededException'],
    });
    this.textractSyncCallFunction.addToRolePolicy(new iam.PolicyStatement(
      {
        actions: [
          'textract:Analyze*',
          'textract:Detect*',
        ],
        resources: ['*'],
      }));
    this.textractSyncCallFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        's3:GetObject', 's3:ListBucket', 's3:PutObject',
      ],
      resources: [`arn:aws:s3:::${
        props.s3OutputBucket
      }`, `arn:aws:s3:::${
        props.s3OutputBucket
      }/*`, '*'],
    }));
    this.textractSyncLambdaLogGroup=(<lambda.Function> this.textractSyncCallFunction).logGroup;

    const workflow_chain = sfn.Chain.start(textractSyncCallTask);

    this.stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definition: workflow_chain,
      timeout: Duration.hours(textractStateMachineTimeoutMinutes),
      tracingEnabled: true,
    });

    this.textractSyncCallFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'states:SendTaskFailure', 'states:SendTaskSuccess',
      ],
      resources: ['*'],
    }));
    // =========
    // DASHBOARD
    // =========
    const appName = this.node.tryGetContext('appName');

    const customMetricNamespace = 'TextractConstructGenericSync';

    // OPERATIONAL
    const syncDurationMetricFilter = new MetricFilter(this, `${appName}-DurationFilter`, {
      logGroup: (<lambda.Function> this.textractSyncCallFunction).logGroup,
      metricNamespace: customMetricNamespace,
      metricName: 'Duration',
      filterPattern: FilterPattern.spaceDelimited('INFO', 'timestamp', 'id', 'message', 'durationMs')
        .whereString('message', '=', `textract_sync_${textractAPI}_call_duration_in_ms:`),
      metricValue: '$durationMs',
    });
    this.syncDurationMetric = syncDurationMetricFilter.metric({ statistic: 'avg' });

    const syncNumberPagesMetricFilter = new MetricFilter(this, `${appName}-NumberPagesFilter`, {
      logGroup: (<lambda.Function> this.textractSyncCallFunction).logGroup,
      metricNamespace: customMetricNamespace,
      metricName: 'NumberPages',
      filterPattern: FilterPattern.spaceDelimited('INFO', 'timestamp', 'id', 'message', 'pages')
        .whereString('message', '=', `textract_sync_${textractAPI}_number_of_pages_processed:`),
      metricValue: '$pages',
    });
    this.syncNumberPagesMetric = syncNumberPagesMetricFilter.metric({ statistic: 'sum' });

    const syncNumberPagesSendMetricFilter = new MetricFilter(this, `${appName}-NumberPagesSendFilter`, {
      logGroup: (<lambda.Function> this.textractSyncCallFunction).logGroup,
      metricNamespace: customMetricNamespace,
      metricName: 'NumberPages',
      filterPattern: FilterPattern.spaceDelimited('INFO', 'timestamp', 'id', 'message', 'pages')
        .whereString('message', '=', `textract_sync_${textractAPI}_number_of_pages_send_to_process:`),
      metricValue: '$pages',
    });
    this.syncNumberPagesSendMetric = syncNumberPagesSendMetricFilter.metric({ statistic: 'sum' });

    const syncTimedOutMetricFilter = new MetricFilter(this, `${appName}-TimedOutFilter`, {
      logGroup: (<lambda.Function> this.textractSyncCallFunction).logGroup,
      metricNamespace: customMetricNamespace,
      metricName: 'DurationSeconds',
      filterPattern: FilterPattern.spaceDelimited('INFO', 'timestamp', 'id', 'message1', 'durationS', 'message2')
        .whereString('message1', '=', 'Task timed out after').whereString('message2', '=', 'seconds'),
      metricValue: '$durationS',
    });
    this.syncTimedOutMetric = syncTimedOutMetricFilter.metric({ statistic: 'sum' });
    // OPERATIONAL STOP

    // CALCUATED OPERATIONAL METRICS

    const pagesPerSecond = new cloudwatch.MathExpression({
      expression: 'pages / (duration / 1000)',
      usingMetrics: {
        pages: this.syncNumberPagesMetric,
        duration: this.syncDurationMetric,
      },
    });
    // CALCUATED OPERATIONAL METRICS STOP

    const errorFilterMetric = new MetricFilter(this, `${appName}-ErrorFilter`, {
      logGroup: (<lambda.Function> this.textractSyncCallFunction).logGroup,
      metricNamespace: customMetricNamespace,
      metricName: 'Errors',
      filterPattern: FilterPattern.anyTerm('ERROR', 'Error', 'error'),
      metricValue: '1',
    });

    const limitExceededExceptionFilterMetric = new MetricFilter(this, `${appName}-limitExceededExceptionFilter`, {
      logGroup: (<lambda.Function> this.textractSyncCallFunction).logGroup,
      metricNamespace: customMetricNamespace,
      metricName: 'LimitExceededException',
      filterPattern: FilterPattern.anyTerm('textract.exceptions.LimitExceededException'),
      metricValue: '1',
    });
    const throttlingException = new MetricFilter(this, `${appName}-throttlingExceptionFilter`, {
      logGroup: (<lambda.Function> this.textractSyncCallFunction).logGroup,
      metricNamespace: customMetricNamespace,
      metricName: 'ThrottlingException',
      filterPattern: FilterPattern.anyTerm('textract.exceptions.ThrottlingException'),
      metricValue: '1',
    });

    const provisionedThroughputExceededException = new MetricFilter(this, `${appName}-provisionedThroughputFilter`, {
      logGroup: (<lambda.Function> this.textractSyncCallFunction).logGroup,
      metricNamespace: customMetricNamespace,
      metricName: 'ProvisionedThroughputExceededException',
      filterPattern: FilterPattern.anyTerm('textract.exceptions.ProvisionedThroughputExceededException'),
      metricValue: '1',
    });
    const internalServerError = new MetricFilter(this, `${appName}-internalServerErrorFilter`, {
      logGroup: (<lambda.Function> this.textractSyncCallFunction).logGroup,
      metricNamespace: customMetricNamespace,
      metricName: 'InternalServerError',
      filterPattern: FilterPattern.anyTerm('textract.exceptions.InternalServerError'),
      metricValue: '1',
    });

    const errorMetric:cloudwatch.IMetric = errorFilterMetric.metric({ statistic: 'sum' });
    const limitExceededMetric:cloudwatch.IMetric = limitExceededExceptionFilterMetric.metric({ statistic: 'sum' });
    const throttlingMetric:cloudwatch.IMetric = throttlingException.metric({ statistic: 'sum' });
    const provisionedThroughputMetric:cloudwatch.IMetric = provisionedThroughputExceededException.metric({ statistic: 'sum' });
    const internalServerErrorMetric:cloudwatch.IMetric = internalServerError.metric({ statistic: 'sum' });

    const textractStartDocumentTextThrottle:cloudwatch.IMetric= new cloudwatch.Metric({
      namespace: 'AWS/Textract',
      metricName: 'ThrottledCount',
      dimensionsMap: {
        Operation: 'StartDocumentTextDetection',
      },
      statistic: 'sum',
    });
    // DASHBOARD LAMBDA

    const dashboardWidth=24;
    // const widgetStandardHeight=9;

    // DASHBOARD
    new cloudwatch.Dashboard(this, '${appName}-TestDashboard', {
      end: 'end',
      periodOverride: cloudwatch.PeriodOverride.AUTO,
      start: 'start',
      widgets: [
        [
          new cloudwatch.Column(new cloudwatch.TextWidget({ markdown: '# Operational Data Row widgets', width: dashboardWidth })),
        ],
        [
          new cloudwatch.Column(new cloudwatch.GraphWidget({ title: 'PagesPerSecond', left: [pagesPerSecond], width: Math.floor(dashboardWidth/2) })),
          new cloudwatch.Column(new cloudwatch.GraphWidget({ title: 'Duration', left: [this.syncDurationMetric], width: Math.floor(dashboardWidth/4) })),
          new cloudwatch.Column(new cloudwatch.GraphWidget({ title: 'NumberPagesProcessed', left: [this.syncNumberPagesMetric], width: Math.floor(dashboardWidth/4) })),
          new cloudwatch.Column(new cloudwatch.GraphWidget({ title: 'NumberPagesSendToProcess', left: [this.syncNumberPagesSendMetric], width: Math.floor(dashboardWidth/4) })),
        ],
        [
          new cloudwatch.Column(new cloudwatch.TextWidget({ markdown: '# Async Textract Exceptions Row', width: dashboardWidth })),
        ],
        [
          new cloudwatch.GraphWidget({ title: 'Errors', left: [errorMetric], width: Math.floor(dashboardWidth/5) }),
          new cloudwatch.GraphWidget({ title: 'LimitExceeded', left: [limitExceededMetric], width: Math.floor(dashboardWidth/5) }),
          new cloudwatch.GraphWidget({ title: 'Throttling', left: [throttlingMetric], width: Math.floor(dashboardWidth/5) }),
          new cloudwatch.GraphWidget({ title: 'ProvisionedThrougput', left: [provisionedThroughputMetric], width: Math.floor(dashboardWidth/5) }),
          new cloudwatch.GraphWidget({ title: 'InternalServerError', left: [internalServerErrorMetric], width: Math.floor(dashboardWidth/5) }),
        ],
        [
          new cloudwatch.TextWidget({ markdown: '# Textract', width: dashboardWidth }),
        ],
        [
          new cloudwatch.GraphWidget({ title: 'Textract-StartDetectText-ThrottledCount', left: [textractStartDocumentTextThrottle] }),
        ],
        [
          new cloudwatch.TextWidget({ markdown: '# textractSyncCallFunction', width: dashboardWidth }),
        ],
        [
          new cloudwatch.GraphWidget({ title: 'Sync-Function-Errors', left: [this.textractSyncCallFunction.metricErrors()], width: Math.floor(dashboardWidth/4) }),
          new cloudwatch.GraphWidget({ title: 'Sync-Function-Invocations', left: [this.textractSyncCallFunction.metricInvocations()], width: Math.floor(dashboardWidth/4) }),
          new cloudwatch.GraphWidget({ title: 'Sync-Function-Throttles', left: [this.textractSyncCallFunction.metricThrottles()], width: Math.floor(dashboardWidth/4) }),
          new cloudwatch.GraphWidget({ title: 'Sync-Function-TimedOut', left: [this.syncTimedOutMetric], width: Math.floor(dashboardWidth/4) }),
        ],
      ],
    });

    // END DASHBOARD
    this.taskPolicies = this.createScopedAccessPolicy();
  }
  /**
       * @internal
       */
  protected _renderTask(): any {
    // suffix of ':2' indicates that the output of the nested state machine should be JSON
    // suffix is only applicable when waiting for a nested state machine to complete (RUN_JOB)
    // https://docs.aws.amazon.com/step-functions/latest/dg/connect-stepfunctions.html
    const suffix = this.integrationPattern === sfn.IntegrationPattern.RUN_JOB ? ':2' : '';
    let input: any;
    if (this.props.associateWithParent) {
      const associateWithParentEntry = {
        AWS_STEP_FUNCTIONS_STARTED_BY_EXECUTION_ID: sfn.JsonPath.stringAt('$$.Execution.Id'),
      };
      input = this.props.input ? {
        ...this.props.input.value,
        ... associateWithParentEntry,
      } : associateWithParentEntry;
    } else {
      input = this.props.input ? this.props.input.value : sfn.TaskInput.fromJsonPathAt('$').value;
    }


    return {
      Resource: `${
        integrationResourceArn('states', 'startExecution', this.integrationPattern)
      }${suffix}`,
      Parameters: sfn.FieldUtils.renderObject(
        {
          Input: input,
          StateMachineArn: this.stateMachine.stateMachineArn,
          Name: this.props.name,
        },
      ),
    };
  }
  /**
       * As StateMachineArn is extracted automatically from the state machine object included in the constructor,
       *
       * the scoped access policy should be generated accordingly.
       *
       * This means the action of StartExecution should be restricted on the given state machine, instead of being granted to all the resources (*).
       */
  private createScopedAccessPolicy(): iam.PolicyStatement[] {
    const stack = Stack.of(this);

    const policyStatements = [
      new iam.PolicyStatement(
        {
          actions: ['states:StartExecution'],
          resources: [this.stateMachine.stateMachineArn],
        },
      ),
    ];

    // Step Functions use Cloud Watch managed rules to deal with synchronous tasks.
    if (this.integrationPattern === sfn.IntegrationPattern.RUN_JOB) {
      policyStatements.push(new iam.PolicyStatement({
        actions: [
          'states:DescribeExecution', 'states:StopExecution',
        ],
        // https://docs.aws.amazon.com/step-functions/latest/dg/concept-create-iam-advanced.html#concept-create-iam-advanced-execution
        resources: [
          stack.formatArn(
            {
              service: 'states',
              resource: 'execution',
              arnFormat: ArnFormat.COLON_RESOURCE_NAME,
              resourceName: `${
                stack.splitArn(this.stateMachine.stateMachineArn, ArnFormat.COLON_RESOURCE_NAME).resourceName
              }*`,
            },
          ),
        ],
      }));

      policyStatements.push(new iam.PolicyStatement({
        actions: [
          'events:PutTargets', 'events:PutRule', 'events:DescribeRule',
        ],
        resources: [
          stack.formatArn(
            {
              service: 'events',
              resource: 'rule',
              resourceName: 'StepFunctionsGetEventsForStepFunctionsExecutionRule',
            },
          ),
        ],
      }));
    }

    return policyStatements;
  }
}