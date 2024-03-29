import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { TextractGenericSyncSfnTask } from '../src';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

describe('TextractSyncTest', () => {
  test('TextractSyncTest', () => {
    new TextractGenericSyncSfnTask(stack, 'idp-textract-sync-test', {
      integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
      s3OutputBucket: 'somebucket',
      s3OutputPrefix: 'someprefix',
    });
    expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::Lambda::Function', 1);
  });
});
