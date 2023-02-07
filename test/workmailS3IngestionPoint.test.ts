import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { WorkmailS3IngestionPoint } from '../src';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

describe('IntegrationWorkmailTest', () => {
  test('Workmail Test', () => {
    new WorkmailS3IngestionPoint(stack, 'idp-classification', {
      s3OutputPrefix: 'sometempoutputprefix',
      workmailAccountNumber: 'someWorkmailAccountNumber',
      workmailRegion: 'us-east-1',
      s3OutputBucket: 'somebucket',
    });
    expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::Lambda::Function', 1);
  });
});
