import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { TextractA2ISfnTask } from '../src/textractA2I';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

describe('A2ITest', () => {
  test('A2ITest', () => {
    new TextractA2ISfnTask(stack, 'idp-a2i', {
      integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
      a2iFlowDefinitionARN: 'somearn',

    });
    expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::Lambda::Function', 2);
  });
});
