import * as path from 'path';
import { Duration, Aws, ArnFormat, Stack } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
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
export interface ComprehendGenericSyncSfnTaskProps extends sfn.TaskStateBaseProps {
  readonly comprehendClassifierArn: string;
  readonly lambdaLogLevel? : 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'FATAL';
  /** Lambda Function Timeout in seconds, default 300 */
  readonly lambdaTimeout? : number;
  /** Memory allocated to Lambda function, default 512 */
  readonly lambdaMemory? : number;
  readonly workflowTracingEnabled? : boolean;
  /** how long can we wait for the process (default is 60 minutes) */
  readonly textractStateMachineTimeoutMinutes? : number;
  /** location of input S3 objects - if left empty will generate rule for s3 access to all [*] */
  readonly s3InputBucket?: string;
  /** prefix for input S3 objects - if left empty will generate rule for s3 access to all in bucket */
  readonly s3InputPrefix?: string;
  /** Bucketname to output data to */
  readonly s3OutputBucket? : string;
  /** The prefix to use for the temporary output files (e. g. output from async process before stiching together) */
  readonly s3OutputPrefix? : string;
  /** List of PolicyStatements to attach to the Lambda function.  */
  readonly inputPolicyStatements?: iam.PolicyStatement[];
  /** List of PolicyStatements to attach to the Lambda function.  */
  readonly outputPolicyStatements?: iam.PolicyStatement[];
  /* number of retries, defaul is 100 */
  readonly comprehendAsyncCallMaxRetries?: number;
  /**default is 1.1 */
  readonly comprehendAsyncCallBackoffRate?: number;
  /**default is 1 */
  readonly comprehendAsyncCallInterval?: number;
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
 * Calls a Comprehend Classification endpoint and parses the result, filters on > 50 % confidence and sets the highest confidence score classification
 *
 * Input: "textract_result"."txt_output_location"
 * Output:  { "documentType": "AWS_PAYSTUBS" } (example will be at "classification"."documentType")
 *
 * Example (Python)
 * ```python
    comprehend_sync_task = tcdk.ComprehendGenericSyncSfnTask(
        self,
        "Classification",
        comprehend_classifier_arn=
        '<your comprehend classifier arn>',
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
        result_path="$.classification")
    ```
 */

export class ComprehendGenericSyncSfnTask extends sfn.TaskStateBase {
  private static readonly SUPPORTED_INTEGRATION_PATTERNS = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.RUN_JOB,
    sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
  ];

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private readonly integrationPattern : sfn.IntegrationPattern;
  public stateMachine : sfn.IStateMachine;
  public version:string;
  public comprehendSyncCallFunction:lambda.IFunction;

  constructor(scope : Construct, id : string, private readonly props : ComprehendGenericSyncSfnTaskProps) {
    super(scope, id, props);

    this.version = '0.0.1';
    this.integrationPattern = props.integrationPattern || sfn.IntegrationPattern.REQUEST_RESPONSE;
    validatePatternSupported(this.integrationPattern, ComprehendGenericSyncSfnTask.SUPPORTED_INTEGRATION_PATTERNS);

    if (this.integrationPattern === sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN && !sfn.FieldUtils.containsTaskToken(props.input)) {
      throw new Error('Task Token is required in `input` for callback. Use JsonPath.taskToken to set the token.');
    }

    if (this.props.associateWithParent && props.input && props.input.type !== sfn.InputType.OBJECT) {
      throw new Error('Could not enable `associateWithParent` because `input` is taken directly from a JSON path. Use `sfn.TaskInput.fromObject` instead.');
    }

    var textractStateMachineTimeoutMinutes = props.textractStateMachineTimeoutMinutes === undefined ? 60 : props.textractStateMachineTimeoutMinutes;
    var lambdaLogLevel = props.lambdaLogLevel === undefined ? 'DEBUG' : props.lambdaLogLevel;
    var lambdaLogLevel = props.lambdaLogLevel === undefined ? 'DEBUG' : props.lambdaLogLevel;
    var lambdaTimeout = props.lambdaTimeout === undefined ? 300 : props.lambdaTimeout;
    var lambdaMemory = props.lambdaMemory === undefined ? 256 : props.lambdaMemory;
    var s3OutputPrefix =
      props.s3OutputPrefix === undefined ? '' : props.s3OutputPrefix;
    var s3InputPrefix =
      props.s3InputPrefix === undefined ? '' : props.s3InputPrefix;
    var comprehendAsyncCallMaxRetries = props.comprehendAsyncCallMaxRetries === undefined ? 100 : props.comprehendAsyncCallMaxRetries;
    var comprehendAsyncCallBackoffRate = props.comprehendAsyncCallBackoffRate === undefined ? 1.1 : props.comprehendAsyncCallBackoffRate;
    var comprehendAsyncCallInterval = props.comprehendAsyncCallInterval === undefined ? 1 : props.comprehendAsyncCallInterval;

    this.comprehendSyncCallFunction = new lambda.DockerImageFunction(this, 'ComprehendSyncCall', {
      code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../lambda/comprehend_sync/')),
      memorySize: lambdaMemory,
      architecture: lambda.Architecture.X86_64,
      timeout: Duration.seconds(lambdaTimeout),
      environment: {
        LOG_LEVEL: lambdaLogLevel,
        COMPREHEND_CLASSIFIER_ARN: props.comprehendClassifierArn,
      },
    });
    this.comprehendSyncCallFunction.addToRolePolicy(new iam.PolicyStatement({ actions: ['comprehend:ClassifyDocument'], resources: [props.comprehendClassifierArn] }));
    /** ################ INPUT BUCKET POLICIES */
    if (props.inputPolicyStatements === undefined) {
      if (props.s3InputBucket === undefined) {
        this.comprehendSyncCallFunction.addToRolePolicy(
          new iam.PolicyStatement({
            actions: ['s3:GetObject', 's3:ListBucket'],
            resources: ['*'],
          }),
        );
      } else {
        this.comprehendSyncCallFunction.addToRolePolicy(
          new iam.PolicyStatement({
            actions: ['s3:GetObject'],
            resources: [
              path.join(`arn:aws:s3:::${props.s3InputBucket}`, '/*'),
              path.join(`arn:aws:s3:::${props.s3InputBucket}`, s3InputPrefix, '/*'),
            ],
          }),
        );
        this.comprehendSyncCallFunction.addToRolePolicy(
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
        this.comprehendSyncCallFunction.addToRolePolicy(policyStatement);
      }
    }
    /** ##################### OUTPUT BUCKET POLICIES */
    if (props.outputPolicyStatements === undefined) {
      if (props.s3OutputBucket === undefined) {
        this.comprehendSyncCallFunction.addToRolePolicy(
          new iam.PolicyStatement({
            actions: ['s3:PutObject'],
            resources: ['*'],
          }),
        );
      } else {
        this.comprehendSyncCallFunction.addToRolePolicy(
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
        this.comprehendSyncCallFunction.addToRolePolicy(policyStatement);
      }
    }

    const comprehendInvoke = new tasks.LambdaInvoke(this, id, {
      lambdaFunction: this.comprehendSyncCallFunction,
      outputPath: '$.Payload',
    });

    comprehendInvoke.addRetry({
      maxAttempts: comprehendAsyncCallMaxRetries,
      backoffRate: comprehendAsyncCallBackoffRate,
      interval: Duration.seconds(comprehendAsyncCallInterval),
      errors: ['ThrottlingException', 'LimitExceededException', 'InternalServerError', 'ProvisionedThroughputExceededException'],
    });
    const workflow_chain = sfn.Chain.start(comprehendInvoke);

    this.stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(workflow_chain),
      timeout: Duration.hours(textractStateMachineTimeoutMinutes),
    });

    this.comprehendSyncCallFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'states:SendTaskFailure', 'states:SendTaskSuccess',
      ],
      resources: ['*'],
    }));
    // =========
    // DASHBOARD
    // =========
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