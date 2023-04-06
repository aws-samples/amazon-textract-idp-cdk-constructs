import * as path from 'path';
import { Duration, Aws, ArnFormat, Stack, RemovalPolicy } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import { IRole, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { FilterPattern, MetricFilter } from 'aws-cdk-lib/aws-logs';
import * as sns from 'aws-cdk-lib/aws-sns';
import { LambdaSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';
export { TextractGenericSyncSfnTask, TextractGenericSyncSfnTaskProps } from './textractSync';
export { TextractPOCDecider, TextractDPPOCDeciderProps } from './textractDecider';
export { TextractClassificationConfigurator, TextractClassificationConfiguratorProps } from './textractClassificationConfigurator';
export { TextractAsyncToJSON, TextractAsyncToJSONProps } from './textractOutputConfigToJSON';
export { TextractGenerateCSV, TextractGenerateCSVProps } from './textractGenerateCSV';
export { TextractA2ISfnTask, TextractA2ISfnTaskProps } from './textractA2I';
export { CSVToAuroraTask, CSVToAuroraTaskProps } from './rdsCSVToAurora';
export { ComprehendGenericSyncSfnTask, ComprehendGenericSyncSfnTaskProps } from './comprehendClassification';
export { SpacySfnTask, SpacySfnTaskProps } from './spacyClassification';
export { DocumentSplitter, DocumentSplitterProps } from './documentSplitter';
export { RDSAuroraServerless, RDSAuroraServerlessProps } from './rdsAuroraServerless';
export { WorkmailS3IngestionPoint, WorkmailS3IngestionPointProps } from './workmailS3IngestionPoint';
export { SearchablePDF, SearchablePDFProps } from './searchablePDF';

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
export interface TextractGenericAsyncSfnTaskProps extends sfn.TaskStateBaseProps {
  /** Bucketname to output data to */
  readonly s3OutputBucket : string;
  /** The prefix to use for the temporary output files (e. g. output from async process before stiching together) */
  readonly s3TempOutputPrefix : string;
  /** Bucketname and prefix to read document from
  /** location of input S3 objects - if left empty will generate rule for s3 access to all [*] */
  readonly s3InputBucket?: string;
  /** prefix for input S3 objects - if left empty will generate rule for s3 access to all in bucket */
  readonly s3InputPrefix?: string;
  /** Which Textract API to call
   * ALL asynchronous Textract API calls are supported. Valid values are GENERIC | EXPENSE | LENDING.
   *
   * For GENERIC, when called without features (e. g. FORMS, TABLES, QUERIES, SIGNATURE), StartDetectText is called and only OCR is returned.
   * For GENERIC, when called with a feature (e. g. FORMS, TABLES, QUERIES, SIGNATURE),  StartAnalyzeDocument is called.
   * @default - GENERIC */
  readonly textractAPI?: 'GENERIC' | 'EXPENSE' | 'LENDING';
  /** number of retries in Step Function flow
   * @default is 100 */
  readonly textractAsyncCallMaxRetries?: number;
  /**retyr backoff rate
   * @default is 1.1 */
  readonly textractAsyncCallBackoffRate?: number;
  /** log level for Lambda function, supports DEBUG|INFO|WARNING|ERROR|FATAL
   * @default = DEBUG
  */
  readonly lambdaLogLevel? : 'DEBUG'|'INFO'|'WARNING'|'ERROR'|'FATAL';
  /**time in seconds to wait before next retry
   * @default is 1 */
  readonly textractAsyncCallInterval?: number;
  /** how long can we wait for the process
   * @default - 2880 (48 hours (60 min * 48 hours = 2880)) */
  readonly textractStateMachineTimeoutMinutes? : number;
  /** enable CloudWatch Metrics and Dashboard
   * @default - false
   */
  /** List of PolicyStatements to attach to the Lambda function.  */
  readonly inputPolicyStatements?: [iam.PolicyStatement];
  /** List of PolicyStatements to attach to the Lambda function.  */
  readonly outputPolicyStatements?: [iam.PolicyStatement];
  readonly enableCloudWatchMetricsAndDashboard? : boolean;
  /** task token table to use for mapping of Textract [JobTag](https://docs.aws.amazon.com/textract/latest/dg/API_StartDocumentTextDetection.html#Textract-StartDocumentTextDetection-request-JobTag)
   * to the [TaskToken](https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html)
  */
  readonly taskTokenTable?: dynamodb.ITable;
  /** IAM Role to assign to Textract, by default
  *  new iam.Role(this, 'TextractAsyncSNSRole', {
      assumedBy: new iam.ServicePrincipal('textract.amazonaws.com'),
      managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('AmazonSQSFullAccess'),
        ManagedPolicy.fromAwsManagedPolicyName('AmazonSNSFullAccess'),
        ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'),
        ManagedPolicy.fromAwsManagedPolicyName('AmazonTextractFullAccess')],
    });*/
  readonly snsRoleTextract?: iam.IRole;

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
 * This Task calls the Textract through the asynchronous API.
 *
 * Which API to call is defined in
 *
 * When GENERIC is called with features in the manifest definition, will call the AnalzyeDocument API.
 *
 * Takes the configuration from "Payload"."manifest"
 *
 * Will retry on recoverable errors based on textractAsyncCallMaxRetries
 * errors for retry: ['ThrottlingException', 'LimitExceededException', 'InternalServerError', 'ProvisionedThroughputExceededException'],
 *
 * Internally calls Start* calls with OutputConfig and SNSNotification.
 * Another Lambda functions waits for SNS Notification event and notifies the Step Function flow with the task token.
 *
 * Step Function JSON input requirements
 *
 * **Input**: "Payload"."manifest"
 *
 * **Output**: "TextractTempOutputJsonPath" points to potentially paginated Textract JSON Schema output at "TextractTempOutputJsonPath" (using the example code it will be at: "textract_result"."TextractTempOutputJsonPath")
 *
 * Works together with TextractAsyncToJSON, which takes the s3_output_bucket/s3_temp_output_prefix location as input
 *
 * Example (Python)
 * ```python
    textract_async_task = tcdk.TextractGenericAsyncSfnTask(
        self,
        "TextractAsync",
        s3_output_bucket=s3_output_bucket,
        s3_temp_output_prefix=s3_temp_output_prefix,
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
    ```

 */
export class TextractGenericAsyncSfnTask extends sfn.TaskStateBase {
  private static readonly SUPPORTED_INTEGRATION_PATTERNS = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.RUN_JOB,
    sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
  ];

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private readonly integrationPattern : sfn.IntegrationPattern;
  public stateMachine : sfn.IStateMachine;
  public taskTokenTable:dynamodb.ITable;
  public taskTokenTableName:string;
  public textractAsyncSNSRole:IRole;
  public textractAsyncSNS:sns.ITopic;
  public textractAsyncCallFunction:lambda.IFunction;
  public textractAsyncReceiveSNSFunction:lambda.IFunction;
  public asyncDurationMetric?:cloudwatch.IMetric;
  public asyncNumberPagesMetric?:cloudwatch.IMetric;
  public asyncJobFinshedMetric?:cloudwatch.IMetric;
  public asyncJobStartedMetric?:cloudwatch.IMetric;
  public asyncNumberPagesSendMetric?:cloudwatch.IMetric;


  constructor(scope : Construct, id : string, private readonly props : TextractGenericAsyncSfnTaskProps) {
    /**resources
     * DynamoDB table
     * textractAsyncSNSRole
     */
    super(scope, id, props);

    this.integrationPattern = props.integrationPattern || sfn.IntegrationPattern.REQUEST_RESPONSE;
    validatePatternSupported(this.integrationPattern, TextractGenericAsyncSfnTask.SUPPORTED_INTEGRATION_PATTERNS);

    if (this.integrationPattern === sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN && !sfn.FieldUtils.containsTaskToken(props.input)) {
      throw new Error('Task Token is required in `input` for callback. Use JsonPath.taskToken to set the token.');
    }

    if (this.props.associateWithParent && props.input && props.input.type !== sfn.InputType.OBJECT) {
      throw new Error('Could not enable `associateWithParent` because `input` is taken directly from a JSON path. Use `sfn.TaskInput.fromObject` instead.');
    }

    var textractStateMachineTimeoutMinutes = props.textractStateMachineTimeoutMinutes === undefined ? 2880 : props.textractStateMachineTimeoutMinutes;
    var lambdaLogLevel = props.lambdaLogLevel === undefined ? 'DEBUG' : props.lambdaLogLevel;
    var textractAPI = props.textractAPI === undefined ? 'GENERIC' : props.textractAPI;
    var textractAsyncCallMaxRetries = props.textractAsyncCallMaxRetries === undefined ? 100 : props.textractAsyncCallMaxRetries;
    var textractAsyncCallBackoffRate = props.textractAsyncCallBackoffRate === undefined ? 1.1 : props.textractAsyncCallBackoffRate;
    var textractAsyncCallInterval = props.textractAsyncCallInterval === undefined ? 1 : props.textractAsyncCallInterval;
    var s3TempOutputPrefix =
      props.s3TempOutputPrefix === undefined ? '' : props.s3TempOutputPrefix;
    var s3InputPrefix =
      props.s3InputPrefix === undefined ? '' : props.s3InputPrefix;
    var enableCloudWatchMetricsAndDashboard = props.enableCloudWatchMetricsAndDashboard === undefined ? false :
      props.enableCloudWatchMetricsAndDashboard;

    /** RESOURCE DYNAMODB TABLE for TASK TOKEN */
    if (props.taskTokenTable === undefined) {
      this.taskTokenTable = new dynamodb.Table(this, 'TextractTaskTokenTable', {
        partitionKey: {
          name: 'ID',
          type: dynamodb.AttributeType.STRING,
        },
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        removalPolicy: RemovalPolicy.DESTROY,
        timeToLiveAttribute: 'ttltimestamp',
      });
    } else {
      this.taskTokenTable = props.taskTokenTable;
    }
    this.taskTokenTableName = this.taskTokenTable.tableName;

    /** RESOURCE: SNS Role for Textract to use*/
    if (props.snsRoleTextract === undefined) {
      this.textractAsyncSNSRole = new iam.Role(this, 'TextractAsyncSNSRole', {
        assumedBy: new iam.ServicePrincipal('textract.amazonaws.com'),
        managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('AmazonSQSFullAccess'),
          ManagedPolicy.fromAwsManagedPolicyName('AmazonSNSFullAccess'),
          ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'),
          ManagedPolicy.fromAwsManagedPolicyName('AmazonTextractFullAccess')],
      });
    } else {
      this.textractAsyncSNSRole = props.snsRoleTextract;

    }

    this.textractAsyncSNS = new sns.Topic(this, 'TextractAsyncSNS');
    this.textractAsyncCallFunction = new lambda.DockerImageFunction(this, 'TextractAsyncCall', {
      code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../lambda/textract_async/')),
      memorySize: 128,
      architecture: lambda.Architecture.X86_64,
      environment: {
        NOTIFICATION_SNS: this.textractAsyncSNS.topicArn,
        NOTIFICATION_ROLE_ARN: this.textractAsyncSNSRole.roleArn,
        TOKEN_STORE_DDB: this.taskTokenTableName,
        S3_OUTPUT_BUCKET: props.s3OutputBucket,
        S3_TEMP_OUTPUT_PREFIX: props.s3TempOutputPrefix,
        LOG_LEVEL: lambdaLogLevel,
        TEXTRACT_API: textractAPI,
      },
    });
    const textractAsyncCallTask = new tasks.LambdaInvoke(this, 'TextractAsyncCallTask', { lambdaFunction: this.textractAsyncCallFunction });
    textractAsyncCallTask.addRetry({
      maxAttempts: textractAsyncCallMaxRetries,
      backoffRate: textractAsyncCallBackoffRate,
      interval: Duration.seconds(textractAsyncCallInterval),
      errors: ['ThrottlingException', 'LimitExceededException', 'InternalServerError', 'ProvisionedThroughputExceededException'],
    });


    this.textractAsyncCallFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'textract:Start*',
        'textract:Get*',
      ],
      resources: ['*'],
    }));
    /** ################ INPUT BUCKET POLICIES */
    if (props.inputPolicyStatements === undefined) {
      if (props.s3InputBucket === undefined) {
        this.textractAsyncCallFunction.addToRolePolicy(
          new iam.PolicyStatement({
            actions: ['s3:GetObject', 's3:ListBucket'],
            resources: ['*'],
          }),
        );
      } else {
        this.textractAsyncCallFunction.addToRolePolicy(
          new iam.PolicyStatement({
            actions: ['s3:GetObject'],
            resources: [
              path.join(`arn:aws:s3:::${props.s3InputBucket}`, '/*'),
              path.join(`arn:aws:s3:::${props.s3InputBucket}`, s3InputPrefix, '/*'),
            ],
          }),
        );
        this.textractAsyncCallFunction.addToRolePolicy(
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
        this.textractAsyncCallFunction.addToRolePolicy(policyStatement);
      }
    }
    /** ##################### OUTPUT BUCKET POLICIES */
    if (props.outputPolicyStatements === undefined) {
      if (props.s3OutputBucket === undefined) {
        this.textractAsyncCallFunction.addToRolePolicy(
          new iam.PolicyStatement({
            actions: ['s3:PutObject'],
            resources: ['*'],
          }),
        );
      } else {
        this.textractAsyncCallFunction.addToRolePolicy(
          new iam.PolicyStatement({
            actions: ['s3:PutObject'],
            resources: [
              path.join(`arn:aws:s3:::${props.s3OutputBucket}`, s3TempOutputPrefix, '/'),
              path.join(`arn:aws:s3:::${props.s3OutputBucket}`, s3TempOutputPrefix, '/*'),
            ],
          }),
        );
      }
    } else {
      for (var policyStatement of props.outputPolicyStatements) {
        this.textractAsyncCallFunction.addToRolePolicy(policyStatement);
      }
    }

    // this.textractAsyncCallFunction.addToRolePolicy(new iam.PolicyStatement({ actions: ['sns:*'], resources: [this.textractAsyncSNS.topicArn] }));
    this.textractAsyncCallFunction.addToRolePolicy(new iam.PolicyStatement({ actions: ['dynamodb:PutItem', 'dynamodb:GetItem'], resources: [this.taskTokenTable.tableArn] }));

    this.textractAsyncReceiveSNSFunction = new lambda.DockerImageFunction(this, 'TextractAsyncSNSFunction', {
      code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../lambda/textract_async_sns_listener/')),
      memorySize: 128,
      architecture: lambda.Architecture.X86_64,
      timeout: Duration.seconds(900),
      environment: {
        TOKEN_STORE_DDB: this.taskTokenTableName,
        S3_OUTPUT_BUCKET: props.s3OutputBucket,
        S3_TEMP_OUTPUT_PREFIX: props.s3TempOutputPrefix,
        LOG_LEVEL: lambdaLogLevel,
      },
    });
    this.textractAsyncSNS.addSubscription(new LambdaSubscription(this.textractAsyncReceiveSNSFunction));
    this.textractAsyncReceiveSNSFunction.addToRolePolicy(new iam.PolicyStatement({ actions: ['dynamodb:GetItem'], resources: [this.taskTokenTable.tableArn] }));

    const workflow_chain = sfn.Chain.start(textractAsyncCallTask);

    this.stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definition: workflow_chain,
      timeout: Duration.hours(textractStateMachineTimeoutMinutes),
    });

    this.textractAsyncReceiveSNSFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'states:SendTaskSuccess', 'states:SendTaskFailure',
      ],
      resources: ['*'],
    }));
    this.textractAsyncCallFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'states:SendTaskFailure',
      ],
      resources: ['*'],
    }));
    // =========
    // DASHBOARD
    // =========
    if (enableCloudWatchMetricsAndDashboard) {
      const appName = this.node.tryGetContext('appName');

      const customMetricNamespace = 'TextractConstructGenericAsync';

      // OPERATIONAL
      const asyncDurationMetricFilter = new MetricFilter(this, `${appName}-DurationFilter`, {
        logGroup: (<lambda.Function> this.textractAsyncReceiveSNSFunction).logGroup,
        metricNamespace: customMetricNamespace,
        metricName: 'Duration',
        filterPattern: FilterPattern.spaceDelimited('INFO', 'timestamp', 'id', 'message', 'durationMs')
          .whereString('message', '=', `textract_async_${textractAPI}_job_duration_in_ms:`),
        metricValue: '$durationMs',
      });
      this.asyncDurationMetric = asyncDurationMetricFilter.metric({ statistic: 'avg' });

      const asyncNumberPagesMetricFilter = new MetricFilter(this, `${appName}-NumberPagesFilter`, {
        logGroup: (<lambda.Function> this.textractAsyncReceiveSNSFunction).logGroup,
        metricNamespace: customMetricNamespace,
        metricName: 'NumberPages',
        filterPattern: FilterPattern.spaceDelimited('INFO', 'timestamp', 'id', 'message', 'pages')
          .whereString('message', '=', `textract_async_${textractAPI}_number_of_pages_processed:`),
        metricValue: '$pages',
      });
      this.asyncNumberPagesMetric = asyncNumberPagesMetricFilter.metric({ statistic: 'sum' });

      // TODO: expose all filters as properties of Construct, so users can build their own metrics
      const asyncJobFinshedMetricFilter = new MetricFilter(this, `${appName}-JobsFinishedFilter`, {
        logGroup: (<lambda.Function> this.textractAsyncReceiveSNSFunction).logGroup,
        metricNamespace: customMetricNamespace,
        metricName: 'JobsFinished',
        filterPattern: FilterPattern.spaceDelimited('INFO', 'timestamp', 'id', 'message', 'pages')
          .whereString('message', '=', `textract_async_${textractAPI}_number_of_pages_processed:`),
        metricValue: '1',
      });
      this.asyncJobFinshedMetric = asyncJobFinshedMetricFilter.metric({ statistic: 'sum' });

      const asyncJobStartedMetricFilter = new MetricFilter(this, `${appName}-JobsStartedFilter`, {
        logGroup: (<lambda.Function> this.textractAsyncCallFunction).logGroup,
        metricNamespace: customMetricNamespace,
        metricName: 'JobsStarted',
        filterPattern: FilterPattern.spaceDelimited('INFO', 'timestamp', 'id', 'message')
          .whereString('message', '=', `textract_async_${textractAPI}_job_started`),
        metricValue: '1',
      });
      this.asyncJobStartedMetric = asyncJobStartedMetricFilter.metric({ statistic: 'sum' });

      const asyncNumberPagesSendMetricFilter = new MetricFilter(this, `${appName}-NumberPagesSendFilter`, {
        logGroup: (<lambda.Function> this.textractAsyncCallFunction).logGroup,
        metricNamespace: customMetricNamespace,
        metricName: 'NumberPages',
        filterPattern: FilterPattern.spaceDelimited('INFO', 'timestamp', 'id', 'message', 'pages')
          .whereString('message', '=', `textract_async_${textractAPI}_number_of_pages_send_to_process:`),
        metricValue: '$pages',
      });
      this.asyncNumberPagesSendMetric = asyncNumberPagesSendMetricFilter.metric({ statistic: 'sum' });
      // OPERATIONAL STOP

      // CALCUATED OPERATIONAL METRICS

      const pagesPerSecond = new cloudwatch.MathExpression({
        expression: 'pages / (duration / 1000)',
        usingMetrics: {
          pages: this.asyncNumberPagesMetric,
          duration: this.asyncDurationMetric,
        },
      });
      const openJobs = new cloudwatch.MathExpression({
        expression: 'startedJobs - finishedJobs',
        usingMetrics: {
          startedJobs: this.asyncJobStartedMetric,
          finishedJobs: this.asyncJobFinshedMetric,
        },
      });
      // CALCUATED OPERATIONAL METRICS STOP

      const errorFilterMetric = new MetricFilter(this, `${appName}-ErrorFilter`, {
        logGroup: (<lambda.Function> this.textractAsyncCallFunction).logGroup,
        metricNamespace: customMetricNamespace,
        metricName: 'Errors',
        filterPattern: FilterPattern.anyTerm('ERROR', 'Error', 'error'),
        metricValue: '1',
      });

      const limitExceededExceptionFilterMetric = new MetricFilter(this, `${appName}-limitExceededExceptionFilter`, {
        logGroup: (<lambda.Function> this.textractAsyncCallFunction).logGroup,
        metricNamespace: customMetricNamespace,
        metricName: 'LimitExceededException',
        filterPattern: FilterPattern.anyTerm('textract.exceptions.LimitExceededException'),
        metricValue: '1',
      });
      const throttlingException = new MetricFilter(this, `${appName}-throttlingExceptionFilter`, {
        logGroup: (<lambda.Function> this.textractAsyncCallFunction).logGroup,
        metricNamespace: customMetricNamespace,
        metricName: 'ThrottlingException',
        filterPattern: FilterPattern.anyTerm('textract.exceptions.ThrottlingException'),
        metricValue: '1',
      });

      const provisionedThroughputExceededException = new MetricFilter(this, `${appName}-provisionedThroughputFilter`, {
        logGroup: (<lambda.Function> this.textractAsyncCallFunction).logGroup,
        metricNamespace: customMetricNamespace,
        metricName: 'ProvisionedThroughputExceededException',
        filterPattern: FilterPattern.anyTerm('textract.exceptions.ProvisionedThroughputExceededException'),
        metricValue: '1',
      });
      const internalServerError = new MetricFilter(this, `${appName}-internalServerErrorFilter`, {
        logGroup: (<lambda.Function> this.textractAsyncCallFunction).logGroup,
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
            new cloudwatch.Column(new cloudwatch.GraphWidget({ title: 'OpenJobs', left: [openJobs], width: Math.floor(dashboardWidth/2) })),
          ],
          [
            new cloudwatch.Column(new cloudwatch.GraphWidget({ title: 'Duration', left: [this.asyncDurationMetric], width: Math.floor(dashboardWidth/4) })),
            new cloudwatch.Column(new cloudwatch.GraphWidget({ title: 'NumberPages', left: [this.asyncNumberPagesMetric], width: Math.floor(dashboardWidth/4) })),
            new cloudwatch.Column(new cloudwatch.GraphWidget({ title: 'NumberPages', left: [this.asyncNumberPagesSendMetric], width: Math.floor(dashboardWidth/4) })),
            new cloudwatch.Column(new cloudwatch.GraphWidget({ title: 'JobsStartedAndFinished', left: [this.asyncJobFinshedMetric], right: [this.asyncJobStartedMetric], width: Math.floor(dashboardWidth/4) })),
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
            new cloudwatch.TextWidget({ markdown: '# textractAsyncCallFunction', width: dashboardWidth }),
          ],
          [
            new cloudwatch.GraphWidget({ title: 'Async-Function-Errors', left: [this.textractAsyncCallFunction.metricErrors()], width: Math.floor(dashboardWidth/3) }),
            new cloudwatch.GraphWidget({ title: 'Async-Function-Invocations', left: [this.textractAsyncCallFunction.metricInvocations()], width: Math.floor(dashboardWidth/3) }),
            new cloudwatch.GraphWidget({ title: 'Async-Function-Throttles', left: [this.textractAsyncCallFunction.metricThrottles()], width: Math.floor(dashboardWidth/3) }),
          ],
          [
            new cloudwatch.TextWidget({ markdown: '# textractAsyncReceiveSNSFunction', width: dashboardWidth }),
          ],
          [
            new cloudwatch.GraphWidget({ title: 'SNS-Function-Errors', left: [this.textractAsyncReceiveSNSFunction.metricErrors()], width: Math.floor(dashboardWidth/3) }),
            new cloudwatch.GraphWidget({ title: 'SNS-Function-Invocations', left: [this.textractAsyncReceiveSNSFunction.metricInvocations()], width: Math.floor(dashboardWidth/3) }),
            new cloudwatch.GraphWidget({ title: 'SNS-Function-Throttles', left: [this.textractAsyncReceiveSNSFunction.metricThrottles()], width: Math.floor(dashboardWidth/3) }),
          ],
        ],
      });
    }
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
