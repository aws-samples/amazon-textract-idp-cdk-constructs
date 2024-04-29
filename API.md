# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### ComprehendGenericSyncSfnTask <a name="ComprehendGenericSyncSfnTask" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask"></a>

Calls a Comprehend Classification endpoint and parses the result, filters on > 50 % confidence and sets the highest confidence score classification.

Input: "textract_result"."txt_output_location"
Output:  { "documentType": "AWS_PAYSTUBS" } (example will be at "classification"."documentType")

Example (Python)
```python
 comprehend_sync_task = tcdk.ComprehendGenericSyncSfnTask(
     self,
     "Classification",
     comprehend_classifier_arn=
     '<your comprehend classifier arn>',
     integration_pattern=sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
     lambda_log_level="DEBUG",
     timeout=Duration.hours(24),
     input=sfn.TaskInput.from_object({
         "Token":
         sfn.JsonPath.task_token,
         "ExecutionId":
         sfn.JsonPath.string_at('$$.Execution.Id'),
         "Payload":
         sfn.JsonPath.entire_payload,
     }),
     result_path="$.classification")
 ```

#### Initializers <a name="Initializers" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.Initializer"></a>

```typescript
import { ComprehendGenericSyncSfnTask } from 'amazon-textract-idp-cdk-constructs'

new ComprehendGenericSyncSfnTask(scope: Construct, id: string, props: ComprehendGenericSyncSfnTaskProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.Initializer.parameter.id">id</a></code> | <code>string</code> | Descriptive identifier for this chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.Initializer.parameter.props">props</a></code> | <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps">ComprehendGenericSyncSfnTaskProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.Initializer.parameter.id"></a>

- *Type:* string

Descriptive identifier for this chainable.

---

##### `props`<sup>Required</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.Initializer.parameter.props"></a>

- *Type:* <a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps">ComprehendGenericSyncSfnTaskProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.addPrefix">addPrefix</a></code> | Add a prefix to the stateId of this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.bindToGraph">bindToGraph</a></code> | Register this state as part of the given graph. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.toStateJson">toStateJson</a></code> | Return the Amazon States Language object for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.addCatch">addCatch</a></code> | Add a recovery handler for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.addRetry">addRetry</a></code> | Add retry configuration for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metric">metric</a></code> | Return the given named metric for this Task. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metricFailed">metricFailed</a></code> | Metric for the number of times this activity fails. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metricHeartbeatTimedOut">metricHeartbeatTimedOut</a></code> | Metric for the number of times the heartbeat times out for this activity. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metricRunTime">metricRunTime</a></code> | The interval, in milliseconds, between the time the Task starts and the time it closes. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metricScheduled">metricScheduled</a></code> | Metric for the number of times this activity is scheduled. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metricScheduleTime">metricScheduleTime</a></code> | The interval, in milliseconds, for which the activity stays in the schedule state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metricStarted">metricStarted</a></code> | Metric for the number of times this activity is started. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metricSucceeded">metricSucceeded</a></code> | Metric for the number of times this activity succeeds. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metricTime">metricTime</a></code> | The interval, in milliseconds, between the time the activity is scheduled and the time it closes. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metricTimedOut">metricTimedOut</a></code> | Metric for the number of times this activity times out. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.next">next</a></code> | Continue normal execution with the given state. |

---

##### `toString` <a name="toString" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addPrefix` <a name="addPrefix" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.addPrefix"></a>

```typescript
public addPrefix(x: string): void
```

Add a prefix to the stateId of this state.

###### `x`<sup>Required</sup> <a name="x" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.addPrefix.parameter.x"></a>

- *Type:* string

---

##### `bindToGraph` <a name="bindToGraph" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.bindToGraph"></a>

```typescript
public bindToGraph(graph: StateGraph): void
```

Register this state as part of the given graph.

Don't call this. It will be called automatically when you work
with states normally.

###### `graph`<sup>Required</sup> <a name="graph" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.bindToGraph.parameter.graph"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.StateGraph

---

##### `toStateJson` <a name="toStateJson" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.toStateJson"></a>

```typescript
public toStateJson(): object
```

Return the Amazon States Language object for this state.

##### `addCatch` <a name="addCatch" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.addCatch"></a>

```typescript
public addCatch(handler: IChainable, props?: CatchProps): TaskStateBase
```

Add a recovery handler for this state.

When a particular error occurs, execution will continue at the error
handler instead of failing the state machine execution.

###### `handler`<sup>Required</sup> <a name="handler" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.addCatch.parameter.handler"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.IChainable

---

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.addCatch.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.CatchProps

---

##### `addRetry` <a name="addRetry" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.addRetry"></a>

```typescript
public addRetry(props?: RetryProps): TaskStateBase
```

Add retry configuration for this state.

This controls if and how the execution will be retried if a particular
error occurs.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.addRetry.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.RetryProps

---

##### `metric` <a name="metric" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metric"></a>

```typescript
public metric(metricName: string, props?: MetricOptions): Metric
```

Return the given named metric for this Task.

###### `metricName`<sup>Required</sup> <a name="metricName" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metric.parameter.metricName"></a>

- *Type:* string

---

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metric.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricFailed` <a name="metricFailed" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metricFailed"></a>

```typescript
public metricFailed(props?: MetricOptions): Metric
```

Metric for the number of times this activity fails.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metricFailed.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricHeartbeatTimedOut` <a name="metricHeartbeatTimedOut" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metricHeartbeatTimedOut"></a>

```typescript
public metricHeartbeatTimedOut(props?: MetricOptions): Metric
```

Metric for the number of times the heartbeat times out for this activity.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metricHeartbeatTimedOut.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricRunTime` <a name="metricRunTime" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metricRunTime"></a>

```typescript
public metricRunTime(props?: MetricOptions): Metric
```

The interval, in milliseconds, between the time the Task starts and the time it closes.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metricRunTime.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricScheduled` <a name="metricScheduled" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metricScheduled"></a>

```typescript
public metricScheduled(props?: MetricOptions): Metric
```

Metric for the number of times this activity is scheduled.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metricScheduled.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricScheduleTime` <a name="metricScheduleTime" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metricScheduleTime"></a>

```typescript
public metricScheduleTime(props?: MetricOptions): Metric
```

The interval, in milliseconds, for which the activity stays in the schedule state.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metricScheduleTime.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricStarted` <a name="metricStarted" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metricStarted"></a>

```typescript
public metricStarted(props?: MetricOptions): Metric
```

Metric for the number of times this activity is started.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metricStarted.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricSucceeded` <a name="metricSucceeded" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metricSucceeded"></a>

```typescript
public metricSucceeded(props?: MetricOptions): Metric
```

Metric for the number of times this activity succeeds.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metricSucceeded.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricTime` <a name="metricTime" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metricTime"></a>

```typescript
public metricTime(props?: MetricOptions): Metric
```

The interval, in milliseconds, between the time the activity is scheduled and the time it closes.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metricTime.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricTimedOut` <a name="metricTimedOut" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metricTimedOut"></a>

```typescript
public metricTimedOut(props?: MetricOptions): Metric
```

Metric for the number of times this activity times out.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.metricTimedOut.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `next` <a name="next" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.next"></a>

```typescript
public next(next: IChainable): Chain
```

Continue normal execution with the given state.

###### `next`<sup>Required</sup> <a name="next" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.next.parameter.next"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.IChainable

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.filterNextables">filterNextables</a></code> | Return only the states that allow chaining from an array of states. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.findReachableEndStates">findReachableEndStates</a></code> | Find the set of end states states reachable through transitions from the given start state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.findReachableStates">findReachableStates</a></code> | Find the set of states reachable through transitions from the given start state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.prefixStates">prefixStates</a></code> | Add a prefix to the stateId of all States found in a construct tree. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.isConstruct"></a>

```typescript
import { ComprehendGenericSyncSfnTask } from 'amazon-textract-idp-cdk-constructs'

ComprehendGenericSyncSfnTask.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `filterNextables` <a name="filterNextables" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.filterNextables"></a>

```typescript
import { ComprehendGenericSyncSfnTask } from 'amazon-textract-idp-cdk-constructs'

ComprehendGenericSyncSfnTask.filterNextables(states: State[])
```

Return only the states that allow chaining from an array of states.

###### `states`<sup>Required</sup> <a name="states" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.filterNextables.parameter.states"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.State[]

---

##### `findReachableEndStates` <a name="findReachableEndStates" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.findReachableEndStates"></a>

```typescript
import { ComprehendGenericSyncSfnTask } from 'amazon-textract-idp-cdk-constructs'

ComprehendGenericSyncSfnTask.findReachableEndStates(start: State, options?: FindStateOptions)
```

Find the set of end states states reachable through transitions from the given start state.

###### `start`<sup>Required</sup> <a name="start" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.findReachableEndStates.parameter.start"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.State

---

###### `options`<sup>Optional</sup> <a name="options" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.findReachableEndStates.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.FindStateOptions

---

##### `findReachableStates` <a name="findReachableStates" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.findReachableStates"></a>

```typescript
import { ComprehendGenericSyncSfnTask } from 'amazon-textract-idp-cdk-constructs'

ComprehendGenericSyncSfnTask.findReachableStates(start: State, options?: FindStateOptions)
```

Find the set of states reachable through transitions from the given start state.

This does not retrieve states from within sub-graphs, such as states within a Parallel state's branch.

###### `start`<sup>Required</sup> <a name="start" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.findReachableStates.parameter.start"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.State

---

###### `options`<sup>Optional</sup> <a name="options" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.findReachableStates.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.FindStateOptions

---

##### `prefixStates` <a name="prefixStates" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.prefixStates"></a>

```typescript
import { ComprehendGenericSyncSfnTask } from 'amazon-textract-idp-cdk-constructs'

ComprehendGenericSyncSfnTask.prefixStates(root: IConstruct, prefix: string)
```

Add a prefix to the stateId of all States found in a construct tree.

###### `root`<sup>Required</sup> <a name="root" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.prefixStates.parameter.root"></a>

- *Type:* constructs.IConstruct

---

###### `prefix`<sup>Required</sup> <a name="prefix" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.prefixStates.parameter.prefix"></a>

- *Type:* string

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.property.endStates">endStates</a></code> | <code>aws-cdk-lib.aws_stepfunctions.INextable[]</code> | Continuable states of this Chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.property.id">id</a></code> | <code>string</code> | Descriptive identifier for this chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.property.startState">startState</a></code> | <code>aws-cdk-lib.aws_stepfunctions.State</code> | First state of this Chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.property.stateId">stateId</a></code> | <code>string</code> | Tokenized string that evaluates to the state's ID. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.property.comprehendSyncCallFunction">comprehendSyncCallFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.property.stateMachine">stateMachine</a></code> | <code>aws-cdk-lib.aws_stepfunctions.IStateMachine</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.property.version">version</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `endStates`<sup>Required</sup> <a name="endStates" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.property.endStates"></a>

```typescript
public readonly endStates: INextable[];
```

- *Type:* aws-cdk-lib.aws_stepfunctions.INextable[]

Continuable states of this Chainable.

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

Descriptive identifier for this chainable.

---

##### `startState`<sup>Required</sup> <a name="startState" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.property.startState"></a>

```typescript
public readonly startState: State;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.State

First state of this Chainable.

---

##### `stateId`<sup>Required</sup> <a name="stateId" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.property.stateId"></a>

```typescript
public readonly stateId: string;
```

- *Type:* string

Tokenized string that evaluates to the state's ID.

---

##### `comprehendSyncCallFunction`<sup>Required</sup> <a name="comprehendSyncCallFunction" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.property.comprehendSyncCallFunction"></a>

```typescript
public readonly comprehendSyncCallFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `stateMachine`<sup>Required</sup> <a name="stateMachine" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.property.stateMachine"></a>

```typescript
public readonly stateMachine: IStateMachine;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.IStateMachine

---

##### `version`<sup>Required</sup> <a name="version" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTask.property.version"></a>

```typescript
public readonly version: string;
```

- *Type:* string

---


### CSVToAuroraTask <a name="CSVToAuroraTask" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask"></a>

CSVToAuroraTask is a demo construct to show import into a serverless Aurora DB.

At the moment it also creates the Aurora Serverless RDS DB, initializes a table structure the matches the output of the GenerateCSV construct.
The Step Functions flow expect a pointer to a CSV at "csv_output_location"."TextractOutputCSVPath" and uses that to execute a batch insert statement command.

Example:
```python
csv_to_aurora_task = tcdk.CSVToAuroraTask(
 self,
 "CsvToAurora",
 vpc=vpc,
 integration_pattern=sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
 lambda_log_level="DEBUG",
 timeout=Duration.hours(24),
 input=sfn.TaskInput.from_object({
   "Token":
   sfn.JsonPath.task_token,
   "ExecutionId":
   sfn.JsonPath.string_at('$$.Execution.Id'),
   "Payload":
   sfn.JsonPath.entire_payload
 }),
 result_path="$.textract_result")
```

Input: "csv_output_location"."TextractOutputCSVPath"
Output: CSV in Aurora Serverless DB, table name 'textractcsvimport"

#### Initializers <a name="Initializers" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.Initializer"></a>

```typescript
import { CSVToAuroraTask } from 'amazon-textract-idp-cdk-constructs'

new CSVToAuroraTask(scope: Construct, id: string, props: CSVToAuroraTaskProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.Initializer.parameter.id">id</a></code> | <code>string</code> | Descriptive identifier for this chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.Initializer.parameter.props">props</a></code> | <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps">CSVToAuroraTaskProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.Initializer.parameter.id"></a>

- *Type:* string

Descriptive identifier for this chainable.

---

##### `props`<sup>Required</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.Initializer.parameter.props"></a>

- *Type:* <a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps">CSVToAuroraTaskProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.addPrefix">addPrefix</a></code> | Add a prefix to the stateId of this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.bindToGraph">bindToGraph</a></code> | Register this state as part of the given graph. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.toStateJson">toStateJson</a></code> | Return the Amazon States Language object for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.addCatch">addCatch</a></code> | Add a recovery handler for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.addRetry">addRetry</a></code> | Add retry configuration for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metric">metric</a></code> | Return the given named metric for this Task. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metricFailed">metricFailed</a></code> | Metric for the number of times this activity fails. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metricHeartbeatTimedOut">metricHeartbeatTimedOut</a></code> | Metric for the number of times the heartbeat times out for this activity. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metricRunTime">metricRunTime</a></code> | The interval, in milliseconds, between the time the Task starts and the time it closes. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metricScheduled">metricScheduled</a></code> | Metric for the number of times this activity is scheduled. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metricScheduleTime">metricScheduleTime</a></code> | The interval, in milliseconds, for which the activity stays in the schedule state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metricStarted">metricStarted</a></code> | Metric for the number of times this activity is started. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metricSucceeded">metricSucceeded</a></code> | Metric for the number of times this activity succeeds. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metricTime">metricTime</a></code> | The interval, in milliseconds, between the time the activity is scheduled and the time it closes. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metricTimedOut">metricTimedOut</a></code> | Metric for the number of times this activity times out. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.next">next</a></code> | Continue normal execution with the given state. |

---

##### `toString` <a name="toString" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addPrefix` <a name="addPrefix" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.addPrefix"></a>

```typescript
public addPrefix(x: string): void
```

Add a prefix to the stateId of this state.

###### `x`<sup>Required</sup> <a name="x" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.addPrefix.parameter.x"></a>

- *Type:* string

---

##### `bindToGraph` <a name="bindToGraph" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.bindToGraph"></a>

```typescript
public bindToGraph(graph: StateGraph): void
```

Register this state as part of the given graph.

Don't call this. It will be called automatically when you work
with states normally.

###### `graph`<sup>Required</sup> <a name="graph" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.bindToGraph.parameter.graph"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.StateGraph

---

##### `toStateJson` <a name="toStateJson" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.toStateJson"></a>

```typescript
public toStateJson(): object
```

Return the Amazon States Language object for this state.

##### `addCatch` <a name="addCatch" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.addCatch"></a>

```typescript
public addCatch(handler: IChainable, props?: CatchProps): TaskStateBase
```

Add a recovery handler for this state.

When a particular error occurs, execution will continue at the error
handler instead of failing the state machine execution.

###### `handler`<sup>Required</sup> <a name="handler" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.addCatch.parameter.handler"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.IChainable

---

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.addCatch.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.CatchProps

---

##### `addRetry` <a name="addRetry" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.addRetry"></a>

```typescript
public addRetry(props?: RetryProps): TaskStateBase
```

Add retry configuration for this state.

This controls if and how the execution will be retried if a particular
error occurs.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.addRetry.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.RetryProps

---

##### `metric` <a name="metric" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metric"></a>

```typescript
public metric(metricName: string, props?: MetricOptions): Metric
```

Return the given named metric for this Task.

###### `metricName`<sup>Required</sup> <a name="metricName" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metric.parameter.metricName"></a>

- *Type:* string

---

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metric.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricFailed` <a name="metricFailed" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metricFailed"></a>

```typescript
public metricFailed(props?: MetricOptions): Metric
```

Metric for the number of times this activity fails.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metricFailed.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricHeartbeatTimedOut` <a name="metricHeartbeatTimedOut" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metricHeartbeatTimedOut"></a>

```typescript
public metricHeartbeatTimedOut(props?: MetricOptions): Metric
```

Metric for the number of times the heartbeat times out for this activity.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metricHeartbeatTimedOut.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricRunTime` <a name="metricRunTime" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metricRunTime"></a>

```typescript
public metricRunTime(props?: MetricOptions): Metric
```

The interval, in milliseconds, between the time the Task starts and the time it closes.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metricRunTime.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricScheduled` <a name="metricScheduled" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metricScheduled"></a>

```typescript
public metricScheduled(props?: MetricOptions): Metric
```

Metric for the number of times this activity is scheduled.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metricScheduled.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricScheduleTime` <a name="metricScheduleTime" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metricScheduleTime"></a>

```typescript
public metricScheduleTime(props?: MetricOptions): Metric
```

The interval, in milliseconds, for which the activity stays in the schedule state.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metricScheduleTime.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricStarted` <a name="metricStarted" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metricStarted"></a>

```typescript
public metricStarted(props?: MetricOptions): Metric
```

Metric for the number of times this activity is started.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metricStarted.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricSucceeded` <a name="metricSucceeded" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metricSucceeded"></a>

```typescript
public metricSucceeded(props?: MetricOptions): Metric
```

Metric for the number of times this activity succeeds.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metricSucceeded.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricTime` <a name="metricTime" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metricTime"></a>

```typescript
public metricTime(props?: MetricOptions): Metric
```

The interval, in milliseconds, between the time the activity is scheduled and the time it closes.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metricTime.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricTimedOut` <a name="metricTimedOut" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metricTimedOut"></a>

```typescript
public metricTimedOut(props?: MetricOptions): Metric
```

Metric for the number of times this activity times out.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.metricTimedOut.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `next` <a name="next" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.next"></a>

```typescript
public next(next: IChainable): Chain
```

Continue normal execution with the given state.

###### `next`<sup>Required</sup> <a name="next" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.next.parameter.next"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.IChainable

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.filterNextables">filterNextables</a></code> | Return only the states that allow chaining from an array of states. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.findReachableEndStates">findReachableEndStates</a></code> | Find the set of end states states reachable through transitions from the given start state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.findReachableStates">findReachableStates</a></code> | Find the set of states reachable through transitions from the given start state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.prefixStates">prefixStates</a></code> | Add a prefix to the stateId of all States found in a construct tree. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.isConstruct"></a>

```typescript
import { CSVToAuroraTask } from 'amazon-textract-idp-cdk-constructs'

CSVToAuroraTask.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `filterNextables` <a name="filterNextables" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.filterNextables"></a>

```typescript
import { CSVToAuroraTask } from 'amazon-textract-idp-cdk-constructs'

CSVToAuroraTask.filterNextables(states: State[])
```

Return only the states that allow chaining from an array of states.

###### `states`<sup>Required</sup> <a name="states" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.filterNextables.parameter.states"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.State[]

---

##### `findReachableEndStates` <a name="findReachableEndStates" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.findReachableEndStates"></a>

```typescript
import { CSVToAuroraTask } from 'amazon-textract-idp-cdk-constructs'

CSVToAuroraTask.findReachableEndStates(start: State, options?: FindStateOptions)
```

Find the set of end states states reachable through transitions from the given start state.

###### `start`<sup>Required</sup> <a name="start" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.findReachableEndStates.parameter.start"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.State

---

###### `options`<sup>Optional</sup> <a name="options" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.findReachableEndStates.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.FindStateOptions

---

##### `findReachableStates` <a name="findReachableStates" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.findReachableStates"></a>

```typescript
import { CSVToAuroraTask } from 'amazon-textract-idp-cdk-constructs'

CSVToAuroraTask.findReachableStates(start: State, options?: FindStateOptions)
```

Find the set of states reachable through transitions from the given start state.

This does not retrieve states from within sub-graphs, such as states within a Parallel state's branch.

###### `start`<sup>Required</sup> <a name="start" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.findReachableStates.parameter.start"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.State

---

###### `options`<sup>Optional</sup> <a name="options" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.findReachableStates.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.FindStateOptions

---

##### `prefixStates` <a name="prefixStates" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.prefixStates"></a>

```typescript
import { CSVToAuroraTask } from 'amazon-textract-idp-cdk-constructs'

CSVToAuroraTask.prefixStates(root: IConstruct, prefix: string)
```

Add a prefix to the stateId of all States found in a construct tree.

###### `root`<sup>Required</sup> <a name="root" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.prefixStates.parameter.root"></a>

- *Type:* constructs.IConstruct

---

###### `prefix`<sup>Required</sup> <a name="prefix" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.prefixStates.parameter.prefix"></a>

- *Type:* string

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.property.endStates">endStates</a></code> | <code>aws-cdk-lib.aws_stepfunctions.INextable[]</code> | Continuable states of this Chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.property.id">id</a></code> | <code>string</code> | Descriptive identifier for this chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.property.startState">startState</a></code> | <code>aws-cdk-lib.aws_stepfunctions.State</code> | First state of this Chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.property.stateId">stateId</a></code> | <code>string</code> | Tokenized string that evaluates to the state's ID. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.property.auroraSecurityGroup">auroraSecurityGroup</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.property.csvToAuroraFunction">csvToAuroraFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.property.dbCluster">dbCluster</a></code> | <code>aws-cdk-lib.aws_rds.IServerlessCluster</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.property.lambdaSecurityGroup">lambdaSecurityGroup</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.property.stateMachine">stateMachine</a></code> | <code>aws-cdk-lib.aws_stepfunctions.IStateMachine</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.property.version">version</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTask.property.csvToAuroraNumberRowsInsertedMetric">csvToAuroraNumberRowsInsertedMetric</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IMetric</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `endStates`<sup>Required</sup> <a name="endStates" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.property.endStates"></a>

```typescript
public readonly endStates: INextable[];
```

- *Type:* aws-cdk-lib.aws_stepfunctions.INextable[]

Continuable states of this Chainable.

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

Descriptive identifier for this chainable.

---

##### `startState`<sup>Required</sup> <a name="startState" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.property.startState"></a>

```typescript
public readonly startState: State;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.State

First state of this Chainable.

---

##### `stateId`<sup>Required</sup> <a name="stateId" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.property.stateId"></a>

```typescript
public readonly stateId: string;
```

- *Type:* string

Tokenized string that evaluates to the state's ID.

---

##### `auroraSecurityGroup`<sup>Required</sup> <a name="auroraSecurityGroup" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.property.auroraSecurityGroup"></a>

```typescript
public readonly auroraSecurityGroup: ISecurityGroup;
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup

---

##### `csvToAuroraFunction`<sup>Required</sup> <a name="csvToAuroraFunction" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.property.csvToAuroraFunction"></a>

```typescript
public readonly csvToAuroraFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `dbCluster`<sup>Required</sup> <a name="dbCluster" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.property.dbCluster"></a>

```typescript
public readonly dbCluster: IServerlessCluster;
```

- *Type:* aws-cdk-lib.aws_rds.IServerlessCluster

---

##### `lambdaSecurityGroup`<sup>Required</sup> <a name="lambdaSecurityGroup" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.property.lambdaSecurityGroup"></a>

```typescript
public readonly lambdaSecurityGroup: ISecurityGroup;
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup

---

##### `stateMachine`<sup>Required</sup> <a name="stateMachine" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.property.stateMachine"></a>

```typescript
public readonly stateMachine: IStateMachine;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.IStateMachine

---

##### `version`<sup>Required</sup> <a name="version" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.property.version"></a>

```typescript
public readonly version: string;
```

- *Type:* string

---

##### `csvToAuroraNumberRowsInsertedMetric`<sup>Optional</sup> <a name="csvToAuroraNumberRowsInsertedMetric" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTask.property.csvToAuroraNumberRowsInsertedMetric"></a>

```typescript
public readonly csvToAuroraNumberRowsInsertedMetric: IMetric;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IMetric

---


### DocumentSplitter <a name="DocumentSplitter" id="amazon-textract-idp-cdk-constructs.DocumentSplitter"></a>

This construct takes in a manifest definition with just the s3Path:.

example s3Path:
{"s3Path": "s3://bucketname/prefix/image.png"}


then it generated single page versions of the multi-page file.
For PDF the output are single PDF files, for TIFF the output are single TIFF files.

Example (Python)
```python
```

#### Initializers <a name="Initializers" id="amazon-textract-idp-cdk-constructs.DocumentSplitter.Initializer"></a>

```typescript
import { DocumentSplitter } from 'amazon-textract-idp-cdk-constructs'

new DocumentSplitter(parent: Construct, id: string, props: DocumentSplitterProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.DocumentSplitter.Initializer.parameter.parent">parent</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.DocumentSplitter.Initializer.parameter.id">id</a></code> | <code>string</code> | Descriptive identifier for this chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.DocumentSplitter.Initializer.parameter.props">props</a></code> | <code><a href="#amazon-textract-idp-cdk-constructs.DocumentSplitterProps">DocumentSplitterProps</a></code> | *No description.* |

---

##### `parent`<sup>Required</sup> <a name="parent" id="amazon-textract-idp-cdk-constructs.DocumentSplitter.Initializer.parameter.parent"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.DocumentSplitter.Initializer.parameter.id"></a>

- *Type:* string

Descriptive identifier for this chainable.

---

##### `props`<sup>Required</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.DocumentSplitter.Initializer.parameter.props"></a>

- *Type:* <a href="#amazon-textract-idp-cdk-constructs.DocumentSplitterProps">DocumentSplitterProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.DocumentSplitter.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#amazon-textract-idp-cdk-constructs.DocumentSplitter.next">next</a></code> | Continue normal execution with the given state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.DocumentSplitter.prefixStates">prefixStates</a></code> | Prefix the IDs of all states in this state machine fragment. |
| <code><a href="#amazon-textract-idp-cdk-constructs.DocumentSplitter.toSingleState">toSingleState</a></code> | Wrap all states in this state machine fragment up into a single state. |

---

##### `toString` <a name="toString" id="amazon-textract-idp-cdk-constructs.DocumentSplitter.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `next` <a name="next" id="amazon-textract-idp-cdk-constructs.DocumentSplitter.next"></a>

```typescript
public next(next: IChainable): Chain
```

Continue normal execution with the given state.

###### `next`<sup>Required</sup> <a name="next" id="amazon-textract-idp-cdk-constructs.DocumentSplitter.next.parameter.next"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.IChainable

---

##### `prefixStates` <a name="prefixStates" id="amazon-textract-idp-cdk-constructs.DocumentSplitter.prefixStates"></a>

```typescript
public prefixStates(prefix?: string): StateMachineFragment
```

Prefix the IDs of all states in this state machine fragment.

Use this to avoid multiple copies of the state machine all having the
same state IDs.

###### `prefix`<sup>Optional</sup> <a name="prefix" id="amazon-textract-idp-cdk-constructs.DocumentSplitter.prefixStates.parameter.prefix"></a>

- *Type:* string

The prefix to add.

Will use construct ID by default.

---

##### `toSingleState` <a name="toSingleState" id="amazon-textract-idp-cdk-constructs.DocumentSplitter.toSingleState"></a>

```typescript
public toSingleState(options?: SingleStateOptions): Parallel
```

Wrap all states in this state machine fragment up into a single state.

This can be used to add retry or error handling onto this state
machine fragment.

Be aware that this changes the result of the inner state machine
to be an array with the result of the state machine in it. Adjust
your paths accordingly. For example, change 'outputPath' to
'$[0]'.

###### `options`<sup>Optional</sup> <a name="options" id="amazon-textract-idp-cdk-constructs.DocumentSplitter.toSingleState.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.SingleStateOptions

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.DocumentSplitter.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="amazon-textract-idp-cdk-constructs.DocumentSplitter.isConstruct"></a>

```typescript
import { DocumentSplitter } from 'amazon-textract-idp-cdk-constructs'

DocumentSplitter.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="amazon-textract-idp-cdk-constructs.DocumentSplitter.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.DocumentSplitter.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#amazon-textract-idp-cdk-constructs.DocumentSplitter.property.endStates">endStates</a></code> | <code>aws-cdk-lib.aws_stepfunctions.INextable[]</code> | The states to chain onto if this fragment is used. |
| <code><a href="#amazon-textract-idp-cdk-constructs.DocumentSplitter.property.id">id</a></code> | <code>string</code> | Descriptive identifier for this chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.DocumentSplitter.property.startState">startState</a></code> | <code>aws-cdk-lib.aws_stepfunctions.State</code> | The start state of this state machine fragment. |
| <code><a href="#amazon-textract-idp-cdk-constructs.DocumentSplitter.property.splitterFunction">splitterFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="amazon-textract-idp-cdk-constructs.DocumentSplitter.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `endStates`<sup>Required</sup> <a name="endStates" id="amazon-textract-idp-cdk-constructs.DocumentSplitter.property.endStates"></a>

```typescript
public readonly endStates: INextable[];
```

- *Type:* aws-cdk-lib.aws_stepfunctions.INextable[]

The states to chain onto if this fragment is used.

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.DocumentSplitter.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

Descriptive identifier for this chainable.

---

##### `startState`<sup>Required</sup> <a name="startState" id="amazon-textract-idp-cdk-constructs.DocumentSplitter.property.startState"></a>

```typescript
public readonly startState: State;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.State

The start state of this state machine fragment.

---

##### `splitterFunction`<sup>Required</sup> <a name="splitterFunction" id="amazon-textract-idp-cdk-constructs.DocumentSplitter.property.splitterFunction"></a>

```typescript
public readonly splitterFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---


### RDSAuroraServerless <a name="RDSAuroraServerless" id="amazon-textract-idp-cdk-constructs.RDSAuroraServerless"></a>

#### Initializers <a name="Initializers" id="amazon-textract-idp-cdk-constructs.RDSAuroraServerless.Initializer"></a>

```typescript
import { RDSAuroraServerless } from 'amazon-textract-idp-cdk-constructs'

new RDSAuroraServerless(scope: Construct, id: string, props: RDSAuroraServerlessProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.RDSAuroraServerless.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.RDSAuroraServerless.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.RDSAuroraServerless.Initializer.parameter.props">props</a></code> | <code><a href="#amazon-textract-idp-cdk-constructs.RDSAuroraServerlessProps">RDSAuroraServerlessProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="amazon-textract-idp-cdk-constructs.RDSAuroraServerless.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.RDSAuroraServerless.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.RDSAuroraServerless.Initializer.parameter.props"></a>

- *Type:* <a href="#amazon-textract-idp-cdk-constructs.RDSAuroraServerlessProps">RDSAuroraServerlessProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.RDSAuroraServerless.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="amazon-textract-idp-cdk-constructs.RDSAuroraServerless.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.RDSAuroraServerless.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="amazon-textract-idp-cdk-constructs.RDSAuroraServerless.isConstruct"></a>

```typescript
import { RDSAuroraServerless } from 'amazon-textract-idp-cdk-constructs'

RDSAuroraServerless.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="amazon-textract-idp-cdk-constructs.RDSAuroraServerless.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.RDSAuroraServerless.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#amazon-textract-idp-cdk-constructs.RDSAuroraServerless.property.props">props</a></code> | <code><a href="#amazon-textract-idp-cdk-constructs.RDSAuroraServerlessProps">RDSAuroraServerlessProps</a></code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.RDSAuroraServerless.property.auroraSecurityGroup">auroraSecurityGroup</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.RDSAuroraServerless.property.dbCluster">dbCluster</a></code> | <code>aws-cdk-lib.aws_rds.IServerlessCluster</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.RDSAuroraServerless.property.lambdaSecurityGroup">lambdaSecurityGroup</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="amazon-textract-idp-cdk-constructs.RDSAuroraServerless.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `props`<sup>Required</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.RDSAuroraServerless.property.props"></a>

```typescript
public readonly props: RDSAuroraServerlessProps;
```

- *Type:* <a href="#amazon-textract-idp-cdk-constructs.RDSAuroraServerlessProps">RDSAuroraServerlessProps</a>

---

##### `auroraSecurityGroup`<sup>Required</sup> <a name="auroraSecurityGroup" id="amazon-textract-idp-cdk-constructs.RDSAuroraServerless.property.auroraSecurityGroup"></a>

```typescript
public readonly auroraSecurityGroup: ISecurityGroup;
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup

---

##### `dbCluster`<sup>Required</sup> <a name="dbCluster" id="amazon-textract-idp-cdk-constructs.RDSAuroraServerless.property.dbCluster"></a>

```typescript
public readonly dbCluster: IServerlessCluster;
```

- *Type:* aws-cdk-lib.aws_rds.IServerlessCluster

---

##### `lambdaSecurityGroup`<sup>Required</sup> <a name="lambdaSecurityGroup" id="amazon-textract-idp-cdk-constructs.RDSAuroraServerless.property.lambdaSecurityGroup"></a>

```typescript
public readonly lambdaSecurityGroup: ISecurityGroup;
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup

---


### SearchablePDF <a name="SearchablePDF" id="amazon-textract-idp-cdk-constructs.SearchablePDF"></a>

This construct takes in a JSON with two s3 Paths, s3TextractOutput, s3PDFBucket.

example s3Path:
{"s3TextractOutput": "s3://bucketname/prefix/1"}
{"s3PDFBucket": "s3://bucketname/prefix/document.pdf"}
```

#### Initializers <a name="Initializers" id="amazon-textract-idp-cdk-constructs.SearchablePDF.Initializer"></a>

```typescript
import { SearchablePDF } from 'amazon-textract-idp-cdk-constructs'

new SearchablePDF(parent: Construct, id: string, props: SearchablePDFProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.SearchablePDF.Initializer.parameter.parent">parent</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.SearchablePDF.Initializer.parameter.id">id</a></code> | <code>string</code> | Descriptive identifier for this chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SearchablePDF.Initializer.parameter.props">props</a></code> | <code><a href="#amazon-textract-idp-cdk-constructs.SearchablePDFProps">SearchablePDFProps</a></code> | *No description.* |

---

##### `parent`<sup>Required</sup> <a name="parent" id="amazon-textract-idp-cdk-constructs.SearchablePDF.Initializer.parameter.parent"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.SearchablePDF.Initializer.parameter.id"></a>

- *Type:* string

Descriptive identifier for this chainable.

---

##### `props`<sup>Required</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.SearchablePDF.Initializer.parameter.props"></a>

- *Type:* <a href="#amazon-textract-idp-cdk-constructs.SearchablePDFProps">SearchablePDFProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.SearchablePDF.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SearchablePDF.next">next</a></code> | Continue normal execution with the given state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SearchablePDF.prefixStates">prefixStates</a></code> | Prefix the IDs of all states in this state machine fragment. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SearchablePDF.toSingleState">toSingleState</a></code> | Wrap all states in this state machine fragment up into a single state. |

---

##### `toString` <a name="toString" id="amazon-textract-idp-cdk-constructs.SearchablePDF.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `next` <a name="next" id="amazon-textract-idp-cdk-constructs.SearchablePDF.next"></a>

```typescript
public next(next: IChainable): Chain
```

Continue normal execution with the given state.

###### `next`<sup>Required</sup> <a name="next" id="amazon-textract-idp-cdk-constructs.SearchablePDF.next.parameter.next"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.IChainable

---

##### `prefixStates` <a name="prefixStates" id="amazon-textract-idp-cdk-constructs.SearchablePDF.prefixStates"></a>

```typescript
public prefixStates(prefix?: string): StateMachineFragment
```

Prefix the IDs of all states in this state machine fragment.

Use this to avoid multiple copies of the state machine all having the
same state IDs.

###### `prefix`<sup>Optional</sup> <a name="prefix" id="amazon-textract-idp-cdk-constructs.SearchablePDF.prefixStates.parameter.prefix"></a>

- *Type:* string

The prefix to add.

Will use construct ID by default.

---

##### `toSingleState` <a name="toSingleState" id="amazon-textract-idp-cdk-constructs.SearchablePDF.toSingleState"></a>

```typescript
public toSingleState(options?: SingleStateOptions): Parallel
```

Wrap all states in this state machine fragment up into a single state.

This can be used to add retry or error handling onto this state
machine fragment.

Be aware that this changes the result of the inner state machine
to be an array with the result of the state machine in it. Adjust
your paths accordingly. For example, change 'outputPath' to
'$[0]'.

###### `options`<sup>Optional</sup> <a name="options" id="amazon-textract-idp-cdk-constructs.SearchablePDF.toSingleState.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.SingleStateOptions

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.SearchablePDF.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="amazon-textract-idp-cdk-constructs.SearchablePDF.isConstruct"></a>

```typescript
import { SearchablePDF } from 'amazon-textract-idp-cdk-constructs'

SearchablePDF.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="amazon-textract-idp-cdk-constructs.SearchablePDF.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.SearchablePDF.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SearchablePDF.property.endStates">endStates</a></code> | <code>aws-cdk-lib.aws_stepfunctions.INextable[]</code> | The states to chain onto if this fragment is used. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SearchablePDF.property.id">id</a></code> | <code>string</code> | Descriptive identifier for this chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SearchablePDF.property.startState">startState</a></code> | <code>aws-cdk-lib.aws_stepfunctions.State</code> | The start state of this state machine fragment. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SearchablePDF.property.searchablePDFFunction">searchablePDFFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="amazon-textract-idp-cdk-constructs.SearchablePDF.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `endStates`<sup>Required</sup> <a name="endStates" id="amazon-textract-idp-cdk-constructs.SearchablePDF.property.endStates"></a>

```typescript
public readonly endStates: INextable[];
```

- *Type:* aws-cdk-lib.aws_stepfunctions.INextable[]

The states to chain onto if this fragment is used.

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.SearchablePDF.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

Descriptive identifier for this chainable.

---

##### `startState`<sup>Required</sup> <a name="startState" id="amazon-textract-idp-cdk-constructs.SearchablePDF.property.startState"></a>

```typescript
public readonly startState: State;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.State

The start state of this state machine fragment.

---

##### `searchablePDFFunction`<sup>Required</sup> <a name="searchablePDFFunction" id="amazon-textract-idp-cdk-constructs.SearchablePDF.property.searchablePDFFunction"></a>

```typescript
public readonly searchablePDFFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---


### SFExecutionsStartThrottle <a name="SFExecutionsStartThrottle" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottle"></a>

This construct starts State Machine executions based on events, but limits the number of concurrent running executions to a threshold number - S3 - API Gateway - SQS  This version does not yet support passing in a manifest for configuration of Textract features.

That will be a future enhancement.
The following resources are created:
- Lambda function
- DynamoDB table. For every document pass in an entry in a DynamoDB table is created with a status (RECEIVED, QUEUED, IN_PROGRESS)

#### Initializers <a name="Initializers" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottle.Initializer"></a>

```typescript
import { SFExecutionsStartThrottle } from 'amazon-textract-idp-cdk-constructs'

new SFExecutionsStartThrottle(parent: Construct, id: string, props: SFExecutionsStartThrottleProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottle.Initializer.parameter.parent">parent</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottle.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottle.Initializer.parameter.props">props</a></code> | <code><a href="#amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps">SFExecutionsStartThrottleProps</a></code> | *No description.* |

---

##### `parent`<sup>Required</sup> <a name="parent" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottle.Initializer.parameter.parent"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottle.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottle.Initializer.parameter.props"></a>

- *Type:* <a href="#amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps">SFExecutionsStartThrottleProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottle.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottle.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottle.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottle.isConstruct"></a>

```typescript
import { SFExecutionsStartThrottle } from 'amazon-textract-idp-cdk-constructs'

SFExecutionsStartThrottle.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottle.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottle.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottle.property.executionsQueueWorkerFunction">executionsQueueWorkerFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottle.property.executionsStartThrottleFunction">executionsStartThrottleFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottle.property.executionsThrottleCounterResetFunction">executionsThrottleCounterResetFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottle.property.documentQueue">documentQueue</a></code> | <code>aws-cdk-lib.aws_sqs.IQueue</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottle.property.documentStatusTable">documentStatusTable</a></code> | <code>aws-cdk-lib.aws_dynamodb.ITable</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottle.property.executionsCounterTable">executionsCounterTable</a></code> | <code>aws-cdk-lib.aws_dynamodb.ITable</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottle.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `executionsQueueWorkerFunction`<sup>Required</sup> <a name="executionsQueueWorkerFunction" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottle.property.executionsQueueWorkerFunction"></a>

```typescript
public readonly executionsQueueWorkerFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `executionsStartThrottleFunction`<sup>Required</sup> <a name="executionsStartThrottleFunction" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottle.property.executionsStartThrottleFunction"></a>

```typescript
public readonly executionsStartThrottleFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `executionsThrottleCounterResetFunction`<sup>Required</sup> <a name="executionsThrottleCounterResetFunction" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottle.property.executionsThrottleCounterResetFunction"></a>

```typescript
public readonly executionsThrottleCounterResetFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `documentQueue`<sup>Optional</sup> <a name="documentQueue" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottle.property.documentQueue"></a>

```typescript
public readonly documentQueue: IQueue;
```

- *Type:* aws-cdk-lib.aws_sqs.IQueue

---

##### `documentStatusTable`<sup>Optional</sup> <a name="documentStatusTable" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottle.property.documentStatusTable"></a>

```typescript
public readonly documentStatusTable: ITable;
```

- *Type:* aws-cdk-lib.aws_dynamodb.ITable

---

##### `executionsCounterTable`<sup>Optional</sup> <a name="executionsCounterTable" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottle.property.executionsCounterTable"></a>

```typescript
public readonly executionsCounterTable: ITable;
```

- *Type:* aws-cdk-lib.aws_dynamodb.ITable

---


### SpacySfnTask <a name="SpacySfnTask" id="amazon-textract-idp-cdk-constructs.SpacySfnTask"></a>

Deploys a Lambda Container with a Spacy NLP model to call textcat.

Input: "textract_result"."txt_output_location"
Output:  { "documentType": "AWS_PAYSTUBS" } (example will be at "classification"."documentType")

Example (Python)
```python
 spacy_classification_task = tcdk.SpacySfnTask(
     self,
     "Classification",
     integration_pattern=sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
     lambda_log_level="DEBUG",
     timeout=Duration.hours(24),
     input=sfn.TaskInput.from_object({
         "Token":
         sfn.JsonPath.task_token,
         "ExecutionId":
         sfn.JsonPath.string_at('$$.Execution.Id'),
         "Payload":
         sfn.JsonPath.entire_payload,
     }),
     result_path="$.classification")
 ```

#### Initializers <a name="Initializers" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.Initializer"></a>

```typescript
import { SpacySfnTask } from 'amazon-textract-idp-cdk-constructs'

new SpacySfnTask(scope: Construct, id: string, props: SpacySfnTaskProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.Initializer.parameter.id">id</a></code> | <code>string</code> | Descriptive identifier for this chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.Initializer.parameter.props">props</a></code> | <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTaskProps">SpacySfnTaskProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.Initializer.parameter.id"></a>

- *Type:* string

Descriptive identifier for this chainable.

---

##### `props`<sup>Required</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.Initializer.parameter.props"></a>

- *Type:* <a href="#amazon-textract-idp-cdk-constructs.SpacySfnTaskProps">SpacySfnTaskProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.addPrefix">addPrefix</a></code> | Add a prefix to the stateId of this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.bindToGraph">bindToGraph</a></code> | Register this state as part of the given graph. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.toStateJson">toStateJson</a></code> | Return the Amazon States Language object for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.addCatch">addCatch</a></code> | Add a recovery handler for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.addRetry">addRetry</a></code> | Add retry configuration for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.metric">metric</a></code> | Return the given named metric for this Task. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.metricFailed">metricFailed</a></code> | Metric for the number of times this activity fails. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.metricHeartbeatTimedOut">metricHeartbeatTimedOut</a></code> | Metric for the number of times the heartbeat times out for this activity. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.metricRunTime">metricRunTime</a></code> | The interval, in milliseconds, between the time the Task starts and the time it closes. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.metricScheduled">metricScheduled</a></code> | Metric for the number of times this activity is scheduled. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.metricScheduleTime">metricScheduleTime</a></code> | The interval, in milliseconds, for which the activity stays in the schedule state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.metricStarted">metricStarted</a></code> | Metric for the number of times this activity is started. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.metricSucceeded">metricSucceeded</a></code> | Metric for the number of times this activity succeeds. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.metricTime">metricTime</a></code> | The interval, in milliseconds, between the time the activity is scheduled and the time it closes. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.metricTimedOut">metricTimedOut</a></code> | Metric for the number of times this activity times out. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.next">next</a></code> | Continue normal execution with the given state. |

---

##### `toString` <a name="toString" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addPrefix` <a name="addPrefix" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.addPrefix"></a>

```typescript
public addPrefix(x: string): void
```

Add a prefix to the stateId of this state.

###### `x`<sup>Required</sup> <a name="x" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.addPrefix.parameter.x"></a>

- *Type:* string

---

##### `bindToGraph` <a name="bindToGraph" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.bindToGraph"></a>

```typescript
public bindToGraph(graph: StateGraph): void
```

Register this state as part of the given graph.

Don't call this. It will be called automatically when you work
with states normally.

###### `graph`<sup>Required</sup> <a name="graph" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.bindToGraph.parameter.graph"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.StateGraph

---

##### `toStateJson` <a name="toStateJson" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.toStateJson"></a>

```typescript
public toStateJson(): object
```

Return the Amazon States Language object for this state.

##### `addCatch` <a name="addCatch" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.addCatch"></a>

```typescript
public addCatch(handler: IChainable, props?: CatchProps): TaskStateBase
```

Add a recovery handler for this state.

When a particular error occurs, execution will continue at the error
handler instead of failing the state machine execution.

###### `handler`<sup>Required</sup> <a name="handler" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.addCatch.parameter.handler"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.IChainable

---

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.addCatch.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.CatchProps

---

##### `addRetry` <a name="addRetry" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.addRetry"></a>

```typescript
public addRetry(props?: RetryProps): TaskStateBase
```

Add retry configuration for this state.

This controls if and how the execution will be retried if a particular
error occurs.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.addRetry.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.RetryProps

---

##### `metric` <a name="metric" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.metric"></a>

```typescript
public metric(metricName: string, props?: MetricOptions): Metric
```

Return the given named metric for this Task.

###### `metricName`<sup>Required</sup> <a name="metricName" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.metric.parameter.metricName"></a>

- *Type:* string

---

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.metric.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricFailed` <a name="metricFailed" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.metricFailed"></a>

```typescript
public metricFailed(props?: MetricOptions): Metric
```

Metric for the number of times this activity fails.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.metricFailed.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricHeartbeatTimedOut` <a name="metricHeartbeatTimedOut" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.metricHeartbeatTimedOut"></a>

```typescript
public metricHeartbeatTimedOut(props?: MetricOptions): Metric
```

Metric for the number of times the heartbeat times out for this activity.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.metricHeartbeatTimedOut.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricRunTime` <a name="metricRunTime" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.metricRunTime"></a>

```typescript
public metricRunTime(props?: MetricOptions): Metric
```

The interval, in milliseconds, between the time the Task starts and the time it closes.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.metricRunTime.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricScheduled` <a name="metricScheduled" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.metricScheduled"></a>

```typescript
public metricScheduled(props?: MetricOptions): Metric
```

Metric for the number of times this activity is scheduled.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.metricScheduled.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricScheduleTime` <a name="metricScheduleTime" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.metricScheduleTime"></a>

```typescript
public metricScheduleTime(props?: MetricOptions): Metric
```

The interval, in milliseconds, for which the activity stays in the schedule state.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.metricScheduleTime.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricStarted` <a name="metricStarted" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.metricStarted"></a>

```typescript
public metricStarted(props?: MetricOptions): Metric
```

Metric for the number of times this activity is started.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.metricStarted.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricSucceeded` <a name="metricSucceeded" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.metricSucceeded"></a>

```typescript
public metricSucceeded(props?: MetricOptions): Metric
```

Metric for the number of times this activity succeeds.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.metricSucceeded.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricTime` <a name="metricTime" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.metricTime"></a>

```typescript
public metricTime(props?: MetricOptions): Metric
```

The interval, in milliseconds, between the time the activity is scheduled and the time it closes.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.metricTime.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricTimedOut` <a name="metricTimedOut" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.metricTimedOut"></a>

```typescript
public metricTimedOut(props?: MetricOptions): Metric
```

Metric for the number of times this activity times out.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.metricTimedOut.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `next` <a name="next" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.next"></a>

```typescript
public next(next: IChainable): Chain
```

Continue normal execution with the given state.

###### `next`<sup>Required</sup> <a name="next" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.next.parameter.next"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.IChainable

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.filterNextables">filterNextables</a></code> | Return only the states that allow chaining from an array of states. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.findReachableEndStates">findReachableEndStates</a></code> | Find the set of end states states reachable through transitions from the given start state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.findReachableStates">findReachableStates</a></code> | Find the set of states reachable through transitions from the given start state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.prefixStates">prefixStates</a></code> | Add a prefix to the stateId of all States found in a construct tree. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.isConstruct"></a>

```typescript
import { SpacySfnTask } from 'amazon-textract-idp-cdk-constructs'

SpacySfnTask.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `filterNextables` <a name="filterNextables" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.filterNextables"></a>

```typescript
import { SpacySfnTask } from 'amazon-textract-idp-cdk-constructs'

SpacySfnTask.filterNextables(states: State[])
```

Return only the states that allow chaining from an array of states.

###### `states`<sup>Required</sup> <a name="states" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.filterNextables.parameter.states"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.State[]

---

##### `findReachableEndStates` <a name="findReachableEndStates" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.findReachableEndStates"></a>

```typescript
import { SpacySfnTask } from 'amazon-textract-idp-cdk-constructs'

SpacySfnTask.findReachableEndStates(start: State, options?: FindStateOptions)
```

Find the set of end states states reachable through transitions from the given start state.

###### `start`<sup>Required</sup> <a name="start" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.findReachableEndStates.parameter.start"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.State

---

###### `options`<sup>Optional</sup> <a name="options" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.findReachableEndStates.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.FindStateOptions

---

##### `findReachableStates` <a name="findReachableStates" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.findReachableStates"></a>

```typescript
import { SpacySfnTask } from 'amazon-textract-idp-cdk-constructs'

SpacySfnTask.findReachableStates(start: State, options?: FindStateOptions)
```

Find the set of states reachable through transitions from the given start state.

This does not retrieve states from within sub-graphs, such as states within a Parallel state's branch.

###### `start`<sup>Required</sup> <a name="start" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.findReachableStates.parameter.start"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.State

---

###### `options`<sup>Optional</sup> <a name="options" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.findReachableStates.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.FindStateOptions

---

##### `prefixStates` <a name="prefixStates" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.prefixStates"></a>

```typescript
import { SpacySfnTask } from 'amazon-textract-idp-cdk-constructs'

SpacySfnTask.prefixStates(root: IConstruct, prefix: string)
```

Add a prefix to the stateId of all States found in a construct tree.

###### `root`<sup>Required</sup> <a name="root" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.prefixStates.parameter.root"></a>

- *Type:* constructs.IConstruct

---

###### `prefix`<sup>Required</sup> <a name="prefix" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.prefixStates.parameter.prefix"></a>

- *Type:* string

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.property.endStates">endStates</a></code> | <code>aws-cdk-lib.aws_stepfunctions.INextable[]</code> | Continuable states of this Chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.property.id">id</a></code> | <code>string</code> | Descriptive identifier for this chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.property.startState">startState</a></code> | <code>aws-cdk-lib.aws_stepfunctions.State</code> | First state of this Chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.property.stateId">stateId</a></code> | <code>string</code> | Tokenized string that evaluates to the state's ID. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.property.spacyCallFunction">spacyCallFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.property.spacySyncLambdaLogGroup">spacySyncLambdaLogGroup</a></code> | <code>aws-cdk-lib.aws_logs.ILogGroup</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.property.stateMachine">stateMachine</a></code> | <code>aws-cdk-lib.aws_stepfunctions.IStateMachine</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTask.property.version">version</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `endStates`<sup>Required</sup> <a name="endStates" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.property.endStates"></a>

```typescript
public readonly endStates: INextable[];
```

- *Type:* aws-cdk-lib.aws_stepfunctions.INextable[]

Continuable states of this Chainable.

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

Descriptive identifier for this chainable.

---

##### `startState`<sup>Required</sup> <a name="startState" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.property.startState"></a>

```typescript
public readonly startState: State;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.State

First state of this Chainable.

---

##### `stateId`<sup>Required</sup> <a name="stateId" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.property.stateId"></a>

```typescript
public readonly stateId: string;
```

- *Type:* string

Tokenized string that evaluates to the state's ID.

---

##### `spacyCallFunction`<sup>Required</sup> <a name="spacyCallFunction" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.property.spacyCallFunction"></a>

```typescript
public readonly spacyCallFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `spacySyncLambdaLogGroup`<sup>Required</sup> <a name="spacySyncLambdaLogGroup" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.property.spacySyncLambdaLogGroup"></a>

```typescript
public readonly spacySyncLambdaLogGroup: ILogGroup;
```

- *Type:* aws-cdk-lib.aws_logs.ILogGroup

---

##### `stateMachine`<sup>Required</sup> <a name="stateMachine" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.property.stateMachine"></a>

```typescript
public readonly stateMachine: IStateMachine;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.IStateMachine

---

##### `version`<sup>Required</sup> <a name="version" id="amazon-textract-idp-cdk-constructs.SpacySfnTask.property.version"></a>

```typescript
public readonly version: string;
```

- *Type:* string

---


### TextractA2ISfnTask <a name="TextractA2ISfnTask" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask"></a>

Calls and A2I endpoint arn with a task_token and waits for the A2I job to finish in order to continue the workflow.

Basic implementation

Input: "Payload"."a2iInputPath"
Output:
```json
{
     'humanLoopStatus': human_loop_status,
     'humanLoopResultPath': human_loop_result,
     'humanLoopCreationTime': human_loop_creation_time,
 }
 ```

```python
textract_a2i_task = tcdk.TextractA2ISfnTask(
     self,
     "TextractA2I",
     a2i_flow_definition_arn=
     "arn:aws:sagemaker:us-east-1:913165245630:flow-definition/textract-classifiction",
     integration_pattern=sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
     lambda_log_level="DEBUG",
     timeout=Duration.hours(24),
     input=sfn.TaskInput.from_object({
         "Token":
         sfn.JsonPath.task_token,
         "ExecutionId":
         sfn.JsonPath.string_at('$$.Execution.Id'),
         "Payload":
         sfn.JsonPath.entire_payload,
     }),
     result_path="$.a2i_result")
```

#### Initializers <a name="Initializers" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.Initializer"></a>

```typescript
import { TextractA2ISfnTask } from 'amazon-textract-idp-cdk-constructs'

new TextractA2ISfnTask(scope: Construct, id: string, props: TextractA2ISfnTaskProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.Initializer.parameter.id">id</a></code> | <code>string</code> | Descriptive identifier for this chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.Initializer.parameter.props">props</a></code> | <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps">TextractA2ISfnTaskProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.Initializer.parameter.id"></a>

- *Type:* string

Descriptive identifier for this chainable.

---

##### `props`<sup>Required</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.Initializer.parameter.props"></a>

- *Type:* <a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps">TextractA2ISfnTaskProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.addPrefix">addPrefix</a></code> | Add a prefix to the stateId of this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.bindToGraph">bindToGraph</a></code> | Register this state as part of the given graph. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.toStateJson">toStateJson</a></code> | Return the Amazon States Language object for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.addCatch">addCatch</a></code> | Add a recovery handler for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.addRetry">addRetry</a></code> | Add retry configuration for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metric">metric</a></code> | Return the given named metric for this Task. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metricFailed">metricFailed</a></code> | Metric for the number of times this activity fails. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metricHeartbeatTimedOut">metricHeartbeatTimedOut</a></code> | Metric for the number of times the heartbeat times out for this activity. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metricRunTime">metricRunTime</a></code> | The interval, in milliseconds, between the time the Task starts and the time it closes. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metricScheduled">metricScheduled</a></code> | Metric for the number of times this activity is scheduled. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metricScheduleTime">metricScheduleTime</a></code> | The interval, in milliseconds, for which the activity stays in the schedule state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metricStarted">metricStarted</a></code> | Metric for the number of times this activity is started. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metricSucceeded">metricSucceeded</a></code> | Metric for the number of times this activity succeeds. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metricTime">metricTime</a></code> | The interval, in milliseconds, between the time the activity is scheduled and the time it closes. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metricTimedOut">metricTimedOut</a></code> | Metric for the number of times this activity times out. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.next">next</a></code> | Continue normal execution with the given state. |

---

##### `toString` <a name="toString" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addPrefix` <a name="addPrefix" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.addPrefix"></a>

```typescript
public addPrefix(x: string): void
```

Add a prefix to the stateId of this state.

###### `x`<sup>Required</sup> <a name="x" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.addPrefix.parameter.x"></a>

- *Type:* string

---

##### `bindToGraph` <a name="bindToGraph" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.bindToGraph"></a>

```typescript
public bindToGraph(graph: StateGraph): void
```

Register this state as part of the given graph.

Don't call this. It will be called automatically when you work
with states normally.

###### `graph`<sup>Required</sup> <a name="graph" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.bindToGraph.parameter.graph"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.StateGraph

---

##### `toStateJson` <a name="toStateJson" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.toStateJson"></a>

```typescript
public toStateJson(): object
```

Return the Amazon States Language object for this state.

##### `addCatch` <a name="addCatch" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.addCatch"></a>

```typescript
public addCatch(handler: IChainable, props?: CatchProps): TaskStateBase
```

Add a recovery handler for this state.

When a particular error occurs, execution will continue at the error
handler instead of failing the state machine execution.

###### `handler`<sup>Required</sup> <a name="handler" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.addCatch.parameter.handler"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.IChainable

---

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.addCatch.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.CatchProps

---

##### `addRetry` <a name="addRetry" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.addRetry"></a>

```typescript
public addRetry(props?: RetryProps): TaskStateBase
```

Add retry configuration for this state.

This controls if and how the execution will be retried if a particular
error occurs.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.addRetry.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.RetryProps

---

##### `metric` <a name="metric" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metric"></a>

```typescript
public metric(metricName: string, props?: MetricOptions): Metric
```

Return the given named metric for this Task.

###### `metricName`<sup>Required</sup> <a name="metricName" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metric.parameter.metricName"></a>

- *Type:* string

---

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metric.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricFailed` <a name="metricFailed" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metricFailed"></a>

```typescript
public metricFailed(props?: MetricOptions): Metric
```

Metric for the number of times this activity fails.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metricFailed.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricHeartbeatTimedOut` <a name="metricHeartbeatTimedOut" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metricHeartbeatTimedOut"></a>

```typescript
public metricHeartbeatTimedOut(props?: MetricOptions): Metric
```

Metric for the number of times the heartbeat times out for this activity.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metricHeartbeatTimedOut.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricRunTime` <a name="metricRunTime" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metricRunTime"></a>

```typescript
public metricRunTime(props?: MetricOptions): Metric
```

The interval, in milliseconds, between the time the Task starts and the time it closes.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metricRunTime.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricScheduled` <a name="metricScheduled" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metricScheduled"></a>

```typescript
public metricScheduled(props?: MetricOptions): Metric
```

Metric for the number of times this activity is scheduled.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metricScheduled.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricScheduleTime` <a name="metricScheduleTime" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metricScheduleTime"></a>

```typescript
public metricScheduleTime(props?: MetricOptions): Metric
```

The interval, in milliseconds, for which the activity stays in the schedule state.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metricScheduleTime.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricStarted` <a name="metricStarted" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metricStarted"></a>

```typescript
public metricStarted(props?: MetricOptions): Metric
```

Metric for the number of times this activity is started.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metricStarted.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricSucceeded` <a name="metricSucceeded" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metricSucceeded"></a>

```typescript
public metricSucceeded(props?: MetricOptions): Metric
```

Metric for the number of times this activity succeeds.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metricSucceeded.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricTime` <a name="metricTime" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metricTime"></a>

```typescript
public metricTime(props?: MetricOptions): Metric
```

The interval, in milliseconds, between the time the activity is scheduled and the time it closes.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metricTime.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricTimedOut` <a name="metricTimedOut" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metricTimedOut"></a>

```typescript
public metricTimedOut(props?: MetricOptions): Metric
```

Metric for the number of times this activity times out.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.metricTimedOut.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `next` <a name="next" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.next"></a>

```typescript
public next(next: IChainable): Chain
```

Continue normal execution with the given state.

###### `next`<sup>Required</sup> <a name="next" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.next.parameter.next"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.IChainable

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.filterNextables">filterNextables</a></code> | Return only the states that allow chaining from an array of states. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.findReachableEndStates">findReachableEndStates</a></code> | Find the set of end states states reachable through transitions from the given start state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.findReachableStates">findReachableStates</a></code> | Find the set of states reachable through transitions from the given start state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.prefixStates">prefixStates</a></code> | Add a prefix to the stateId of all States found in a construct tree. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.isConstruct"></a>

```typescript
import { TextractA2ISfnTask } from 'amazon-textract-idp-cdk-constructs'

TextractA2ISfnTask.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `filterNextables` <a name="filterNextables" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.filterNextables"></a>

```typescript
import { TextractA2ISfnTask } from 'amazon-textract-idp-cdk-constructs'

TextractA2ISfnTask.filterNextables(states: State[])
```

Return only the states that allow chaining from an array of states.

###### `states`<sup>Required</sup> <a name="states" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.filterNextables.parameter.states"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.State[]

---

##### `findReachableEndStates` <a name="findReachableEndStates" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.findReachableEndStates"></a>

```typescript
import { TextractA2ISfnTask } from 'amazon-textract-idp-cdk-constructs'

TextractA2ISfnTask.findReachableEndStates(start: State, options?: FindStateOptions)
```

Find the set of end states states reachable through transitions from the given start state.

###### `start`<sup>Required</sup> <a name="start" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.findReachableEndStates.parameter.start"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.State

---

###### `options`<sup>Optional</sup> <a name="options" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.findReachableEndStates.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.FindStateOptions

---

##### `findReachableStates` <a name="findReachableStates" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.findReachableStates"></a>

```typescript
import { TextractA2ISfnTask } from 'amazon-textract-idp-cdk-constructs'

TextractA2ISfnTask.findReachableStates(start: State, options?: FindStateOptions)
```

Find the set of states reachable through transitions from the given start state.

This does not retrieve states from within sub-graphs, such as states within a Parallel state's branch.

###### `start`<sup>Required</sup> <a name="start" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.findReachableStates.parameter.start"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.State

---

###### `options`<sup>Optional</sup> <a name="options" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.findReachableStates.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.FindStateOptions

---

##### `prefixStates` <a name="prefixStates" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.prefixStates"></a>

```typescript
import { TextractA2ISfnTask } from 'amazon-textract-idp-cdk-constructs'

TextractA2ISfnTask.prefixStates(root: IConstruct, prefix: string)
```

Add a prefix to the stateId of all States found in a construct tree.

###### `root`<sup>Required</sup> <a name="root" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.prefixStates.parameter.root"></a>

- *Type:* constructs.IConstruct

---

###### `prefix`<sup>Required</sup> <a name="prefix" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.prefixStates.parameter.prefix"></a>

- *Type:* string

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.property.endStates">endStates</a></code> | <code>aws-cdk-lib.aws_stepfunctions.INextable[]</code> | Continuable states of this Chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.property.id">id</a></code> | <code>string</code> | Descriptive identifier for this chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.property.startState">startState</a></code> | <code>aws-cdk-lib.aws_stepfunctions.State</code> | First state of this Chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.property.stateId">stateId</a></code> | <code>string</code> | Tokenized string that evaluates to the state's ID. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.property.stateMachine">stateMachine</a></code> | <code>aws-cdk-lib.aws_stepfunctions.IStateMachine</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.property.taskTokenTableName">taskTokenTableName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.property.version">version</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `endStates`<sup>Required</sup> <a name="endStates" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.property.endStates"></a>

```typescript
public readonly endStates: INextable[];
```

- *Type:* aws-cdk-lib.aws_stepfunctions.INextable[]

Continuable states of this Chainable.

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

Descriptive identifier for this chainable.

---

##### `startState`<sup>Required</sup> <a name="startState" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.property.startState"></a>

```typescript
public readonly startState: State;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.State

First state of this Chainable.

---

##### `stateId`<sup>Required</sup> <a name="stateId" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.property.stateId"></a>

```typescript
public readonly stateId: string;
```

- *Type:* string

Tokenized string that evaluates to the state's ID.

---

##### `stateMachine`<sup>Required</sup> <a name="stateMachine" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.property.stateMachine"></a>

```typescript
public readonly stateMachine: IStateMachine;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.IStateMachine

---

##### `taskTokenTableName`<sup>Required</sup> <a name="taskTokenTableName" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.property.taskTokenTableName"></a>

```typescript
public readonly taskTokenTableName: string;
```

- *Type:* string

---

##### `version`<sup>Required</sup> <a name="version" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTask.property.version"></a>

```typescript
public readonly version: string;
```

- *Type:* string

---


### TextractAsyncToJSON <a name="TextractAsyncToJSON" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSON"></a>

combines the potentially paginated response from async Textract calls and stores as one combines JSON.

This construct is not memory optimzed (yet) and will combine all JSON by loading them to memory.
Large responses could exceed the memory potentially, the memory size is set to Lambda max.

Reduce the memory size to your needs if your processing does not yield large responses to save Lamda cost.


Input: "textract_result"."TextractTempOutputJsonPath"
Output: "TextractOutputJsonPath"

Example (Python)
```python
 textract_async_to_json = tcdk.TextractAsyncToJSON(
     self,
     "TextractAsyncToJSON2",
     s3_output_prefix=s3_output_prefix,
     s3_output_bucket=s3_output_bucket)
```

#### Initializers <a name="Initializers" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.Initializer"></a>

```typescript
import { TextractAsyncToJSON } from 'amazon-textract-idp-cdk-constructs'

new TextractAsyncToJSON(parent: Construct, id: string, props: TextractAsyncToJSONProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.Initializer.parameter.parent">parent</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.Initializer.parameter.id">id</a></code> | <code>string</code> | Descriptive identifier for this chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.Initializer.parameter.props">props</a></code> | <code><a href="#amazon-textract-idp-cdk-constructs.TextractAsyncToJSONProps">TextractAsyncToJSONProps</a></code> | *No description.* |

---

##### `parent`<sup>Required</sup> <a name="parent" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.Initializer.parameter.parent"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.Initializer.parameter.id"></a>

- *Type:* string

Descriptive identifier for this chainable.

---

##### `props`<sup>Required</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.Initializer.parameter.props"></a>

- *Type:* <a href="#amazon-textract-idp-cdk-constructs.TextractAsyncToJSONProps">TextractAsyncToJSONProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.next">next</a></code> | Continue normal execution with the given state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.prefixStates">prefixStates</a></code> | Prefix the IDs of all states in this state machine fragment. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.toSingleState">toSingleState</a></code> | Wrap all states in this state machine fragment up into a single state. |

---

##### `toString` <a name="toString" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `next` <a name="next" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.next"></a>

```typescript
public next(next: IChainable): Chain
```

Continue normal execution with the given state.

###### `next`<sup>Required</sup> <a name="next" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.next.parameter.next"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.IChainable

---

##### `prefixStates` <a name="prefixStates" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.prefixStates"></a>

```typescript
public prefixStates(prefix?: string): StateMachineFragment
```

Prefix the IDs of all states in this state machine fragment.

Use this to avoid multiple copies of the state machine all having the
same state IDs.

###### `prefix`<sup>Optional</sup> <a name="prefix" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.prefixStates.parameter.prefix"></a>

- *Type:* string

The prefix to add.

Will use construct ID by default.

---

##### `toSingleState` <a name="toSingleState" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.toSingleState"></a>

```typescript
public toSingleState(options?: SingleStateOptions): Parallel
```

Wrap all states in this state machine fragment up into a single state.

This can be used to add retry or error handling onto this state
machine fragment.

Be aware that this changes the result of the inner state machine
to be an array with the result of the state machine in it. Adjust
your paths accordingly. For example, change 'outputPath' to
'$[0]'.

###### `options`<sup>Optional</sup> <a name="options" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.toSingleState.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.SingleStateOptions

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.isConstruct"></a>

```typescript
import { TextractAsyncToJSON } from 'amazon-textract-idp-cdk-constructs'

TextractAsyncToJSON.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.property.endStates">endStates</a></code> | <code>aws-cdk-lib.aws_stepfunctions.INextable[]</code> | The states to chain onto if this fragment is used. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.property.id">id</a></code> | <code>string</code> | Descriptive identifier for this chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.property.startState">startState</a></code> | <code>aws-cdk-lib.aws_stepfunctions.State</code> | The start state of this state machine fragment. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.property.asyncToJSONFunction">asyncToJSONFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `endStates`<sup>Required</sup> <a name="endStates" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.property.endStates"></a>

```typescript
public readonly endStates: INextable[];
```

- *Type:* aws-cdk-lib.aws_stepfunctions.INextable[]

The states to chain onto if this fragment is used.

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

Descriptive identifier for this chainable.

---

##### `startState`<sup>Required</sup> <a name="startState" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.property.startState"></a>

```typescript
public readonly startState: State;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.State

The start state of this state machine fragment.

---

##### `asyncToJSONFunction`<sup>Required</sup> <a name="asyncToJSONFunction" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSON.property.asyncToJSONFunction"></a>

```typescript
public readonly asyncToJSONFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---


### TextractClassificationConfigurator <a name="TextractClassificationConfigurator" id="amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator"></a>

Looks for a matching DOCYMENT_TYPE in the configurationTableName and sets the CONFIG value (when found) to the context, so subsequent calls to Textract use those values.

This is an entry from the default config
AWS_PAYSTUBS,"{""queriesConfig"": [{""alias"": ""PAYSTUB_PERIOD_START_DATE"", ""text"": ""What is the Pay Period Start Date?""}, {""alias"": ""PAYSTUB_PERIOD_END_DATE"", ""text"": ""What is the Pay Period End Date?""}, {""alias"": ""PAYSTUB_PERIOD_PAY_DATE"", ""text"": ""What is the Pay Date?""}, {""alias"": ""PAYSTUB_PERIOD_EMPLOYEE_NAME"", ""text"": ""What is the Employee Name?""}, {""alias"": ""PAYSTUB_PERIOD_COMPANY_NAME"", ""text"": ""What is the company Name?""}, {""alias"": ""PAYSTUB_PERIOD_CURRENT_GROSS_PAY"", ""text"": ""What is the Current Gross Pay?""}, {""alias"": ""PAYSTUB_PERIOD_YTD_GROSS_PAY"", ""text"": ""What is the YTD Gross Pay?""}, {""alias"": ""PAYSTUB_PERIOD_REGULAR_HOURLY_RATE"", ""text"": ""What is the regular hourly rate?""}, {""alias"": ""PAYSTUB_PERIOD_HOLIDAY_RATE"", ""text"": ""What is the holiday rate?""}], ""textractFeatures"": [""QUERIES""]}"

So, if the "classification"."documentType" in the Step Function Input is AWS_PAYSTUBS
then it will set the queriesConfig in the manifest for the subsequent Textract Calls in the Step Function flow

Input: "classification"."documentType"
Output: config set to manifest

Example (Python)
```
 configurator_task = tcdk.TextractClassificationConfigurator(
     self, f"{workflow_name}-Configurator",
 )

```

#### Initializers <a name="Initializers" id="amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.Initializer"></a>

```typescript
import { TextractClassificationConfigurator } from 'amazon-textract-idp-cdk-constructs'

new TextractClassificationConfigurator(parent: Construct, id: string, props: TextractClassificationConfiguratorProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.Initializer.parameter.parent">parent</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.Initializer.parameter.id">id</a></code> | <code>string</code> | Descriptive identifier for this chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.Initializer.parameter.props">props</a></code> | <code><a href="#amazon-textract-idp-cdk-constructs.TextractClassificationConfiguratorProps">TextractClassificationConfiguratorProps</a></code> | *No description.* |

---

##### `parent`<sup>Required</sup> <a name="parent" id="amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.Initializer.parameter.parent"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.Initializer.parameter.id"></a>

- *Type:* string

Descriptive identifier for this chainable.

---

##### `props`<sup>Required</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.Initializer.parameter.props"></a>

- *Type:* <a href="#amazon-textract-idp-cdk-constructs.TextractClassificationConfiguratorProps">TextractClassificationConfiguratorProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.next">next</a></code> | Continue normal execution with the given state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.prefixStates">prefixStates</a></code> | Prefix the IDs of all states in this state machine fragment. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.toSingleState">toSingleState</a></code> | Wrap all states in this state machine fragment up into a single state. |

---

##### `toString` <a name="toString" id="amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `next` <a name="next" id="amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.next"></a>

```typescript
public next(next: IChainable): Chain
```

Continue normal execution with the given state.

###### `next`<sup>Required</sup> <a name="next" id="amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.next.parameter.next"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.IChainable

---

##### `prefixStates` <a name="prefixStates" id="amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.prefixStates"></a>

```typescript
public prefixStates(prefix?: string): StateMachineFragment
```

Prefix the IDs of all states in this state machine fragment.

Use this to avoid multiple copies of the state machine all having the
same state IDs.

###### `prefix`<sup>Optional</sup> <a name="prefix" id="amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.prefixStates.parameter.prefix"></a>

- *Type:* string

The prefix to add.

Will use construct ID by default.

---

##### `toSingleState` <a name="toSingleState" id="amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.toSingleState"></a>

```typescript
public toSingleState(options?: SingleStateOptions): Parallel
```

Wrap all states in this state machine fragment up into a single state.

This can be used to add retry or error handling onto this state
machine fragment.

Be aware that this changes the result of the inner state machine
to be an array with the result of the state machine in it. Adjust
your paths accordingly. For example, change 'outputPath' to
'$[0]'.

###### `options`<sup>Optional</sup> <a name="options" id="amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.toSingleState.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.SingleStateOptions

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.isConstruct"></a>

```typescript
import { TextractClassificationConfigurator } from 'amazon-textract-idp-cdk-constructs'

TextractClassificationConfigurator.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.property.endStates">endStates</a></code> | <code>aws-cdk-lib.aws_stepfunctions.INextable[]</code> | The states to chain onto if this fragment is used. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.property.id">id</a></code> | <code>string</code> | Descriptive identifier for this chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.property.startState">startState</a></code> | <code>aws-cdk-lib.aws_stepfunctions.State</code> | The start state of this state machine fragment. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.property.configurationTable">configurationTable</a></code> | <code>aws-cdk-lib.aws_dynamodb.ITable</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.property.configurationTableName">configurationTableName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.property.configuratorFunction">configuratorFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `endStates`<sup>Required</sup> <a name="endStates" id="amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.property.endStates"></a>

```typescript
public readonly endStates: INextable[];
```

- *Type:* aws-cdk-lib.aws_stepfunctions.INextable[]

The states to chain onto if this fragment is used.

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

Descriptive identifier for this chainable.

---

##### `startState`<sup>Required</sup> <a name="startState" id="amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.property.startState"></a>

```typescript
public readonly startState: State;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.State

The start state of this state machine fragment.

---

##### `configurationTable`<sup>Required</sup> <a name="configurationTable" id="amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.property.configurationTable"></a>

```typescript
public readonly configurationTable: ITable;
```

- *Type:* aws-cdk-lib.aws_dynamodb.ITable

---

##### `configurationTableName`<sup>Required</sup> <a name="configurationTableName" id="amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.property.configurationTableName"></a>

```typescript
public readonly configurationTableName: string;
```

- *Type:* string

---

##### `configuratorFunction`<sup>Required</sup> <a name="configuratorFunction" id="amazon-textract-idp-cdk-constructs.TextractClassificationConfigurator.property.configuratorFunction"></a>

```typescript
public readonly configuratorFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---


### TextractComprehendMedical <a name="TextractComprehendMedical" id="amazon-textract-idp-cdk-constructs.TextractComprehendMedical"></a>

This construct takes in a manifest definition or a plain JSON with a s3Path:.

example s3Path:
{"s3Path": "s3://bucketname/prefix/image.png"}


Then it generated the numberOfPages attribute and the mime on the context.
The mime types checked against the supported mime types for Textract and if fails, will raise an Exception failing the workflow.

Example (Python)
```python
decider_task_id = tcdk.TextractPOCDecider(
self,
f"InsuranceDecider",
)
```

#### Initializers <a name="Initializers" id="amazon-textract-idp-cdk-constructs.TextractComprehendMedical.Initializer"></a>

```typescript
import { TextractComprehendMedical } from 'amazon-textract-idp-cdk-constructs'

new TextractComprehendMedical(parent: Construct, id: string, props: TextractComprehendMedicalProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractComprehendMedical.Initializer.parameter.parent">parent</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractComprehendMedical.Initializer.parameter.id">id</a></code> | <code>string</code> | Descriptive identifier for this chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractComprehendMedical.Initializer.parameter.props">props</a></code> | <code><a href="#amazon-textract-idp-cdk-constructs.TextractComprehendMedicalProps">TextractComprehendMedicalProps</a></code> | *No description.* |

---

##### `parent`<sup>Required</sup> <a name="parent" id="amazon-textract-idp-cdk-constructs.TextractComprehendMedical.Initializer.parameter.parent"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.TextractComprehendMedical.Initializer.parameter.id"></a>

- *Type:* string

Descriptive identifier for this chainable.

---

##### `props`<sup>Required</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractComprehendMedical.Initializer.parameter.props"></a>

- *Type:* <a href="#amazon-textract-idp-cdk-constructs.TextractComprehendMedicalProps">TextractComprehendMedicalProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractComprehendMedical.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractComprehendMedical.next">next</a></code> | Continue normal execution with the given state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractComprehendMedical.prefixStates">prefixStates</a></code> | Prefix the IDs of all states in this state machine fragment. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractComprehendMedical.toSingleState">toSingleState</a></code> | Wrap all states in this state machine fragment up into a single state. |

---

##### `toString` <a name="toString" id="amazon-textract-idp-cdk-constructs.TextractComprehendMedical.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `next` <a name="next" id="amazon-textract-idp-cdk-constructs.TextractComprehendMedical.next"></a>

```typescript
public next(next: IChainable): Chain
```

Continue normal execution with the given state.

###### `next`<sup>Required</sup> <a name="next" id="amazon-textract-idp-cdk-constructs.TextractComprehendMedical.next.parameter.next"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.IChainable

---

##### `prefixStates` <a name="prefixStates" id="amazon-textract-idp-cdk-constructs.TextractComprehendMedical.prefixStates"></a>

```typescript
public prefixStates(prefix?: string): StateMachineFragment
```

Prefix the IDs of all states in this state machine fragment.

Use this to avoid multiple copies of the state machine all having the
same state IDs.

###### `prefix`<sup>Optional</sup> <a name="prefix" id="amazon-textract-idp-cdk-constructs.TextractComprehendMedical.prefixStates.parameter.prefix"></a>

- *Type:* string

The prefix to add.

Will use construct ID by default.

---

##### `toSingleState` <a name="toSingleState" id="amazon-textract-idp-cdk-constructs.TextractComprehendMedical.toSingleState"></a>

```typescript
public toSingleState(options?: SingleStateOptions): Parallel
```

Wrap all states in this state machine fragment up into a single state.

This can be used to add retry or error handling onto this state
machine fragment.

Be aware that this changes the result of the inner state machine
to be an array with the result of the state machine in it. Adjust
your paths accordingly. For example, change 'outputPath' to
'$[0]'.

###### `options`<sup>Optional</sup> <a name="options" id="amazon-textract-idp-cdk-constructs.TextractComprehendMedical.toSingleState.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.SingleStateOptions

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractComprehendMedical.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="amazon-textract-idp-cdk-constructs.TextractComprehendMedical.isConstruct"></a>

```typescript
import { TextractComprehendMedical } from 'amazon-textract-idp-cdk-constructs'

TextractComprehendMedical.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="amazon-textract-idp-cdk-constructs.TextractComprehendMedical.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractComprehendMedical.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractComprehendMedical.property.endStates">endStates</a></code> | <code>aws-cdk-lib.aws_stepfunctions.INextable[]</code> | The states to chain onto if this fragment is used. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractComprehendMedical.property.id">id</a></code> | <code>string</code> | Descriptive identifier for this chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractComprehendMedical.property.startState">startState</a></code> | <code>aws-cdk-lib.aws_stepfunctions.State</code> | The start state of this state machine fragment. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractComprehendMedical.property.textractComprehendMedicalFunction">textractComprehendMedicalFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="amazon-textract-idp-cdk-constructs.TextractComprehendMedical.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `endStates`<sup>Required</sup> <a name="endStates" id="amazon-textract-idp-cdk-constructs.TextractComprehendMedical.property.endStates"></a>

```typescript
public readonly endStates: INextable[];
```

- *Type:* aws-cdk-lib.aws_stepfunctions.INextable[]

The states to chain onto if this fragment is used.

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.TextractComprehendMedical.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

Descriptive identifier for this chainable.

---

##### `startState`<sup>Required</sup> <a name="startState" id="amazon-textract-idp-cdk-constructs.TextractComprehendMedical.property.startState"></a>

```typescript
public readonly startState: State;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.State

The start state of this state machine fragment.

---

##### `textractComprehendMedicalFunction`<sup>Required</sup> <a name="textractComprehendMedicalFunction" id="amazon-textract-idp-cdk-constructs.TextractComprehendMedical.property.textractComprehendMedicalFunction"></a>

```typescript
public readonly textractComprehendMedicalFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---


### TextractGenerateCSV <a name="TextractGenerateCSV" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV"></a>

Generates a output based on Textract Forms and Queries. Supported output_types: "LINES" | "CSV".

Input: "Payload"."textract_result"."TextractOutputJsonPath"
Output: "TextractOutputCSVPath" TODO: rename


Output as LINES
Example (Python)
```python
        generate_text = tcdk.TextractGenerateCSV(
         self,
         "GenerateText",
         csv_s3_output_bucket=document_bucket.bucket_name,
         csv_s3_output_prefix=s3_txt_output_prefix,
         output_type='LINES',
         lambda_log_level="DEBUG",
         integration_pattern=sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
         input=sfn.TaskInput.from_object({
             "Token":
             sfn.JsonPath.task_token,
             "ExecutionId":
             sfn.JsonPath.string_at('$$.Execution.Id'),
             "Payload":
             sfn.JsonPath.entire_payload,
         }),
         result_path="$.txt_output_location")
```

#### Initializers <a name="Initializers" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.Initializer"></a>

```typescript
import { TextractGenerateCSV } from 'amazon-textract-idp-cdk-constructs'

new TextractGenerateCSV(scope: Construct, id: string, props: TextractGenerateCSVProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.Initializer.parameter.id">id</a></code> | <code>string</code> | Descriptive identifier for this chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.Initializer.parameter.props">props</a></code> | <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps">TextractGenerateCSVProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.Initializer.parameter.id"></a>

- *Type:* string

Descriptive identifier for this chainable.

---

##### `props`<sup>Required</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.Initializer.parameter.props"></a>

- *Type:* <a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps">TextractGenerateCSVProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.addPrefix">addPrefix</a></code> | Add a prefix to the stateId of this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.bindToGraph">bindToGraph</a></code> | Register this state as part of the given graph. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.toStateJson">toStateJson</a></code> | Return the Amazon States Language object for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.addCatch">addCatch</a></code> | Add a recovery handler for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.addRetry">addRetry</a></code> | Add retry configuration for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metric">metric</a></code> | Return the given named metric for this Task. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metricFailed">metricFailed</a></code> | Metric for the number of times this activity fails. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metricHeartbeatTimedOut">metricHeartbeatTimedOut</a></code> | Metric for the number of times the heartbeat times out for this activity. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metricRunTime">metricRunTime</a></code> | The interval, in milliseconds, between the time the Task starts and the time it closes. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metricScheduled">metricScheduled</a></code> | Metric for the number of times this activity is scheduled. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metricScheduleTime">metricScheduleTime</a></code> | The interval, in milliseconds, for which the activity stays in the schedule state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metricStarted">metricStarted</a></code> | Metric for the number of times this activity is started. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metricSucceeded">metricSucceeded</a></code> | Metric for the number of times this activity succeeds. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metricTime">metricTime</a></code> | The interval, in milliseconds, between the time the activity is scheduled and the time it closes. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metricTimedOut">metricTimedOut</a></code> | Metric for the number of times this activity times out. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.next">next</a></code> | Continue normal execution with the given state. |

---

##### `toString` <a name="toString" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addPrefix` <a name="addPrefix" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.addPrefix"></a>

```typescript
public addPrefix(x: string): void
```

Add a prefix to the stateId of this state.

###### `x`<sup>Required</sup> <a name="x" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.addPrefix.parameter.x"></a>

- *Type:* string

---

##### `bindToGraph` <a name="bindToGraph" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.bindToGraph"></a>

```typescript
public bindToGraph(graph: StateGraph): void
```

Register this state as part of the given graph.

Don't call this. It will be called automatically when you work
with states normally.

###### `graph`<sup>Required</sup> <a name="graph" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.bindToGraph.parameter.graph"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.StateGraph

---

##### `toStateJson` <a name="toStateJson" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.toStateJson"></a>

```typescript
public toStateJson(): object
```

Return the Amazon States Language object for this state.

##### `addCatch` <a name="addCatch" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.addCatch"></a>

```typescript
public addCatch(handler: IChainable, props?: CatchProps): TaskStateBase
```

Add a recovery handler for this state.

When a particular error occurs, execution will continue at the error
handler instead of failing the state machine execution.

###### `handler`<sup>Required</sup> <a name="handler" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.addCatch.parameter.handler"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.IChainable

---

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.addCatch.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.CatchProps

---

##### `addRetry` <a name="addRetry" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.addRetry"></a>

```typescript
public addRetry(props?: RetryProps): TaskStateBase
```

Add retry configuration for this state.

This controls if and how the execution will be retried if a particular
error occurs.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.addRetry.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.RetryProps

---

##### `metric` <a name="metric" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metric"></a>

```typescript
public metric(metricName: string, props?: MetricOptions): Metric
```

Return the given named metric for this Task.

###### `metricName`<sup>Required</sup> <a name="metricName" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metric.parameter.metricName"></a>

- *Type:* string

---

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metric.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricFailed` <a name="metricFailed" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metricFailed"></a>

```typescript
public metricFailed(props?: MetricOptions): Metric
```

Metric for the number of times this activity fails.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metricFailed.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricHeartbeatTimedOut` <a name="metricHeartbeatTimedOut" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metricHeartbeatTimedOut"></a>

```typescript
public metricHeartbeatTimedOut(props?: MetricOptions): Metric
```

Metric for the number of times the heartbeat times out for this activity.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metricHeartbeatTimedOut.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricRunTime` <a name="metricRunTime" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metricRunTime"></a>

```typescript
public metricRunTime(props?: MetricOptions): Metric
```

The interval, in milliseconds, between the time the Task starts and the time it closes.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metricRunTime.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricScheduled` <a name="metricScheduled" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metricScheduled"></a>

```typescript
public metricScheduled(props?: MetricOptions): Metric
```

Metric for the number of times this activity is scheduled.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metricScheduled.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricScheduleTime` <a name="metricScheduleTime" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metricScheduleTime"></a>

```typescript
public metricScheduleTime(props?: MetricOptions): Metric
```

The interval, in milliseconds, for which the activity stays in the schedule state.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metricScheduleTime.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricStarted` <a name="metricStarted" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metricStarted"></a>

```typescript
public metricStarted(props?: MetricOptions): Metric
```

Metric for the number of times this activity is started.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metricStarted.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricSucceeded` <a name="metricSucceeded" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metricSucceeded"></a>

```typescript
public metricSucceeded(props?: MetricOptions): Metric
```

Metric for the number of times this activity succeeds.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metricSucceeded.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricTime` <a name="metricTime" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metricTime"></a>

```typescript
public metricTime(props?: MetricOptions): Metric
```

The interval, in milliseconds, between the time the activity is scheduled and the time it closes.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metricTime.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricTimedOut` <a name="metricTimedOut" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metricTimedOut"></a>

```typescript
public metricTimedOut(props?: MetricOptions): Metric
```

Metric for the number of times this activity times out.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.metricTimedOut.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `next` <a name="next" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.next"></a>

```typescript
public next(next: IChainable): Chain
```

Continue normal execution with the given state.

###### `next`<sup>Required</sup> <a name="next" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.next.parameter.next"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.IChainable

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.filterNextables">filterNextables</a></code> | Return only the states that allow chaining from an array of states. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.findReachableEndStates">findReachableEndStates</a></code> | Find the set of end states states reachable through transitions from the given start state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.findReachableStates">findReachableStates</a></code> | Find the set of states reachable through transitions from the given start state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.prefixStates">prefixStates</a></code> | Add a prefix to the stateId of all States found in a construct tree. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.isConstruct"></a>

```typescript
import { TextractGenerateCSV } from 'amazon-textract-idp-cdk-constructs'

TextractGenerateCSV.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `filterNextables` <a name="filterNextables" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.filterNextables"></a>

```typescript
import { TextractGenerateCSV } from 'amazon-textract-idp-cdk-constructs'

TextractGenerateCSV.filterNextables(states: State[])
```

Return only the states that allow chaining from an array of states.

###### `states`<sup>Required</sup> <a name="states" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.filterNextables.parameter.states"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.State[]

---

##### `findReachableEndStates` <a name="findReachableEndStates" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.findReachableEndStates"></a>

```typescript
import { TextractGenerateCSV } from 'amazon-textract-idp-cdk-constructs'

TextractGenerateCSV.findReachableEndStates(start: State, options?: FindStateOptions)
```

Find the set of end states states reachable through transitions from the given start state.

###### `start`<sup>Required</sup> <a name="start" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.findReachableEndStates.parameter.start"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.State

---

###### `options`<sup>Optional</sup> <a name="options" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.findReachableEndStates.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.FindStateOptions

---

##### `findReachableStates` <a name="findReachableStates" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.findReachableStates"></a>

```typescript
import { TextractGenerateCSV } from 'amazon-textract-idp-cdk-constructs'

TextractGenerateCSV.findReachableStates(start: State, options?: FindStateOptions)
```

Find the set of states reachable through transitions from the given start state.

This does not retrieve states from within sub-graphs, such as states within a Parallel state's branch.

###### `start`<sup>Required</sup> <a name="start" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.findReachableStates.parameter.start"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.State

---

###### `options`<sup>Optional</sup> <a name="options" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.findReachableStates.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.FindStateOptions

---

##### `prefixStates` <a name="prefixStates" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.prefixStates"></a>

```typescript
import { TextractGenerateCSV } from 'amazon-textract-idp-cdk-constructs'

TextractGenerateCSV.prefixStates(root: IConstruct, prefix: string)
```

Add a prefix to the stateId of all States found in a construct tree.

###### `root`<sup>Required</sup> <a name="root" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.prefixStates.parameter.root"></a>

- *Type:* constructs.IConstruct

---

###### `prefix`<sup>Required</sup> <a name="prefix" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.prefixStates.parameter.prefix"></a>

- *Type:* string

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.property.endStates">endStates</a></code> | <code>aws-cdk-lib.aws_stepfunctions.INextable[]</code> | Continuable states of this Chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.property.id">id</a></code> | <code>string</code> | Descriptive identifier for this chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.property.startState">startState</a></code> | <code>aws-cdk-lib.aws_stepfunctions.State</code> | First state of this Chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.property.stateId">stateId</a></code> | <code>string</code> | Tokenized string that evaluates to the state's ID. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.property.generateCSVLambda">generateCSVLambda</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSV.property.stateMachine">stateMachine</a></code> | <code>aws-cdk-lib.aws_stepfunctions.StateMachine</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `endStates`<sup>Required</sup> <a name="endStates" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.property.endStates"></a>

```typescript
public readonly endStates: INextable[];
```

- *Type:* aws-cdk-lib.aws_stepfunctions.INextable[]

Continuable states of this Chainable.

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

Descriptive identifier for this chainable.

---

##### `startState`<sup>Required</sup> <a name="startState" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.property.startState"></a>

```typescript
public readonly startState: State;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.State

First state of this Chainable.

---

##### `stateId`<sup>Required</sup> <a name="stateId" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.property.stateId"></a>

```typescript
public readonly stateId: string;
```

- *Type:* string

Tokenized string that evaluates to the state's ID.

---

##### `generateCSVLambda`<sup>Required</sup> <a name="generateCSVLambda" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.property.generateCSVLambda"></a>

```typescript
public readonly generateCSVLambda: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `stateMachine`<sup>Required</sup> <a name="stateMachine" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSV.property.stateMachine"></a>

```typescript
public readonly stateMachine: StateMachine;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.StateMachine

---


### TextractGenericAsyncSfnTask <a name="TextractGenericAsyncSfnTask" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask"></a>

This Task calls the Textract through the asynchronous API.

Which API to call is defined in

When GENERIC is called with features in the manifest definition, will call the AnalzyeDocument API.

Takes the configuration from "Payload"."manifest"

Will retry on recoverable errors based on textractAsyncCallMaxRetries
errors for retry: ['ThrottlingException', 'LimitExceededException', 'InternalServerError', 'ProvisionedThroughputExceededException'],

Internally calls Start* calls with OutputConfig and SNSNotification.
Another Lambda functions waits for SNS Notification event and notifies the Step Function flow with the task token.

Step Function JSON input requirements

**Input**: "Payload"."manifest"

**Output**: "TextractTempOutputJsonPath" points to potentially paginated Textract JSON Schema output at "TextractTempOutputJsonPath" (using the example code it will be at: "textract_result"."TextractTempOutputJsonPath")

Works together with TextractAsyncToJSON, which takes the s3_output_bucket/s3_temp_output_prefix location as input

Example (Python)
```python
 textract_async_task = tcdk.TextractGenericAsyncSfnTask(
     self,
     "TextractAsync",
     s3_output_bucket=s3_output_bucket,
     s3_temp_output_prefix=s3_temp_output_prefix,
     integration_pattern=sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
     lambda_log_level="DEBUG",
     timeout=Duration.hours(24),
     input=sfn.TaskInput.from_object({
         "Token":
         sfn.JsonPath.task_token,
         "ExecutionId":
         sfn.JsonPath.string_at('$$.Execution.Id'),
         "Payload":
         sfn.JsonPath.entire_payload,
     }),
     result_path="$.textract_result")
 ```

#### Initializers <a name="Initializers" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.Initializer"></a>

```typescript
import { TextractGenericAsyncSfnTask } from 'amazon-textract-idp-cdk-constructs'

new TextractGenericAsyncSfnTask(scope: Construct, id: string, props: TextractGenericAsyncSfnTaskProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.Initializer.parameter.id">id</a></code> | <code>string</code> | Descriptive identifier for this chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.Initializer.parameter.props">props</a></code> | <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps">TextractGenericAsyncSfnTaskProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.Initializer.parameter.id"></a>

- *Type:* string

Descriptive identifier for this chainable.

---

##### `props`<sup>Required</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.Initializer.parameter.props"></a>

- *Type:* <a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps">TextractGenericAsyncSfnTaskProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.addPrefix">addPrefix</a></code> | Add a prefix to the stateId of this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.bindToGraph">bindToGraph</a></code> | Register this state as part of the given graph. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.toStateJson">toStateJson</a></code> | Return the Amazon States Language object for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.addCatch">addCatch</a></code> | Add a recovery handler for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.addRetry">addRetry</a></code> | Add retry configuration for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metric">metric</a></code> | Return the given named metric for this Task. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metricFailed">metricFailed</a></code> | Metric for the number of times this activity fails. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metricHeartbeatTimedOut">metricHeartbeatTimedOut</a></code> | Metric for the number of times the heartbeat times out for this activity. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metricRunTime">metricRunTime</a></code> | The interval, in milliseconds, between the time the Task starts and the time it closes. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metricScheduled">metricScheduled</a></code> | Metric for the number of times this activity is scheduled. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metricScheduleTime">metricScheduleTime</a></code> | The interval, in milliseconds, for which the activity stays in the schedule state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metricStarted">metricStarted</a></code> | Metric for the number of times this activity is started. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metricSucceeded">metricSucceeded</a></code> | Metric for the number of times this activity succeeds. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metricTime">metricTime</a></code> | The interval, in milliseconds, between the time the activity is scheduled and the time it closes. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metricTimedOut">metricTimedOut</a></code> | Metric for the number of times this activity times out. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.next">next</a></code> | Continue normal execution with the given state. |

---

##### `toString` <a name="toString" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addPrefix` <a name="addPrefix" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.addPrefix"></a>

```typescript
public addPrefix(x: string): void
```

Add a prefix to the stateId of this state.

###### `x`<sup>Required</sup> <a name="x" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.addPrefix.parameter.x"></a>

- *Type:* string

---

##### `bindToGraph` <a name="bindToGraph" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.bindToGraph"></a>

```typescript
public bindToGraph(graph: StateGraph): void
```

Register this state as part of the given graph.

Don't call this. It will be called automatically when you work
with states normally.

###### `graph`<sup>Required</sup> <a name="graph" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.bindToGraph.parameter.graph"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.StateGraph

---

##### `toStateJson` <a name="toStateJson" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.toStateJson"></a>

```typescript
public toStateJson(): object
```

Return the Amazon States Language object for this state.

##### `addCatch` <a name="addCatch" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.addCatch"></a>

```typescript
public addCatch(handler: IChainable, props?: CatchProps): TaskStateBase
```

Add a recovery handler for this state.

When a particular error occurs, execution will continue at the error
handler instead of failing the state machine execution.

###### `handler`<sup>Required</sup> <a name="handler" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.addCatch.parameter.handler"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.IChainable

---

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.addCatch.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.CatchProps

---

##### `addRetry` <a name="addRetry" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.addRetry"></a>

```typescript
public addRetry(props?: RetryProps): TaskStateBase
```

Add retry configuration for this state.

This controls if and how the execution will be retried if a particular
error occurs.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.addRetry.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.RetryProps

---

##### `metric` <a name="metric" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metric"></a>

```typescript
public metric(metricName: string, props?: MetricOptions): Metric
```

Return the given named metric for this Task.

###### `metricName`<sup>Required</sup> <a name="metricName" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metric.parameter.metricName"></a>

- *Type:* string

---

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metric.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricFailed` <a name="metricFailed" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metricFailed"></a>

```typescript
public metricFailed(props?: MetricOptions): Metric
```

Metric for the number of times this activity fails.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metricFailed.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricHeartbeatTimedOut` <a name="metricHeartbeatTimedOut" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metricHeartbeatTimedOut"></a>

```typescript
public metricHeartbeatTimedOut(props?: MetricOptions): Metric
```

Metric for the number of times the heartbeat times out for this activity.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metricHeartbeatTimedOut.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricRunTime` <a name="metricRunTime" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metricRunTime"></a>

```typescript
public metricRunTime(props?: MetricOptions): Metric
```

The interval, in milliseconds, between the time the Task starts and the time it closes.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metricRunTime.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricScheduled` <a name="metricScheduled" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metricScheduled"></a>

```typescript
public metricScheduled(props?: MetricOptions): Metric
```

Metric for the number of times this activity is scheduled.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metricScheduled.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricScheduleTime` <a name="metricScheduleTime" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metricScheduleTime"></a>

```typescript
public metricScheduleTime(props?: MetricOptions): Metric
```

The interval, in milliseconds, for which the activity stays in the schedule state.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metricScheduleTime.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricStarted` <a name="metricStarted" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metricStarted"></a>

```typescript
public metricStarted(props?: MetricOptions): Metric
```

Metric for the number of times this activity is started.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metricStarted.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricSucceeded` <a name="metricSucceeded" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metricSucceeded"></a>

```typescript
public metricSucceeded(props?: MetricOptions): Metric
```

Metric for the number of times this activity succeeds.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metricSucceeded.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricTime` <a name="metricTime" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metricTime"></a>

```typescript
public metricTime(props?: MetricOptions): Metric
```

The interval, in milliseconds, between the time the activity is scheduled and the time it closes.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metricTime.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricTimedOut` <a name="metricTimedOut" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metricTimedOut"></a>

```typescript
public metricTimedOut(props?: MetricOptions): Metric
```

Metric for the number of times this activity times out.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.metricTimedOut.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `next` <a name="next" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.next"></a>

```typescript
public next(next: IChainable): Chain
```

Continue normal execution with the given state.

###### `next`<sup>Required</sup> <a name="next" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.next.parameter.next"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.IChainable

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.filterNextables">filterNextables</a></code> | Return only the states that allow chaining from an array of states. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.findReachableEndStates">findReachableEndStates</a></code> | Find the set of end states states reachable through transitions from the given start state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.findReachableStates">findReachableStates</a></code> | Find the set of states reachable through transitions from the given start state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.prefixStates">prefixStates</a></code> | Add a prefix to the stateId of all States found in a construct tree. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.isConstruct"></a>

```typescript
import { TextractGenericAsyncSfnTask } from 'amazon-textract-idp-cdk-constructs'

TextractGenericAsyncSfnTask.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `filterNextables` <a name="filterNextables" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.filterNextables"></a>

```typescript
import { TextractGenericAsyncSfnTask } from 'amazon-textract-idp-cdk-constructs'

TextractGenericAsyncSfnTask.filterNextables(states: State[])
```

Return only the states that allow chaining from an array of states.

###### `states`<sup>Required</sup> <a name="states" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.filterNextables.parameter.states"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.State[]

---

##### `findReachableEndStates` <a name="findReachableEndStates" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.findReachableEndStates"></a>

```typescript
import { TextractGenericAsyncSfnTask } from 'amazon-textract-idp-cdk-constructs'

TextractGenericAsyncSfnTask.findReachableEndStates(start: State, options?: FindStateOptions)
```

Find the set of end states states reachable through transitions from the given start state.

###### `start`<sup>Required</sup> <a name="start" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.findReachableEndStates.parameter.start"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.State

---

###### `options`<sup>Optional</sup> <a name="options" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.findReachableEndStates.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.FindStateOptions

---

##### `findReachableStates` <a name="findReachableStates" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.findReachableStates"></a>

```typescript
import { TextractGenericAsyncSfnTask } from 'amazon-textract-idp-cdk-constructs'

TextractGenericAsyncSfnTask.findReachableStates(start: State, options?: FindStateOptions)
```

Find the set of states reachable through transitions from the given start state.

This does not retrieve states from within sub-graphs, such as states within a Parallel state's branch.

###### `start`<sup>Required</sup> <a name="start" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.findReachableStates.parameter.start"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.State

---

###### `options`<sup>Optional</sup> <a name="options" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.findReachableStates.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.FindStateOptions

---

##### `prefixStates` <a name="prefixStates" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.prefixStates"></a>

```typescript
import { TextractGenericAsyncSfnTask } from 'amazon-textract-idp-cdk-constructs'

TextractGenericAsyncSfnTask.prefixStates(root: IConstruct, prefix: string)
```

Add a prefix to the stateId of all States found in a construct tree.

###### `root`<sup>Required</sup> <a name="root" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.prefixStates.parameter.root"></a>

- *Type:* constructs.IConstruct

---

###### `prefix`<sup>Required</sup> <a name="prefix" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.prefixStates.parameter.prefix"></a>

- *Type:* string

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.endStates">endStates</a></code> | <code>aws-cdk-lib.aws_stepfunctions.INextable[]</code> | Continuable states of this Chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.id">id</a></code> | <code>string</code> | Descriptive identifier for this chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.startState">startState</a></code> | <code>aws-cdk-lib.aws_stepfunctions.State</code> | First state of this Chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.stateId">stateId</a></code> | <code>string</code> | Tokenized string that evaluates to the state's ID. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.stateMachine">stateMachine</a></code> | <code>aws-cdk-lib.aws_stepfunctions.IStateMachine</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.taskTokenTable">taskTokenTable</a></code> | <code>aws-cdk-lib.aws_dynamodb.ITable</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.taskTokenTableName">taskTokenTableName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.textractAsyncCallFunction">textractAsyncCallFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.textractAsyncReceiveSNSFunction">textractAsyncReceiveSNSFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.textractAsyncSNS">textractAsyncSNS</a></code> | <code>aws-cdk-lib.aws_sns.ITopic</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.textractAsyncSNSRole">textractAsyncSNSRole</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.asyncDurationMetric">asyncDurationMetric</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IMetric</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.asyncJobFailureMetric">asyncJobFailureMetric</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IMetric</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.asyncJobFinshedMetric">asyncJobFinshedMetric</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IMetric</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.asyncJobStartedMetric">asyncJobStartedMetric</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IMetric</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.asyncNumberPagesMetric">asyncNumberPagesMetric</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IMetric</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.asyncNumberPagesSendMetric">asyncNumberPagesSendMetric</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IMetric</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `endStates`<sup>Required</sup> <a name="endStates" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.endStates"></a>

```typescript
public readonly endStates: INextable[];
```

- *Type:* aws-cdk-lib.aws_stepfunctions.INextable[]

Continuable states of this Chainable.

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

Descriptive identifier for this chainable.

---

##### `startState`<sup>Required</sup> <a name="startState" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.startState"></a>

```typescript
public readonly startState: State;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.State

First state of this Chainable.

---

##### `stateId`<sup>Required</sup> <a name="stateId" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.stateId"></a>

```typescript
public readonly stateId: string;
```

- *Type:* string

Tokenized string that evaluates to the state's ID.

---

##### `stateMachine`<sup>Required</sup> <a name="stateMachine" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.stateMachine"></a>

```typescript
public readonly stateMachine: IStateMachine;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.IStateMachine

---

##### `taskTokenTable`<sup>Required</sup> <a name="taskTokenTable" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.taskTokenTable"></a>

```typescript
public readonly taskTokenTable: ITable;
```

- *Type:* aws-cdk-lib.aws_dynamodb.ITable

---

##### `taskTokenTableName`<sup>Required</sup> <a name="taskTokenTableName" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.taskTokenTableName"></a>

```typescript
public readonly taskTokenTableName: string;
```

- *Type:* string

---

##### `textractAsyncCallFunction`<sup>Required</sup> <a name="textractAsyncCallFunction" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.textractAsyncCallFunction"></a>

```typescript
public readonly textractAsyncCallFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `textractAsyncReceiveSNSFunction`<sup>Required</sup> <a name="textractAsyncReceiveSNSFunction" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.textractAsyncReceiveSNSFunction"></a>

```typescript
public readonly textractAsyncReceiveSNSFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `textractAsyncSNS`<sup>Required</sup> <a name="textractAsyncSNS" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.textractAsyncSNS"></a>

```typescript
public readonly textractAsyncSNS: ITopic;
```

- *Type:* aws-cdk-lib.aws_sns.ITopic

---

##### `textractAsyncSNSRole`<sup>Required</sup> <a name="textractAsyncSNSRole" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.textractAsyncSNSRole"></a>

```typescript
public readonly textractAsyncSNSRole: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole

---

##### `asyncDurationMetric`<sup>Optional</sup> <a name="asyncDurationMetric" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.asyncDurationMetric"></a>

```typescript
public readonly asyncDurationMetric: IMetric;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IMetric

---

##### `asyncJobFailureMetric`<sup>Optional</sup> <a name="asyncJobFailureMetric" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.asyncJobFailureMetric"></a>

```typescript
public readonly asyncJobFailureMetric: IMetric;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IMetric

---

##### `asyncJobFinshedMetric`<sup>Optional</sup> <a name="asyncJobFinshedMetric" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.asyncJobFinshedMetric"></a>

```typescript
public readonly asyncJobFinshedMetric: IMetric;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IMetric

---

##### `asyncJobStartedMetric`<sup>Optional</sup> <a name="asyncJobStartedMetric" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.asyncJobStartedMetric"></a>

```typescript
public readonly asyncJobStartedMetric: IMetric;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IMetric

---

##### `asyncNumberPagesMetric`<sup>Optional</sup> <a name="asyncNumberPagesMetric" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.asyncNumberPagesMetric"></a>

```typescript
public readonly asyncNumberPagesMetric: IMetric;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IMetric

---

##### `asyncNumberPagesSendMetric`<sup>Optional</sup> <a name="asyncNumberPagesSendMetric" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTask.property.asyncNumberPagesSendMetric"></a>

```typescript
public readonly asyncNumberPagesSendMetric: IMetric;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IMetric

---


### TextractGenericSyncSfnTask <a name="TextractGenericSyncSfnTask" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask"></a>

Calls Textract synchronous API.

Supports the Textract APIs:  'GENERIC' | 'ANALYZEID' | 'EXPENSE'
When GENERIC is called with features in the manifest definition, will call the AnalzyeDocument API.
Takes the configuration from "Payload"."manifest"
Will retry on recoverable errors based on textractAsyncCallMaxRetries
errors for retry: ['ThrottlingException', 'LimitExceededException', 'InternalServerError', 'ProvisionedThroughputExceededException'],

Input: "Payload"."manifest"
Output: Textract JSON Schema at  s3_output_bucket/s3_output_prefix

Example (Python)
```python
        textract_sync_task = tcdk.TextractGenericSyncSfnTask(
         self,
         "TextractSync",
         s3_output_bucket=document_bucket.bucket_name,
         s3_output_prefix=s3_output_prefix,
         integration_pattern=sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
         lambda_log_level="DEBUG",
         timeout=Duration.hours(24),
         input=sfn.TaskInput.from_object({
             "Token":
             sfn.JsonPath.task_token,
             "ExecutionId":
             sfn.JsonPath.string_at('$$.Execution.Id'),
             "Payload":
             sfn.JsonPath.entire_payload,
         }),
         result_path="$.textract_result")
```

#### Initializers <a name="Initializers" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.Initializer"></a>

```typescript
import { TextractGenericSyncSfnTask } from 'amazon-textract-idp-cdk-constructs'

new TextractGenericSyncSfnTask(scope: Construct, id: string, props: TextractGenericSyncSfnTaskProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.Initializer.parameter.id">id</a></code> | <code>string</code> | Descriptive identifier for this chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.Initializer.parameter.props">props</a></code> | <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps">TextractGenericSyncSfnTaskProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.Initializer.parameter.id"></a>

- *Type:* string

Descriptive identifier for this chainable.

---

##### `props`<sup>Required</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.Initializer.parameter.props"></a>

- *Type:* <a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps">TextractGenericSyncSfnTaskProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.addPrefix">addPrefix</a></code> | Add a prefix to the stateId of this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.bindToGraph">bindToGraph</a></code> | Register this state as part of the given graph. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.toStateJson">toStateJson</a></code> | Return the Amazon States Language object for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.addCatch">addCatch</a></code> | Add a recovery handler for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.addRetry">addRetry</a></code> | Add retry configuration for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metric">metric</a></code> | Return the given named metric for this Task. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metricFailed">metricFailed</a></code> | Metric for the number of times this activity fails. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metricHeartbeatTimedOut">metricHeartbeatTimedOut</a></code> | Metric for the number of times the heartbeat times out for this activity. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metricRunTime">metricRunTime</a></code> | The interval, in milliseconds, between the time the Task starts and the time it closes. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metricScheduled">metricScheduled</a></code> | Metric for the number of times this activity is scheduled. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metricScheduleTime">metricScheduleTime</a></code> | The interval, in milliseconds, for which the activity stays in the schedule state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metricStarted">metricStarted</a></code> | Metric for the number of times this activity is started. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metricSucceeded">metricSucceeded</a></code> | Metric for the number of times this activity succeeds. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metricTime">metricTime</a></code> | The interval, in milliseconds, between the time the activity is scheduled and the time it closes. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metricTimedOut">metricTimedOut</a></code> | Metric for the number of times this activity times out. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.next">next</a></code> | Continue normal execution with the given state. |

---

##### `toString` <a name="toString" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addPrefix` <a name="addPrefix" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.addPrefix"></a>

```typescript
public addPrefix(x: string): void
```

Add a prefix to the stateId of this state.

###### `x`<sup>Required</sup> <a name="x" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.addPrefix.parameter.x"></a>

- *Type:* string

---

##### `bindToGraph` <a name="bindToGraph" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.bindToGraph"></a>

```typescript
public bindToGraph(graph: StateGraph): void
```

Register this state as part of the given graph.

Don't call this. It will be called automatically when you work
with states normally.

###### `graph`<sup>Required</sup> <a name="graph" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.bindToGraph.parameter.graph"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.StateGraph

---

##### `toStateJson` <a name="toStateJson" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.toStateJson"></a>

```typescript
public toStateJson(): object
```

Return the Amazon States Language object for this state.

##### `addCatch` <a name="addCatch" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.addCatch"></a>

```typescript
public addCatch(handler: IChainable, props?: CatchProps): TaskStateBase
```

Add a recovery handler for this state.

When a particular error occurs, execution will continue at the error
handler instead of failing the state machine execution.

###### `handler`<sup>Required</sup> <a name="handler" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.addCatch.parameter.handler"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.IChainable

---

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.addCatch.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.CatchProps

---

##### `addRetry` <a name="addRetry" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.addRetry"></a>

```typescript
public addRetry(props?: RetryProps): TaskStateBase
```

Add retry configuration for this state.

This controls if and how the execution will be retried if a particular
error occurs.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.addRetry.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.RetryProps

---

##### `metric` <a name="metric" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metric"></a>

```typescript
public metric(metricName: string, props?: MetricOptions): Metric
```

Return the given named metric for this Task.

###### `metricName`<sup>Required</sup> <a name="metricName" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metric.parameter.metricName"></a>

- *Type:* string

---

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metric.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricFailed` <a name="metricFailed" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metricFailed"></a>

```typescript
public metricFailed(props?: MetricOptions): Metric
```

Metric for the number of times this activity fails.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metricFailed.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricHeartbeatTimedOut` <a name="metricHeartbeatTimedOut" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metricHeartbeatTimedOut"></a>

```typescript
public metricHeartbeatTimedOut(props?: MetricOptions): Metric
```

Metric for the number of times the heartbeat times out for this activity.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metricHeartbeatTimedOut.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricRunTime` <a name="metricRunTime" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metricRunTime"></a>

```typescript
public metricRunTime(props?: MetricOptions): Metric
```

The interval, in milliseconds, between the time the Task starts and the time it closes.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metricRunTime.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricScheduled` <a name="metricScheduled" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metricScheduled"></a>

```typescript
public metricScheduled(props?: MetricOptions): Metric
```

Metric for the number of times this activity is scheduled.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metricScheduled.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricScheduleTime` <a name="metricScheduleTime" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metricScheduleTime"></a>

```typescript
public metricScheduleTime(props?: MetricOptions): Metric
```

The interval, in milliseconds, for which the activity stays in the schedule state.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metricScheduleTime.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricStarted` <a name="metricStarted" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metricStarted"></a>

```typescript
public metricStarted(props?: MetricOptions): Metric
```

Metric for the number of times this activity is started.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metricStarted.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricSucceeded` <a name="metricSucceeded" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metricSucceeded"></a>

```typescript
public metricSucceeded(props?: MetricOptions): Metric
```

Metric for the number of times this activity succeeds.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metricSucceeded.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricTime` <a name="metricTime" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metricTime"></a>

```typescript
public metricTime(props?: MetricOptions): Metric
```

The interval, in milliseconds, between the time the activity is scheduled and the time it closes.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metricTime.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricTimedOut` <a name="metricTimedOut" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metricTimedOut"></a>

```typescript
public metricTimedOut(props?: MetricOptions): Metric
```

Metric for the number of times this activity times out.

###### `props`<sup>Optional</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.metricTimedOut.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `next` <a name="next" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.next"></a>

```typescript
public next(next: IChainable): Chain
```

Continue normal execution with the given state.

###### `next`<sup>Required</sup> <a name="next" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.next.parameter.next"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.IChainable

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.filterNextables">filterNextables</a></code> | Return only the states that allow chaining from an array of states. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.findReachableEndStates">findReachableEndStates</a></code> | Find the set of end states states reachable through transitions from the given start state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.findReachableStates">findReachableStates</a></code> | Find the set of states reachable through transitions from the given start state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.prefixStates">prefixStates</a></code> | Add a prefix to the stateId of all States found in a construct tree. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.isConstruct"></a>

```typescript
import { TextractGenericSyncSfnTask } from 'amazon-textract-idp-cdk-constructs'

TextractGenericSyncSfnTask.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `filterNextables` <a name="filterNextables" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.filterNextables"></a>

```typescript
import { TextractGenericSyncSfnTask } from 'amazon-textract-idp-cdk-constructs'

TextractGenericSyncSfnTask.filterNextables(states: State[])
```

Return only the states that allow chaining from an array of states.

###### `states`<sup>Required</sup> <a name="states" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.filterNextables.parameter.states"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.State[]

---

##### `findReachableEndStates` <a name="findReachableEndStates" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.findReachableEndStates"></a>

```typescript
import { TextractGenericSyncSfnTask } from 'amazon-textract-idp-cdk-constructs'

TextractGenericSyncSfnTask.findReachableEndStates(start: State, options?: FindStateOptions)
```

Find the set of end states states reachable through transitions from the given start state.

###### `start`<sup>Required</sup> <a name="start" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.findReachableEndStates.parameter.start"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.State

---

###### `options`<sup>Optional</sup> <a name="options" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.findReachableEndStates.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.FindStateOptions

---

##### `findReachableStates` <a name="findReachableStates" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.findReachableStates"></a>

```typescript
import { TextractGenericSyncSfnTask } from 'amazon-textract-idp-cdk-constructs'

TextractGenericSyncSfnTask.findReachableStates(start: State, options?: FindStateOptions)
```

Find the set of states reachable through transitions from the given start state.

This does not retrieve states from within sub-graphs, such as states within a Parallel state's branch.

###### `start`<sup>Required</sup> <a name="start" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.findReachableStates.parameter.start"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.State

---

###### `options`<sup>Optional</sup> <a name="options" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.findReachableStates.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.FindStateOptions

---

##### `prefixStates` <a name="prefixStates" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.prefixStates"></a>

```typescript
import { TextractGenericSyncSfnTask } from 'amazon-textract-idp-cdk-constructs'

TextractGenericSyncSfnTask.prefixStates(root: IConstruct, prefix: string)
```

Add a prefix to the stateId of all States found in a construct tree.

###### `root`<sup>Required</sup> <a name="root" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.prefixStates.parameter.root"></a>

- *Type:* constructs.IConstruct

---

###### `prefix`<sup>Required</sup> <a name="prefix" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.prefixStates.parameter.prefix"></a>

- *Type:* string

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.property.endStates">endStates</a></code> | <code>aws-cdk-lib.aws_stepfunctions.INextable[]</code> | Continuable states of this Chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.property.id">id</a></code> | <code>string</code> | Descriptive identifier for this chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.property.startState">startState</a></code> | <code>aws-cdk-lib.aws_stepfunctions.State</code> | First state of this Chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.property.stateId">stateId</a></code> | <code>string</code> | Tokenized string that evaluates to the state's ID. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.property.stateMachine">stateMachine</a></code> | <code>aws-cdk-lib.aws_stepfunctions.IStateMachine</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.property.textractSyncCallFunction">textractSyncCallFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.property.version">version</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.property.syncDurationMetric">syncDurationMetric</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IMetric</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.property.syncNumberPagesMetric">syncNumberPagesMetric</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IMetric</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.property.syncNumberPagesSendMetric">syncNumberPagesSendMetric</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IMetric</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.property.syncTimedOutMetric">syncTimedOutMetric</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IMetric</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `endStates`<sup>Required</sup> <a name="endStates" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.property.endStates"></a>

```typescript
public readonly endStates: INextable[];
```

- *Type:* aws-cdk-lib.aws_stepfunctions.INextable[]

Continuable states of this Chainable.

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

Descriptive identifier for this chainable.

---

##### `startState`<sup>Required</sup> <a name="startState" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.property.startState"></a>

```typescript
public readonly startState: State;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.State

First state of this Chainable.

---

##### `stateId`<sup>Required</sup> <a name="stateId" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.property.stateId"></a>

```typescript
public readonly stateId: string;
```

- *Type:* string

Tokenized string that evaluates to the state's ID.

---

##### `stateMachine`<sup>Required</sup> <a name="stateMachine" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.property.stateMachine"></a>

```typescript
public readonly stateMachine: IStateMachine;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.IStateMachine

---

##### `textractSyncCallFunction`<sup>Required</sup> <a name="textractSyncCallFunction" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.property.textractSyncCallFunction"></a>

```typescript
public readonly textractSyncCallFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `version`<sup>Required</sup> <a name="version" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.property.version"></a>

```typescript
public readonly version: string;
```

- *Type:* string

---

##### `syncDurationMetric`<sup>Optional</sup> <a name="syncDurationMetric" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.property.syncDurationMetric"></a>

```typescript
public readonly syncDurationMetric: IMetric;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IMetric

---

##### `syncNumberPagesMetric`<sup>Optional</sup> <a name="syncNumberPagesMetric" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.property.syncNumberPagesMetric"></a>

```typescript
public readonly syncNumberPagesMetric: IMetric;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IMetric

---

##### `syncNumberPagesSendMetric`<sup>Optional</sup> <a name="syncNumberPagesSendMetric" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.property.syncNumberPagesSendMetric"></a>

```typescript
public readonly syncNumberPagesSendMetric: IMetric;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IMetric

---

##### `syncTimedOutMetric`<sup>Optional</sup> <a name="syncTimedOutMetric" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTask.property.syncTimedOutMetric"></a>

```typescript
public readonly syncTimedOutMetric: IMetric;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IMetric

---


### TextractPdfMapperForFhir <a name="TextractPdfMapperForFhir" id="amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir"></a>

This construct takes in a manifest definition or a plain JSON with a s3Path:.

example s3Path:
{"s3Path": "s3://bucketname/prefix/image.png"}


Then it generated the numberOfPages attribute and the mime on the context.
The mime types checked against the supported mime types for Textract and if fails, will raise an Exception failing the workflow.

Example (Python)
```python
decider_task_id = tcdk.TextractPOCDecider(
self,
f"InsuranceDecider",
)
```

#### Initializers <a name="Initializers" id="amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.Initializer"></a>

```typescript
import { TextractPdfMapperForFhir } from 'amazon-textract-idp-cdk-constructs'

new TextractPdfMapperForFhir(parent: Construct, id: string, props: TextractPdfMapperForFhirProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.Initializer.parameter.parent">parent</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.Initializer.parameter.id">id</a></code> | <code>string</code> | Descriptive identifier for this chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.Initializer.parameter.props">props</a></code> | <code><a href="#amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhirProps">TextractPdfMapperForFhirProps</a></code> | *No description.* |

---

##### `parent`<sup>Required</sup> <a name="parent" id="amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.Initializer.parameter.parent"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.Initializer.parameter.id"></a>

- *Type:* string

Descriptive identifier for this chainable.

---

##### `props`<sup>Required</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.Initializer.parameter.props"></a>

- *Type:* <a href="#amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhirProps">TextractPdfMapperForFhirProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.next">next</a></code> | Continue normal execution with the given state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.prefixStates">prefixStates</a></code> | Prefix the IDs of all states in this state machine fragment. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.toSingleState">toSingleState</a></code> | Wrap all states in this state machine fragment up into a single state. |

---

##### `toString` <a name="toString" id="amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `next` <a name="next" id="amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.next"></a>

```typescript
public next(next: IChainable): Chain
```

Continue normal execution with the given state.

###### `next`<sup>Required</sup> <a name="next" id="amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.next.parameter.next"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.IChainable

---

##### `prefixStates` <a name="prefixStates" id="amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.prefixStates"></a>

```typescript
public prefixStates(prefix?: string): StateMachineFragment
```

Prefix the IDs of all states in this state machine fragment.

Use this to avoid multiple copies of the state machine all having the
same state IDs.

###### `prefix`<sup>Optional</sup> <a name="prefix" id="amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.prefixStates.parameter.prefix"></a>

- *Type:* string

The prefix to add.

Will use construct ID by default.

---

##### `toSingleState` <a name="toSingleState" id="amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.toSingleState"></a>

```typescript
public toSingleState(options?: SingleStateOptions): Parallel
```

Wrap all states in this state machine fragment up into a single state.

This can be used to add retry or error handling onto this state
machine fragment.

Be aware that this changes the result of the inner state machine
to be an array with the result of the state machine in it. Adjust
your paths accordingly. For example, change 'outputPath' to
'$[0]'.

###### `options`<sup>Optional</sup> <a name="options" id="amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.toSingleState.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.SingleStateOptions

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.isConstruct"></a>

```typescript
import { TextractPdfMapperForFhir } from 'amazon-textract-idp-cdk-constructs'

TextractPdfMapperForFhir.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.property.endStates">endStates</a></code> | <code>aws-cdk-lib.aws_stepfunctions.INextable[]</code> | The states to chain onto if this fragment is used. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.property.id">id</a></code> | <code>string</code> | Descriptive identifier for this chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.property.startState">startState</a></code> | <code>aws-cdk-lib.aws_stepfunctions.State</code> | The start state of this state machine fragment. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.property.pdfMapperForFhirFunction">pdfMapperForFhirFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `endStates`<sup>Required</sup> <a name="endStates" id="amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.property.endStates"></a>

```typescript
public readonly endStates: INextable[];
```

- *Type:* aws-cdk-lib.aws_stepfunctions.INextable[]

The states to chain onto if this fragment is used.

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

Descriptive identifier for this chainable.

---

##### `startState`<sup>Required</sup> <a name="startState" id="amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.property.startState"></a>

```typescript
public readonly startState: State;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.State

The start state of this state machine fragment.

---

##### `pdfMapperForFhirFunction`<sup>Required</sup> <a name="pdfMapperForFhirFunction" id="amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhir.property.pdfMapperForFhirFunction"></a>

```typescript
public readonly pdfMapperForFhirFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---


### TextractPOCDecider <a name="TextractPOCDecider" id="amazon-textract-idp-cdk-constructs.TextractPOCDecider"></a>

This construct takes in a manifest definition or a plain JSON with a s3Path:.

example s3Path:
{"s3Path": "s3://bucketname/prefix/image.png"}


Then it generated the numberOfPages attribute and the mime on the context.
The mime types checked against the supported mime types for Textract and if fails, will raise an Exception failing the workflow.

Example (Python)
```python
decider_task_id = tcdk.TextractPOCDecider(
     self,
     f"InsuranceDecider",
)
```

#### Initializers <a name="Initializers" id="amazon-textract-idp-cdk-constructs.TextractPOCDecider.Initializer"></a>

```typescript
import { TextractPOCDecider } from 'amazon-textract-idp-cdk-constructs'

new TextractPOCDecider(parent: Construct, id: string, props: TextractDPPOCDeciderProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPOCDecider.Initializer.parameter.parent">parent</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPOCDecider.Initializer.parameter.id">id</a></code> | <code>string</code> | Descriptive identifier for this chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPOCDecider.Initializer.parameter.props">props</a></code> | <code><a href="#amazon-textract-idp-cdk-constructs.TextractDPPOCDeciderProps">TextractDPPOCDeciderProps</a></code> | *No description.* |

---

##### `parent`<sup>Required</sup> <a name="parent" id="amazon-textract-idp-cdk-constructs.TextractPOCDecider.Initializer.parameter.parent"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.TextractPOCDecider.Initializer.parameter.id"></a>

- *Type:* string

Descriptive identifier for this chainable.

---

##### `props`<sup>Required</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.TextractPOCDecider.Initializer.parameter.props"></a>

- *Type:* <a href="#amazon-textract-idp-cdk-constructs.TextractDPPOCDeciderProps">TextractDPPOCDeciderProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPOCDecider.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPOCDecider.next">next</a></code> | Continue normal execution with the given state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPOCDecider.prefixStates">prefixStates</a></code> | Prefix the IDs of all states in this state machine fragment. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPOCDecider.toSingleState">toSingleState</a></code> | Wrap all states in this state machine fragment up into a single state. |

---

##### `toString` <a name="toString" id="amazon-textract-idp-cdk-constructs.TextractPOCDecider.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `next` <a name="next" id="amazon-textract-idp-cdk-constructs.TextractPOCDecider.next"></a>

```typescript
public next(next: IChainable): Chain
```

Continue normal execution with the given state.

###### `next`<sup>Required</sup> <a name="next" id="amazon-textract-idp-cdk-constructs.TextractPOCDecider.next.parameter.next"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.IChainable

---

##### `prefixStates` <a name="prefixStates" id="amazon-textract-idp-cdk-constructs.TextractPOCDecider.prefixStates"></a>

```typescript
public prefixStates(prefix?: string): StateMachineFragment
```

Prefix the IDs of all states in this state machine fragment.

Use this to avoid multiple copies of the state machine all having the
same state IDs.

###### `prefix`<sup>Optional</sup> <a name="prefix" id="amazon-textract-idp-cdk-constructs.TextractPOCDecider.prefixStates.parameter.prefix"></a>

- *Type:* string

The prefix to add.

Will use construct ID by default.

---

##### `toSingleState` <a name="toSingleState" id="amazon-textract-idp-cdk-constructs.TextractPOCDecider.toSingleState"></a>

```typescript
public toSingleState(options?: SingleStateOptions): Parallel
```

Wrap all states in this state machine fragment up into a single state.

This can be used to add retry or error handling onto this state
machine fragment.

Be aware that this changes the result of the inner state machine
to be an array with the result of the state machine in it. Adjust
your paths accordingly. For example, change 'outputPath' to
'$[0]'.

###### `options`<sup>Optional</sup> <a name="options" id="amazon-textract-idp-cdk-constructs.TextractPOCDecider.toSingleState.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_stepfunctions.SingleStateOptions

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPOCDecider.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="amazon-textract-idp-cdk-constructs.TextractPOCDecider.isConstruct"></a>

```typescript
import { TextractPOCDecider } from 'amazon-textract-idp-cdk-constructs'

TextractPOCDecider.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="amazon-textract-idp-cdk-constructs.TextractPOCDecider.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPOCDecider.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPOCDecider.property.endStates">endStates</a></code> | <code>aws-cdk-lib.aws_stepfunctions.INextable[]</code> | The states to chain onto if this fragment is used. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPOCDecider.property.id">id</a></code> | <code>string</code> | Descriptive identifier for this chainable. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPOCDecider.property.startState">startState</a></code> | <code>aws-cdk-lib.aws_stepfunctions.State</code> | The start state of this state machine fragment. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPOCDecider.property.deciderFunction">deciderFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="amazon-textract-idp-cdk-constructs.TextractPOCDecider.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `endStates`<sup>Required</sup> <a name="endStates" id="amazon-textract-idp-cdk-constructs.TextractPOCDecider.property.endStates"></a>

```typescript
public readonly endStates: INextable[];
```

- *Type:* aws-cdk-lib.aws_stepfunctions.INextable[]

The states to chain onto if this fragment is used.

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.TextractPOCDecider.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

Descriptive identifier for this chainable.

---

##### `startState`<sup>Required</sup> <a name="startState" id="amazon-textract-idp-cdk-constructs.TextractPOCDecider.property.startState"></a>

```typescript
public readonly startState: State;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.State

The start state of this state machine fragment.

---

##### `deciderFunction`<sup>Required</sup> <a name="deciderFunction" id="amazon-textract-idp-cdk-constructs.TextractPOCDecider.property.deciderFunction"></a>

```typescript
public readonly deciderFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---


### WorkmailS3IngestionPoint <a name="WorkmailS3IngestionPoint" id="amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPoint"></a>

#### Initializers <a name="Initializers" id="amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPoint.Initializer"></a>

```typescript
import { WorkmailS3IngestionPoint } from 'amazon-textract-idp-cdk-constructs'

new WorkmailS3IngestionPoint(scope: Construct, id: string, props: WorkmailS3IngestionPointProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPoint.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPoint.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPoint.Initializer.parameter.props">props</a></code> | <code><a href="#amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPointProps">WorkmailS3IngestionPointProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPoint.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPoint.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPoint.Initializer.parameter.props"></a>

- *Type:* <a href="#amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPointProps">WorkmailS3IngestionPointProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPoint.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPoint.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPoint.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPoint.isConstruct"></a>

```typescript
import { WorkmailS3IngestionPoint } from 'amazon-textract-idp-cdk-constructs'

WorkmailS3IngestionPoint.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPoint.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPoint.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPoint.property.props">props</a></code> | <code><a href="#amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPointProps">WorkmailS3IngestionPointProps</a></code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPoint.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `props`<sup>Required</sup> <a name="props" id="amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPoint.property.props"></a>

```typescript
public readonly props: WorkmailS3IngestionPointProps;
```

- *Type:* <a href="#amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPointProps">WorkmailS3IngestionPointProps</a>

---


## Structs <a name="Structs" id="Structs"></a>

### ComprehendGenericSyncSfnTaskProps <a name="ComprehendGenericSyncSfnTaskProps" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps"></a>

#### Initializer <a name="Initializer" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.Initializer"></a>

```typescript
import { ComprehendGenericSyncSfnTaskProps } from 'amazon-textract-idp-cdk-constructs'

const comprehendGenericSyncSfnTaskProps: ComprehendGenericSyncSfnTaskProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.comment">comment</a></code> | <code>string</code> | An optional description for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.credentials">credentials</a></code> | <code>aws-cdk-lib.aws_stepfunctions.Credentials</code> | Credentials for an IAM Role that the State Machine assumes for executing the task. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.heartbeat">heartbeat</a></code> | <code>aws-cdk-lib.Duration</code> | Timeout for the heartbeat. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.heartbeatTimeout">heartbeatTimeout</a></code> | <code>aws-cdk-lib.aws_stepfunctions.Timeout</code> | Timeout for the heartbeat. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.inputPath">inputPath</a></code> | <code>string</code> | JSONPath expression to select part of the state to be the input to this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.integrationPattern">integrationPattern</a></code> | <code>aws-cdk-lib.aws_stepfunctions.IntegrationPattern</code> | AWS Step Functions integrates with services directly in the Amazon States Language. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.outputPath">outputPath</a></code> | <code>string</code> | JSONPath expression to select select a portion of the state output to pass to the next state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.resultPath">resultPath</a></code> | <code>string</code> | JSONPath expression to indicate where to inject the state's output. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.resultSelector">resultSelector</a></code> | <code>{[ key: string ]: any}</code> | The JSON that will replace the state's raw result and become the effective result before ResultPath is applied. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.stateName">stateName</a></code> | <code>string</code> | Optional name for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.taskTimeout">taskTimeout</a></code> | <code>aws-cdk-lib.aws_stepfunctions.Timeout</code> | Timeout for the task. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.timeout">timeout</a></code> | <code>aws-cdk-lib.Duration</code> | Timeout for the task. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.comprehendClassifierArn">comprehendClassifierArn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.associateWithParent">associateWithParent</a></code> | <code>boolean</code> | Pass the execution ID from the context object to the execution input. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.comprehendAsyncCallBackoffRate">comprehendAsyncCallBackoffRate</a></code> | <code>number</code> | default is 1.1. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.comprehendAsyncCallInterval">comprehendAsyncCallInterval</a></code> | <code>number</code> | default is 1. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.comprehendAsyncCallMaxRetries">comprehendAsyncCallMaxRetries</a></code> | <code>number</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.input">input</a></code> | <code>aws-cdk-lib.aws_stepfunctions.TaskInput</code> | The JSON input for the execution, same as that of StartExecution. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.inputPolicyStatements">inputPolicyStatements</a></code> | <code>aws-cdk-lib.aws_iam.PolicyStatement[]</code> | List of PolicyStatements to attach to the Lambda function. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.lambdaLogLevel">lambdaLogLevel</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.lambdaMemory">lambdaMemory</a></code> | <code>number</code> | Memory allocated to Lambda function, default 512. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.lambdaTimeout">lambdaTimeout</a></code> | <code>number</code> | Lambda Function Timeout in seconds, default 300. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.name">name</a></code> | <code>string</code> | The name of the execution, same as that of StartExecution. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.outputPolicyStatements">outputPolicyStatements</a></code> | <code>aws-cdk-lib.aws_iam.PolicyStatement[]</code> | List of PolicyStatements to attach to the Lambda function. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.s3InputBucket">s3InputBucket</a></code> | <code>string</code> | location of input S3 objects - if left empty will generate rule for s3 access to all [*]. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.s3InputPrefix">s3InputPrefix</a></code> | <code>string</code> | prefix for input S3 objects - if left empty will generate rule for s3 access to all in bucket. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.s3OutputBucket">s3OutputBucket</a></code> | <code>string</code> | Bucketname to output data to. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.s3OutputPrefix">s3OutputPrefix</a></code> | <code>string</code> | The prefix to use for the temporary output files (e. |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.textractStateMachineTimeoutMinutes">textractStateMachineTimeoutMinutes</a></code> | <code>number</code> | how long can we wait for the process (default is 60 minutes). |
| <code><a href="#amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.workflowTracingEnabled">workflowTracingEnabled</a></code> | <code>boolean</code> | *No description.* |

---

##### `comment`<sup>Optional</sup> <a name="comment" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.comment"></a>

```typescript
public readonly comment: string;
```

- *Type:* string
- *Default:* No comment

An optional description for this state.

---

##### `credentials`<sup>Optional</sup> <a name="credentials" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.credentials"></a>

```typescript
public readonly credentials: Credentials;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.Credentials
- *Default:* None (Task is executed using the State Machine's execution role)

Credentials for an IAM Role that the State Machine assumes for executing the task.

This enables cross-account resource invocations.

> [https://docs.aws.amazon.com/step-functions/latest/dg/concepts-access-cross-acct-resources.html](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-access-cross-acct-resources.html)

---

##### ~~`heartbeat`~~<sup>Optional</sup> <a name="heartbeat" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.heartbeat"></a>

- *Deprecated:* use `heartbeatTimeout`

```typescript
public readonly heartbeat: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* None

Timeout for the heartbeat.

---

##### `heartbeatTimeout`<sup>Optional</sup> <a name="heartbeatTimeout" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.heartbeatTimeout"></a>

```typescript
public readonly heartbeatTimeout: Timeout;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.Timeout
- *Default:* None

Timeout for the heartbeat.

[disable-awslint:duration-prop-type] is needed because all props interface in
aws-stepfunctions-tasks extend this interface

---

##### `inputPath`<sup>Optional</sup> <a name="inputPath" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.inputPath"></a>

```typescript
public readonly inputPath: string;
```

- *Type:* string
- *Default:* The entire task input (JSON path '$')

JSONPath expression to select part of the state to be the input to this state.

May also be the special value JsonPath.DISCARD, which will cause the effective
input to be the empty object {}.

---

##### `integrationPattern`<sup>Optional</sup> <a name="integrationPattern" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.integrationPattern"></a>

```typescript
public readonly integrationPattern: IntegrationPattern;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.IntegrationPattern
- *Default:* `IntegrationPattern.REQUEST_RESPONSE` for most tasks. `IntegrationPattern.RUN_JOB` for the following exceptions: `BatchSubmitJob`, `EmrAddStep`, `EmrCreateCluster`, `EmrTerminationCluster`, and `EmrContainersStartJobRun`.

AWS Step Functions integrates with services directly in the Amazon States Language.

You can control these AWS services using service integration patterns.

Depending on the AWS Service, the Service Integration Pattern availability will vary.

> [https://docs.aws.amazon.com/step-functions/latest/dg/connect-supported-services.html](https://docs.aws.amazon.com/step-functions/latest/dg/connect-supported-services.html)

---

##### `outputPath`<sup>Optional</sup> <a name="outputPath" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.outputPath"></a>

```typescript
public readonly outputPath: string;
```

- *Type:* string
- *Default:* The entire JSON node determined by the state input, the task result, and resultPath is passed to the next state (JSON path '$')

JSONPath expression to select select a portion of the state output to pass to the next state.

May also be the special value JsonPath.DISCARD, which will cause the effective
output to be the empty object {}.

---

##### `resultPath`<sup>Optional</sup> <a name="resultPath" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.resultPath"></a>

```typescript
public readonly resultPath: string;
```

- *Type:* string
- *Default:* Replaces the entire input with the result (JSON path '$')

JSONPath expression to indicate where to inject the state's output.

May also be the special value JsonPath.DISCARD, which will cause the state's
input to become its output.

---

##### `resultSelector`<sup>Optional</sup> <a name="resultSelector" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.resultSelector"></a>

```typescript
public readonly resultSelector: {[ key: string ]: any};
```

- *Type:* {[ key: string ]: any}
- *Default:* None

The JSON that will replace the state's raw result and become the effective result before ResultPath is applied.

You can use ResultSelector to create a payload with values that are static
or selected from the state's raw result.

> [https://docs.aws.amazon.com/step-functions/latest/dg/input-output-inputpath-params.html#input-output-resultselector](https://docs.aws.amazon.com/step-functions/latest/dg/input-output-inputpath-params.html#input-output-resultselector)

---

##### `stateName`<sup>Optional</sup> <a name="stateName" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.stateName"></a>

```typescript
public readonly stateName: string;
```

- *Type:* string
- *Default:* The construct ID will be used as state name

Optional name for this state.

---

##### `taskTimeout`<sup>Optional</sup> <a name="taskTimeout" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.taskTimeout"></a>

```typescript
public readonly taskTimeout: Timeout;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.Timeout
- *Default:* None

Timeout for the task.

[disable-awslint:duration-prop-type] is needed because all props interface in
aws-stepfunctions-tasks extend this interface

---

##### ~~`timeout`~~<sup>Optional</sup> <a name="timeout" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.timeout"></a>

- *Deprecated:* use `taskTimeout`

```typescript
public readonly timeout: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* None

Timeout for the task.

---

##### `comprehendClassifierArn`<sup>Required</sup> <a name="comprehendClassifierArn" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.comprehendClassifierArn"></a>

```typescript
public readonly comprehendClassifierArn: string;
```

- *Type:* string

---

##### `associateWithParent`<sup>Optional</sup> <a name="associateWithParent" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.associateWithParent"></a>

```typescript
public readonly associateWithParent: boolean;
```

- *Type:* boolean
- *Default:* false

Pass the execution ID from the context object to the execution input.

This allows the Step Functions UI to link child executions from parent executions, making it easier to trace execution flow across state machines.

If you set this property to `true`, the `input` property must be an object (provided by `sfn.TaskInput.fromObject`) or omitted entirely.

> [https://docs.aws.amazon.com/step-functions/latest/dg/concepts-nested-workflows.html#nested-execution-startid](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-nested-workflows.html#nested-execution-startid)

---

##### `comprehendAsyncCallBackoffRate`<sup>Optional</sup> <a name="comprehendAsyncCallBackoffRate" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.comprehendAsyncCallBackoffRate"></a>

```typescript
public readonly comprehendAsyncCallBackoffRate: number;
```

- *Type:* number

default is 1.1.

---

##### `comprehendAsyncCallInterval`<sup>Optional</sup> <a name="comprehendAsyncCallInterval" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.comprehendAsyncCallInterval"></a>

```typescript
public readonly comprehendAsyncCallInterval: number;
```

- *Type:* number

default is 1.

---

##### `comprehendAsyncCallMaxRetries`<sup>Optional</sup> <a name="comprehendAsyncCallMaxRetries" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.comprehendAsyncCallMaxRetries"></a>

```typescript
public readonly comprehendAsyncCallMaxRetries: number;
```

- *Type:* number

---

##### `input`<sup>Optional</sup> <a name="input" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.input"></a>

```typescript
public readonly input: TaskInput;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.TaskInput
- *Default:* The state input (JSON path '$')

The JSON input for the execution, same as that of StartExecution.

> [https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html](https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html)

---

##### `inputPolicyStatements`<sup>Optional</sup> <a name="inputPolicyStatements" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.inputPolicyStatements"></a>

```typescript
public readonly inputPolicyStatements: PolicyStatement[];
```

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement[]

List of PolicyStatements to attach to the Lambda function.

---

##### `lambdaLogLevel`<sup>Optional</sup> <a name="lambdaLogLevel" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.lambdaLogLevel"></a>

```typescript
public readonly lambdaLogLevel: string;
```

- *Type:* string

---

##### `lambdaMemory`<sup>Optional</sup> <a name="lambdaMemory" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.lambdaMemory"></a>

```typescript
public readonly lambdaMemory: number;
```

- *Type:* number

Memory allocated to Lambda function, default 512.

---

##### `lambdaTimeout`<sup>Optional</sup> <a name="lambdaTimeout" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.lambdaTimeout"></a>

```typescript
public readonly lambdaTimeout: number;
```

- *Type:* number

Lambda Function Timeout in seconds, default 300.

---

##### `name`<sup>Optional</sup> <a name="name" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string
- *Default:* None

The name of the execution, same as that of StartExecution.

> [https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html](https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html)

---

##### `outputPolicyStatements`<sup>Optional</sup> <a name="outputPolicyStatements" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.outputPolicyStatements"></a>

```typescript
public readonly outputPolicyStatements: PolicyStatement[];
```

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement[]

List of PolicyStatements to attach to the Lambda function.

---

##### `s3InputBucket`<sup>Optional</sup> <a name="s3InputBucket" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.s3InputBucket"></a>

```typescript
public readonly s3InputBucket: string;
```

- *Type:* string

location of input S3 objects - if left empty will generate rule for s3 access to all [*].

---

##### `s3InputPrefix`<sup>Optional</sup> <a name="s3InputPrefix" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.s3InputPrefix"></a>

```typescript
public readonly s3InputPrefix: string;
```

- *Type:* string

prefix for input S3 objects - if left empty will generate rule for s3 access to all in bucket.

---

##### `s3OutputBucket`<sup>Optional</sup> <a name="s3OutputBucket" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.s3OutputBucket"></a>

```typescript
public readonly s3OutputBucket: string;
```

- *Type:* string

Bucketname to output data to.

---

##### `s3OutputPrefix`<sup>Optional</sup> <a name="s3OutputPrefix" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.s3OutputPrefix"></a>

```typescript
public readonly s3OutputPrefix: string;
```

- *Type:* string

The prefix to use for the temporary output files (e.

g. output from async process before stiching together)

---

##### `textractStateMachineTimeoutMinutes`<sup>Optional</sup> <a name="textractStateMachineTimeoutMinutes" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.textractStateMachineTimeoutMinutes"></a>

```typescript
public readonly textractStateMachineTimeoutMinutes: number;
```

- *Type:* number

how long can we wait for the process (default is 60 minutes).

---

##### `workflowTracingEnabled`<sup>Optional</sup> <a name="workflowTracingEnabled" id="amazon-textract-idp-cdk-constructs.ComprehendGenericSyncSfnTaskProps.property.workflowTracingEnabled"></a>

```typescript
public readonly workflowTracingEnabled: boolean;
```

- *Type:* boolean

---

### CSVToAuroraTaskProps <a name="CSVToAuroraTaskProps" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps"></a>

#### Initializer <a name="Initializer" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.Initializer"></a>

```typescript
import { CSVToAuroraTaskProps } from 'amazon-textract-idp-cdk-constructs'

const cSVToAuroraTaskProps: CSVToAuroraTaskProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.comment">comment</a></code> | <code>string</code> | An optional description for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.credentials">credentials</a></code> | <code>aws-cdk-lib.aws_stepfunctions.Credentials</code> | Credentials for an IAM Role that the State Machine assumes for executing the task. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.heartbeat">heartbeat</a></code> | <code>aws-cdk-lib.Duration</code> | Timeout for the heartbeat. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.heartbeatTimeout">heartbeatTimeout</a></code> | <code>aws-cdk-lib.aws_stepfunctions.Timeout</code> | Timeout for the heartbeat. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.inputPath">inputPath</a></code> | <code>string</code> | JSONPath expression to select part of the state to be the input to this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.integrationPattern">integrationPattern</a></code> | <code>aws-cdk-lib.aws_stepfunctions.IntegrationPattern</code> | AWS Step Functions integrates with services directly in the Amazon States Language. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.outputPath">outputPath</a></code> | <code>string</code> | JSONPath expression to select select a portion of the state output to pass to the next state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.resultPath">resultPath</a></code> | <code>string</code> | JSONPath expression to indicate where to inject the state's output. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.resultSelector">resultSelector</a></code> | <code>{[ key: string ]: any}</code> | The JSON that will replace the state's raw result and become the effective result before ResultPath is applied. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.stateName">stateName</a></code> | <code>string</code> | Optional name for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.taskTimeout">taskTimeout</a></code> | <code>aws-cdk-lib.aws_stepfunctions.Timeout</code> | Timeout for the task. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.timeout">timeout</a></code> | <code>aws-cdk-lib.Duration</code> | Timeout for the task. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.associateWithParent">associateWithParent</a></code> | <code>boolean</code> | Pass the execution ID from the context object to the execution input. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.auroraSecurityGroup">auroraSecurityGroup</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup</code> | auroraSecurity Group for Cluster. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.csvToAuroraBackoffRate">csvToAuroraBackoffRate</a></code> | <code>number</code> | default is 1.1. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.csvToAuroraInterval">csvToAuroraInterval</a></code> | <code>number</code> | default is 1. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.csvToAuroraMaxRetries">csvToAuroraMaxRetries</a></code> | <code>number</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.dbCluster">dbCluster</a></code> | <code>aws-cdk-lib.aws_rds.IServerlessCluster</code> | DBCluster to import into. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.enableCloudWatchMetricsAndDashboard">enableCloudWatchMetricsAndDashboard</a></code> | <code>boolean</code> | enable CloudWatch Metrics and Dashboard. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.input">input</a></code> | <code>aws-cdk-lib.aws_stepfunctions.TaskInput</code> | The JSON input for the execution, same as that of StartExecution. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.lambdaLogLevel">lambdaLogLevel</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.lambdaMemory">lambdaMemory</a></code> | <code>number</code> | Memory allocated to Lambda function, default 512. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.lambdaSecurityGroup">lambdaSecurityGroup</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup</code> | lambdaSecurity Group for Cluster. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.lambdaTimeout">lambdaTimeout</a></code> | <code>number</code> | Lambda Function Timeout in seconds, default 300. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.name">name</a></code> | <code>string</code> | The name of the execution, same as that of StartExecution. |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.textractStateMachineTimeoutMinutes">textractStateMachineTimeoutMinutes</a></code> | <code>number</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.vpc">vpc</a></code> | <code>aws-cdk-lib.aws_ec2.IVpc</code> | VPC to install the database into, optional if dbCluster is passed in. |

---

##### `comment`<sup>Optional</sup> <a name="comment" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.comment"></a>

```typescript
public readonly comment: string;
```

- *Type:* string
- *Default:* No comment

An optional description for this state.

---

##### `credentials`<sup>Optional</sup> <a name="credentials" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.credentials"></a>

```typescript
public readonly credentials: Credentials;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.Credentials
- *Default:* None (Task is executed using the State Machine's execution role)

Credentials for an IAM Role that the State Machine assumes for executing the task.

This enables cross-account resource invocations.

> [https://docs.aws.amazon.com/step-functions/latest/dg/concepts-access-cross-acct-resources.html](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-access-cross-acct-resources.html)

---

##### ~~`heartbeat`~~<sup>Optional</sup> <a name="heartbeat" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.heartbeat"></a>

- *Deprecated:* use `heartbeatTimeout`

```typescript
public readonly heartbeat: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* None

Timeout for the heartbeat.

---

##### `heartbeatTimeout`<sup>Optional</sup> <a name="heartbeatTimeout" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.heartbeatTimeout"></a>

```typescript
public readonly heartbeatTimeout: Timeout;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.Timeout
- *Default:* None

Timeout for the heartbeat.

[disable-awslint:duration-prop-type] is needed because all props interface in
aws-stepfunctions-tasks extend this interface

---

##### `inputPath`<sup>Optional</sup> <a name="inputPath" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.inputPath"></a>

```typescript
public readonly inputPath: string;
```

- *Type:* string
- *Default:* The entire task input (JSON path '$')

JSONPath expression to select part of the state to be the input to this state.

May also be the special value JsonPath.DISCARD, which will cause the effective
input to be the empty object {}.

---

##### `integrationPattern`<sup>Optional</sup> <a name="integrationPattern" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.integrationPattern"></a>

```typescript
public readonly integrationPattern: IntegrationPattern;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.IntegrationPattern
- *Default:* `IntegrationPattern.REQUEST_RESPONSE` for most tasks. `IntegrationPattern.RUN_JOB` for the following exceptions: `BatchSubmitJob`, `EmrAddStep`, `EmrCreateCluster`, `EmrTerminationCluster`, and `EmrContainersStartJobRun`.

AWS Step Functions integrates with services directly in the Amazon States Language.

You can control these AWS services using service integration patterns.

Depending on the AWS Service, the Service Integration Pattern availability will vary.

> [https://docs.aws.amazon.com/step-functions/latest/dg/connect-supported-services.html](https://docs.aws.amazon.com/step-functions/latest/dg/connect-supported-services.html)

---

##### `outputPath`<sup>Optional</sup> <a name="outputPath" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.outputPath"></a>

```typescript
public readonly outputPath: string;
```

- *Type:* string
- *Default:* The entire JSON node determined by the state input, the task result, and resultPath is passed to the next state (JSON path '$')

JSONPath expression to select select a portion of the state output to pass to the next state.

May also be the special value JsonPath.DISCARD, which will cause the effective
output to be the empty object {}.

---

##### `resultPath`<sup>Optional</sup> <a name="resultPath" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.resultPath"></a>

```typescript
public readonly resultPath: string;
```

- *Type:* string
- *Default:* Replaces the entire input with the result (JSON path '$')

JSONPath expression to indicate where to inject the state's output.

May also be the special value JsonPath.DISCARD, which will cause the state's
input to become its output.

---

##### `resultSelector`<sup>Optional</sup> <a name="resultSelector" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.resultSelector"></a>

```typescript
public readonly resultSelector: {[ key: string ]: any};
```

- *Type:* {[ key: string ]: any}
- *Default:* None

The JSON that will replace the state's raw result and become the effective result before ResultPath is applied.

You can use ResultSelector to create a payload with values that are static
or selected from the state's raw result.

> [https://docs.aws.amazon.com/step-functions/latest/dg/input-output-inputpath-params.html#input-output-resultselector](https://docs.aws.amazon.com/step-functions/latest/dg/input-output-inputpath-params.html#input-output-resultselector)

---

##### `stateName`<sup>Optional</sup> <a name="stateName" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.stateName"></a>

```typescript
public readonly stateName: string;
```

- *Type:* string
- *Default:* The construct ID will be used as state name

Optional name for this state.

---

##### `taskTimeout`<sup>Optional</sup> <a name="taskTimeout" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.taskTimeout"></a>

```typescript
public readonly taskTimeout: Timeout;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.Timeout
- *Default:* None

Timeout for the task.

[disable-awslint:duration-prop-type] is needed because all props interface in
aws-stepfunctions-tasks extend this interface

---

##### ~~`timeout`~~<sup>Optional</sup> <a name="timeout" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.timeout"></a>

- *Deprecated:* use `taskTimeout`

```typescript
public readonly timeout: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* None

Timeout for the task.

---

##### `associateWithParent`<sup>Optional</sup> <a name="associateWithParent" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.associateWithParent"></a>

```typescript
public readonly associateWithParent: boolean;
```

- *Type:* boolean
- *Default:* false

Pass the execution ID from the context object to the execution input.

This allows the Step Functions UI to link child executions from parent executions, making it easier to trace execution flow across state machines.

If you set this property to `true`, the `input` property must be an object (provided by `sfn.TaskInput.fromObject`) or omitted entirely.

> [https://docs.aws.amazon.com/step-functions/latest/dg/concepts-nested-workflows.html#nested-execution-startid](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-nested-workflows.html#nested-execution-startid)

---

##### `auroraSecurityGroup`<sup>Optional</sup> <a name="auroraSecurityGroup" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.auroraSecurityGroup"></a>

```typescript
public readonly auroraSecurityGroup: ISecurityGroup;
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup

auroraSecurity Group for Cluster.

---

##### `csvToAuroraBackoffRate`<sup>Optional</sup> <a name="csvToAuroraBackoffRate" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.csvToAuroraBackoffRate"></a>

```typescript
public readonly csvToAuroraBackoffRate: number;
```

- *Type:* number

default is 1.1.

---

##### `csvToAuroraInterval`<sup>Optional</sup> <a name="csvToAuroraInterval" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.csvToAuroraInterval"></a>

```typescript
public readonly csvToAuroraInterval: number;
```

- *Type:* number

default is 1.

---

##### `csvToAuroraMaxRetries`<sup>Optional</sup> <a name="csvToAuroraMaxRetries" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.csvToAuroraMaxRetries"></a>

```typescript
public readonly csvToAuroraMaxRetries: number;
```

- *Type:* number

---

##### `dbCluster`<sup>Optional</sup> <a name="dbCluster" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.dbCluster"></a>

```typescript
public readonly dbCluster: IServerlessCluster;
```

- *Type:* aws-cdk-lib.aws_rds.IServerlessCluster

DBCluster to import into.

---

##### `enableCloudWatchMetricsAndDashboard`<sup>Optional</sup> <a name="enableCloudWatchMetricsAndDashboard" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.enableCloudWatchMetricsAndDashboard"></a>

```typescript
public readonly enableCloudWatchMetricsAndDashboard: boolean;
```

- *Type:* boolean
- *Default:* false

enable CloudWatch Metrics and Dashboard.

---

##### `input`<sup>Optional</sup> <a name="input" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.input"></a>

```typescript
public readonly input: TaskInput;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.TaskInput
- *Default:* The state input (JSON path '$')

The JSON input for the execution, same as that of StartExecution.

> [https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html](https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html)

---

##### `lambdaLogLevel`<sup>Optional</sup> <a name="lambdaLogLevel" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.lambdaLogLevel"></a>

```typescript
public readonly lambdaLogLevel: string;
```

- *Type:* string

---

##### `lambdaMemory`<sup>Optional</sup> <a name="lambdaMemory" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.lambdaMemory"></a>

```typescript
public readonly lambdaMemory: number;
```

- *Type:* number

Memory allocated to Lambda function, default 512.

---

##### `lambdaSecurityGroup`<sup>Optional</sup> <a name="lambdaSecurityGroup" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.lambdaSecurityGroup"></a>

```typescript
public readonly lambdaSecurityGroup: ISecurityGroup;
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup

lambdaSecurity Group for Cluster.

---

##### `lambdaTimeout`<sup>Optional</sup> <a name="lambdaTimeout" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.lambdaTimeout"></a>

```typescript
public readonly lambdaTimeout: number;
```

- *Type:* number

Lambda Function Timeout in seconds, default 300.

---

##### `name`<sup>Optional</sup> <a name="name" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string
- *Default:* None

The name of the execution, same as that of StartExecution.

> [https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html](https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html)

---

##### `textractStateMachineTimeoutMinutes`<sup>Optional</sup> <a name="textractStateMachineTimeoutMinutes" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.textractStateMachineTimeoutMinutes"></a>

```typescript
public readonly textractStateMachineTimeoutMinutes: number;
```

- *Type:* number

---

##### `vpc`<sup>Optional</sup> <a name="vpc" id="amazon-textract-idp-cdk-constructs.CSVToAuroraTaskProps.property.vpc"></a>

```typescript
public readonly vpc: IVpc;
```

- *Type:* aws-cdk-lib.aws_ec2.IVpc

VPC to install the database into, optional if dbCluster is passed in.

---

### DocumentSplitterProps <a name="DocumentSplitterProps" id="amazon-textract-idp-cdk-constructs.DocumentSplitterProps"></a>

#### Initializer <a name="Initializer" id="amazon-textract-idp-cdk-constructs.DocumentSplitterProps.Initializer"></a>

```typescript
import { DocumentSplitterProps } from 'amazon-textract-idp-cdk-constructs'

const documentSplitterProps: DocumentSplitterProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.DocumentSplitterProps.property.s3OutputBucket">s3OutputBucket</a></code> | <code>string</code> | Bucketname to output data to. |
| <code><a href="#amazon-textract-idp-cdk-constructs.DocumentSplitterProps.property.s3OutputPrefix">s3OutputPrefix</a></code> | <code>string</code> | The prefix to use to output files to. |
| <code><a href="#amazon-textract-idp-cdk-constructs.DocumentSplitterProps.property.inputPolicyStatements">inputPolicyStatements</a></code> | <code>aws-cdk-lib.aws_iam.PolicyStatement[]</code> | List of PolicyStatements to attach to the Lambda function. |
| <code><a href="#amazon-textract-idp-cdk-constructs.DocumentSplitterProps.property.lambdaLogLevel">lambdaLogLevel</a></code> | <code>string</code> | Lambda log level. |
| <code><a href="#amazon-textract-idp-cdk-constructs.DocumentSplitterProps.property.lambdaMemoryMB">lambdaMemoryMB</a></code> | <code>number</code> | Lambda function memory configuration (may need to increase for larger documents). |
| <code><a href="#amazon-textract-idp-cdk-constructs.DocumentSplitterProps.property.lambdaTimeout">lambdaTimeout</a></code> | <code>number</code> | Lambda function timeout (may need to increase for larger documents). |
| <code><a href="#amazon-textract-idp-cdk-constructs.DocumentSplitterProps.property.maxNumberOfPagesPerDoc">maxNumberOfPagesPerDoc</a></code> | <code>number</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.DocumentSplitterProps.property.outputPolicyStatements">outputPolicyStatements</a></code> | <code>aws-cdk-lib.aws_iam.PolicyStatement[]</code> | List of PolicyStatements to attach to the Lambda function. |
| <code><a href="#amazon-textract-idp-cdk-constructs.DocumentSplitterProps.property.s3InputBucket">s3InputBucket</a></code> | <code>string</code> | location of input S3 objects - if left empty will generate rule for s3 access to all [*]. |
| <code><a href="#amazon-textract-idp-cdk-constructs.DocumentSplitterProps.property.s3InputPrefix">s3InputPrefix</a></code> | <code>string</code> | prefix for input S3 objects - if left empty will generate rule for s3 access to all in bucket. |
| <code><a href="#amazon-textract-idp-cdk-constructs.DocumentSplitterProps.property.textractDocumentSplitterBackoffRate">textractDocumentSplitterBackoffRate</a></code> | <code>number</code> | retyr backoff rate. |
| <code><a href="#amazon-textract-idp-cdk-constructs.DocumentSplitterProps.property.textractDocumentSplitterInterval">textractDocumentSplitterInterval</a></code> | <code>number</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.DocumentSplitterProps.property.textractDocumentSplitterMaxRetries">textractDocumentSplitterMaxRetries</a></code> | <code>number</code> | number of retries in Step Function flow. |

---

##### `s3OutputBucket`<sup>Required</sup> <a name="s3OutputBucket" id="amazon-textract-idp-cdk-constructs.DocumentSplitterProps.property.s3OutputBucket"></a>

```typescript
public readonly s3OutputBucket: string;
```

- *Type:* string

Bucketname to output data to.

---

##### `s3OutputPrefix`<sup>Required</sup> <a name="s3OutputPrefix" id="amazon-textract-idp-cdk-constructs.DocumentSplitterProps.property.s3OutputPrefix"></a>

```typescript
public readonly s3OutputPrefix: string;
```

- *Type:* string

The prefix to use to output files to.

---

##### `inputPolicyStatements`<sup>Optional</sup> <a name="inputPolicyStatements" id="amazon-textract-idp-cdk-constructs.DocumentSplitterProps.property.inputPolicyStatements"></a>

```typescript
public readonly inputPolicyStatements: PolicyStatement[];
```

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement[]

List of PolicyStatements to attach to the Lambda function.

---

##### `lambdaLogLevel`<sup>Optional</sup> <a name="lambdaLogLevel" id="amazon-textract-idp-cdk-constructs.DocumentSplitterProps.property.lambdaLogLevel"></a>

```typescript
public readonly lambdaLogLevel: string;
```

- *Type:* string

Lambda log level.

---

##### `lambdaMemoryMB`<sup>Optional</sup> <a name="lambdaMemoryMB" id="amazon-textract-idp-cdk-constructs.DocumentSplitterProps.property.lambdaMemoryMB"></a>

```typescript
public readonly lambdaMemoryMB: number;
```

- *Type:* number

Lambda function memory configuration (may need to increase for larger documents).

---

##### `lambdaTimeout`<sup>Optional</sup> <a name="lambdaTimeout" id="amazon-textract-idp-cdk-constructs.DocumentSplitterProps.property.lambdaTimeout"></a>

```typescript
public readonly lambdaTimeout: number;
```

- *Type:* number

Lambda function timeout (may need to increase for larger documents).

---

##### `maxNumberOfPagesPerDoc`<sup>Optional</sup> <a name="maxNumberOfPagesPerDoc" id="amazon-textract-idp-cdk-constructs.DocumentSplitterProps.property.maxNumberOfPagesPerDoc"></a>

```typescript
public readonly maxNumberOfPagesPerDoc: number;
```

- *Type:* number

---

##### `outputPolicyStatements`<sup>Optional</sup> <a name="outputPolicyStatements" id="amazon-textract-idp-cdk-constructs.DocumentSplitterProps.property.outputPolicyStatements"></a>

```typescript
public readonly outputPolicyStatements: PolicyStatement[];
```

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement[]

List of PolicyStatements to attach to the Lambda function.

---

##### `s3InputBucket`<sup>Optional</sup> <a name="s3InputBucket" id="amazon-textract-idp-cdk-constructs.DocumentSplitterProps.property.s3InputBucket"></a>

```typescript
public readonly s3InputBucket: string;
```

- *Type:* string

location of input S3 objects - if left empty will generate rule for s3 access to all [*].

---

##### `s3InputPrefix`<sup>Optional</sup> <a name="s3InputPrefix" id="amazon-textract-idp-cdk-constructs.DocumentSplitterProps.property.s3InputPrefix"></a>

```typescript
public readonly s3InputPrefix: string;
```

- *Type:* string

prefix for input S3 objects - if left empty will generate rule for s3 access to all in bucket.

---

##### `textractDocumentSplitterBackoffRate`<sup>Optional</sup> <a name="textractDocumentSplitterBackoffRate" id="amazon-textract-idp-cdk-constructs.DocumentSplitterProps.property.textractDocumentSplitterBackoffRate"></a>

```typescript
public readonly textractDocumentSplitterBackoffRate: number;
```

- *Type:* number
- *Default:* is 1.1

retyr backoff rate.

---

##### `textractDocumentSplitterInterval`<sup>Optional</sup> <a name="textractDocumentSplitterInterval" id="amazon-textract-idp-cdk-constructs.DocumentSplitterProps.property.textractDocumentSplitterInterval"></a>

```typescript
public readonly textractDocumentSplitterInterval: number;
```

- *Type:* number

---

##### `textractDocumentSplitterMaxRetries`<sup>Optional</sup> <a name="textractDocumentSplitterMaxRetries" id="amazon-textract-idp-cdk-constructs.DocumentSplitterProps.property.textractDocumentSplitterMaxRetries"></a>

```typescript
public readonly textractDocumentSplitterMaxRetries: number;
```

- *Type:* number
- *Default:* is 100

number of retries in Step Function flow.

---

### RDSAuroraServerlessProps <a name="RDSAuroraServerlessProps" id="amazon-textract-idp-cdk-constructs.RDSAuroraServerlessProps"></a>

#### Initializer <a name="Initializer" id="amazon-textract-idp-cdk-constructs.RDSAuroraServerlessProps.Initializer"></a>

```typescript
import { RDSAuroraServerlessProps } from 'amazon-textract-idp-cdk-constructs'

const rDSAuroraServerlessProps: RDSAuroraServerlessProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.RDSAuroraServerlessProps.property.vpc">vpc</a></code> | <code>aws-cdk-lib.aws_ec2.IVpc</code> | VPC to install the database into. |

---

##### `vpc`<sup>Required</sup> <a name="vpc" id="amazon-textract-idp-cdk-constructs.RDSAuroraServerlessProps.property.vpc"></a>

```typescript
public readonly vpc: IVpc;
```

- *Type:* aws-cdk-lib.aws_ec2.IVpc

VPC to install the database into.

---

### SearchablePDFProps <a name="SearchablePDFProps" id="amazon-textract-idp-cdk-constructs.SearchablePDFProps"></a>

#### Initializer <a name="Initializer" id="amazon-textract-idp-cdk-constructs.SearchablePDFProps.Initializer"></a>

```typescript
import { SearchablePDFProps } from 'amazon-textract-idp-cdk-constructs'

const searchablePDFProps: SearchablePDFProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.SearchablePDFProps.property.inputPolicyStatements">inputPolicyStatements</a></code> | <code>aws-cdk-lib.aws_iam.PolicyStatement[]</code> | List of PolicyStatements to attach to the Lambda function for S3 GET and LIST. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SearchablePDFProps.property.lambdaMemoryMB">lambdaMemoryMB</a></code> | <code>number</code> | memory of Lambda function (may need to increase for larger documents). |
| <code><a href="#amazon-textract-idp-cdk-constructs.SearchablePDFProps.property.lambdaTimeout">lambdaTimeout</a></code> | <code>number</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.SearchablePDFProps.property.s3InputPrefix">s3InputPrefix</a></code> | <code>string</code> | prefix for the incoming document. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SearchablePDFProps.property.s3PDFBucket">s3PDFBucket</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.SearchablePDFProps.property.s3TextractOutputBucket">s3TextractOutputBucket</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.SearchablePDFProps.property.searchablePDFFunction">searchablePDFFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |

---

##### `inputPolicyStatements`<sup>Optional</sup> <a name="inputPolicyStatements" id="amazon-textract-idp-cdk-constructs.SearchablePDFProps.property.inputPolicyStatements"></a>

```typescript
public readonly inputPolicyStatements: PolicyStatement[];
```

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement[]

List of PolicyStatements to attach to the Lambda function for S3 GET and LIST.

---

##### `lambdaMemoryMB`<sup>Optional</sup> <a name="lambdaMemoryMB" id="amazon-textract-idp-cdk-constructs.SearchablePDFProps.property.lambdaMemoryMB"></a>

```typescript
public readonly lambdaMemoryMB: number;
```

- *Type:* number

memory of Lambda function (may need to increase for larger documents).

---

##### `lambdaTimeout`<sup>Optional</sup> <a name="lambdaTimeout" id="amazon-textract-idp-cdk-constructs.SearchablePDFProps.property.lambdaTimeout"></a>

```typescript
public readonly lambdaTimeout: number;
```

- *Type:* number

---

##### `s3InputPrefix`<sup>Optional</sup> <a name="s3InputPrefix" id="amazon-textract-idp-cdk-constructs.SearchablePDFProps.property.s3InputPrefix"></a>

```typescript
public readonly s3InputPrefix: string;
```

- *Type:* string

prefix for the incoming document.

Will be used to create role

---

##### `s3PDFBucket`<sup>Optional</sup> <a name="s3PDFBucket" id="amazon-textract-idp-cdk-constructs.SearchablePDFProps.property.s3PDFBucket"></a>

```typescript
public readonly s3PDFBucket: string;
```

- *Type:* string

---

##### `s3TextractOutputBucket`<sup>Optional</sup> <a name="s3TextractOutputBucket" id="amazon-textract-idp-cdk-constructs.SearchablePDFProps.property.s3TextractOutputBucket"></a>

```typescript
public readonly s3TextractOutputBucket: string;
```

- *Type:* string

---

##### `searchablePDFFunction`<sup>Optional</sup> <a name="searchablePDFFunction" id="amazon-textract-idp-cdk-constructs.SearchablePDFProps.property.searchablePDFFunction"></a>

```typescript
public readonly searchablePDFFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

### SFExecutionsStartThrottleProps <a name="SFExecutionsStartThrottleProps" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps"></a>

#### Initializer <a name="Initializer" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.Initializer"></a>

```typescript
import { SFExecutionsStartThrottleProps } from 'amazon-textract-idp-cdk-constructs'

const sFExecutionsStartThrottleProps: SFExecutionsStartThrottleProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.property.stateMachineArn">stateMachineArn</a></code> | <code>string</code> | State Machine ARN. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.property.documentStatusTable">documentStatusTable</a></code> | <code>aws-cdk-lib.aws_dynamodb.ITable</code> | Status table - DynamoDB table with status information for the document execution. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.property.eventSource">eventSource</a></code> | <code>aws-cdk-lib.aws_lambda.IEventSource[]</code> | List of PolicyStatements to attach to the Lambda function. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.property.executionsConcurrencyThreshold">executionsConcurrencyThreshold</a></code> | <code>number</code> | Executions concurrency, default is 100 should be set to whatever the bottleneck of the workflow is For Textract Asynchronous APIs, that would be the number of concurrent jobs that can be processed For Textract Synchronous APIs, that would be the TPS for the API. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.property.executionsCounterTable">executionsCounterTable</a></code> | <code>aws-cdk-lib.aws_dynamodb.ITable</code> | Step Functions Executions Counter - DynamoDB table with current count of executions. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.property.inputPolicyStatements">inputPolicyStatements</a></code> | <code>aws-cdk-lib.aws_iam.PolicyStatement[]</code> | List of PolicyStatements to attach to the Lambda function. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.property.lambdaLogLevel">lambdaLogLevel</a></code> | <code>string</code> | log level for Lambda function, supports DEBUG\|INFO\|WARNING\|ERROR\|FATAL. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.property.lambdaMemory">lambdaMemory</a></code> | <code>number</code> | Memory allocated to Lambda function, default 512. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.property.lambdaQueueWorkerLogLevel">lambdaQueueWorkerLogLevel</a></code> | <code>string</code> | log level for Lambda function, supports DEBUG\|INFO\|WARNING\|ERROR\|FATAL. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.property.lambdaQueueWorkerMemory">lambdaQueueWorkerMemory</a></code> | <code>number</code> | Memory allocated to Lambda function, default 512. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.property.lambdaQueueWorkerTimeout">lambdaQueueWorkerTimeout</a></code> | <code>number</code> | Lambda Function Timeout in seconds, default 300. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.property.lambdaTimeout">lambdaTimeout</a></code> | <code>number</code> | Lambda Function Timeout in seconds, default 300. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.property.s3InputBucket">s3InputBucket</a></code> | <code>string</code> | Bucketname and prefix to read document from /** location of input S3 objects - if left empty will generate rule for s3 access to all [*]. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.property.s3InputPrefix">s3InputPrefix</a></code> | <code>string</code> | prefix for input S3 objects - if left empty will generate rule for s3 access to all in bucket. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.property.sqsBatch">sqsBatch</a></code> | <code>number</code> | SQS Batch size when catchup up on queued documents (max 10, which is also the default). |

---

##### `stateMachineArn`<sup>Required</sup> <a name="stateMachineArn" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.property.stateMachineArn"></a>

```typescript
public readonly stateMachineArn: string;
```

- *Type:* string

State Machine ARN.

---

##### `documentStatusTable`<sup>Optional</sup> <a name="documentStatusTable" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.property.documentStatusTable"></a>

```typescript
public readonly documentStatusTable: ITable;
```

- *Type:* aws-cdk-lib.aws_dynamodb.ITable

Status table - DynamoDB table with status information for the document execution.

---

##### `eventSource`<sup>Optional</sup> <a name="eventSource" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.property.eventSource"></a>

```typescript
public readonly eventSource: IEventSource[];
```

- *Type:* aws-cdk-lib.aws_lambda.IEventSource[]

List of PolicyStatements to attach to the Lambda function.

---

##### `executionsConcurrencyThreshold`<sup>Optional</sup> <a name="executionsConcurrencyThreshold" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.property.executionsConcurrencyThreshold"></a>

```typescript
public readonly executionsConcurrencyThreshold: number;
```

- *Type:* number

Executions concurrency, default is 100 should be set to whatever the bottleneck of the workflow is For Textract Asynchronous APIs, that would be the number of concurrent jobs that can be processed For Textract Synchronous APIs, that would be the TPS for the API.

---

##### `executionsCounterTable`<sup>Optional</sup> <a name="executionsCounterTable" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.property.executionsCounterTable"></a>

```typescript
public readonly executionsCounterTable: ITable;
```

- *Type:* aws-cdk-lib.aws_dynamodb.ITable

Step Functions Executions Counter - DynamoDB table with current count of executions.

---

##### `inputPolicyStatements`<sup>Optional</sup> <a name="inputPolicyStatements" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.property.inputPolicyStatements"></a>

```typescript
public readonly inputPolicyStatements: PolicyStatement[];
```

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement[]

List of PolicyStatements to attach to the Lambda function.

---

##### `lambdaLogLevel`<sup>Optional</sup> <a name="lambdaLogLevel" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.property.lambdaLogLevel"></a>

```typescript
public readonly lambdaLogLevel: string;
```

- *Type:* string
- *Default:* = INFO

log level for Lambda function, supports DEBUG|INFO|WARNING|ERROR|FATAL.

---

##### `lambdaMemory`<sup>Optional</sup> <a name="lambdaMemory" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.property.lambdaMemory"></a>

```typescript
public readonly lambdaMemory: number;
```

- *Type:* number

Memory allocated to Lambda function, default 512.

---

##### `lambdaQueueWorkerLogLevel`<sup>Optional</sup> <a name="lambdaQueueWorkerLogLevel" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.property.lambdaQueueWorkerLogLevel"></a>

```typescript
public readonly lambdaQueueWorkerLogLevel: string;
```

- *Type:* string
- *Default:* = DEBUG

log level for Lambda function, supports DEBUG|INFO|WARNING|ERROR|FATAL.

---

##### `lambdaQueueWorkerMemory`<sup>Optional</sup> <a name="lambdaQueueWorkerMemory" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.property.lambdaQueueWorkerMemory"></a>

```typescript
public readonly lambdaQueueWorkerMemory: number;
```

- *Type:* number

Memory allocated to Lambda function, default 512.

---

##### `lambdaQueueWorkerTimeout`<sup>Optional</sup> <a name="lambdaQueueWorkerTimeout" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.property.lambdaQueueWorkerTimeout"></a>

```typescript
public readonly lambdaQueueWorkerTimeout: number;
```

- *Type:* number

Lambda Function Timeout in seconds, default 300.

---

##### `lambdaTimeout`<sup>Optional</sup> <a name="lambdaTimeout" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.property.lambdaTimeout"></a>

```typescript
public readonly lambdaTimeout: number;
```

- *Type:* number

Lambda Function Timeout in seconds, default 300.

---

##### `s3InputBucket`<sup>Optional</sup> <a name="s3InputBucket" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.property.s3InputBucket"></a>

```typescript
public readonly s3InputBucket: string;
```

- *Type:* string

Bucketname and prefix to read document from /** location of input S3 objects - if left empty will generate rule for s3 access to all [*].

---

##### `s3InputPrefix`<sup>Optional</sup> <a name="s3InputPrefix" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.property.s3InputPrefix"></a>

```typescript
public readonly s3InputPrefix: string;
```

- *Type:* string

prefix for input S3 objects - if left empty will generate rule for s3 access to all in bucket.

---

##### `sqsBatch`<sup>Optional</sup> <a name="sqsBatch" id="amazon-textract-idp-cdk-constructs.SFExecutionsStartThrottleProps.property.sqsBatch"></a>

```typescript
public readonly sqsBatch: number;
```

- *Type:* number

SQS Batch size when catchup up on queued documents (max 10, which is also the default).

---

### SpacySfnTaskProps <a name="SpacySfnTaskProps" id="amazon-textract-idp-cdk-constructs.SpacySfnTaskProps"></a>

#### Initializer <a name="Initializer" id="amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.Initializer"></a>

```typescript
import { SpacySfnTaskProps } from 'amazon-textract-idp-cdk-constructs'

const spacySfnTaskProps: SpacySfnTaskProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.comment">comment</a></code> | <code>string</code> | An optional description for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.credentials">credentials</a></code> | <code>aws-cdk-lib.aws_stepfunctions.Credentials</code> | Credentials for an IAM Role that the State Machine assumes for executing the task. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.heartbeat">heartbeat</a></code> | <code>aws-cdk-lib.Duration</code> | Timeout for the heartbeat. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.heartbeatTimeout">heartbeatTimeout</a></code> | <code>aws-cdk-lib.aws_stepfunctions.Timeout</code> | Timeout for the heartbeat. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.inputPath">inputPath</a></code> | <code>string</code> | JSONPath expression to select part of the state to be the input to this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.integrationPattern">integrationPattern</a></code> | <code>aws-cdk-lib.aws_stepfunctions.IntegrationPattern</code> | AWS Step Functions integrates with services directly in the Amazon States Language. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.outputPath">outputPath</a></code> | <code>string</code> | JSONPath expression to select select a portion of the state output to pass to the next state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.resultPath">resultPath</a></code> | <code>string</code> | JSONPath expression to indicate where to inject the state's output. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.resultSelector">resultSelector</a></code> | <code>{[ key: string ]: any}</code> | The JSON that will replace the state's raw result and become the effective result before ResultPath is applied. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.stateName">stateName</a></code> | <code>string</code> | Optional name for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.taskTimeout">taskTimeout</a></code> | <code>aws-cdk-lib.aws_stepfunctions.Timeout</code> | Timeout for the task. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.timeout">timeout</a></code> | <code>aws-cdk-lib.Duration</code> | Timeout for the task. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.associateWithParent">associateWithParent</a></code> | <code>boolean</code> | Pass the execution ID from the context object to the execution input. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.dockerImageFunction">dockerImageFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | Docker Container (to use in DockerImageCode.from_ecr() call). |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.input">input</a></code> | <code>aws-cdk-lib.aws_stepfunctions.TaskInput</code> | The JSON input for the execution, same as that of StartExecution. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.lambdaLogLevel">lambdaLogLevel</a></code> | <code>string</code> | log level for Lambda function, supports DEBUG\|INFO\|WARNING\|ERROR\|FATAL. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.name">name</a></code> | <code>string</code> | The name of the execution, same as that of StartExecution. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.spacyImageEcrRepository">spacyImageEcrRepository</a></code> | <code>string</code> | ECR Container URI for Spacy classification. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.spacyLambdaMemorySize">spacyLambdaMemorySize</a></code> | <code>number</code> | memorySize for Lambda function calling Spacy NLP, default is 4096 MB. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.spacyLambdaTimeout">spacyLambdaTimeout</a></code> | <code>number</code> | timeout for Lambda function calling Spacy NLP, default is 900 seconds. |
| <code><a href="#amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.textractStateMachineTimeoutMinutes">textractStateMachineTimeoutMinutes</a></code> | <code>number</code> | how long can we wait for the process (default is 48 hours (60*48=2880)). |

---

##### `comment`<sup>Optional</sup> <a name="comment" id="amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.comment"></a>

```typescript
public readonly comment: string;
```

- *Type:* string
- *Default:* No comment

An optional description for this state.

---

##### `credentials`<sup>Optional</sup> <a name="credentials" id="amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.credentials"></a>

```typescript
public readonly credentials: Credentials;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.Credentials
- *Default:* None (Task is executed using the State Machine's execution role)

Credentials for an IAM Role that the State Machine assumes for executing the task.

This enables cross-account resource invocations.

> [https://docs.aws.amazon.com/step-functions/latest/dg/concepts-access-cross-acct-resources.html](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-access-cross-acct-resources.html)

---

##### ~~`heartbeat`~~<sup>Optional</sup> <a name="heartbeat" id="amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.heartbeat"></a>

- *Deprecated:* use `heartbeatTimeout`

```typescript
public readonly heartbeat: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* None

Timeout for the heartbeat.

---

##### `heartbeatTimeout`<sup>Optional</sup> <a name="heartbeatTimeout" id="amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.heartbeatTimeout"></a>

```typescript
public readonly heartbeatTimeout: Timeout;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.Timeout
- *Default:* None

Timeout for the heartbeat.

[disable-awslint:duration-prop-type] is needed because all props interface in
aws-stepfunctions-tasks extend this interface

---

##### `inputPath`<sup>Optional</sup> <a name="inputPath" id="amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.inputPath"></a>

```typescript
public readonly inputPath: string;
```

- *Type:* string
- *Default:* The entire task input (JSON path '$')

JSONPath expression to select part of the state to be the input to this state.

May also be the special value JsonPath.DISCARD, which will cause the effective
input to be the empty object {}.

---

##### `integrationPattern`<sup>Optional</sup> <a name="integrationPattern" id="amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.integrationPattern"></a>

```typescript
public readonly integrationPattern: IntegrationPattern;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.IntegrationPattern
- *Default:* `IntegrationPattern.REQUEST_RESPONSE` for most tasks. `IntegrationPattern.RUN_JOB` for the following exceptions: `BatchSubmitJob`, `EmrAddStep`, `EmrCreateCluster`, `EmrTerminationCluster`, and `EmrContainersStartJobRun`.

AWS Step Functions integrates with services directly in the Amazon States Language.

You can control these AWS services using service integration patterns.

Depending on the AWS Service, the Service Integration Pattern availability will vary.

> [https://docs.aws.amazon.com/step-functions/latest/dg/connect-supported-services.html](https://docs.aws.amazon.com/step-functions/latest/dg/connect-supported-services.html)

---

##### `outputPath`<sup>Optional</sup> <a name="outputPath" id="amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.outputPath"></a>

```typescript
public readonly outputPath: string;
```

- *Type:* string
- *Default:* The entire JSON node determined by the state input, the task result, and resultPath is passed to the next state (JSON path '$')

JSONPath expression to select select a portion of the state output to pass to the next state.

May also be the special value JsonPath.DISCARD, which will cause the effective
output to be the empty object {}.

---

##### `resultPath`<sup>Optional</sup> <a name="resultPath" id="amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.resultPath"></a>

```typescript
public readonly resultPath: string;
```

- *Type:* string
- *Default:* Replaces the entire input with the result (JSON path '$')

JSONPath expression to indicate where to inject the state's output.

May also be the special value JsonPath.DISCARD, which will cause the state's
input to become its output.

---

##### `resultSelector`<sup>Optional</sup> <a name="resultSelector" id="amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.resultSelector"></a>

```typescript
public readonly resultSelector: {[ key: string ]: any};
```

- *Type:* {[ key: string ]: any}
- *Default:* None

The JSON that will replace the state's raw result and become the effective result before ResultPath is applied.

You can use ResultSelector to create a payload with values that are static
or selected from the state's raw result.

> [https://docs.aws.amazon.com/step-functions/latest/dg/input-output-inputpath-params.html#input-output-resultselector](https://docs.aws.amazon.com/step-functions/latest/dg/input-output-inputpath-params.html#input-output-resultselector)

---

##### `stateName`<sup>Optional</sup> <a name="stateName" id="amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.stateName"></a>

```typescript
public readonly stateName: string;
```

- *Type:* string
- *Default:* The construct ID will be used as state name

Optional name for this state.

---

##### `taskTimeout`<sup>Optional</sup> <a name="taskTimeout" id="amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.taskTimeout"></a>

```typescript
public readonly taskTimeout: Timeout;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.Timeout
- *Default:* None

Timeout for the task.

[disable-awslint:duration-prop-type] is needed because all props interface in
aws-stepfunctions-tasks extend this interface

---

##### ~~`timeout`~~<sup>Optional</sup> <a name="timeout" id="amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.timeout"></a>

- *Deprecated:* use `taskTimeout`

```typescript
public readonly timeout: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* None

Timeout for the task.

---

##### `associateWithParent`<sup>Optional</sup> <a name="associateWithParent" id="amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.associateWithParent"></a>

```typescript
public readonly associateWithParent: boolean;
```

- *Type:* boolean
- *Default:* false

Pass the execution ID from the context object to the execution input.

This allows the Step Functions UI to link child executions from parent executions, making it easier to trace execution flow across state machines.

If you set this property to `true`, the `input` property must be an object (provided by `sfn.TaskInput.fromObject`) or omitted entirely.

> [https://docs.aws.amazon.com/step-functions/latest/dg/concepts-nested-workflows.html#nested-execution-startid](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-nested-workflows.html#nested-execution-startid)

---

##### `dockerImageFunction`<sup>Optional</sup> <a name="dockerImageFunction" id="amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.dockerImageFunction"></a>

```typescript
public readonly dockerImageFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

Docker Container (to use in DockerImageCode.from_ecr() call).

---

##### `input`<sup>Optional</sup> <a name="input" id="amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.input"></a>

```typescript
public readonly input: TaskInput;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.TaskInput
- *Default:* The state input (JSON path '$')

The JSON input for the execution, same as that of StartExecution.

> [https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html](https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html)

---

##### `lambdaLogLevel`<sup>Optional</sup> <a name="lambdaLogLevel" id="amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.lambdaLogLevel"></a>

```typescript
public readonly lambdaLogLevel: string;
```

- *Type:* string

log level for Lambda function, supports DEBUG|INFO|WARNING|ERROR|FATAL.

---

##### `name`<sup>Optional</sup> <a name="name" id="amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string
- *Default:* None

The name of the execution, same as that of StartExecution.

> [https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html](https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html)

---

##### `spacyImageEcrRepository`<sup>Optional</sup> <a name="spacyImageEcrRepository" id="amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.spacyImageEcrRepository"></a>

```typescript
public readonly spacyImageEcrRepository: string;
```

- *Type:* string

ECR Container URI for Spacy classification.

---

##### `spacyLambdaMemorySize`<sup>Optional</sup> <a name="spacyLambdaMemorySize" id="amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.spacyLambdaMemorySize"></a>

```typescript
public readonly spacyLambdaMemorySize: number;
```

- *Type:* number

memorySize for Lambda function calling Spacy NLP, default is 4096 MB.

---

##### `spacyLambdaTimeout`<sup>Optional</sup> <a name="spacyLambdaTimeout" id="amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.spacyLambdaTimeout"></a>

```typescript
public readonly spacyLambdaTimeout: number;
```

- *Type:* number

timeout for Lambda function calling Spacy NLP, default is 900 seconds.

---

##### `textractStateMachineTimeoutMinutes`<sup>Optional</sup> <a name="textractStateMachineTimeoutMinutes" id="amazon-textract-idp-cdk-constructs.SpacySfnTaskProps.property.textractStateMachineTimeoutMinutes"></a>

```typescript
public readonly textractStateMachineTimeoutMinutes: number;
```

- *Type:* number

how long can we wait for the process (default is 48 hours (60*48=2880)).

---

### TextractA2ISfnTaskProps <a name="TextractA2ISfnTaskProps" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps"></a>

#### Initializer <a name="Initializer" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.Initializer"></a>

```typescript
import { TextractA2ISfnTaskProps } from 'amazon-textract-idp-cdk-constructs'

const textractA2ISfnTaskProps: TextractA2ISfnTaskProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.comment">comment</a></code> | <code>string</code> | An optional description for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.credentials">credentials</a></code> | <code>aws-cdk-lib.aws_stepfunctions.Credentials</code> | Credentials for an IAM Role that the State Machine assumes for executing the task. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.heartbeat">heartbeat</a></code> | <code>aws-cdk-lib.Duration</code> | Timeout for the heartbeat. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.heartbeatTimeout">heartbeatTimeout</a></code> | <code>aws-cdk-lib.aws_stepfunctions.Timeout</code> | Timeout for the heartbeat. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.inputPath">inputPath</a></code> | <code>string</code> | JSONPath expression to select part of the state to be the input to this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.integrationPattern">integrationPattern</a></code> | <code>aws-cdk-lib.aws_stepfunctions.IntegrationPattern</code> | AWS Step Functions integrates with services directly in the Amazon States Language. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.outputPath">outputPath</a></code> | <code>string</code> | JSONPath expression to select select a portion of the state output to pass to the next state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.resultPath">resultPath</a></code> | <code>string</code> | JSONPath expression to indicate where to inject the state's output. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.resultSelector">resultSelector</a></code> | <code>{[ key: string ]: any}</code> | The JSON that will replace the state's raw result and become the effective result before ResultPath is applied. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.stateName">stateName</a></code> | <code>string</code> | Optional name for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.taskTimeout">taskTimeout</a></code> | <code>aws-cdk-lib.aws_stepfunctions.Timeout</code> | Timeout for the task. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.timeout">timeout</a></code> | <code>aws-cdk-lib.Duration</code> | Timeout for the task. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.a2iFlowDefinitionARN">a2iFlowDefinitionARN</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.associateWithParent">associateWithParent</a></code> | <code>boolean</code> | Pass the execution ID from the context object to the execution input. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.input">input</a></code> | <code>aws-cdk-lib.aws_stepfunctions.TaskInput</code> | The JSON input for the execution, same as that of StartExecution. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.lambdaLogLevel">lambdaLogLevel</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.name">name</a></code> | <code>string</code> | The name of the execution, same as that of StartExecution. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.taskTokenTableName">taskTokenTableName</a></code> | <code>string</code> | *No description.* |

---

##### `comment`<sup>Optional</sup> <a name="comment" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.comment"></a>

```typescript
public readonly comment: string;
```

- *Type:* string
- *Default:* No comment

An optional description for this state.

---

##### `credentials`<sup>Optional</sup> <a name="credentials" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.credentials"></a>

```typescript
public readonly credentials: Credentials;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.Credentials
- *Default:* None (Task is executed using the State Machine's execution role)

Credentials for an IAM Role that the State Machine assumes for executing the task.

This enables cross-account resource invocations.

> [https://docs.aws.amazon.com/step-functions/latest/dg/concepts-access-cross-acct-resources.html](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-access-cross-acct-resources.html)

---

##### ~~`heartbeat`~~<sup>Optional</sup> <a name="heartbeat" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.heartbeat"></a>

- *Deprecated:* use `heartbeatTimeout`

```typescript
public readonly heartbeat: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* None

Timeout for the heartbeat.

---

##### `heartbeatTimeout`<sup>Optional</sup> <a name="heartbeatTimeout" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.heartbeatTimeout"></a>

```typescript
public readonly heartbeatTimeout: Timeout;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.Timeout
- *Default:* None

Timeout for the heartbeat.

[disable-awslint:duration-prop-type] is needed because all props interface in
aws-stepfunctions-tasks extend this interface

---

##### `inputPath`<sup>Optional</sup> <a name="inputPath" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.inputPath"></a>

```typescript
public readonly inputPath: string;
```

- *Type:* string
- *Default:* The entire task input (JSON path '$')

JSONPath expression to select part of the state to be the input to this state.

May also be the special value JsonPath.DISCARD, which will cause the effective
input to be the empty object {}.

---

##### `integrationPattern`<sup>Optional</sup> <a name="integrationPattern" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.integrationPattern"></a>

```typescript
public readonly integrationPattern: IntegrationPattern;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.IntegrationPattern
- *Default:* `IntegrationPattern.REQUEST_RESPONSE` for most tasks. `IntegrationPattern.RUN_JOB` for the following exceptions: `BatchSubmitJob`, `EmrAddStep`, `EmrCreateCluster`, `EmrTerminationCluster`, and `EmrContainersStartJobRun`.

AWS Step Functions integrates with services directly in the Amazon States Language.

You can control these AWS services using service integration patterns.

Depending on the AWS Service, the Service Integration Pattern availability will vary.

> [https://docs.aws.amazon.com/step-functions/latest/dg/connect-supported-services.html](https://docs.aws.amazon.com/step-functions/latest/dg/connect-supported-services.html)

---

##### `outputPath`<sup>Optional</sup> <a name="outputPath" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.outputPath"></a>

```typescript
public readonly outputPath: string;
```

- *Type:* string
- *Default:* The entire JSON node determined by the state input, the task result, and resultPath is passed to the next state (JSON path '$')

JSONPath expression to select select a portion of the state output to pass to the next state.

May also be the special value JsonPath.DISCARD, which will cause the effective
output to be the empty object {}.

---

##### `resultPath`<sup>Optional</sup> <a name="resultPath" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.resultPath"></a>

```typescript
public readonly resultPath: string;
```

- *Type:* string
- *Default:* Replaces the entire input with the result (JSON path '$')

JSONPath expression to indicate where to inject the state's output.

May also be the special value JsonPath.DISCARD, which will cause the state's
input to become its output.

---

##### `resultSelector`<sup>Optional</sup> <a name="resultSelector" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.resultSelector"></a>

```typescript
public readonly resultSelector: {[ key: string ]: any};
```

- *Type:* {[ key: string ]: any}
- *Default:* None

The JSON that will replace the state's raw result and become the effective result before ResultPath is applied.

You can use ResultSelector to create a payload with values that are static
or selected from the state's raw result.

> [https://docs.aws.amazon.com/step-functions/latest/dg/input-output-inputpath-params.html#input-output-resultselector](https://docs.aws.amazon.com/step-functions/latest/dg/input-output-inputpath-params.html#input-output-resultselector)

---

##### `stateName`<sup>Optional</sup> <a name="stateName" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.stateName"></a>

```typescript
public readonly stateName: string;
```

- *Type:* string
- *Default:* The construct ID will be used as state name

Optional name for this state.

---

##### `taskTimeout`<sup>Optional</sup> <a name="taskTimeout" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.taskTimeout"></a>

```typescript
public readonly taskTimeout: Timeout;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.Timeout
- *Default:* None

Timeout for the task.

[disable-awslint:duration-prop-type] is needed because all props interface in
aws-stepfunctions-tasks extend this interface

---

##### ~~`timeout`~~<sup>Optional</sup> <a name="timeout" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.timeout"></a>

- *Deprecated:* use `taskTimeout`

```typescript
public readonly timeout: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* None

Timeout for the task.

---

##### `a2iFlowDefinitionARN`<sup>Required</sup> <a name="a2iFlowDefinitionARN" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.a2iFlowDefinitionARN"></a>

```typescript
public readonly a2iFlowDefinitionARN: string;
```

- *Type:* string

---

##### `associateWithParent`<sup>Optional</sup> <a name="associateWithParent" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.associateWithParent"></a>

```typescript
public readonly associateWithParent: boolean;
```

- *Type:* boolean
- *Default:* false

Pass the execution ID from the context object to the execution input.

This allows the Step Functions UI to link child executions from parent executions, making it easier to trace execution flow across state machines.

If you set this property to `true`, the `input` property must be an object (provided by `sfn.TaskInput.fromObject`) or omitted entirely.

> [https://docs.aws.amazon.com/step-functions/latest/dg/concepts-nested-workflows.html#nested-execution-startid](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-nested-workflows.html#nested-execution-startid)

---

##### `input`<sup>Optional</sup> <a name="input" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.input"></a>

```typescript
public readonly input: TaskInput;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.TaskInput
- *Default:* The state input (JSON path '$')

The JSON input for the execution, same as that of StartExecution.

> [https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html](https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html)

---

##### `lambdaLogLevel`<sup>Optional</sup> <a name="lambdaLogLevel" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.lambdaLogLevel"></a>

```typescript
public readonly lambdaLogLevel: string;
```

- *Type:* string

---

##### `name`<sup>Optional</sup> <a name="name" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string
- *Default:* None

The name of the execution, same as that of StartExecution.

> [https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html](https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html)

---

##### `taskTokenTableName`<sup>Optional</sup> <a name="taskTokenTableName" id="amazon-textract-idp-cdk-constructs.TextractA2ISfnTaskProps.property.taskTokenTableName"></a>

```typescript
public readonly taskTokenTableName: string;
```

- *Type:* string

---

### TextractAsyncToJSONProps <a name="TextractAsyncToJSONProps" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSONProps"></a>

#### Initializer <a name="Initializer" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSONProps.Initializer"></a>

```typescript
import { TextractAsyncToJSONProps } from 'amazon-textract-idp-cdk-constructs'

const textractAsyncToJSONProps: TextractAsyncToJSONProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractAsyncToJSONProps.property.s3OutputBucket">s3OutputBucket</a></code> | <code>string</code> | Bucketname to output data to. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractAsyncToJSONProps.property.s3OutputPrefix">s3OutputPrefix</a></code> | <code>string</code> | The prefix to use for the output files. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractAsyncToJSONProps.property.inputPolicyStatements">inputPolicyStatements</a></code> | <code>aws-cdk-lib.aws_iam.PolicyStatement[]</code> | List of PolicyStatements to attach to the Lambda function. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractAsyncToJSONProps.property.lambdaLogLevel">lambdaLogLevel</a></code> | <code>string</code> | log level for Lambda function, supports DEBUG\|INFO\|WARNING\|ERROR\|FATAL. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractAsyncToJSONProps.property.lambdaMemoryMB">lambdaMemoryMB</a></code> | <code>number</code> | memory of Lambda function (may need to increase for larger documents), set to 10240 (max) atm, decrease for smaller workloads. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractAsyncToJSONProps.property.lambdaTimeout">lambdaTimeout</a></code> | <code>number</code> | memory of Lambda function (may need to increase for larger documents). |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractAsyncToJSONProps.property.outputPolicyStatements">outputPolicyStatements</a></code> | <code>aws-cdk-lib.aws_iam.PolicyStatement[]</code> | List of PolicyStatements to attach to the Lambda function. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractAsyncToJSONProps.property.s3InputBucket">s3InputBucket</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractAsyncToJSONProps.property.s3InputPrefix">s3InputPrefix</a></code> | <code>string</code> | prefix for input S3 objects - if left empty will generate rule for s3 access to all in bucket. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractAsyncToJSONProps.property.textractAPI">textractAPI</a></code> | <code>string</code> | Which Textract API was used to create the OutputConfig? |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractAsyncToJSONProps.property.textractAsyncToJSONBackoffRate">textractAsyncToJSONBackoffRate</a></code> | <code>number</code> | retyr backoff rate. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractAsyncToJSONProps.property.textractAsyncToJSONInterval">textractAsyncToJSONInterval</a></code> | <code>number</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractAsyncToJSONProps.property.textractAsyncToJSONMaxRetries">textractAsyncToJSONMaxRetries</a></code> | <code>number</code> | number of retries in Step Function flow. |

---

##### `s3OutputBucket`<sup>Required</sup> <a name="s3OutputBucket" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSONProps.property.s3OutputBucket"></a>

```typescript
public readonly s3OutputBucket: string;
```

- *Type:* string

Bucketname to output data to.

---

##### `s3OutputPrefix`<sup>Required</sup> <a name="s3OutputPrefix" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSONProps.property.s3OutputPrefix"></a>

```typescript
public readonly s3OutputPrefix: string;
```

- *Type:* string

The prefix to use for the output files.

---

##### `inputPolicyStatements`<sup>Optional</sup> <a name="inputPolicyStatements" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSONProps.property.inputPolicyStatements"></a>

```typescript
public readonly inputPolicyStatements: PolicyStatement[];
```

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement[]

List of PolicyStatements to attach to the Lambda function.

---

##### `lambdaLogLevel`<sup>Optional</sup> <a name="lambdaLogLevel" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSONProps.property.lambdaLogLevel"></a>

```typescript
public readonly lambdaLogLevel: string;
```

- *Type:* string

log level for Lambda function, supports DEBUG|INFO|WARNING|ERROR|FATAL.

---

##### `lambdaMemoryMB`<sup>Optional</sup> <a name="lambdaMemoryMB" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSONProps.property.lambdaMemoryMB"></a>

```typescript
public readonly lambdaMemoryMB: number;
```

- *Type:* number

memory of Lambda function (may need to increase for larger documents), set to 10240 (max) atm, decrease for smaller workloads.

---

##### `lambdaTimeout`<sup>Optional</sup> <a name="lambdaTimeout" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSONProps.property.lambdaTimeout"></a>

```typescript
public readonly lambdaTimeout: number;
```

- *Type:* number

memory of Lambda function (may need to increase for larger documents).

---

##### `outputPolicyStatements`<sup>Optional</sup> <a name="outputPolicyStatements" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSONProps.property.outputPolicyStatements"></a>

```typescript
public readonly outputPolicyStatements: PolicyStatement[];
```

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement[]

List of PolicyStatements to attach to the Lambda function.

---

##### `s3InputBucket`<sup>Optional</sup> <a name="s3InputBucket" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSONProps.property.s3InputBucket"></a>

```typescript
public readonly s3InputBucket: string;
```

- *Type:* string

---

##### `s3InputPrefix`<sup>Optional</sup> <a name="s3InputPrefix" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSONProps.property.s3InputPrefix"></a>

```typescript
public readonly s3InputPrefix: string;
```

- *Type:* string

prefix for input S3 objects - if left empty will generate rule for s3 access to all in bucket.

---

##### `textractAPI`<sup>Optional</sup> <a name="textractAPI" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSONProps.property.textractAPI"></a>

```typescript
public readonly textractAPI: string;
```

- *Type:* string
- *Default:* GENERIC

Which Textract API was used to create the OutputConfig?

GENERIC and LENDING are supported.

---

##### `textractAsyncToJSONBackoffRate`<sup>Optional</sup> <a name="textractAsyncToJSONBackoffRate" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSONProps.property.textractAsyncToJSONBackoffRate"></a>

```typescript
public readonly textractAsyncToJSONBackoffRate: number;
```

- *Type:* number
- *Default:* is 1.1

retyr backoff rate.

---

##### `textractAsyncToJSONInterval`<sup>Optional</sup> <a name="textractAsyncToJSONInterval" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSONProps.property.textractAsyncToJSONInterval"></a>

```typescript
public readonly textractAsyncToJSONInterval: number;
```

- *Type:* number

---

##### `textractAsyncToJSONMaxRetries`<sup>Optional</sup> <a name="textractAsyncToJSONMaxRetries" id="amazon-textract-idp-cdk-constructs.TextractAsyncToJSONProps.property.textractAsyncToJSONMaxRetries"></a>

```typescript
public readonly textractAsyncToJSONMaxRetries: number;
```

- *Type:* number
- *Default:* is 100

number of retries in Step Function flow.

---

### TextractClassificationConfiguratorProps <a name="TextractClassificationConfiguratorProps" id="amazon-textract-idp-cdk-constructs.TextractClassificationConfiguratorProps"></a>

#### Initializer <a name="Initializer" id="amazon-textract-idp-cdk-constructs.TextractClassificationConfiguratorProps.Initializer"></a>

```typescript
import { TextractClassificationConfiguratorProps } from 'amazon-textract-idp-cdk-constructs'

const textractClassificationConfiguratorProps: TextractClassificationConfiguratorProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractClassificationConfiguratorProps.property.configurationTable">configurationTable</a></code> | <code>aws-cdk-lib.aws_dynamodb.ITable</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractClassificationConfiguratorProps.property.lambdaLogLevel">lambdaLogLevel</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractClassificationConfiguratorProps.property.lambdaMemoryMB">lambdaMemoryMB</a></code> | <code>number</code> | memory of Lambda function (may need to increase for larger documents). |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractClassificationConfiguratorProps.property.lambdaTimeout">lambdaTimeout</a></code> | <code>number</code> | *No description.* |

---

##### `configurationTable`<sup>Optional</sup> <a name="configurationTable" id="amazon-textract-idp-cdk-constructs.TextractClassificationConfiguratorProps.property.configurationTable"></a>

```typescript
public readonly configurationTable: ITable;
```

- *Type:* aws-cdk-lib.aws_dynamodb.ITable

---

##### `lambdaLogLevel`<sup>Optional</sup> <a name="lambdaLogLevel" id="amazon-textract-idp-cdk-constructs.TextractClassificationConfiguratorProps.property.lambdaLogLevel"></a>

```typescript
public readonly lambdaLogLevel: string;
```

- *Type:* string

---

##### `lambdaMemoryMB`<sup>Optional</sup> <a name="lambdaMemoryMB" id="amazon-textract-idp-cdk-constructs.TextractClassificationConfiguratorProps.property.lambdaMemoryMB"></a>

```typescript
public readonly lambdaMemoryMB: number;
```

- *Type:* number

memory of Lambda function (may need to increase for larger documents).

---

##### `lambdaTimeout`<sup>Optional</sup> <a name="lambdaTimeout" id="amazon-textract-idp-cdk-constructs.TextractClassificationConfiguratorProps.property.lambdaTimeout"></a>

```typescript
public readonly lambdaTimeout: number;
```

- *Type:* number

---

### TextractComprehendMedicalProps <a name="TextractComprehendMedicalProps" id="amazon-textract-idp-cdk-constructs.TextractComprehendMedicalProps"></a>

#### Initializer <a name="Initializer" id="amazon-textract-idp-cdk-constructs.TextractComprehendMedicalProps.Initializer"></a>

```typescript
import { TextractComprehendMedicalProps } from 'amazon-textract-idp-cdk-constructs'

const textractComprehendMedicalProps: TextractComprehendMedicalProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractComprehendMedicalProps.property.comprehendMedicalJobType">comprehendMedicalJobType</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractComprehendMedicalProps.property.comprehendMedicalRoleName">comprehendMedicalRoleName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractComprehendMedicalProps.property.inputPolicyStatements">inputPolicyStatements</a></code> | <code>aws-cdk-lib.aws_iam.PolicyStatement[]</code> | List of PolicyStatements to attach to the Lambda function for S3 GET and LIST. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractComprehendMedicalProps.property.lambdaLogLevel">lambdaLogLevel</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractComprehendMedicalProps.property.lambdaMemoryMB">lambdaMemoryMB</a></code> | <code>number</code> | memory of Lambda function (may need to increase for larger documents). |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractComprehendMedicalProps.property.lambdaTimeout">lambdaTimeout</a></code> | <code>number</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractComprehendMedicalProps.property.s3InputBucket">s3InputBucket</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractComprehendMedicalProps.property.s3InputPrefix">s3InputPrefix</a></code> | <code>string</code> | prefix for the incoming document. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractComprehendMedicalProps.property.textractComprehendMedicalFunction">textractComprehendMedicalFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |

---

##### `comprehendMedicalJobType`<sup>Optional</sup> <a name="comprehendMedicalJobType" id="amazon-textract-idp-cdk-constructs.TextractComprehendMedicalProps.property.comprehendMedicalJobType"></a>

```typescript
public readonly comprehendMedicalJobType: string;
```

- *Type:* string

---

##### `comprehendMedicalRoleName`<sup>Optional</sup> <a name="comprehendMedicalRoleName" id="amazon-textract-idp-cdk-constructs.TextractComprehendMedicalProps.property.comprehendMedicalRoleName"></a>

```typescript
public readonly comprehendMedicalRoleName: string;
```

- *Type:* string

---

##### `inputPolicyStatements`<sup>Optional</sup> <a name="inputPolicyStatements" id="amazon-textract-idp-cdk-constructs.TextractComprehendMedicalProps.property.inputPolicyStatements"></a>

```typescript
public readonly inputPolicyStatements: PolicyStatement[];
```

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement[]

List of PolicyStatements to attach to the Lambda function for S3 GET and LIST.

---

##### `lambdaLogLevel`<sup>Optional</sup> <a name="lambdaLogLevel" id="amazon-textract-idp-cdk-constructs.TextractComprehendMedicalProps.property.lambdaLogLevel"></a>

```typescript
public readonly lambdaLogLevel: string;
```

- *Type:* string

---

##### `lambdaMemoryMB`<sup>Optional</sup> <a name="lambdaMemoryMB" id="amazon-textract-idp-cdk-constructs.TextractComprehendMedicalProps.property.lambdaMemoryMB"></a>

```typescript
public readonly lambdaMemoryMB: number;
```

- *Type:* number

memory of Lambda function (may need to increase for larger documents).

---

##### `lambdaTimeout`<sup>Optional</sup> <a name="lambdaTimeout" id="amazon-textract-idp-cdk-constructs.TextractComprehendMedicalProps.property.lambdaTimeout"></a>

```typescript
public readonly lambdaTimeout: number;
```

- *Type:* number

---

##### `s3InputBucket`<sup>Optional</sup> <a name="s3InputBucket" id="amazon-textract-idp-cdk-constructs.TextractComprehendMedicalProps.property.s3InputBucket"></a>

```typescript
public readonly s3InputBucket: string;
```

- *Type:* string

---

##### `s3InputPrefix`<sup>Optional</sup> <a name="s3InputPrefix" id="amazon-textract-idp-cdk-constructs.TextractComprehendMedicalProps.property.s3InputPrefix"></a>

```typescript
public readonly s3InputPrefix: string;
```

- *Type:* string

prefix for the incoming document.

Will be used to create role

---

##### `textractComprehendMedicalFunction`<sup>Optional</sup> <a name="textractComprehendMedicalFunction" id="amazon-textract-idp-cdk-constructs.TextractComprehendMedicalProps.property.textractComprehendMedicalFunction"></a>

```typescript
public readonly textractComprehendMedicalFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

### TextractDPPOCDeciderProps <a name="TextractDPPOCDeciderProps" id="amazon-textract-idp-cdk-constructs.TextractDPPOCDeciderProps"></a>

#### Initializer <a name="Initializer" id="amazon-textract-idp-cdk-constructs.TextractDPPOCDeciderProps.Initializer"></a>

```typescript
import { TextractDPPOCDeciderProps } from 'amazon-textract-idp-cdk-constructs'

const textractDPPOCDeciderProps: TextractDPPOCDeciderProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractDPPOCDeciderProps.property.deciderFunction">deciderFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractDPPOCDeciderProps.property.inputPolicyStatements">inputPolicyStatements</a></code> | <code>aws-cdk-lib.aws_iam.PolicyStatement[]</code> | List of PolicyStatements to attach to the Lambda function for S3 GET and LIST. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractDPPOCDeciderProps.property.lambdaLogLevel">lambdaLogLevel</a></code> | <code>string</code> | log level for Lambda function, supports DEBUG\|INFO\|WARNING\|ERROR\|FATAL. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractDPPOCDeciderProps.property.lambdaMemoryMB">lambdaMemoryMB</a></code> | <code>number</code> | memory of Lambda function (may need to increase for larger documents). |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractDPPOCDeciderProps.property.lambdaTimeout">lambdaTimeout</a></code> | <code>number</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractDPPOCDeciderProps.property.s3InputBucket">s3InputBucket</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractDPPOCDeciderProps.property.s3InputPrefix">s3InputPrefix</a></code> | <code>string</code> | prefix for the incoming document. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractDPPOCDeciderProps.property.textractDeciderBackoffRate">textractDeciderBackoffRate</a></code> | <code>number</code> | retyr backoff rate. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractDPPOCDeciderProps.property.textractDeciderInterval">textractDeciderInterval</a></code> | <code>number</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractDPPOCDeciderProps.property.textractDeciderMaxRetries">textractDeciderMaxRetries</a></code> | <code>number</code> | number of retries in Step Function flow. |

---

##### `deciderFunction`<sup>Optional</sup> <a name="deciderFunction" id="amazon-textract-idp-cdk-constructs.TextractDPPOCDeciderProps.property.deciderFunction"></a>

```typescript
public readonly deciderFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `inputPolicyStatements`<sup>Optional</sup> <a name="inputPolicyStatements" id="amazon-textract-idp-cdk-constructs.TextractDPPOCDeciderProps.property.inputPolicyStatements"></a>

```typescript
public readonly inputPolicyStatements: PolicyStatement[];
```

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement[]

List of PolicyStatements to attach to the Lambda function for S3 GET and LIST.

---

##### `lambdaLogLevel`<sup>Optional</sup> <a name="lambdaLogLevel" id="amazon-textract-idp-cdk-constructs.TextractDPPOCDeciderProps.property.lambdaLogLevel"></a>

```typescript
public readonly lambdaLogLevel: string;
```

- *Type:* string
- *Default:* = DEBUG

log level for Lambda function, supports DEBUG|INFO|WARNING|ERROR|FATAL.

---

##### `lambdaMemoryMB`<sup>Optional</sup> <a name="lambdaMemoryMB" id="amazon-textract-idp-cdk-constructs.TextractDPPOCDeciderProps.property.lambdaMemoryMB"></a>

```typescript
public readonly lambdaMemoryMB: number;
```

- *Type:* number

memory of Lambda function (may need to increase for larger documents).

---

##### `lambdaTimeout`<sup>Optional</sup> <a name="lambdaTimeout" id="amazon-textract-idp-cdk-constructs.TextractDPPOCDeciderProps.property.lambdaTimeout"></a>

```typescript
public readonly lambdaTimeout: number;
```

- *Type:* number

---

##### `s3InputBucket`<sup>Optional</sup> <a name="s3InputBucket" id="amazon-textract-idp-cdk-constructs.TextractDPPOCDeciderProps.property.s3InputBucket"></a>

```typescript
public readonly s3InputBucket: string;
```

- *Type:* string

---

##### `s3InputPrefix`<sup>Optional</sup> <a name="s3InputPrefix" id="amazon-textract-idp-cdk-constructs.TextractDPPOCDeciderProps.property.s3InputPrefix"></a>

```typescript
public readonly s3InputPrefix: string;
```

- *Type:* string

prefix for the incoming document.

Will be used to create role

---

##### `textractDeciderBackoffRate`<sup>Optional</sup> <a name="textractDeciderBackoffRate" id="amazon-textract-idp-cdk-constructs.TextractDPPOCDeciderProps.property.textractDeciderBackoffRate"></a>

```typescript
public readonly textractDeciderBackoffRate: number;
```

- *Type:* number
- *Default:* is 1.1

retyr backoff rate.

---

##### `textractDeciderInterval`<sup>Optional</sup> <a name="textractDeciderInterval" id="amazon-textract-idp-cdk-constructs.TextractDPPOCDeciderProps.property.textractDeciderInterval"></a>

```typescript
public readonly textractDeciderInterval: number;
```

- *Type:* number

---

##### `textractDeciderMaxRetries`<sup>Optional</sup> <a name="textractDeciderMaxRetries" id="amazon-textract-idp-cdk-constructs.TextractDPPOCDeciderProps.property.textractDeciderMaxRetries"></a>

```typescript
public readonly textractDeciderMaxRetries: number;
```

- *Type:* number
- *Default:* is 100

number of retries in Step Function flow.

---

### TextractGenerateCSVProps <a name="TextractGenerateCSVProps" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps"></a>

#### Initializer <a name="Initializer" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.Initializer"></a>

```typescript
import { TextractGenerateCSVProps } from 'amazon-textract-idp-cdk-constructs'

const textractGenerateCSVProps: TextractGenerateCSVProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.comment">comment</a></code> | <code>string</code> | An optional description for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.credentials">credentials</a></code> | <code>aws-cdk-lib.aws_stepfunctions.Credentials</code> | Credentials for an IAM Role that the State Machine assumes for executing the task. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.heartbeat">heartbeat</a></code> | <code>aws-cdk-lib.Duration</code> | Timeout for the heartbeat. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.heartbeatTimeout">heartbeatTimeout</a></code> | <code>aws-cdk-lib.aws_stepfunctions.Timeout</code> | Timeout for the heartbeat. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.inputPath">inputPath</a></code> | <code>string</code> | JSONPath expression to select part of the state to be the input to this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.integrationPattern">integrationPattern</a></code> | <code>aws-cdk-lib.aws_stepfunctions.IntegrationPattern</code> | AWS Step Functions integrates with services directly in the Amazon States Language. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.outputPath">outputPath</a></code> | <code>string</code> | JSONPath expression to select select a portion of the state output to pass to the next state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.resultPath">resultPath</a></code> | <code>string</code> | JSONPath expression to indicate where to inject the state's output. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.resultSelector">resultSelector</a></code> | <code>{[ key: string ]: any}</code> | The JSON that will replace the state's raw result and become the effective result before ResultPath is applied. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.stateName">stateName</a></code> | <code>string</code> | Optional name for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.taskTimeout">taskTimeout</a></code> | <code>aws-cdk-lib.aws_stepfunctions.Timeout</code> | Timeout for the task. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.timeout">timeout</a></code> | <code>aws-cdk-lib.Duration</code> | Timeout for the task. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.csvS3OutputBucket">csvS3OutputBucket</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.csvS3OutputPrefix">csvS3OutputPrefix</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.associateWithParent">associateWithParent</a></code> | <code>boolean</code> | Pass the execution ID from the context object to the execution input. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.input">input</a></code> | <code>aws-cdk-lib.aws_stepfunctions.TaskInput</code> | The JSON input for the execution, same as that of StartExecution. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.inputPolicyStatements">inputPolicyStatements</a></code> | <code>aws-cdk-lib.aws_iam.PolicyStatement[]</code> | List of PolicyStatements to attach to the Lambda function. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.lambdaLogLevel">lambdaLogLevel</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.lambdaMemoryMB">lambdaMemoryMB</a></code> | <code>number</code> | memory of Lambda function (may need to increase for larger documents). |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.lambdaTimeout">lambdaTimeout</a></code> | <code>number</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.metaDataToAppend">metaDataToAppend</a></code> | <code>string[]</code> | The generated CSV can have any meta-data from the manifest file included. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.name">name</a></code> | <code>string</code> | The name of the execution, same as that of StartExecution. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.opensearchIndexName">opensearchIndexName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.outputFeatures">outputFeatures</a></code> | <code>string</code> | supports FORMS, TABLES, QUERIES, SIGNATURES as a comma seperated string and generates CSV files for the output from those default is "FORMS,TABLES,QUERIES,SIGNATURES". |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.outputPolicyStatements">outputPolicyStatements</a></code> | <code>aws-cdk-lib.aws_iam.PolicyStatement[]</code> | List of PolicyStatements to attach to the Lambda function. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.outputType">outputType</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.s3InputBucket">s3InputBucket</a></code> | <code>string</code> | Bucketname and prefix to read document from /** location of input S3 objects - if left empty will generate rule for s3 access to all [*]. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.s3InputPrefix">s3InputPrefix</a></code> | <code>string</code> | prefix for input S3 objects - if left empty will generate rule for s3 access to all in bucket. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.textractAPI">textractAPI</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.textractGenerateCSVBackoffRate">textractGenerateCSVBackoffRate</a></code> | <code>number</code> | retyr backoff rate. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.textractGenerateCSVInterval">textractGenerateCSVInterval</a></code> | <code>number</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.textractGenerateCSVMaxRetries">textractGenerateCSVMaxRetries</a></code> | <code>number</code> | number of retries in Step Function flow. |

---

##### `comment`<sup>Optional</sup> <a name="comment" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.comment"></a>

```typescript
public readonly comment: string;
```

- *Type:* string
- *Default:* No comment

An optional description for this state.

---

##### `credentials`<sup>Optional</sup> <a name="credentials" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.credentials"></a>

```typescript
public readonly credentials: Credentials;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.Credentials
- *Default:* None (Task is executed using the State Machine's execution role)

Credentials for an IAM Role that the State Machine assumes for executing the task.

This enables cross-account resource invocations.

> [https://docs.aws.amazon.com/step-functions/latest/dg/concepts-access-cross-acct-resources.html](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-access-cross-acct-resources.html)

---

##### ~~`heartbeat`~~<sup>Optional</sup> <a name="heartbeat" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.heartbeat"></a>

- *Deprecated:* use `heartbeatTimeout`

```typescript
public readonly heartbeat: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* None

Timeout for the heartbeat.

---

##### `heartbeatTimeout`<sup>Optional</sup> <a name="heartbeatTimeout" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.heartbeatTimeout"></a>

```typescript
public readonly heartbeatTimeout: Timeout;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.Timeout
- *Default:* None

Timeout for the heartbeat.

[disable-awslint:duration-prop-type] is needed because all props interface in
aws-stepfunctions-tasks extend this interface

---

##### `inputPath`<sup>Optional</sup> <a name="inputPath" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.inputPath"></a>

```typescript
public readonly inputPath: string;
```

- *Type:* string
- *Default:* The entire task input (JSON path '$')

JSONPath expression to select part of the state to be the input to this state.

May also be the special value JsonPath.DISCARD, which will cause the effective
input to be the empty object {}.

---

##### `integrationPattern`<sup>Optional</sup> <a name="integrationPattern" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.integrationPattern"></a>

```typescript
public readonly integrationPattern: IntegrationPattern;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.IntegrationPattern
- *Default:* `IntegrationPattern.REQUEST_RESPONSE` for most tasks. `IntegrationPattern.RUN_JOB` for the following exceptions: `BatchSubmitJob`, `EmrAddStep`, `EmrCreateCluster`, `EmrTerminationCluster`, and `EmrContainersStartJobRun`.

AWS Step Functions integrates with services directly in the Amazon States Language.

You can control these AWS services using service integration patterns.

Depending on the AWS Service, the Service Integration Pattern availability will vary.

> [https://docs.aws.amazon.com/step-functions/latest/dg/connect-supported-services.html](https://docs.aws.amazon.com/step-functions/latest/dg/connect-supported-services.html)

---

##### `outputPath`<sup>Optional</sup> <a name="outputPath" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.outputPath"></a>

```typescript
public readonly outputPath: string;
```

- *Type:* string
- *Default:* The entire JSON node determined by the state input, the task result, and resultPath is passed to the next state (JSON path '$')

JSONPath expression to select select a portion of the state output to pass to the next state.

May also be the special value JsonPath.DISCARD, which will cause the effective
output to be the empty object {}.

---

##### `resultPath`<sup>Optional</sup> <a name="resultPath" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.resultPath"></a>

```typescript
public readonly resultPath: string;
```

- *Type:* string
- *Default:* Replaces the entire input with the result (JSON path '$')

JSONPath expression to indicate where to inject the state's output.

May also be the special value JsonPath.DISCARD, which will cause the state's
input to become its output.

---

##### `resultSelector`<sup>Optional</sup> <a name="resultSelector" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.resultSelector"></a>

```typescript
public readonly resultSelector: {[ key: string ]: any};
```

- *Type:* {[ key: string ]: any}
- *Default:* None

The JSON that will replace the state's raw result and become the effective result before ResultPath is applied.

You can use ResultSelector to create a payload with values that are static
or selected from the state's raw result.

> [https://docs.aws.amazon.com/step-functions/latest/dg/input-output-inputpath-params.html#input-output-resultselector](https://docs.aws.amazon.com/step-functions/latest/dg/input-output-inputpath-params.html#input-output-resultselector)

---

##### `stateName`<sup>Optional</sup> <a name="stateName" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.stateName"></a>

```typescript
public readonly stateName: string;
```

- *Type:* string
- *Default:* The construct ID will be used as state name

Optional name for this state.

---

##### `taskTimeout`<sup>Optional</sup> <a name="taskTimeout" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.taskTimeout"></a>

```typescript
public readonly taskTimeout: Timeout;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.Timeout
- *Default:* None

Timeout for the task.

[disable-awslint:duration-prop-type] is needed because all props interface in
aws-stepfunctions-tasks extend this interface

---

##### ~~`timeout`~~<sup>Optional</sup> <a name="timeout" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.timeout"></a>

- *Deprecated:* use `taskTimeout`

```typescript
public readonly timeout: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* None

Timeout for the task.

---

##### `csvS3OutputBucket`<sup>Required</sup> <a name="csvS3OutputBucket" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.csvS3OutputBucket"></a>

```typescript
public readonly csvS3OutputBucket: string;
```

- *Type:* string

---

##### `csvS3OutputPrefix`<sup>Required</sup> <a name="csvS3OutputPrefix" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.csvS3OutputPrefix"></a>

```typescript
public readonly csvS3OutputPrefix: string;
```

- *Type:* string

---

##### `associateWithParent`<sup>Optional</sup> <a name="associateWithParent" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.associateWithParent"></a>

```typescript
public readonly associateWithParent: boolean;
```

- *Type:* boolean
- *Default:* false

Pass the execution ID from the context object to the execution input.

This allows the Step Functions UI to link child executions from parent executions, making it easier to trace execution flow across state machines.

If you set this property to `true`, the `input` property must be an object (provided by `sfn.TaskInput.fromObject`) or omitted entirely.

> [https://docs.aws.amazon.com/step-functions/latest/dg/concepts-nested-workflows.html#nested-execution-startid](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-nested-workflows.html#nested-execution-startid)

---

##### `input`<sup>Optional</sup> <a name="input" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.input"></a>

```typescript
public readonly input: TaskInput;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.TaskInput
- *Default:* The state input (JSON path '$')

The JSON input for the execution, same as that of StartExecution.

> [https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html](https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html)

---

##### `inputPolicyStatements`<sup>Optional</sup> <a name="inputPolicyStatements" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.inputPolicyStatements"></a>

```typescript
public readonly inputPolicyStatements: PolicyStatement[];
```

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement[]

List of PolicyStatements to attach to the Lambda function.

---

##### `lambdaLogLevel`<sup>Optional</sup> <a name="lambdaLogLevel" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.lambdaLogLevel"></a>

```typescript
public readonly lambdaLogLevel: string;
```

- *Type:* string

---

##### `lambdaMemoryMB`<sup>Optional</sup> <a name="lambdaMemoryMB" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.lambdaMemoryMB"></a>

```typescript
public readonly lambdaMemoryMB: number;
```

- *Type:* number

memory of Lambda function (may need to increase for larger documents).

---

##### `lambdaTimeout`<sup>Optional</sup> <a name="lambdaTimeout" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.lambdaTimeout"></a>

```typescript
public readonly lambdaTimeout: number;
```

- *Type:* number

---

##### `metaDataToAppend`<sup>Optional</sup> <a name="metaDataToAppend" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.metaDataToAppend"></a>

```typescript
public readonly metaDataToAppend: string[];
```

- *Type:* string[]

The generated CSV can have any meta-data from the manifest file included.

This is a list of all meta-data names to include
If they are missed they will be ""
MetaData keys have to be without ','

---

##### `name`<sup>Optional</sup> <a name="name" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string
- *Default:* None

The name of the execution, same as that of StartExecution.

> [https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html](https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html)

---

##### `opensearchIndexName`<sup>Optional</sup> <a name="opensearchIndexName" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.opensearchIndexName"></a>

```typescript
public readonly opensearchIndexName: string;
```

- *Type:* string

---

##### `outputFeatures`<sup>Optional</sup> <a name="outputFeatures" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.outputFeatures"></a>

```typescript
public readonly outputFeatures: string;
```

- *Type:* string

supports FORMS, TABLES, QUERIES, SIGNATURES as a comma seperated string and generates CSV files for the output from those default is "FORMS,TABLES,QUERIES,SIGNATURES".

---

##### `outputPolicyStatements`<sup>Optional</sup> <a name="outputPolicyStatements" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.outputPolicyStatements"></a>

```typescript
public readonly outputPolicyStatements: PolicyStatement[];
```

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement[]

List of PolicyStatements to attach to the Lambda function.

---

##### `outputType`<sup>Optional</sup> <a name="outputType" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.outputType"></a>

```typescript
public readonly outputType: string;
```

- *Type:* string

---

##### `s3InputBucket`<sup>Optional</sup> <a name="s3InputBucket" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.s3InputBucket"></a>

```typescript
public readonly s3InputBucket: string;
```

- *Type:* string

Bucketname and prefix to read document from /** location of input S3 objects - if left empty will generate rule for s3 access to all [*].

---

##### `s3InputPrefix`<sup>Optional</sup> <a name="s3InputPrefix" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.s3InputPrefix"></a>

```typescript
public readonly s3InputPrefix: string;
```

- *Type:* string

prefix for input S3 objects - if left empty will generate rule for s3 access to all in bucket.

---

##### `textractAPI`<sup>Optional</sup> <a name="textractAPI" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.textractAPI"></a>

```typescript
public readonly textractAPI: string;
```

- *Type:* string

---

##### `textractGenerateCSVBackoffRate`<sup>Optional</sup> <a name="textractGenerateCSVBackoffRate" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.textractGenerateCSVBackoffRate"></a>

```typescript
public readonly textractGenerateCSVBackoffRate: number;
```

- *Type:* number
- *Default:* is 1.1

retyr backoff rate.

---

##### `textractGenerateCSVInterval`<sup>Optional</sup> <a name="textractGenerateCSVInterval" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.textractGenerateCSVInterval"></a>

```typescript
public readonly textractGenerateCSVInterval: number;
```

- *Type:* number

---

##### `textractGenerateCSVMaxRetries`<sup>Optional</sup> <a name="textractGenerateCSVMaxRetries" id="amazon-textract-idp-cdk-constructs.TextractGenerateCSVProps.property.textractGenerateCSVMaxRetries"></a>

```typescript
public readonly textractGenerateCSVMaxRetries: number;
```

- *Type:* number
- *Default:* is 100

number of retries in Step Function flow.

---

### TextractGenericAsyncSfnTaskProps <a name="TextractGenericAsyncSfnTaskProps" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps"></a>

#### Initializer <a name="Initializer" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.Initializer"></a>

```typescript
import { TextractGenericAsyncSfnTaskProps } from 'amazon-textract-idp-cdk-constructs'

const textractGenericAsyncSfnTaskProps: TextractGenericAsyncSfnTaskProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.comment">comment</a></code> | <code>string</code> | An optional description for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.credentials">credentials</a></code> | <code>aws-cdk-lib.aws_stepfunctions.Credentials</code> | Credentials for an IAM Role that the State Machine assumes for executing the task. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.heartbeat">heartbeat</a></code> | <code>aws-cdk-lib.Duration</code> | Timeout for the heartbeat. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.heartbeatTimeout">heartbeatTimeout</a></code> | <code>aws-cdk-lib.aws_stepfunctions.Timeout</code> | Timeout for the heartbeat. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.inputPath">inputPath</a></code> | <code>string</code> | JSONPath expression to select part of the state to be the input to this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.integrationPattern">integrationPattern</a></code> | <code>aws-cdk-lib.aws_stepfunctions.IntegrationPattern</code> | AWS Step Functions integrates with services directly in the Amazon States Language. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.outputPath">outputPath</a></code> | <code>string</code> | JSONPath expression to select select a portion of the state output to pass to the next state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.resultPath">resultPath</a></code> | <code>string</code> | JSONPath expression to indicate where to inject the state's output. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.resultSelector">resultSelector</a></code> | <code>{[ key: string ]: any}</code> | The JSON that will replace the state's raw result and become the effective result before ResultPath is applied. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.stateName">stateName</a></code> | <code>string</code> | Optional name for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.taskTimeout">taskTimeout</a></code> | <code>aws-cdk-lib.aws_stepfunctions.Timeout</code> | Timeout for the task. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.timeout">timeout</a></code> | <code>aws-cdk-lib.Duration</code> | Timeout for the task. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.s3OutputBucket">s3OutputBucket</a></code> | <code>string</code> | Bucketname to output data to. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.s3TempOutputPrefix">s3TempOutputPrefix</a></code> | <code>string</code> | The prefix to use for the temporary output files (e. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.associateWithParent">associateWithParent</a></code> | <code>boolean</code> | Pass the execution ID from the context object to the execution input. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.enableCloudWatchMetricsAndDashboard">enableCloudWatchMetricsAndDashboard</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.input">input</a></code> | <code>aws-cdk-lib.aws_stepfunctions.TaskInput</code> | The JSON input for the execution, same as that of StartExecution. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.inputPolicyStatements">inputPolicyStatements</a></code> | <code>aws-cdk-lib.aws_iam.PolicyStatement[]</code> | List of PolicyStatements to attach to the Lambda function. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.lambdaLogLevel">lambdaLogLevel</a></code> | <code>string</code> | log level for Lambda function, supports DEBUG\|INFO\|WARNING\|ERROR\|FATAL. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.lambdaMemory">lambdaMemory</a></code> | <code>number</code> | Memory allocated to Lambda function, default 512. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.lambdaTimeout">lambdaTimeout</a></code> | <code>number</code> | Lambda Function Timeout in seconds, default 300. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.name">name</a></code> | <code>string</code> | The name of the execution, same as that of StartExecution. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.outputPolicyStatements">outputPolicyStatements</a></code> | <code>aws-cdk-lib.aws_iam.PolicyStatement[]</code> | List of PolicyStatements to attach to the Lambda function. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.s3InputBucket">s3InputBucket</a></code> | <code>string</code> | Bucketname and prefix to read document from /** location of input S3 objects - if left empty will generate rule for s3 access to all [*]. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.s3InputPrefix">s3InputPrefix</a></code> | <code>string</code> | prefix for input S3 objects - if left empty will generate rule for s3 access to all in bucket. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.snsRoleTextract">snsRoleTextract</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | IAM Role to assign to Textract, by default new iam.Role(this, 'TextractAsyncSNSRole', { assumedBy: new iam.ServicePrincipal('textract.amazonaws.com'), managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('AmazonSQSFullAccess'),   ManagedPolicy.fromAwsManagedPolicyName('AmazonSNSFullAccess'),   ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'),   ManagedPolicy.fromAwsManagedPolicyName('AmazonTextractFullAccess')], }); |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.taskTokenTable">taskTokenTable</a></code> | <code>aws-cdk-lib.aws_dynamodb.ITable</code> | task token table to use for mapping of Textract [JobTag](https://docs.aws.amazon.com/textract/latest/dg/API_StartDocumentTextDetection.html#Textract-StartDocumentTextDetection-request-JobTag) to the [TaskToken](https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html). |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.textractAPI">textractAPI</a></code> | <code>string</code> | Which Textract API to call ALL asynchronous Textract API calls are supported. Valid values are GENERIC \| EXPENSE \| LENDING. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.textractAsyncCallBackoffRate">textractAsyncCallBackoffRate</a></code> | <code>number</code> | retyr backoff rate. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.textractAsyncCallInterval">textractAsyncCallInterval</a></code> | <code>number</code> | time in seconds to wait before next retry. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.textractAsyncCallMaxRetries">textractAsyncCallMaxRetries</a></code> | <code>number</code> | number of retries in Step Function flow. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.textractStateMachineTimeoutMinutes">textractStateMachineTimeoutMinutes</a></code> | <code>number</code> | how long can we wait for the process. |

---

##### `comment`<sup>Optional</sup> <a name="comment" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.comment"></a>

```typescript
public readonly comment: string;
```

- *Type:* string
- *Default:* No comment

An optional description for this state.

---

##### `credentials`<sup>Optional</sup> <a name="credentials" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.credentials"></a>

```typescript
public readonly credentials: Credentials;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.Credentials
- *Default:* None (Task is executed using the State Machine's execution role)

Credentials for an IAM Role that the State Machine assumes for executing the task.

This enables cross-account resource invocations.

> [https://docs.aws.amazon.com/step-functions/latest/dg/concepts-access-cross-acct-resources.html](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-access-cross-acct-resources.html)

---

##### ~~`heartbeat`~~<sup>Optional</sup> <a name="heartbeat" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.heartbeat"></a>

- *Deprecated:* use `heartbeatTimeout`

```typescript
public readonly heartbeat: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* None

Timeout for the heartbeat.

---

##### `heartbeatTimeout`<sup>Optional</sup> <a name="heartbeatTimeout" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.heartbeatTimeout"></a>

```typescript
public readonly heartbeatTimeout: Timeout;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.Timeout
- *Default:* None

Timeout for the heartbeat.

[disable-awslint:duration-prop-type] is needed because all props interface in
aws-stepfunctions-tasks extend this interface

---

##### `inputPath`<sup>Optional</sup> <a name="inputPath" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.inputPath"></a>

```typescript
public readonly inputPath: string;
```

- *Type:* string
- *Default:* The entire task input (JSON path '$')

JSONPath expression to select part of the state to be the input to this state.

May also be the special value JsonPath.DISCARD, which will cause the effective
input to be the empty object {}.

---

##### `integrationPattern`<sup>Optional</sup> <a name="integrationPattern" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.integrationPattern"></a>

```typescript
public readonly integrationPattern: IntegrationPattern;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.IntegrationPattern
- *Default:* `IntegrationPattern.REQUEST_RESPONSE` for most tasks. `IntegrationPattern.RUN_JOB` for the following exceptions: `BatchSubmitJob`, `EmrAddStep`, `EmrCreateCluster`, `EmrTerminationCluster`, and `EmrContainersStartJobRun`.

AWS Step Functions integrates with services directly in the Amazon States Language.

You can control these AWS services using service integration patterns.

Depending on the AWS Service, the Service Integration Pattern availability will vary.

> [https://docs.aws.amazon.com/step-functions/latest/dg/connect-supported-services.html](https://docs.aws.amazon.com/step-functions/latest/dg/connect-supported-services.html)

---

##### `outputPath`<sup>Optional</sup> <a name="outputPath" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.outputPath"></a>

```typescript
public readonly outputPath: string;
```

- *Type:* string
- *Default:* The entire JSON node determined by the state input, the task result, and resultPath is passed to the next state (JSON path '$')

JSONPath expression to select select a portion of the state output to pass to the next state.

May also be the special value JsonPath.DISCARD, which will cause the effective
output to be the empty object {}.

---

##### `resultPath`<sup>Optional</sup> <a name="resultPath" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.resultPath"></a>

```typescript
public readonly resultPath: string;
```

- *Type:* string
- *Default:* Replaces the entire input with the result (JSON path '$')

JSONPath expression to indicate where to inject the state's output.

May also be the special value JsonPath.DISCARD, which will cause the state's
input to become its output.

---

##### `resultSelector`<sup>Optional</sup> <a name="resultSelector" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.resultSelector"></a>

```typescript
public readonly resultSelector: {[ key: string ]: any};
```

- *Type:* {[ key: string ]: any}
- *Default:* None

The JSON that will replace the state's raw result and become the effective result before ResultPath is applied.

You can use ResultSelector to create a payload with values that are static
or selected from the state's raw result.

> [https://docs.aws.amazon.com/step-functions/latest/dg/input-output-inputpath-params.html#input-output-resultselector](https://docs.aws.amazon.com/step-functions/latest/dg/input-output-inputpath-params.html#input-output-resultselector)

---

##### `stateName`<sup>Optional</sup> <a name="stateName" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.stateName"></a>

```typescript
public readonly stateName: string;
```

- *Type:* string
- *Default:* The construct ID will be used as state name

Optional name for this state.

---

##### `taskTimeout`<sup>Optional</sup> <a name="taskTimeout" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.taskTimeout"></a>

```typescript
public readonly taskTimeout: Timeout;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.Timeout
- *Default:* None

Timeout for the task.

[disable-awslint:duration-prop-type] is needed because all props interface in
aws-stepfunctions-tasks extend this interface

---

##### ~~`timeout`~~<sup>Optional</sup> <a name="timeout" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.timeout"></a>

- *Deprecated:* use `taskTimeout`

```typescript
public readonly timeout: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* None

Timeout for the task.

---

##### `s3OutputBucket`<sup>Required</sup> <a name="s3OutputBucket" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.s3OutputBucket"></a>

```typescript
public readonly s3OutputBucket: string;
```

- *Type:* string

Bucketname to output data to.

---

##### `s3TempOutputPrefix`<sup>Required</sup> <a name="s3TempOutputPrefix" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.s3TempOutputPrefix"></a>

```typescript
public readonly s3TempOutputPrefix: string;
```

- *Type:* string

The prefix to use for the temporary output files (e.

g. output from async process before stiching together)

---

##### `associateWithParent`<sup>Optional</sup> <a name="associateWithParent" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.associateWithParent"></a>

```typescript
public readonly associateWithParent: boolean;
```

- *Type:* boolean
- *Default:* false

Pass the execution ID from the context object to the execution input.

This allows the Step Functions UI to link child executions from parent executions, making it easier to trace execution flow across state machines.

If you set this property to `true`, the `input` property must be an object (provided by `sfn.TaskInput.fromObject`) or omitted entirely.

> [https://docs.aws.amazon.com/step-functions/latest/dg/concepts-nested-workflows.html#nested-execution-startid](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-nested-workflows.html#nested-execution-startid)

---

##### `enableCloudWatchMetricsAndDashboard`<sup>Optional</sup> <a name="enableCloudWatchMetricsAndDashboard" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.enableCloudWatchMetricsAndDashboard"></a>

```typescript
public readonly enableCloudWatchMetricsAndDashboard: boolean;
```

- *Type:* boolean

---

##### `input`<sup>Optional</sup> <a name="input" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.input"></a>

```typescript
public readonly input: TaskInput;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.TaskInput
- *Default:* The state input (JSON path '$')

The JSON input for the execution, same as that of StartExecution.

> [https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html](https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html)

---

##### `inputPolicyStatements`<sup>Optional</sup> <a name="inputPolicyStatements" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.inputPolicyStatements"></a>

```typescript
public readonly inputPolicyStatements: PolicyStatement[];
```

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement[]

List of PolicyStatements to attach to the Lambda function.

---

##### `lambdaLogLevel`<sup>Optional</sup> <a name="lambdaLogLevel" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.lambdaLogLevel"></a>

```typescript
public readonly lambdaLogLevel: string;
```

- *Type:* string
- *Default:* = DEBUG

log level for Lambda function, supports DEBUG|INFO|WARNING|ERROR|FATAL.

---

##### `lambdaMemory`<sup>Optional</sup> <a name="lambdaMemory" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.lambdaMemory"></a>

```typescript
public readonly lambdaMemory: number;
```

- *Type:* number

Memory allocated to Lambda function, default 512.

---

##### `lambdaTimeout`<sup>Optional</sup> <a name="lambdaTimeout" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.lambdaTimeout"></a>

```typescript
public readonly lambdaTimeout: number;
```

- *Type:* number

Lambda Function Timeout in seconds, default 300.

---

##### `name`<sup>Optional</sup> <a name="name" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string
- *Default:* None

The name of the execution, same as that of StartExecution.

> [https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html](https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html)

---

##### `outputPolicyStatements`<sup>Optional</sup> <a name="outputPolicyStatements" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.outputPolicyStatements"></a>

```typescript
public readonly outputPolicyStatements: PolicyStatement[];
```

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement[]

List of PolicyStatements to attach to the Lambda function.

---

##### `s3InputBucket`<sup>Optional</sup> <a name="s3InputBucket" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.s3InputBucket"></a>

```typescript
public readonly s3InputBucket: string;
```

- *Type:* string

Bucketname and prefix to read document from /** location of input S3 objects - if left empty will generate rule for s3 access to all [*].

---

##### `s3InputPrefix`<sup>Optional</sup> <a name="s3InputPrefix" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.s3InputPrefix"></a>

```typescript
public readonly s3InputPrefix: string;
```

- *Type:* string

prefix for input S3 objects - if left empty will generate rule for s3 access to all in bucket.

---

##### `snsRoleTextract`<sup>Optional</sup> <a name="snsRoleTextract" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.snsRoleTextract"></a>

```typescript
public readonly snsRoleTextract: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole

IAM Role to assign to Textract, by default new iam.Role(this, 'TextractAsyncSNSRole', { assumedBy: new iam.ServicePrincipal('textract.amazonaws.com'), managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('AmazonSQSFullAccess'),   ManagedPolicy.fromAwsManagedPolicyName('AmazonSNSFullAccess'),   ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'),   ManagedPolicy.fromAwsManagedPolicyName('AmazonTextractFullAccess')], });

---

##### `taskTokenTable`<sup>Optional</sup> <a name="taskTokenTable" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.taskTokenTable"></a>

```typescript
public readonly taskTokenTable: ITable;
```

- *Type:* aws-cdk-lib.aws_dynamodb.ITable

task token table to use for mapping of Textract [JobTag](https://docs.aws.amazon.com/textract/latest/dg/API_StartDocumentTextDetection.html#Textract-StartDocumentTextDetection-request-JobTag) to the [TaskToken](https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html).

---

##### `textractAPI`<sup>Optional</sup> <a name="textractAPI" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.textractAPI"></a>

```typescript
public readonly textractAPI: string;
```

- *Type:* string
- *Default:* GENERIC

Which Textract API to call ALL asynchronous Textract API calls are supported. Valid values are GENERIC | EXPENSE | LENDING.

For GENERIC, when called without features (e. g. FORMS, TABLES, QUERIES, SIGNATURE), StartDetectText is called and only OCR is returned.
For GENERIC, when called with a feature (e. g. FORMS, TABLES, QUERIES, SIGNATURE),  StartAnalyzeDocument is called.

---

##### `textractAsyncCallBackoffRate`<sup>Optional</sup> <a name="textractAsyncCallBackoffRate" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.textractAsyncCallBackoffRate"></a>

```typescript
public readonly textractAsyncCallBackoffRate: number;
```

- *Type:* number
- *Default:* is 1.1

retyr backoff rate.

---

##### `textractAsyncCallInterval`<sup>Optional</sup> <a name="textractAsyncCallInterval" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.textractAsyncCallInterval"></a>

```typescript
public readonly textractAsyncCallInterval: number;
```

- *Type:* number
- *Default:* is 1

time in seconds to wait before next retry.

---

##### `textractAsyncCallMaxRetries`<sup>Optional</sup> <a name="textractAsyncCallMaxRetries" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.textractAsyncCallMaxRetries"></a>

```typescript
public readonly textractAsyncCallMaxRetries: number;
```

- *Type:* number
- *Default:* is 100

number of retries in Step Function flow.

---

##### `textractStateMachineTimeoutMinutes`<sup>Optional</sup> <a name="textractStateMachineTimeoutMinutes" id="amazon-textract-idp-cdk-constructs.TextractGenericAsyncSfnTaskProps.property.textractStateMachineTimeoutMinutes"></a>

```typescript
public readonly textractStateMachineTimeoutMinutes: number;
```

- *Type:* number
- *Default:* 2880 (48 hours (60 min * 48 hours = 2880))

how long can we wait for the process.

---

### TextractGenericSyncSfnTaskProps <a name="TextractGenericSyncSfnTaskProps" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps"></a>

#### Initializer <a name="Initializer" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.Initializer"></a>

```typescript
import { TextractGenericSyncSfnTaskProps } from 'amazon-textract-idp-cdk-constructs'

const textractGenericSyncSfnTaskProps: TextractGenericSyncSfnTaskProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.comment">comment</a></code> | <code>string</code> | An optional description for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.credentials">credentials</a></code> | <code>aws-cdk-lib.aws_stepfunctions.Credentials</code> | Credentials for an IAM Role that the State Machine assumes for executing the task. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.heartbeat">heartbeat</a></code> | <code>aws-cdk-lib.Duration</code> | Timeout for the heartbeat. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.heartbeatTimeout">heartbeatTimeout</a></code> | <code>aws-cdk-lib.aws_stepfunctions.Timeout</code> | Timeout for the heartbeat. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.inputPath">inputPath</a></code> | <code>string</code> | JSONPath expression to select part of the state to be the input to this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.integrationPattern">integrationPattern</a></code> | <code>aws-cdk-lib.aws_stepfunctions.IntegrationPattern</code> | AWS Step Functions integrates with services directly in the Amazon States Language. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.outputPath">outputPath</a></code> | <code>string</code> | JSONPath expression to select select a portion of the state output to pass to the next state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.resultPath">resultPath</a></code> | <code>string</code> | JSONPath expression to indicate where to inject the state's output. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.resultSelector">resultSelector</a></code> | <code>{[ key: string ]: any}</code> | The JSON that will replace the state's raw result and become the effective result before ResultPath is applied. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.stateName">stateName</a></code> | <code>string</code> | Optional name for this state. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.taskTimeout">taskTimeout</a></code> | <code>aws-cdk-lib.aws_stepfunctions.Timeout</code> | Timeout for the task. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.timeout">timeout</a></code> | <code>aws-cdk-lib.Duration</code> | Timeout for the task. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.s3OutputBucket">s3OutputBucket</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.s3OutputPrefix">s3OutputPrefix</a></code> | <code>string</code> | The prefix to use for the output files. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.associateWithParent">associateWithParent</a></code> | <code>boolean</code> | Pass the execution ID from the context object to the execution input. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.customFunction">customFunction</a></code> | <code>aws-cdk-lib.aws_stepfunctions_tasks.LambdaInvoke</code> | not implemented yet. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.enableCloudWatchMetricsAndDashboard">enableCloudWatchMetricsAndDashboard</a></code> | <code>boolean</code> | enable CloudWatch Metrics and Dashboard. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.enableDashboard">enableDashboard</a></code> | <code>boolean</code> | not implemented yet. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.enableMonitoring">enableMonitoring</a></code> | <code>boolean</code> | not implemented yet. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.input">input</a></code> | <code>aws-cdk-lib.aws_stepfunctions.TaskInput</code> | The JSON input for the execution, same as that of StartExecution. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.inputPolicyStatements">inputPolicyStatements</a></code> | <code>aws-cdk-lib.aws_iam.PolicyStatement[]</code> | List of PolicyStatements to attach to the Lambda function. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.lambdaLogLevel">lambdaLogLevel</a></code> | <code>string</code> | Log level, can be DEBUG, INFO, WARNING, ERROR, FATAL. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.lambdaMemory">lambdaMemory</a></code> | <code>number</code> | Memory allocated to Lambda function, default 512. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.lambdaTimeout">lambdaTimeout</a></code> | <code>number</code> | Lambda Function Timeout in seconds, default 300. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.name">name</a></code> | <code>string</code> | The name of the execution, same as that of StartExecution. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.outputPolicyStatements">outputPolicyStatements</a></code> | <code>aws-cdk-lib.aws_iam.PolicyStatement[]</code> | List of PolicyStatements to attach to the Lambda function. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.s3InputBucket">s3InputBucket</a></code> | <code>string</code> | location of input S3 objects - if left empty will generate rule for s3 access to all [*]. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.s3InputPrefix">s3InputPrefix</a></code> | <code>string</code> | prefix for input S3 objects - if left empty will generate rule for s3 access to all [*]. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.textractAPI">textractAPI</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.textractAsyncCallBackoffRate">textractAsyncCallBackoffRate</a></code> | <code>number</code> | default is 1.1. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.textractAsyncCallInterval">textractAsyncCallInterval</a></code> | <code>number</code> | default is 1. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.textractAsyncCallMaxRetries">textractAsyncCallMaxRetries</a></code> | <code>number</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.textractStateMachineTimeoutMinutes">textractStateMachineTimeoutMinutes</a></code> | <code>number</code> | how long can we wait for the process (default is 48 hours (60*48=2880)). |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.workflowTracingEnabled">workflowTracingEnabled</a></code> | <code>boolean</code> | *No description.* |

---

##### `comment`<sup>Optional</sup> <a name="comment" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.comment"></a>

```typescript
public readonly comment: string;
```

- *Type:* string
- *Default:* No comment

An optional description for this state.

---

##### `credentials`<sup>Optional</sup> <a name="credentials" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.credentials"></a>

```typescript
public readonly credentials: Credentials;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.Credentials
- *Default:* None (Task is executed using the State Machine's execution role)

Credentials for an IAM Role that the State Machine assumes for executing the task.

This enables cross-account resource invocations.

> [https://docs.aws.amazon.com/step-functions/latest/dg/concepts-access-cross-acct-resources.html](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-access-cross-acct-resources.html)

---

##### ~~`heartbeat`~~<sup>Optional</sup> <a name="heartbeat" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.heartbeat"></a>

- *Deprecated:* use `heartbeatTimeout`

```typescript
public readonly heartbeat: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* None

Timeout for the heartbeat.

---

##### `heartbeatTimeout`<sup>Optional</sup> <a name="heartbeatTimeout" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.heartbeatTimeout"></a>

```typescript
public readonly heartbeatTimeout: Timeout;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.Timeout
- *Default:* None

Timeout for the heartbeat.

[disable-awslint:duration-prop-type] is needed because all props interface in
aws-stepfunctions-tasks extend this interface

---

##### `inputPath`<sup>Optional</sup> <a name="inputPath" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.inputPath"></a>

```typescript
public readonly inputPath: string;
```

- *Type:* string
- *Default:* The entire task input (JSON path '$')

JSONPath expression to select part of the state to be the input to this state.

May also be the special value JsonPath.DISCARD, which will cause the effective
input to be the empty object {}.

---

##### `integrationPattern`<sup>Optional</sup> <a name="integrationPattern" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.integrationPattern"></a>

```typescript
public readonly integrationPattern: IntegrationPattern;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.IntegrationPattern
- *Default:* `IntegrationPattern.REQUEST_RESPONSE` for most tasks. `IntegrationPattern.RUN_JOB` for the following exceptions: `BatchSubmitJob`, `EmrAddStep`, `EmrCreateCluster`, `EmrTerminationCluster`, and `EmrContainersStartJobRun`.

AWS Step Functions integrates with services directly in the Amazon States Language.

You can control these AWS services using service integration patterns.

Depending on the AWS Service, the Service Integration Pattern availability will vary.

> [https://docs.aws.amazon.com/step-functions/latest/dg/connect-supported-services.html](https://docs.aws.amazon.com/step-functions/latest/dg/connect-supported-services.html)

---

##### `outputPath`<sup>Optional</sup> <a name="outputPath" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.outputPath"></a>

```typescript
public readonly outputPath: string;
```

- *Type:* string
- *Default:* The entire JSON node determined by the state input, the task result, and resultPath is passed to the next state (JSON path '$')

JSONPath expression to select select a portion of the state output to pass to the next state.

May also be the special value JsonPath.DISCARD, which will cause the effective
output to be the empty object {}.

---

##### `resultPath`<sup>Optional</sup> <a name="resultPath" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.resultPath"></a>

```typescript
public readonly resultPath: string;
```

- *Type:* string
- *Default:* Replaces the entire input with the result (JSON path '$')

JSONPath expression to indicate where to inject the state's output.

May also be the special value JsonPath.DISCARD, which will cause the state's
input to become its output.

---

##### `resultSelector`<sup>Optional</sup> <a name="resultSelector" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.resultSelector"></a>

```typescript
public readonly resultSelector: {[ key: string ]: any};
```

- *Type:* {[ key: string ]: any}
- *Default:* None

The JSON that will replace the state's raw result and become the effective result before ResultPath is applied.

You can use ResultSelector to create a payload with values that are static
or selected from the state's raw result.

> [https://docs.aws.amazon.com/step-functions/latest/dg/input-output-inputpath-params.html#input-output-resultselector](https://docs.aws.amazon.com/step-functions/latest/dg/input-output-inputpath-params.html#input-output-resultselector)

---

##### `stateName`<sup>Optional</sup> <a name="stateName" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.stateName"></a>

```typescript
public readonly stateName: string;
```

- *Type:* string
- *Default:* The construct ID will be used as state name

Optional name for this state.

---

##### `taskTimeout`<sup>Optional</sup> <a name="taskTimeout" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.taskTimeout"></a>

```typescript
public readonly taskTimeout: Timeout;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.Timeout
- *Default:* None

Timeout for the task.

[disable-awslint:duration-prop-type] is needed because all props interface in
aws-stepfunctions-tasks extend this interface

---

##### ~~`timeout`~~<sup>Optional</sup> <a name="timeout" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.timeout"></a>

- *Deprecated:* use `taskTimeout`

```typescript
public readonly timeout: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* None

Timeout for the task.

---

##### `s3OutputBucket`<sup>Required</sup> <a name="s3OutputBucket" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.s3OutputBucket"></a>

```typescript
public readonly s3OutputBucket: string;
```

- *Type:* string

---

##### `s3OutputPrefix`<sup>Required</sup> <a name="s3OutputPrefix" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.s3OutputPrefix"></a>

```typescript
public readonly s3OutputPrefix: string;
```

- *Type:* string

The prefix to use for the output files.

---

##### `associateWithParent`<sup>Optional</sup> <a name="associateWithParent" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.associateWithParent"></a>

```typescript
public readonly associateWithParent: boolean;
```

- *Type:* boolean
- *Default:* false

Pass the execution ID from the context object to the execution input.

This allows the Step Functions UI to link child executions from parent executions, making it easier to trace execution flow across state machines.

If you set this property to `true`, the `input` property must be an object (provided by `sfn.TaskInput.fromObject`) or omitted entirely.

> [https://docs.aws.amazon.com/step-functions/latest/dg/concepts-nested-workflows.html#nested-execution-startid](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-nested-workflows.html#nested-execution-startid)

---

##### `customFunction`<sup>Optional</sup> <a name="customFunction" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.customFunction"></a>

```typescript
public readonly customFunction: LambdaInvoke;
```

- *Type:* aws-cdk-lib.aws_stepfunctions_tasks.LambdaInvoke

not implemented yet.

---

##### `enableCloudWatchMetricsAndDashboard`<sup>Optional</sup> <a name="enableCloudWatchMetricsAndDashboard" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.enableCloudWatchMetricsAndDashboard"></a>

```typescript
public readonly enableCloudWatchMetricsAndDashboard: boolean;
```

- *Type:* boolean
- *Default:* false

enable CloudWatch Metrics and Dashboard.

---

##### `enableDashboard`<sup>Optional</sup> <a name="enableDashboard" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.enableDashboard"></a>

```typescript
public readonly enableDashboard: boolean;
```

- *Type:* boolean

not implemented yet.

---

##### `enableMonitoring`<sup>Optional</sup> <a name="enableMonitoring" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.enableMonitoring"></a>

```typescript
public readonly enableMonitoring: boolean;
```

- *Type:* boolean

not implemented yet.

---

##### `input`<sup>Optional</sup> <a name="input" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.input"></a>

```typescript
public readonly input: TaskInput;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.TaskInput
- *Default:* The state input (JSON path '$')

The JSON input for the execution, same as that of StartExecution.

> [https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html](https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html)

---

##### `inputPolicyStatements`<sup>Optional</sup> <a name="inputPolicyStatements" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.inputPolicyStatements"></a>

```typescript
public readonly inputPolicyStatements: PolicyStatement[];
```

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement[]

List of PolicyStatements to attach to the Lambda function.

---

##### `lambdaLogLevel`<sup>Optional</sup> <a name="lambdaLogLevel" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.lambdaLogLevel"></a>

```typescript
public readonly lambdaLogLevel: string;
```

- *Type:* string

Log level, can be DEBUG, INFO, WARNING, ERROR, FATAL.

---

##### `lambdaMemory`<sup>Optional</sup> <a name="lambdaMemory" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.lambdaMemory"></a>

```typescript
public readonly lambdaMemory: number;
```

- *Type:* number

Memory allocated to Lambda function, default 512.

---

##### `lambdaTimeout`<sup>Optional</sup> <a name="lambdaTimeout" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.lambdaTimeout"></a>

```typescript
public readonly lambdaTimeout: number;
```

- *Type:* number

Lambda Function Timeout in seconds, default 300.

---

##### `name`<sup>Optional</sup> <a name="name" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string
- *Default:* None

The name of the execution, same as that of StartExecution.

> [https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html](https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html)

---

##### `outputPolicyStatements`<sup>Optional</sup> <a name="outputPolicyStatements" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.outputPolicyStatements"></a>

```typescript
public readonly outputPolicyStatements: PolicyStatement[];
```

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement[]

List of PolicyStatements to attach to the Lambda function.

---

##### `s3InputBucket`<sup>Optional</sup> <a name="s3InputBucket" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.s3InputBucket"></a>

```typescript
public readonly s3InputBucket: string;
```

- *Type:* string

location of input S3 objects - if left empty will generate rule for s3 access to all [*].

---

##### `s3InputPrefix`<sup>Optional</sup> <a name="s3InputPrefix" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.s3InputPrefix"></a>

```typescript
public readonly s3InputPrefix: string;
```

- *Type:* string

prefix for input S3 objects - if left empty will generate rule for s3 access to all [*].

---

##### `textractAPI`<sup>Optional</sup> <a name="textractAPI" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.textractAPI"></a>

```typescript
public readonly textractAPI: string;
```

- *Type:* string

---

##### `textractAsyncCallBackoffRate`<sup>Optional</sup> <a name="textractAsyncCallBackoffRate" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.textractAsyncCallBackoffRate"></a>

```typescript
public readonly textractAsyncCallBackoffRate: number;
```

- *Type:* number

default is 1.1.

---

##### `textractAsyncCallInterval`<sup>Optional</sup> <a name="textractAsyncCallInterval" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.textractAsyncCallInterval"></a>

```typescript
public readonly textractAsyncCallInterval: number;
```

- *Type:* number

default is 1.

---

##### `textractAsyncCallMaxRetries`<sup>Optional</sup> <a name="textractAsyncCallMaxRetries" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.textractAsyncCallMaxRetries"></a>

```typescript
public readonly textractAsyncCallMaxRetries: number;
```

- *Type:* number

---

##### `textractStateMachineTimeoutMinutes`<sup>Optional</sup> <a name="textractStateMachineTimeoutMinutes" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.textractStateMachineTimeoutMinutes"></a>

```typescript
public readonly textractStateMachineTimeoutMinutes: number;
```

- *Type:* number

how long can we wait for the process (default is 48 hours (60*48=2880)).

---

##### `workflowTracingEnabled`<sup>Optional</sup> <a name="workflowTracingEnabled" id="amazon-textract-idp-cdk-constructs.TextractGenericSyncSfnTaskProps.property.workflowTracingEnabled"></a>

```typescript
public readonly workflowTracingEnabled: boolean;
```

- *Type:* boolean

---

### TextractPdfMapperForFhirProps <a name="TextractPdfMapperForFhirProps" id="amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhirProps"></a>

#### Initializer <a name="Initializer" id="amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhirProps.Initializer"></a>

```typescript
import { TextractPdfMapperForFhirProps } from 'amazon-textract-idp-cdk-constructs'

const textractPdfMapperForFhirProps: TextractPdfMapperForFhirProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhirProps.property.healthlakeEndpoint">healthlakeEndpoint</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhirProps.property.inputPolicyStatements">inputPolicyStatements</a></code> | <code>aws-cdk-lib.aws_iam.PolicyStatement[]</code> | List of PolicyStatements to attach to the Lambda function for S3 GET and LIST. |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhirProps.property.lambdaLogLevel">lambdaLogLevel</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhirProps.property.lambdaMemoryMB">lambdaMemoryMB</a></code> | <code>number</code> | memory of Lambda function (may need to increase for larger documents). |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhirProps.property.lambdaTimeout">lambdaTimeout</a></code> | <code>number</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhirProps.property.pdfMapperForFhirFunction">pdfMapperForFhirFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhirProps.property.s3InputBucket">s3InputBucket</a></code> | <code>string</code> | *No description.* |
| <code><a href="#amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhirProps.property.s3InputPrefix">s3InputPrefix</a></code> | <code>string</code> | prefix for the incoming document. |

---

##### `healthlakeEndpoint`<sup>Optional</sup> <a name="healthlakeEndpoint" id="amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhirProps.property.healthlakeEndpoint"></a>

```typescript
public readonly healthlakeEndpoint: string;
```

- *Type:* string

---

##### `inputPolicyStatements`<sup>Optional</sup> <a name="inputPolicyStatements" id="amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhirProps.property.inputPolicyStatements"></a>

```typescript
public readonly inputPolicyStatements: PolicyStatement[];
```

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement[]

List of PolicyStatements to attach to the Lambda function for S3 GET and LIST.

---

##### `lambdaLogLevel`<sup>Optional</sup> <a name="lambdaLogLevel" id="amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhirProps.property.lambdaLogLevel"></a>

```typescript
public readonly lambdaLogLevel: string;
```

- *Type:* string

---

##### `lambdaMemoryMB`<sup>Optional</sup> <a name="lambdaMemoryMB" id="amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhirProps.property.lambdaMemoryMB"></a>

```typescript
public readonly lambdaMemoryMB: number;
```

- *Type:* number

memory of Lambda function (may need to increase for larger documents).

---

##### `lambdaTimeout`<sup>Optional</sup> <a name="lambdaTimeout" id="amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhirProps.property.lambdaTimeout"></a>

```typescript
public readonly lambdaTimeout: number;
```

- *Type:* number

---

##### `pdfMapperForFhirFunction`<sup>Optional</sup> <a name="pdfMapperForFhirFunction" id="amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhirProps.property.pdfMapperForFhirFunction"></a>

```typescript
public readonly pdfMapperForFhirFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `s3InputBucket`<sup>Optional</sup> <a name="s3InputBucket" id="amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhirProps.property.s3InputBucket"></a>

```typescript
public readonly s3InputBucket: string;
```

- *Type:* string

---

##### `s3InputPrefix`<sup>Optional</sup> <a name="s3InputPrefix" id="amazon-textract-idp-cdk-constructs.TextractPdfMapperForFhirProps.property.s3InputPrefix"></a>

```typescript
public readonly s3InputPrefix: string;
```

- *Type:* string

prefix for the incoming document.

Will be used to create role

---

### WorkmailS3IngestionPointProps <a name="WorkmailS3IngestionPointProps" id="amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPointProps"></a>

#### Initializer <a name="Initializer" id="amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPointProps.Initializer"></a>

```typescript
import { WorkmailS3IngestionPointProps } from 'amazon-textract-idp-cdk-constructs'

const workmailS3IngestionPointProps: WorkmailS3IngestionPointProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPointProps.property.s3OutputBucket">s3OutputBucket</a></code> | <code>string</code> | Bucket name to output data to. |
| <code><a href="#amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPointProps.property.s3OutputPrefix">s3OutputPrefix</a></code> | <code>string</code> | The prefix to use to output files to. |
| <code><a href="#amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPointProps.property.workmailAccountNumber">workmailAccountNumber</a></code> | <code>string</code> | Account number for WorkMail instance. |
| <code><a href="#amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPointProps.property.workmailRegion">workmailRegion</a></code> | <code>string</code> | Region where WorkMailail instance exists. |
| <code><a href="#amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPointProps.property.lambdaMemoryMB">lambdaMemoryMB</a></code> | <code>number</code> | Lambda function memory configuration (may need to increase for larger documents). |
| <code><a href="#amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPointProps.property.lambdaTimeout">lambdaTimeout</a></code> | <code>number</code> | Lambda function timeout (may need to increase for larger documents). |

---

##### `s3OutputBucket`<sup>Required</sup> <a name="s3OutputBucket" id="amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPointProps.property.s3OutputBucket"></a>

```typescript
public readonly s3OutputBucket: string;
```

- *Type:* string

Bucket name to output data to.

---

##### `s3OutputPrefix`<sup>Required</sup> <a name="s3OutputPrefix" id="amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPointProps.property.s3OutputPrefix"></a>

```typescript
public readonly s3OutputPrefix: string;
```

- *Type:* string

The prefix to use to output files to.

---

##### `workmailAccountNumber`<sup>Required</sup> <a name="workmailAccountNumber" id="amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPointProps.property.workmailAccountNumber"></a>

```typescript
public readonly workmailAccountNumber: string;
```

- *Type:* string

Account number for WorkMail instance.

---

##### `workmailRegion`<sup>Required</sup> <a name="workmailRegion" id="amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPointProps.property.workmailRegion"></a>

```typescript
public readonly workmailRegion: string;
```

- *Type:* string

Region where WorkMailail instance exists.

---

##### `lambdaMemoryMB`<sup>Optional</sup> <a name="lambdaMemoryMB" id="amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPointProps.property.lambdaMemoryMB"></a>

```typescript
public readonly lambdaMemoryMB: number;
```

- *Type:* number

Lambda function memory configuration (may need to increase for larger documents).

---

##### `lambdaTimeout`<sup>Optional</sup> <a name="lambdaTimeout" id="amazon-textract-idp-cdk-constructs.WorkmailS3IngestionPointProps.property.lambdaTimeout"></a>

```typescript
public readonly lambdaTimeout: number;
```

- *Type:* number

Lambda function timeout (may need to increase for larger documents).

---



