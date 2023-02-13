import * as path from 'path';
import { Duration, Aws, ArnFormat, Stack } from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { ILogGroup } from 'aws-cdk-lib/aws-logs';
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
export interface SpacySfnTaskProps extends sfn.TaskStateBaseProps {
  /** log level for Lambda function, supports DEBUG|INFO|WARNING|ERROR|FATAL */
  readonly lambdaLogLevel? : 'DEBUG'|'INFO'|'WARNING'|'ERROR'|'FATAL';
  /** how long can we wait for the process (default is 48 hours (60*48=2880)) */
  readonly textractStateMachineTimeoutMinutes? : number;
  /** timeout for Lambda function calling Spacy NLP, default is 900 seconds */
  readonly spacyLambdaTimeout? : number;
  /** memorySize for Lambda function calling Spacy NLP, default is 4096 MB */
  readonly spacyLambdaMemorySize? : number;
  /** ECR Container URI for Spacy classification */
  readonly spacyImageEcrRepository? : string;
  /** Docker Container (to use in DockerImageCode.from_ecr() call) */
  readonly dockerImageFunction? : lambda.IFunction;
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
 * Deploys a Lambda Container with a Spacy NLP model to call textcat
 *
 * Input: "textract_result"."txt_output_location"
 * Output:  { "documentType": "AWS_PAYSTUBS" } (example will be at "classification"."documentType")
 *
 * Example (Python)
 * ```python
    spacy_classification_task = tcdk.SpacySfnTask(
        self,
        "Classification",
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

export class SpacySfnTask extends sfn.TaskStateBase {
  private static readonly SUPPORTED_INTEGRATION_PATTERNS = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.RUN_JOB,
    sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
  ];

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private readonly integrationPattern : sfn.IntegrationPattern;
  public stateMachine : sfn.IStateMachine;
  public spacySyncLambdaLogGroup:ILogGroup;
  public version:string;
  public spacyCallFunction:lambda.IFunction;

  constructor(scope : Construct, id : string, private readonly props : SpacySfnTaskProps) {
    super(scope, id, props);

    this.version = '0.0.1';
    this.integrationPattern = props.integrationPattern || sfn.IntegrationPattern.REQUEST_RESPONSE;
    validatePatternSupported(this.integrationPattern, SpacySfnTask.SUPPORTED_INTEGRATION_PATTERNS);

    if (this.integrationPattern === sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN && !sfn.FieldUtils.containsTaskToken(props.input)) {
      throw new Error('Task Token is required in `input` for callback. Use JsonPath.taskToken to set the token.');
    }

    if (this.props.associateWithParent && props.input && props.input.type !== sfn.InputType.OBJECT) {
      throw new Error('Could not enable `associateWithParent` because `input` is taken directly from a JSON path. Use `sfn.TaskInput.fromObject` instead.');
    }

    var textractStateMachineTimeoutMinutes = props.textractStateMachineTimeoutMinutes === undefined ? 2880 : props.textractStateMachineTimeoutMinutes;
    var lambdaLogLevel = props.lambdaLogLevel === undefined ? 'DEBUG' : props.lambdaLogLevel;
    var spacyLambdaTimeout = props.spacyLambdaTimeout === undefined ? 900 : props.spacyLambdaTimeout;
    var spacyLambdaMemorySize = props.spacyLambdaMemorySize === undefined ? 4096 : props.spacyLambdaMemorySize;

    if (props.spacyImageEcrRepository === undefined && props.dockerImageFunction === undefined) {
      this.spacyCallFunction = new lambda.DockerImageFunction(this, 'SpacyCall', {
        code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../lambda/classification_spacy_image/')),
        memorySize: spacyLambdaMemorySize,
        architecture: lambda.Architecture.X86_64,
        timeout: Duration.seconds(spacyLambdaTimeout),
        environment: {
          LOG_LEVEL: lambdaLogLevel,
        },
      });
    } else if (props.dockerImageFunction != undefined) {
      this.spacyCallFunction = props.dockerImageFunction;
    } else {
      const repo = new ecr.Repository(this, 'SpacyRepo', { repositoryName: props.spacyImageEcrRepository });
      this.spacyCallFunction = new lambda.DockerImageFunction(this, 'SpacyCall', {
        code: lambda.DockerImageCode.fromEcr(repo),
        memorySize: spacyLambdaMemorySize,
        architecture: lambda.Architecture.X86_64,
        timeout: Duration.seconds(spacyLambdaTimeout),
        environment: {
          LOG_LEVEL: lambdaLogLevel,
        },
      });
    }
    this.spacyCallFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject', 's3:ListBucket', 's3:PutObject'], resources: ['*'],
    }));
    this.spacyCallFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'states:SendTaskFailure', 'states:SendTaskSuccess',
      ],
      resources: ['*'],
    }));
    this.spacySyncLambdaLogGroup=(<lambda.Function> this.spacyCallFunction).logGroup;

    const spacyTask = new tasks.LambdaInvoke(this, 'SpacyTask', { lambdaFunction: this.spacyCallFunction });

    const workflow_chain = sfn.Chain.start(spacyTask);

    this.stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definition: workflow_chain,
      timeout: Duration.hours(textractStateMachineTimeoutMinutes),
    });

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