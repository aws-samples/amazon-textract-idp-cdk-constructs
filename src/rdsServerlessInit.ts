import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as customResources from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';


export interface RdsServerlessInitProps {
  readonly dbClusterSecretARN:string;
  readonly dbClusterARN: string;
  // readonly securityGroups:[ISecurityGroup];
}

export class RdsServerlessInit extends Construct {
  private rdsServerlessInit:lambda.IFunction;
  public response:string;

  constructor(scope: Construct, id: string, props: RdsServerlessInitProps) {
    super(scope, id);

    this.rdsServerlessInit = new lambda.DockerImageFunction(this, id+'ServerlessInit', {
      code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../lambda/rds_serverless_init/')),
      memorySize: 128,
      architecture: lambda.Architecture.X86_64,
      timeout: cdk.Duration.seconds(600),
      // securityGroups: props.securityGroups,
      environment: {
        LOG_LEVEL: 'DEBUG',
        SECRET_ARN: props.dbClusterSecretARN,
        CLUSTER_ARN: props.dbClusterARN,
      },
    });

    this.rdsServerlessInit.role?.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonRDSDataFullAccess'));
    this.rdsServerlessInit.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'secretsmanager:GetSecretValue',
      ],
      resources: [props.dbClusterSecretARN],
    }));


    const provider = new customResources.Provider(this, 'Provider', {
      onEventHandler: this.rdsServerlessInit,
    });

    const resource = new cdk.CustomResource(this, 'Resource', {
      serviceToken: provider.serviceToken,
      properties: props,
    });

    this.response = resource.getAtt('Response').toString();
  }
}

