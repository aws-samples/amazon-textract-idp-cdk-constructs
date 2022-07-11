import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { TextractGenerateCSV } from '../src';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

describe('ClassificationTest', () => {
  test('ClassificationTest', () => {
    new TextractGenerateCSV(stack, 'idp-classification', {
      csvS3OutputBucket: 'somebucket',
      csvS3OutputPrefix: 'someprefix',
    });
    expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::Lambda::Function', 2);
  });
});
