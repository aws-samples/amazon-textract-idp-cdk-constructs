import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { TextractClassificationConfigurator } from '../src';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

describe('ClassificationTest', () => {
  test('ClassificationTest', () => {
    new TextractClassificationConfigurator(stack, 'textractConfiguration', {
      configurationTable: new dynamodb.Table(stack, 'TextractConfigurationTable', {
        partitionKey: {
          name: 'DOCUMENT_TYPE',
          type: dynamodb.AttributeType.STRING,
        },
      }),
    });
    expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::Lambda::Function', 2);
  });
});
