import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { ComprehendPiiSyncSfnTask } from '../src';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

describe('ClassificationPiiTest', () => {
  test('ClassificationPiiTest', () => {
    new ComprehendPiiSyncSfnTask(stack, 'idp-pii-classification', {
      lambdaLogLevel: 'INFO',
      integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
      languageCode: 'en',
      comprehendClassifierArn: 'somearn',
    });

    expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::Lambda::Function', 1);
  });
});
