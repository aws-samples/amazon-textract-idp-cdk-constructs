import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { ComprehendGenericSyncSfnTask } from '../src';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

describe('ClassificationTest', () => {
  test('ClassificationTest', () => {
    new ComprehendGenericSyncSfnTask(stack, 'idp-classification', {
      integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
      comprehendClassifierArn: 'somearn',
    });
    expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::Lambda::Function', 1);
  });
});
