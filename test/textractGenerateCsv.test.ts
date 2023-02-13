import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { TextractGenerateCSV } from '../src';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

describe('GenerateCSVTest', () => {
  test('GenerateCSVTest', () => {
    new TextractGenerateCSV(stack, 'idp-generate-csv', {
      csvS3OutputBucket: 'somebucket',
      csvS3OutputPrefix: 'someprefix',
    });
    expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::Lambda::Function', 1);
  });
});
