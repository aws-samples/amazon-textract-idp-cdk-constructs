import * as path from 'path';
import { Duration, Aws, ArnFormat, Stack } from 'aws-cdk-lib';
//import * as ec2 from 'aws-cdk-lib/aws-ec2';
//import { ISecurityGroup, IVpc } from 'aws-cdk-lib/aws-ec2';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { FilterPattern, ILogGroup, MetricFilter } from 'aws-cdk-lib/aws-logs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';
import { RdsServerlessInit } from './rdsServerlessInit';

export function validatePatternSupported(integrationPattern: sfn.IntegrationPattern, supportedPatterns: sfn.IntegrationPattern[]) {
  if (!supportedPatterns.includes(integrationPattern)) {
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
export function integrationResourceArn(service: string, api: string, integrationPattern?: sfn.IntegrationPattern): string {
  if (!service || !api) {
    throw new Error("Both 'service' and 'api' must be provided to build the resource ARN.");
  }
  return `arn:${Aws.PARTITION
  }:states:::${service}:${api}` + (integrationPattern ? resourceArnSuffix[integrationPattern] : '');
}
export interface CSVToAuroraTaskProps extends sfn.TaskStateBaseProps {
  /** VPC to install the database into */
  readonly vpc: ec2.IVpc;
  readonly textractStateMachineTimeoutMinutes?: number;
  readonly lambdaLogLevel?: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'FATAL';
  /** Lambda Function Timeout in seconds, default 300 */
  readonly lambdaTimeout?: number;
  /** Memory allocated to Lambda function, default 512 */
  readonly lambdaMemory?: number;
  readonly csvToAuroraMaxRetries?: number;
  /**default is 1.1 */
  readonly csvToAuroraBackoffRate?: number;
  /**default is 1 */
  readonly csvToAuroraInterval?: number;
  /** enable CloudWatch Metrics and Dashboard
     * @default - false
     */
  readonly enableCloudWatchMetricsAndDashboard?: boolean;
  /**
       * The JSON input for the execution, same as that of StartExecution.
       *
       * @see https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html
       *
       * @default - The state input (JSON path '$')
       */
  readonly input?: sfn.TaskInput;

  /**
        * The name of the execution, same as that of StartExecution.
        *
        * @see https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html
        *
        * @default - None
        */
  readonly name?: string;

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
  readonly associateWithParent?: boolean;
}
/**
 * CSVToAuroraTask is a demo construct to show import into a serverless Aurora DB.
 * At the moment it also creates the Aurora Serverless RDS DB, initializes a table structure the matches the output of the GenerateCSV construct.
 * The Step Functions flow expect a pointer to a CSV at "csv_output_location"."TextractOutputCSVPath" and uses that to execute a batch insert statement command.
 *
 * Example:
 * ```python
*  csv_to_aurora_task = tcdk.CSVToAuroraTask(
    self,
    "CsvToAurora",
    vpc=vpc,
    integration_pattern=sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
    lambda_log_level="DEBUG",
    timeout=Duration.hours(24),
    input=sfn.TaskInput.from_object({
      "Token":
      sfn.JsonPath.task_token,
      "ExecutionId":
      sfn.JsonPath.string_at('$$.Execution.Id'),
      "Payload":
      sfn.JsonPath.entire_payload
    }),
    result_path="$.textract_result")
  ```
 *
 * Input: "csv_output_location"."TextractOutputCSVPath"
 * Output: CSV in Aurora Serverless DB, table name 'textractcsvimport"
 */
export class CSVToAuroraTask extends sfn.TaskStateBase {
  private static readonly SUPPORTED_INTEGRATION_PATTERNS = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.RUN_JOB,
    sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
  ];

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private readonly integrationPattern: sfn.IntegrationPattern;
  public stateMachine: sfn.IStateMachine;
  public csvToAuroraLambdaLogGroup: ILogGroup;
  public version: string;
  public csvToAuroraFunction: lambda.IFunction;
  public dbCluster: rds.IServerlessCluster;
  public csvToAuroraNumberRowsInsertedMetric?: cloudwatch.IMetric;

  constructor(scope: Construct, id: string, private readonly props: CSVToAuroraTaskProps) {
    super(scope, id, props);

    this.version = '0.0.1';
    this.integrationPattern = props.integrationPattern || sfn.IntegrationPattern.REQUEST_RESPONSE;
    validatePatternSupported(this.integrationPattern, CSVToAuroraTask.SUPPORTED_INTEGRATION_PATTERNS);

    if (this.integrationPattern === sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN && !sfn.FieldUtils.containsTaskToken(props.input)) {
      throw new Error('Task Token is required in `input` for callback. Use JsonPath.taskToken to set the token.');
    }

    if (this.props.associateWithParent && props.input && props.input.type !== sfn.InputType.OBJECT) {
      throw new Error('Could not enable `associateWithParent` because `input` is taken directly from a JSON path. Use `sfn.TaskInput.fromObject` instead.');
    }
    var enableCloudWatchMetricsAndDashboard = props.enableCloudWatchMetricsAndDashboard === undefined ? false :
      props.enableCloudWatchMetricsAndDashboard;

    var textractStateMachineTimeoutMinutes = props.textractStateMachineTimeoutMinutes === undefined ? 2880 : props.textractStateMachineTimeoutMinutes;
    var lambdaLogLevel = props.lambdaLogLevel === undefined ? 'DEBUG' : props.lambdaLogLevel;
    var lambdaTimeout = props.lambdaTimeout === undefined ? 600 : props.lambdaTimeout;
    var lambdaMemory = props.lambdaMemory === undefined ? 256 : props.lambdaMemory;
    var csvToAuroraMaxRetries = props.csvToAuroraMaxRetries === undefined ? 100 : props.csvToAuroraMaxRetries;
    var csvToAuroraBackoffRate = props.csvToAuroraBackoffRate === undefined ? 1.1 : props.csvToAuroraBackoffRate;
    var csvToAuroraInterval = props.csvToAuroraInterval === undefined ? 1 : props.csvToAuroraInterval;
    const lambdaSG: ec2.ISecurityGroup = new ec2.SecurityGroup(this, 'LambdaSG', { allowAllOutbound: true, vpc: props.vpc });
    const auroraSg: ec2.ISecurityGroup = new ec2.SecurityGroup(this, 'Aurora', { allowAllOutbound: true, vpc: props.vpc });
    auroraSg.addIngressRule(auroraSg, ec2.Port.tcp(5432), 'fromSameSG');
    auroraSg.addIngressRule(auroraSg, ec2.Port.tcp(443), 'fromSameSG');
    auroraSg.addIngressRule(lambdaSG, ec2.Port.tcp(5432), 'LambdaIngreess');
    auroraSg.addIngressRule(lambdaSG, ec2.Port.tcp(443), 'LambdaIngreess');

    // AURORA
    this.dbCluster = new rds.ServerlessCluster(this, id + 'AuroraPSQL', {
      engine: rds.DatabaseClusterEngine.AURORA_POSTGRESQL,
      parameterGroup: rds.ParameterGroup.fromParameterGroupName(this, 'ParameterGroup', 'default.aurora-postgresql10'),
      vpc: props.vpc,
      securityGroups: [auroraSg],
      enableDataApi: true,
    });

    const rdsServerlessInit = new RdsServerlessInit(this, 'RdsServerlessInit', {
      dbClusterSecretARN: (<rds.ServerlessCluster> this.dbCluster).secret!.secretArn,
      dbClusterARN: (<rds.ServerlessCluster> this.dbCluster).clusterArn,
    });
    rdsServerlessInit.node.addDependency(this.dbCluster);

    // LAMBDA PUT ON Cluster
    this.csvToAuroraFunction = new lambda.DockerImageFunction(this, 'CSVToAuroraFunction', {
      code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../lambda/csv_to_aurora/')),
      memorySize: lambdaMemory,
      timeout: Duration.seconds(lambdaTimeout),
      securityGroups: [lambdaSG],
      vpc: props.vpc,
      environment: {
        SECRET_ARN: (<rds.ServerlessCluster> this.dbCluster).secret!.secretArn,
        CLUSTER_ARN: (<rds.ServerlessCluster> this.dbCluster).clusterArn,
        LOG_LEVEL: lambdaLogLevel,
      },
    });
    this.csvToAuroraLambdaLogGroup = (<lambda.Function> this.csvToAuroraFunction).logGroup;

    const csvToAuroraTask = new tasks.LambdaInvoke(this, 'TextractSyncCallTask', { lambdaFunction: this.csvToAuroraFunction });

    csvToAuroraTask.addRetry({
      maxAttempts: csvToAuroraMaxRetries,
      backoffRate: csvToAuroraBackoffRate,
      interval: Duration.seconds(csvToAuroraInterval),
      errors: ['StatementTimeoutException', 'InternalServerErrorException', 'ServiceUnavailableError', 'Lambda.Unknown'],
    });

    // WORKFLOW
    const workflow_chain = sfn.Chain.start(csvToAuroraTask);

    this.stateMachine = new sfn.StateMachine(this, id + '-SFN', {
      definition: workflow_chain,
      timeout: Duration.hours(textractStateMachineTimeoutMinutes),
      tracingEnabled: true,
    });

    this.csvToAuroraFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'states:SendTaskSuccess', 'states:SendTaskFailure',
      ],
      resources: ['*'],
    }));
    this.csvToAuroraFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'secretsmanager:GetSecretValue',
      ],
      resources: ['*'],
    }));
    this.csvToAuroraFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        's3:GetObject', 's3:ListBucket',
      ],
      resources: ['*'],
    }));
    this.csvToAuroraFunction.role?.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonRDSDataFullAccess'));
    // START DASHBOARD

    if (enableCloudWatchMetricsAndDashboard) {
      const appName = this.node.tryGetContext('appName');

      const customMetricNamespace = 'TextractIDPCSVToAurora';

      const csvToAuroraNumberRowsInsertedFilter = new MetricFilter(this, `${appName}-NumberOfRowsFilter`, {
        logGroup: (<lambda.Function> this.csvToAuroraFunction).logGroup,
        metricNamespace: customMetricNamespace,
        metricName: 'NumberOfRows',
        filterPattern: FilterPattern.spaceDelimited('INFO', 'timestamp', 'id', 'message', 'numberOfRows')
          .whereString('message', '=', 'csv_to_aurora_insert_rows:'),
        metricValue: '$numberOfRows',
      });
      this.csvToAuroraNumberRowsInsertedMetric = csvToAuroraNumberRowsInsertedFilter.metric({ statistic: 'sum' });
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
        ...associateWithParentEntry,
      } : associateWithParentEntry;
    } else {
      input = this.props.input ? this.props.input.value : sfn.TaskInput.fromJsonPathAt('$').value;
    }


    return {
      Resource: `${integrationResourceArn('states', 'startExecution', this.integrationPattern)
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
              resourceName: `${stack.splitArn(this.stateMachine.stateMachineArn, ArnFormat.COLON_RESOURCE_NAME).resourceName
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
