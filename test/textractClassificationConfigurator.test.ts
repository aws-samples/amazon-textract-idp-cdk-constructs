import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { TextractClassificationConfigurator } from '../src';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

describe('ClassificationTest', () => {
  test('ClassificationTest', () => {
    new TextractClassificationConfigurator(stack, 'textractConfiguration', {
    });
    expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::Lambda::Function', 3);
  });
});
