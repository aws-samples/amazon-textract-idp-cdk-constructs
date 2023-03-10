import * as path from 'path';
import { Duration, Aws, ArnFormat, Stack } from 'aws-cdk-lib';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Architecture, DockerImageCode, DockerImageFunction, IFunction } from 'aws-cdk-lib/aws-lambda';
import { Chain, FieldUtils, IntegrationPattern, IStateMachine, JsonPath, StateMachine, TaskInput, TaskMetricsConfig, TaskStateBase, TaskStateBaseProps } from 'aws-cdk-lib/aws-stepfunctions';
import { LambdaInvoke } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';
import { handleStepFunctionError } from './commonUtils';

export function validatePatternSupported(
  integrationPattern: IntegrationPattern,
  supportedPatterns: IntegrationPattern[],
) {
  if (!supportedPatterns.includes(integrationPattern)) {
    throw new Error(
      `Unsupported service integration pattern. Supported Patterns: ${supportedPatterns}. Received: ${integrationPattern}`,
    );
  }
}
/**
 * Suffixes corresponding to different service integration patterns
 * Key is the service integration pattern, value is the resource ARN suffix.
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html
 */
const resourceArnSuffix: Record<IntegrationPattern, string> = {
  [IntegrationPattern.REQUEST_RESPONSE]: '',
  [IntegrationPattern.RUN_JOB]: '.sync',
  [IntegrationPattern.WAIT_FOR_TASK_TOKEN]: '.waitForTaskToken',
};

export function integrationResourceArn(
  service: string,
  api: string,
  integrationPattern?: IntegrationPattern,
): string {
  if (!service || !api) {
    throw new Error(
      "Both 'service' and 'api' must be provided to build the resource ARN.",
    );
  }
  return (
    `arn:${Aws.PARTITION}:states:::${service}:${api}` +
        (integrationPattern ? resourceArnSuffix[integrationPattern] : '')
  );
}

export interface ComprehendPiiSyncSfnTaskProps extends TaskStateBaseProps {
  readonly languageCode: string;
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
  /** Bucket name to output data to */
  readonly s3OutputBucket? : string;
  /** The prefix to use for the temporary output files (e.g. output from async process before stitching together) */
  readonly s3OutputPrefix? : string;
  /** List of PolicyStatements to attach to the Lambda function.  */
  readonly inputPolicyStatements?: [PolicyStatement];
  /** List of PolicyStatements to attach to the Lambda function.  */
  readonly outputPolicyStatements?: [PolicyStatement];
  /**
       * The JSON input for the execution, same as that of StartExecution.
       *
       * @see https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html
       *
       * @default - The state input (JSON path '$')
       */
  readonly input? : TaskInput;

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
          * If you set this property to `true`, the `input` property must be an object (provided by `TaskInput.fromObject`) or omitted entirely.
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
 comprehend_sync_task = tcdk.ComprehendPiiSyncSfnTask(
 self,
 "Classification",
    languageCode="en",
    comprehendClassifierArn='<your comprehend classifier arn>',
 integration_pattern=IntegrationPattern.WAIT_FOR_TASK_TOKEN,
 lambda_log_level="DEBUG",
 timeout=Duration.hours(24),
 input=TaskInput.from_object({
            "Token":
            JsonPath.task_token,
            "ExecutionId":
            JsonPath.string_at('$$.Execution.Id'),
            "Payload":
            JsonPath.entire_payload,
        }),
 result_path="$.classification")
 ```
 */

export class ComprehendPiiSyncSfnTask extends TaskStateBase {
  private static readonly SUPPORTED_INTEGRATION_PATTERNS = [
    IntegrationPattern.REQUEST_RESPONSE,
    IntegrationPattern.RUN_JOB,
    IntegrationPattern.WAIT_FOR_TASK_TOKEN,
  ];

  protected readonly taskMetrics?: TaskMetricsConfig;
  protected readonly taskPolicies?: PolicyStatement[];

  private readonly integrationPattern: IntegrationPattern;
  public stateMachine: IStateMachine;
  public version:string;
  public comprehendSyncPiiCallFunction: IFunction;

  constructor(
    scope: Construct,
    id: string,
    private readonly props: ComprehendPiiSyncSfnTaskProps,
  ) {
    super(scope, id, props);

    this.version = '0.0.1';
    this.integrationPattern =
            props.integrationPattern || IntegrationPattern.REQUEST_RESPONSE;
    validatePatternSupported(
      this.integrationPattern,
      ComprehendPiiSyncSfnTask.SUPPORTED_INTEGRATION_PATTERNS,
    );

    handleStepFunctionError(this.integrationPattern, props.input, this.props.associateWithParent);

    const {
      textractStateMachineTimeoutMinutes,
      lambdaLogLevel,
      lambdaTimeout,
      lambdaMemory,
      s3OutputPrefix,
      s3InputPrefix,
    } = props;

    const stateMachineTimeoutMinutes =
            textractStateMachineTimeoutMinutes === undefined
              ? 60
              : textractStateMachineTimeoutMinutes;
    const logLevel = lambdaLogLevel === undefined ? 'DEBUG' : lambdaLogLevel;
    const lambdaTimeoutDuration =
            lambdaTimeout === undefined ? 300 : lambdaTimeout;
    const lambdaMemoryConstant =
            lambdaMemory === undefined ? 256 : lambdaMemory;
    const s3OutputPrefixValue =
        s3OutputPrefix === undefined ? '' : s3OutputPrefix;
    const s3InputPrefixValue =
        s3InputPrefix === undefined ? '' : s3InputPrefix;

    this.comprehendSyncPiiCallFunction = new DockerImageFunction(this, 'ComprehendPiiSyncCall', {
      code: DockerImageCode.fromImageAsset(path.join(__dirname, '../lambda/comprehend_pii_sync/')),
      memorySize: lambdaMemoryConstant,
      architecture: Architecture.ARM_64,
      timeout: Duration.seconds(lambdaTimeoutDuration),
      environment: {
        LOG_LEVEL: logLevel,
        COMPREHEND_CLASSIFIER_ARN: props.comprehendClassifierArn,
        LANGUAGE_CODE: props.languageCode,
      },
    });

    this.comprehendSyncPiiCallFunction.addToRolePolicy(new PolicyStatement(
      {
        actions: ['comprehend:DetectPiiEntities'],
        resources: [props.comprehendClassifierArn],
      }),
    );
    /** ################ INPUT BUCKET POLICIES */
    if (props.inputPolicyStatements === undefined) {
      if (props.s3InputBucket === undefined) {
        this.comprehendSyncPiiCallFunction.addToRolePolicy(
          new PolicyStatement({
            actions: ['s3:GetObject', 's3:ListBucket'],
            resources: ['*'],
          }),
        );
      } else {
        this.comprehendSyncPiiCallFunction.addToRolePolicy(
          new PolicyStatement({
            actions: ['s3:GetObject'],
            resources: [
              path.join(`arn:aws:s3:::${props.s3InputBucket}`, '/*'),
              path.join(`arn:aws:s3:::${props.s3InputBucket}`, s3InputPrefixValue, '/*'),
            ],
          }),
        );
        this.comprehendSyncPiiCallFunction.addToRolePolicy(
          new PolicyStatement({
            actions: ['s3:ListBucket'],
            resources: [
              path.join(`arn:aws:s3:::${props.s3InputBucket}`),
            ],
          }),
        );
      }
    } else {
      for (let policyStatement of props.inputPolicyStatements) {
        this.comprehendSyncPiiCallFunction.addToRolePolicy(policyStatement);
      }
    }
    /** ##################### OUTPUT BUCKET POLICIES */
    if (props.outputPolicyStatements === undefined) {
      if (props.s3OutputBucket === undefined) {
        this.comprehendSyncPiiCallFunction.addToRolePolicy(
          new PolicyStatement({
            actions: ['s3:PutObject'],
            resources: ['*'],
          }),
        );
      } else {
        this.comprehendSyncPiiCallFunction.addToRolePolicy(
          new PolicyStatement({
            actions: ['s3:PutObject'],
            resources: [
              path.join(`arn:aws:s3:::${props.s3OutputBucket}`, s3OutputPrefixValue, '/'),
              path.join(`arn:aws:s3:::${props.s3OutputBucket}`, s3OutputPrefixValue, '/*'),
            ],
          }),
        );
      }
    } else {
      for (let policyStatement of props.outputPolicyStatements) {
        this.comprehendSyncPiiCallFunction.addToRolePolicy(policyStatement);
      }
    }

    const comprehendInvoke = new LambdaInvoke(this, id, {
      lambdaFunction: this.comprehendSyncPiiCallFunction,
      timeout: Duration.seconds(900),
      outputPath: '$.Payload',
    });

    const workflow_chain = Chain.start(comprehendInvoke);

    this.stateMachine = new StateMachine(this, 'StateMachine', {
      definition: workflow_chain,
      timeout: Duration.hours(stateMachineTimeoutMinutes),
    });

    this.comprehendSyncPiiCallFunction.addToRolePolicy(new PolicyStatement({
      actions: [
        'states:SendTaskFailure', 'states:SendTaskSuccess',
      ],
      resources: ['*'],
    }));

    this.taskPolicies = this.createScopedAccessPolicy();
  }
  /**
     * @internal
     */
  protected _renderTask(): any {
    // suffix of ':2' indicates that the output of the nested state machine should be JSON
    // suffix is only applicable when waiting for a nested state machine to complete (RUN_JOB)
    // https://docs.aws.amazon.com/step-functions/latest/dg/connect-stepfunctions.html
    const suffix =
            this.integrationPattern === IntegrationPattern.RUN_JOB ? ':2' : '';
    let input: any;
    if (this.props.associateWithParent) {
      const associateWithParentEntry = {
        AWS_STEP_FUNCTIONS_STARTED_BY_EXECUTION_ID:
                    JsonPath.stringAt('$$.Execution.Id'),
      };
      input = this.props.input
        ? {
          ...this.props.input.value,
          ...associateWithParentEntry,
        }
        : associateWithParentEntry;
    } else {
      input = this.props.input
        ? this.props.input.value
        : TaskInput.fromJsonPathAt('$').value;
    }

    return {
      Resource: `${integrationResourceArn(
        'states',
        'startExecution',
        this.integrationPattern,
      )}${suffix}`,
      Parameters: FieldUtils.renderObject({
        Input: input,
        StateMachineArn: this.stateMachine.stateMachineArn,
        Name: this.props.name,
      }),
    };
  }
  /**
     * As StateMachineArn is extracted automatically from the state machine object included in the constructor,
     *
     * the scoped access policy should be generated accordingly.
     *
     * This means the action of StartExecution should be restricted on the given state machine, instead of being granted to all the resources (*).
     */
  private createScopedAccessPolicy(): PolicyStatement[] {
    const stack = Stack.of(this);

    const policyStatements = [
      new PolicyStatement({
        actions: ['states:StartExecution'],
        resources: [this.stateMachine.stateMachineArn],
      }),
    ];

    // Step Functions use Cloud Watch managed rules to deal with synchronous tasks.
    if (this.integrationPattern === IntegrationPattern.RUN_JOB) {
      policyStatements.push(
        new PolicyStatement({
          actions: ['states:DescribeExecution', 'states:StopExecution'],
          // https://docs.aws.amazon.com/step-functions/latest/dg/concept-create-iam-advanced.html#concept-create-iam-advanced-execution
          resources: [
            stack.formatArn({
              service: 'states',
              resource: 'execution',
              arnFormat: ArnFormat.COLON_RESOURCE_NAME,
              resourceName: `${
                stack.splitArn(
                  this.stateMachine.stateMachineArn,
                  ArnFormat.COLON_RESOURCE_NAME,
                ).resourceName
              }*`,
            }),
          ],
        }),
      );

      policyStatements.push(
        new PolicyStatement({
          actions: [
            'events:PutTargets',
            'events:PutRule',
            'events:DescribeRule',
          ],
          resources: [
            stack.formatArn({
              service: 'events',
              resource: 'rule',
              resourceName:
                                'StepFunctionsGetEventsForStepFunctionsExecutionRule',
            }),
          ],
        }),
      );
    }

    return policyStatements;
  }
}
