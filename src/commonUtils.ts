import { ArnFormat, Stack } from 'aws-cdk-lib';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { FieldUtils, InputType, IntegrationPattern, IStateMachine } from 'aws-cdk-lib/aws-stepfunctions';

export const handleStepFunctionError = (
  integrationPattern: IntegrationPattern,
  input: { [key: string]: any } | undefined,
  associateWithParent: boolean | undefined,
) => {
  if (integrationPattern === IntegrationPattern.WAIT_FOR_TASK_TOKEN && !FieldUtils.containsTaskToken(input)) {
    throw new Error(
      'Task Token is required in `input` for callback. Use JsonPath.taskToken to set the token.',
    );
  }

  if (associateWithParent && input && input.type !== InputType.OBJECT) {
    throw new Error(
      'Could not enable `associateWithParent` because `input` is taken directly from a JSON path. Use `TaskInput.fromObject` instead.',
    );
  }

};

/**
 * As StateMachineArn is extracted automatically from the state machine object included in the constructor,
 * the scoped access policy should be generated accordingly.
 * This means the action of StartExecution should be restricted on the given state machine, instead of being granted to all the resources (*).
 */
export const createScopedAccessPolicy = (stateMachine: IStateMachine, integrationPattern: IntegrationPattern, stack: Stack): PolicyStatement[] => {

  const policyStatements = [
    new PolicyStatement({
      actions: ['states:StartExecution'],
      resources: [stateMachine.stateMachineArn],
    }),
  ];

  // Step Functions use Cloud Watch managed rules to deal with synchronous tasks.
  if (integrationPattern === IntegrationPattern.RUN_JOB) {
    policyStatements.push(
      new PolicyStatement({
        actions: ['states:DescribeExecution', 'states:StopExecution'],
        // https://docs.aws.amazon.com/step-functions/latest/dg/concept-create-iam-advanced.html#concept-create-iam-advanced-execution
        resources: [
          stack.formatArn({
            service: 'states',
            resource: 'execution',
            arnFormat: ArnFormat.COLON_RESOURCE_NAME,
            resourceName: `${
              stack.splitArn(
                stateMachine.stateMachineArn,
                ArnFormat.COLON_RESOURCE_NAME,
              ).resourceName
            }*`,
          }),
        ],
      }),
    );

    policyStatements.push(
      new PolicyStatement({
        actions: [
          'events:PutTargets',
          'events:PutRule',
          'events:DescribeRule',
        ],
        resources: [
          stack.formatArn({
            service: 'events',
            resource: 'rule',
            resourceName: 'StepFunctionsGetEventsForStepFunctionsExecutionRule',
          }),
        ],
      }),
    );
  }

  return policyStatements;
};