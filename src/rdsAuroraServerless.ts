//import * as ec2 from 'aws-cdk-lib/aws-ec2';
//import { ISecurityGroup, IVpc } from 'aws-cdk-lib/aws-ec2';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';
import { RdsServerlessInit } from './rdsServerlessInit';

export interface RDSAuroraServerlessProps {
  /** VPC to install the database into */
  readonly vpc: ec2.IVpc;
}
export class RDSAuroraServerless extends Construct {

  public dbCluster: rds.IServerlessCluster;
  public auroraSecurityGroup: ec2.ISecurityGroup;
  public lambdaSecurityGroup: ec2.ISecurityGroup;

  constructor(scope: Construct, id: string, readonly props: RDSAuroraServerlessProps) {
    super(scope, id);

    this.lambdaSecurityGroup = new ec2.SecurityGroup(this, 'LambdaSG', { allowAllOutbound: true, vpc: props.vpc });
    this.auroraSecurityGroup = new ec2.SecurityGroup(this, 'Aurora', { allowAllOutbound: true, vpc: props.vpc });
    this.auroraSecurityGroup.addIngressRule(this.auroraSecurityGroup, ec2.Port.tcp(5432), 'fromSameSG');
    this.auroraSecurityGroup.addIngressRule(this.auroraSecurityGroup, ec2.Port.tcp(443), 'fromSameSG');
    this.auroraSecurityGroup.addIngressRule(this.lambdaSecurityGroup, ec2.Port.tcp(5432), 'LambdaIngreess');
    this.auroraSecurityGroup.addIngressRule(this.lambdaSecurityGroup, ec2.Port.tcp(443), 'LambdaIngreess');

    // AURORA
    this.dbCluster = new rds.ServerlessCluster(this, id + 'AuroraPSQL', {
      engine: rds.DatabaseClusterEngine.AURORA_POSTGRESQL,
      parameterGroup: rds.ParameterGroup.fromParameterGroupName(this, 'ParameterGroup', 'default.aurora-postgresql10'),
      vpc: props.vpc,
      securityGroups: [this.auroraSecurityGroup],
      enableDataApi: true,
    });

    const rdsServerlessInit = new RdsServerlessInit(this, 'RdsServerlessInit', {
      dbClusterSecretARN: (<rds.ServerlessCluster> this.dbCluster).secret!.secretArn,
      dbClusterARN: (<rds.ServerlessCluster> this.dbCluster).clusterArn,
    });
    rdsServerlessInit.node.addDependency(this.dbCluster);
  }
}
