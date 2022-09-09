import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
//import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as customResources from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';


export interface TextractConfigurationProps {
  readonly configuration_table:string;
}

/**
 * CloudFormation Custom Resources importing default configuration values from default_config.csv
 * into DynamoDB table.
 * Used by the Configuration Construct to configure Textrat features.
 * The DynamoDB table can be configured to your requirements.
 * The configuration has to match the manifest format.
 * Essentially the Configuration construct looks up the classification
 * and if a match is found in the DynamoDB table, configures the context
 * manifest object to include the configuration.
 *
 */
export class TextractConfiguration extends Construct {
  private configurationInit:lambda.IFunction;
  public response:string;

  constructor(scope: Construct, id: string, props: TextractConfigurationProps) {
    super(scope, id);

    this.configurationInit = new lambda.DockerImageFunction(this, id, {
      code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../lambda/cfn_custom_configurator_prefill/')),
      architecture: lambda.Architecture.X86_64,
      memorySize: 128,
      timeout: cdk.Duration.seconds(600),
      environment: {
        LOG_LEVEL: 'DEBUG',
        CONFIGURATION_TABLE: props.configuration_table,
      },
    });

    this.configurationInit.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['dynamodb:PutItem', 'dynamodb:GetItem'],
        resources: ['*'],
      }));

    const provider = new customResources.Provider(this, 'Provider', {
      onEventHandler: this.configurationInit,
    });

    const resource = new cdk.CustomResource(this, 'Resource', {
      serviceToken: provider.serviceToken,
      properties: props,
    });

    this.response = resource.getAtt('Response').toString();
  }
}

