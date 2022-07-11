import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { TextractAsyncToJSON } from '../src';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

describe('ClassificationTest', () => {
  test('ClassificationTest', () => {
    new TextractAsyncToJSON(stack, 'idp-classification', {
      s3OutputBucket: 'somebucket',
      s3OutputPrefix: 'someprefix',
    });
    expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::Lambda::Function', 1);
  });
});
