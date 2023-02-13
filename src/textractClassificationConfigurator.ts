import * as path from 'path';
import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';
import { TextractConfiguration } from './cfnCustomResourceConfiguratorPrefill';

export interface TextractClassificationConfiguratorProps {
  /** memory of Lambda function (may need to increase for larger documents) */
  readonly lambdaMemoryMB?:number;
  readonly lambdaTimeout?:number;
  readonly lambdaLogLevel?:string;
  readonly configurationTable?:dynamodb.ITable;
}

/**
 * Looks for a matching DOCYMENT_TYPE in the configurationTableName
 * and sets the CONFIG value (when found) to the context, so subsequent calls to
 * Textract use those values.
 *
 * This is an entry from the default config
 * AWS_PAYSTUBS,"{""queriesConfig"": [{""alias"": ""PAYSTUB_PERIOD_START_DATE"", ""text"": ""What is the Pay Period Start Date?""}, {""alias"": ""PAYSTUB_PERIOD_END_DATE"", ""text"": ""What is the Pay Period End Date?""}, {""alias"": ""PAYSTUB_PERIOD_PAY_DATE"", ""text"": ""What is the Pay Date?""}, {""alias"": ""PAYSTUB_PERIOD_EMPLOYEE_NAME"", ""text"": ""What is the Employee Name?""}, {""alias"": ""PAYSTUB_PERIOD_COMPANY_NAME"", ""text"": ""What is the company Name?""}, {""alias"": ""PAYSTUB_PERIOD_CURRENT_GROSS_PAY"", ""text"": ""What is the Current Gross Pay?""}, {""alias"": ""PAYSTUB_PERIOD_YTD_GROSS_PAY"", ""text"": ""What is the YTD Gross Pay?""}, {""alias"": ""PAYSTUB_PERIOD_REGULAR_HOURLY_RATE"", ""text"": ""What is the regular hourly rate?""}, {""alias"": ""PAYSTUB_PERIOD_HOLIDAY_RATE"", ""text"": ""What is the holiday rate?""}], ""textractFeatures"": [""QUERIES""]}"
 *
 * So, if the "classification"."documentType" in the Step Function Input is AWS_PAYSTUBS
 * then it will set the queriesConfig in the manifest for the subsequent Textract Calls in the Step Function flow
 *
 * Input: "classification"."documentType"
 * Output: config set to manifest
 *
 * Example (Python)
 * ```
    configurator_task = tcdk.TextractClassificationConfigurator(
        self, f"{workflow_name}-Configurator",
    )

 * ```
 */
export class TextractClassificationConfigurator extends sfn.StateMachineFragment {
  public readonly startState: sfn.State;
  public readonly endStates: sfn.INextable[];
  public configuratorFunction:lambda.IFunction;
  public configurationTable:dynamodb.ITable;
  public configurationTableName:string;

  constructor(parent: Construct, id: string, props: TextractClassificationConfiguratorProps) {
    super(parent, id);

    var lambdaMemoryMB= props.lambdaMemoryMB === undefined ? 1024 : props.lambdaMemoryMB;
    var lambdaTimeout= props.lambdaTimeout === undefined ? 900 : props.lambdaTimeout;
    var lambdaLogLevel= props.lambdaLogLevel === undefined ? 'DEBUG' : props.lambdaLogLevel;

    if (props.configurationTable === undefined) {
      this.configurationTable = new dynamodb.Table(this, 'TextractConfigurationTable', {
        partitionKey: {
          name: 'DOCUMENT_TYPE',
          type: dynamodb.AttributeType.STRING,
        },
        removalPolicy: RemovalPolicy.DESTROY,
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      });
      this.configurationTableName=this.configurationTable.tableName;
      const configurationInitFunction = new TextractConfiguration(this, 'DocTypeConfig', {
        configurationTableName: this.configurationTable.tableName,
        configurationTableArn: this.configurationTable.tableArn,
      });
      configurationInitFunction.node.addDependency(this.configurationTable);
    } else {
      this.configurationTable=props.configurationTable;
      this.configurationTableName=props.configurationTable.tableName;
    }

    this.configuratorFunction = new lambda.DockerImageFunction(this, 'ClassificationConfigurator', {
      code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../lambda/configurator/')),
      memorySize: lambdaMemoryMB,
      architecture: lambda.Architecture.X86_64,
      timeout: Duration.seconds(lambdaTimeout),
      environment: {
        CONFIGURATION_TABLE: this.configurationTable.tableName,
        LOG_LEVEL: lambdaLogLevel,
      },
    });
    this.configuratorFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: ['dynamodb:PutItem', 'dynamodb:GetItem'],
      resources: [this.configurationTable.tableArn],
    }));

    const configuratorLambdaInvoke = new tasks.LambdaInvoke(this, id, {
      lambdaFunction: this.configuratorFunction,
      timeout: Duration.seconds(100),
      outputPath: '$.Payload',
    });
    this.startState=configuratorLambdaInvoke;
    this.endStates=[configuratorLambdaInvoke];
  }
}
