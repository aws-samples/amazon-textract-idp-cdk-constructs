import * as path from 'path';
import { Duration, Aws, ArnFormat, Stack } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda_ from 'aws-cdk-lib/aws-lambda';
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
export interface TextractGenerateCSVProps extends sfn.TaskStateBaseProps{
  readonly csvS3OutputBucket:string;
  readonly csvS3OutputPrefix:string;
  /** memory of Lambda function (may need to increase for larger documents) */
  readonly lambdaMemoryMB?:number;
  //TODO: make enum, supports CSV, LINES
  readonly outputType?:string;
  readonly lambdaTimeout?:number;
  readonly lambdaLogLevel?:string;
  /** Which Textract API output should be converted to a CSV?
   * GENERIC and AnalyzeID and LENDING are supported.
   * @default - GENERIC */
  readonly textractAPI?: 'GENERIC' | 'ANALYZEID' | 'LENDING';
  /** The generated CSV can have any meta-data from the manifest file included.
   * This is a list of all meta-data names to include
   * If they are missed they will be ""
   * MetaData keys have to be without ','
   */
  readonly metaDataToAppend?:Array<string>;
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
 * Generates a output based on Textract Forms and Queries.
 * Supported output_types: "LINES" | "CSV"
 *
 * Input: "Payload"."textract_result"."TextractOutputJsonPath"
 * Output: "TextractOutputCSVPath" TODO: rename
 *
 *
 * Output as LINES
 * Example (Python)
 * ```python
 *         generate_text = tcdk.TextractGenerateCSV(
            self,
            "GenerateText",
            csv_s3_output_bucket=document_bucket.bucket_name,
            csv_s3_output_prefix=s3_txt_output_prefix,
            output_type='LINES',
            lambda_log_level="DEBUG",
            integration_pattern=sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
            input=sfn.TaskInput.from_object({
                "Token":
                sfn.JsonPath.task_token,
                "ExecutionId":
                sfn.JsonPath.string_at('$$.Execution.Id'),
                "Payload":
                sfn.JsonPath.entire_payload,
            }),
            result_path="$.txt_output_location")
   ```
 */
export class TextractGenerateCSV extends sfn.TaskStateBase {
  private static readonly SUPPORTED_INTEGRATION_PATTERNS = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.RUN_JOB,
    sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
  ];
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private readonly integrationPattern : sfn.IntegrationPattern;
  stateMachine : sfn.StateMachine;

  public readonly generateCSVLogGroup: ILogGroup;
  public readonly generateCSVLambda: lambda_.IFunction;

  constructor(scope : Construct, id : string, private readonly props : TextractGenerateCSVProps) {
    super(scope, id, props);

    this.integrationPattern = props.integrationPattern || sfn.IntegrationPattern.REQUEST_RESPONSE;
    validatePatternSupported(this.integrationPattern, TextractGenerateCSV.SUPPORTED_INTEGRATION_PATTERNS);

    if (this.integrationPattern === sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN && !sfn.FieldUtils.containsTaskToken(props.input)) {
      throw new Error('Task Token is required in `input` for callback. Use JsonPath.taskToken to set the token.');
    }

    if (this.props.associateWithParent && props.input && props.input.type !== sfn.InputType.OBJECT) {
      throw new Error('Could not enable `associateWithParent` because `input` is taken directly from a JSON path. Use `sfn.TaskInput.fromObject` instead.');
    }
    var lambdaLogLevel = props.lambdaLogLevel === undefined ? 'DEBUG' : props.lambdaLogLevel;
    var lambdaTimeout = props.lambdaTimeout === undefined ? 300 : props.lambdaTimeout;
    var lambdaMemoryMB = props.lambdaMemoryMB === undefined ? 1048 : props.lambdaMemoryMB;
    var textractAPI = props.textractAPI === undefined ? 'GENERIC' : props.textractAPI;
    var outputType= props.outputType === undefined ? 'CSV' : props.outputType;
    var metaDataToAppend= props.metaDataToAppend === undefined ? '' : props.metaDataToAppend;

    const csvGeneratorFunction = new lambda_.DockerImageFunction(this, 'TextractCSVGenerator', {
      code: lambda_.DockerImageCode.fromImageAsset(path.join(__dirname, '../lambda/generatecsv/')),
      memorySize: lambdaMemoryMB,
      architecture: lambda_.Architecture.X86_64,
      timeout: Duration.seconds(lambdaTimeout),
      environment: {
        CSV_S3_OUTPUT_BUCKET: props.csvS3OutputBucket,
        CSV_S3_OUTPUT_PREFIX: props.csvS3OutputPrefix,
        LOG_LEVEL: lambdaLogLevel,
        OUTPUT_TYPE: outputType,
        TEXTRACT_API: textractAPI,
        META_DATA_TO_APPEND: metaDataToAppend?.toString(),
      },
    });
    csvGeneratorFunction.addToRolePolicy(new iam.PolicyStatement({ actions: ['s3:PutObject', 's3:Get*', 's3:List*'], resources: ['*'] }));
    csvGeneratorFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'states:SendTaskSuccess', 'states:SendTaskFailure',
      ],
      resources: ['*'],
    }));
    this.generateCSVLambda = csvGeneratorFunction;
    this.generateCSVLogGroup = csvGeneratorFunction.logGroup;


    const csvGeneratorLambdaInvoke = new tasks.LambdaInvoke(this, 'csvGeneratorInvoke', {
      lambdaFunction: csvGeneratorFunction,
    });

    csvGeneratorLambdaInvoke.addCatch(new sfn.Fail(this, 'csvGenerationFailure'), {
      errors: [sfn.Errors.ALL],
    });
    const workflow_chain = sfn.Chain.start(csvGeneratorLambdaInvoke);

    this.stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definition: workflow_chain,
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
