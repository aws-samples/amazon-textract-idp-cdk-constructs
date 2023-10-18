import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { RDSAuroraServerless } from '../src';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

describe('AuroraServerless', () => {
  test('AuroraServerless', () => {
    new RDSAuroraServerless(stack, 'csvtoAurora', {
      vpc: new ec2.Vpc(stack, 'someid', {
        ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
        maxAzs: 2,
        subnetConfiguration: [{
          cidrMask: 26,
          name: 'isolatedSubnet',
          subnetType: ec2.SubnetType.PUBLIC,
        }, {
          cidrMask: 26,
          name: 'privateWithNat',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        }, {
          cidrMask: 26,
          name: 'private',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        }],
        natGateways: 1,
      }),
    });
    expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::RDS::DBCluster', 1);
    template.resourceCountIs('AWS::EC2::SecurityGroup', 2);
  });
});
