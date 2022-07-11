import * as path from 'path';
import { Duration, Aws, ArnFormat, Stack, RemovalPolicy } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
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
export interface TextractA2ISfnTaskProps extends sfn.TaskStateBaseProps {
  readonly lambdaLogLevel? : string;
  readonly a2iFlowDefinitionARN: string;
  readonly taskTokenTableName? : string;
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
 * Calls and A2I endpoint arn with a task_token and waits for the A2I job to finish in order to continue the workflow.
 *
 * Very basic implementation atm.
 *
 * Example::
 *         textract_a2i_task = tcdk.TextractA2ISfnTask(
            self,
            "TextractA2I",
            a2i_flow_definition_arn=
            "arn:aws:sagemaker:us-east-1:913165245630:flow-definition/textract-classifiction",
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
            result_path="$.a2i_result")

 */
export class TextractA2ISfnTask extends sfn.TaskStateBase {
  private static readonly SUPPORTED_INTEGRATION_PATTERNS = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.RUN_JOB,
    sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
  ];

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private readonly integrationPattern : sfn.IntegrationPattern;
  public stateMachine : sfn.IStateMachine;
  public taskTokenTableName:string;
  public version:string;

  constructor(scope : Construct, id : string, private readonly props : TextractA2ISfnTaskProps) {
    super(scope, id, props);

    this.version = '0.0.1';
    this.integrationPattern = props.integrationPattern || sfn.IntegrationPattern.REQUEST_RESPONSE;
    validatePatternSupported(this.integrationPattern, TextractA2ISfnTask.SUPPORTED_INTEGRATION_PATTERNS);

    if (this.integrationPattern === sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN && !sfn.FieldUtils.containsTaskToken(props.input)) {
      throw new Error('Task Token is required in `input` for callback. Use JsonPath.taskToken to set the token.');
    }

    if (this.props.associateWithParent && props.input && props.input.type !== sfn.InputType.OBJECT) {
      throw new Error('Could not enable `associateWithParent` because `input` is taken directly from a JSON path. Use `sfn.TaskInput.fromObject` instead.');
    }

    var lambdaLogLevel = props.lambdaLogLevel === undefined ? 'DEBUG' : props.lambdaLogLevel;

    const taskTokenTable = new dynamodb.Table(this, 'A2ITaskTokenTable', {
      partitionKey: {
        name: 'ID',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
      timeToLiveAttribute: 'ttltimestamp',
    });
    this.taskTokenTableName = taskTokenTable.tableName;

    const startA2IFunction = new lambda.DockerImageFunction(this, 'startA2ICall', {
      code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../lambda/a2i_preprocess/')),
      memorySize: 128,
      environment: {
        TOKEN_STORE_DDB: this.taskTokenTableName,
        A2I_FLOW_DEFINITION_ARN: props.a2iFlowDefinitionARN,
        LOG_LEVEL: lambdaLogLevel,
      },
    });

    const startA2ITask = new tasks.LambdaInvoke(this, 'StartA2ITask', {
      lambdaFunction: startA2IFunction,
    });

    const postA2IFunction = new lambda.DockerImageFunction(this, 'endA2ICall', {
      code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../lambda/a2i_postprocess/')),
      memorySize: 128,
      environment: {
        TOKEN_STORE_DDB: this.taskTokenTableName,
        LOG_LEVEL: lambdaLogLevel,
      },
    });

    const rule = new events.Rule(this, 'EventBridgeRule', {
      enabled: true,
      eventPattern: {
        source: ['aws.sagemaker'],
        detailType: ['SageMaker A2I HumanLoop Status Change'],
        detail: {
          humanLoopStatus: ['Completed', 'Failed'],
          flowDefinitionArn: [props.a2iFlowDefinitionARN],
        },
      },
    });
    rule.addTarget(new targets.LambdaFunction(postA2IFunction));


    startA2IFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'sagemaker:StartHumanLoop',
      ],
      resources: [props.a2iFlowDefinitionARN],
    }));
    startA2IFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'states:SendTaskSuccess', 'states:SendTaskFailure',
      ],
      resources: ['*'],
    }));
    startA2IFunction.addToRolePolicy(new iam.PolicyStatement({ actions: ['dynamodb:PutItem', 'dynamodb:GetItem'], resources: [taskTokenTable.tableArn] }));
    startA2IFunction.addToRolePolicy(new iam.PolicyStatement({ actions: ['s3:PutObject', 's3:Get*', 's3:List*'], resources: ['*'] }));
    postA2IFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'states:SendTaskSuccess', 'states:SendTaskFailure',
      ],
      resources: ['*'],
    }));
    postA2IFunction.addToRolePolicy(new iam.PolicyStatement({ actions: ['dynamodb:PutItem', 'dynamodb:GetItem'], resources: [taskTokenTable.tableArn] }));

    const workflow_chain = sfn.Chain.start(startA2ITask);

    this.stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definition: workflow_chain,
      timeout: Duration.hours(2),
      tracingEnabled: true,
    });

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