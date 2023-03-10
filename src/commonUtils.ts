import { FieldUtils, InputType, IntegrationPattern } from 'aws-cdk-lib/aws-stepfunctions';

export const handleStepFunctionError = (
  integrationPattern: IntegrationPattern,
  input: { [key: string]: any } | undefined,
  associateWithParent: boolean | undefined,
) => {
  if (
    integrationPattern === IntegrationPattern.WAIT_FOR_TASK_TOKEN &&
            !FieldUtils.containsTaskToken(input)
  ) {
    throw new Error(
      'Task Token is required in `input` for callback. Use JsonPath.taskToken to set the token.',
    );
  }

  if (
    associateWithParent &&
            input &&
            input.type !== InputType.OBJECT
  ) {
    throw new Error(
      'Could not enable `associateWithParent` because `input` is taken directly from a JSON path. Use `TaskInput.fromObject` instead.',
    );
  }

};