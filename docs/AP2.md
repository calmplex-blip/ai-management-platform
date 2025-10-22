# AP2 Integration Guide

Agent Protocol 2 (AP2) integration in ConsciousOps provides an advanced task execution engine with resource allocation, action dependencies, and real-time progress tracking.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Task Management](#task-management)
- [Actions](#actions)
- [Resources](#resources)
- [Execution](#execution)
- [API Reference](#api-reference)
- [Examples](#examples)

## Overview

AP2 (Agent Protocol 2) is Google's protocol for structured task execution with complex workflows. ConsciousOps provides:

- **Task Creation** - Define multi-step tasks with actions and resources
- **5 Action Types** - Query, Execute, Observe, Plan, Delegate
- **Resource Management** - Allocate and track resource usage
- **Dependency Resolution** - Execute actions in correct order
- **Progress Tracking** - Real-time 0-100% progress updates
- **Event System** - Monitor task lifecycle events

## Architecture

### Core Components

```
src/
├── types/ap2.ts              # AP2 protocol types
├── lib/
│   ├── ap2-manager.ts        # Execution engine and task management
│   └── ap2-store.ts          # Zustand state management
└── components/
    └── ap2/                  # Task management UI
        ├── TaskCard.tsx
        └── CreateTaskModal.tsx
```

### Type Definitions

**Key Types** (`src/types/ap2.ts`):

```typescript
// Task
interface AP2Task {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
  agentId: string;
  actions: AP2Action[];
  resources: AP2Resource[];
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  progress: number; // 0-100
  result?: any;
  error?: string;
}

type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

// Action
interface AP2Action {
  id: string;
  taskId: string;
  type: ActionType;
  name: string;
  description?: string;
  parameters: Record<string, any>;
  dependencies?: string[]; // IDs of actions that must complete first
  status: TaskStatus;
  result?: any;
  error?: string;
}

type ActionType = 'query' | 'execute' | 'observe' | 'plan' | 'delegate';

// Resource
interface AP2Resource {
  id: string;
  type: ResourceType;
  name: string;
  amount: number;
  unit: string;
  allocated: boolean;
}

type ResourceType = 'compute' | 'memory' | 'storage' | 'network' | 'credits' | 'custom';

// Tool
interface AP2Tool {
  id: string;
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  outputSchema: Record<string, any>;
  category: string;
}

// Execution Plan
interface AP2ExecutionPlan {
  taskId: string;
  steps: AP2ExecutionStep[];
  estimatedDuration?: number;
  resourceRequirements: AP2Resource[];
}

interface AP2ExecutionStep {
  actionId: string;
  order: number;
  dependsOn: string[];
  estimatedDuration?: number;
}

// Task Result
interface AP2TaskResult {
  taskId: string;
  success: boolean;
  result?: any;
  error?: string;
  executionTime: number;
  resourcesUsed: AP2Resource[];
}
```

## Getting Started

### 1. Access AP2 Tasks Page

Navigate to the AP2 Tasks page:

```
http://localhost:3000/ap2-tasks
```

### 2. View Task Statistics

The page displays:
- Total tasks count
- Running tasks count
- Completed tasks count
- Failed tasks count
- Available tools count
- Allocated resources count

## Task Management

### Creating Tasks

#### Via UI

1. Click **"Create Task"** button
2. Fill in task details:
   - **Task Name**: Descriptive name
   - **Description**: What the task does
   - **Agent ID**: Agent that will execute the task

3. Add Actions:
   - Click **"Add Action"**
   - Select action type (Query, Execute, Observe, Plan, Delegate)
   - Enter action name and description
   - Add parameters (key-value pairs)
   - Specify dependencies (comma-separated action IDs)
   - Click **"+"** to add more actions

4. Add Resources:
   - Click **"Add Resource"**
   - Select resource type
   - Enter resource name, amount, and unit
   - Click **"+"** to add more resources

5. Click **"Create Task"**

#### Programmatically

```typescript
import { ap2Manager } from '@/lib/ap2-manager';
import { v4 as uuidv4 } from 'uuid';

const task = await ap2Manager.createTask({
  name: 'Data Analysis Pipeline',
  description: 'Fetch, clean, and analyze data',
  agentId: 'agent-1',
  actions: [
    {
      id: 'action-1',
      type: 'query',
      name: 'fetch_data',
      description: 'Fetch data from database',
      parameters: { source: 'database', query: 'SELECT * FROM data' },
      dependencies: []
    },
    {
      id: 'action-2',
      type: 'execute',
      name: 'clean_data',
      description: 'Clean and normalize data',
      parameters: { operations: ['remove_nulls', 'normalize'] },
      dependencies: ['action-1'] // Depends on action-1
    },
    {
      id: 'action-3',
      type: 'execute',
      name: 'analyze_data',
      description: 'Analyze cleaned data',
      parameters: { metrics: ['mean', 'median', 'std'] },
      dependencies: ['action-2'] // Depends on action-2
    }
  ],
  resources: [
    {
      id: uuidv4(),
      type: 'compute',
      name: 'CPU',
      amount: 4,
      unit: 'cores',
      allocated: false
    },
    {
      id: uuidv4(),
      type: 'memory',
      name: 'RAM',
      amount: 8,
      unit: 'GB',
      allocated: false
    }
  ]
});

console.log('Task created:', task.id);
```

### Viewing Tasks

The tasks page shows:
- Task name and description
- Status with color indicators
- Progress bar (0-100%)
- Agent ID
- Number of actions
- Creation time

### Executing Tasks

#### Via UI

1. Find the task card
2. Click **"Execute"** button
3. Watch progress bar update in real-time
4. View completion status

#### Programmatically

```typescript
import { ap2Manager } from '@/lib/ap2-manager';

// Execute task
const result = await ap2Manager.executeTask('task-id');

if (result.success) {
  console.log('Task completed:', result.result);
  console.log('Execution time:', result.executionTime, 'ms');
} else {
  console.error('Task failed:', result.error);
}
```

### Cancelling Tasks

#### Via UI

Click **"Cancel"** on a running task.

#### Programmatically

```typescript
await ap2Manager.cancelTask('task-id');
```

### Viewing Task Details

Click **"Details"** on a task card to see:
- Full task information
- All actions with status
- Resource allocation
- Execution timeline
- Results or errors

### Deleting Tasks

Click **"Delete"** to remove a completed or failed task.

## Actions

AP2 supports 5 action types, each with a specific purpose:

### 1. Query

**Purpose**: Retrieve information without side effects

**Use Cases**:
- Database queries
- API GET requests
- File reads
- Status checks

**Example**:
```typescript
{
  type: 'query',
  name: 'get_user_data',
  description: 'Fetch user data from database',
  parameters: {
    userId: '12345',
    fields: ['name', 'email', 'status']
  }
}
```

### 2. Execute

**Purpose**: Perform operations with side effects

**Use Cases**:
- Data processing
- File operations
- API POST/PUT/DELETE requests
- Calculations

**Example**:
```typescript
{
  type: 'execute',
  name: 'process_payment',
  description: 'Process payment transaction',
  parameters: {
    amount: 99.99,
    currency: 'USD',
    method: 'card'
  }
}
```

### 3. Observe

**Purpose**: Monitor state or wait for conditions

**Use Cases**:
- Wait for file to exist
- Monitor API endpoint
- Check system metrics
- Wait for event

**Example**:
```typescript
{
  type: 'observe',
  name: 'wait_for_completion',
  description: 'Wait for external process to complete',
  parameters: {
    endpoint: 'https://api.example.com/status',
    condition: 'status === "complete"',
    timeout: 60000
  }
}
```

### 4. Plan

**Purpose**: Generate execution plans for complex workflows

**Use Cases**:
- Create sub-tasks
- Generate action sequences
- Optimize workflows
- Resource planning

**Example**:
```typescript
{
  type: 'plan',
  name: 'generate_workflow',
  description: 'Create optimized execution plan',
  parameters: {
    goal: 'analyze_customer_data',
    constraints: {
      maxDuration: 300000,
      maxResources: { compute: 8, memory: 16 }
    }
  }
}
```

### 5. Delegate

**Purpose**: Assign work to other agents or services

**Use Cases**:
- Multi-agent workflows
- Load balancing
- Specialized processing
- External service calls

**Example**:
```typescript
{
  type: 'delegate',
  name: 'delegate_analysis',
  description: 'Send data to analysis agent',
  parameters: {
    targetAgent: 'analysis-agent',
    capability: 'advanced_analytics',
    data: { ... }
  }
}
```

## Resources

### Resource Types

#### Compute
CPU cores, GPU units, processing power

```typescript
{
  type: 'compute',
  name: 'CPU',
  amount: 4,
  unit: 'cores'
}
```

#### Memory
RAM, cache, working memory

```typescript
{
  type: 'memory',
  name: 'RAM',
  amount: 8,
  unit: 'GB'
}
```

#### Storage
Disk space, database storage

```typescript
{
  type: 'storage',
  name: 'Disk',
  amount: 100,
  unit: 'GB'
}
```

#### Network
Bandwidth, API calls, requests

```typescript
{
  type: 'network',
  name: 'Bandwidth',
  amount: 1000,
  unit: 'Mbps'
}
```

#### Credits
API credits, tokens, usage quotas

```typescript
{
  type: 'credits',
  name: 'API Tokens',
  amount: 10000,
  unit: 'tokens'
}
```

#### Custom
Any other resource type

```typescript
{
  type: 'custom',
  name: 'Licenses',
  amount: 2,
  unit: 'concurrent'
}
```

### Resource Allocation

Resources are automatically allocated when a task starts:

```typescript
// Resources specified in task
const task = await ap2Manager.createTask({
  name: 'Heavy Processing',
  resources: [
    { type: 'compute', name: 'CPU', amount: 8, unit: 'cores' },
    { type: 'memory', name: 'RAM', amount: 16, unit: 'GB' }
  ],
  // ...
});

// When task executes:
// 1. Resources are allocated
// 2. Task runs
// 3. Resources are released
```

### Resource Tracking

Monitor resource usage:

```typescript
// Get task result
const result = await ap2Manager.executeTask(taskId);

// Check resources used
console.log('Resources used:', result.resourcesUsed);

// [
//   { type: 'compute', name: 'CPU', amount: 8, unit: 'cores', allocated: true },
//   { type: 'memory', name: 'RAM', amount: 16, unit: 'GB', allocated: true }
// ]
```

## Execution

### Action Dependencies

Actions can depend on other actions:

```typescript
const task = await ap2Manager.createTask({
  name: 'Sequential Pipeline',
  actions: [
    {
      id: 'step-1',
      type: 'query',
      name: 'fetch',
      dependencies: [] // No dependencies, runs first
    },
    {
      id: 'step-2',
      type: 'execute',
      name: 'process',
      dependencies: ['step-1'] // Runs after step-1
    },
    {
      id: 'step-3',
      type: 'execute',
      name: 'save',
      dependencies: ['step-2'] // Runs after step-2
    }
  ]
});
```

### Parallel Execution

Actions without dependencies run in parallel:

```typescript
const task = await ap2Manager.createTask({
  name: 'Parallel Processing',
  actions: [
    {
      id: 'fetch-1',
      type: 'query',
      name: 'fetch_source_1',
      dependencies: []
    },
    {
      id: 'fetch-2',
      type: 'query',
      name: 'fetch_source_2',
      dependencies: [] // Runs in parallel with fetch-1
    },
    {
      id: 'merge',
      type: 'execute',
      name: 'merge_data',
      dependencies: ['fetch-1', 'fetch-2'] // Waits for both
    }
  ]
});
```

### Progress Tracking

Track execution progress:

```typescript
import { ap2Manager } from '@/lib/ap2-manager';

// Listen for progress events
ap2Manager.on('task:progress', ({ taskId, progress }) => {
  console.log(`Task ${taskId}: ${progress}%`);
});

// Listen for status changes
ap2Manager.on('task:status', ({ taskId, status }) => {
  console.log(`Task ${taskId} status: ${status}`);
});

// Execute task
await ap2Manager.executeTask(taskId);
```

### Error Handling

Handle task failures:

```typescript
try {
  const result = await ap2Manager.executeTask(taskId);

  if (result.success) {
    console.log('Success:', result.result);
  } else {
    console.error('Failed:', result.error);
  }
} catch (error) {
  console.error('Execution error:', error);
}
```

## API Reference

### AP2Manager

Located in `src/lib/ap2-manager.ts`:

#### `createTask(params: CreateTaskParams): Promise<AP2Task>`

Create a new task.

```typescript
import { ap2Manager } from '@/lib/ap2-manager';

const task = await ap2Manager.createTask({
  name: 'My Task',
  description: 'Task description',
  agentId: 'agent-1',
  actions: [...],
  resources: [...]
});
```

#### `getTask(taskId: string): AP2Task | undefined`

Get a task by ID.

```typescript
const task = ap2Manager.getTask('task-id');
```

#### `executeTask(taskId: string): Promise<AP2TaskResult>`

Execute a task.

```typescript
const result = await ap2Manager.executeTask('task-id');

if (result.success) {
  console.log('Result:', result.result);
  console.log('Time:', result.executionTime, 'ms');
}
```

#### `cancelTask(taskId: string): Promise<void>`

Cancel a running task.

```typescript
await ap2Manager.cancelTask('task-id');
```

#### `allocateResource(resourceId: string): Promise<void>`

Allocate a resource.

```typescript
await ap2Manager.allocateResource('resource-id');
```

#### `releaseResource(resourceId: string): Promise<void>`

Release a resource.

```typescript
await ap2Manager.releaseResource('resource-id');
```

#### `executeAction(actionId: string): Promise<any>`

Execute a single action.

```typescript
const result = await ap2Manager.executeAction('action-id');
```

#### `generateExecutionPlan(task: AP2Task): AP2ExecutionPlan`

Generate execution plan with action ordering.

```typescript
const plan = ap2Manager.generateExecutionPlan(task);

console.log('Steps:', plan.steps);
console.log('Estimated duration:', plan.estimatedDuration);
```

#### `on(event: string, handler: Function): void`

Listen for events.

```typescript
ap2Manager.on('task:created', (task) => {
  console.log('Task created:', task.id);
});

ap2Manager.on('task:started', (taskId) => {
  console.log('Task started:', taskId);
});

ap2Manager.on('task:progress', ({ taskId, progress }) => {
  console.log(`Progress: ${progress}%`);
});

ap2Manager.on('task:completed', ({ taskId, result }) => {
  console.log('Task completed:', result);
});

ap2Manager.on('task:failed', ({ taskId, error }) => {
  console.error('Task failed:', error);
});
```

### useAP2Store

Zustand store for AP2 state management:

```typescript
import { useAP2Store } from '@/lib/ap2-store';

const {
  tasks,
  tools,
  addTask,
  updateTask,
  removeTask,
  addTool
} = useAP2Store();

// Add task
addTask(newTask);

// Update task
updateTask(taskId, { status: 'running', progress: 50 });

// Remove task
removeTask(taskId);

// Add tool
addTool(newTool);
```

**Store State**:
```typescript
{
  tasks: AP2Task[];
  tools: AP2Tool[];
  addTask: (task: AP2Task) => void;
  updateTask: (id: string, updates: Partial<AP2Task>) => void;
  removeTask: (id: string) => void;
  addTool: (tool: AP2Tool) => void;
}
```

## Examples

### Example 1: Data Processing Pipeline

```typescript
import { ap2Manager } from '@/lib/ap2-manager';
import { v4 as uuidv4 } from 'uuid';

async function createDataPipeline() {
  const task = await ap2Manager.createTask({
    name: 'ETL Pipeline',
    description: 'Extract, Transform, Load data pipeline',
    agentId: 'etl-agent',
    actions: [
      {
        id: 'extract',
        type: 'query',
        name: 'extract_data',
        description: 'Extract data from source',
        parameters: {
          source: 'database',
          table: 'raw_data',
          limit: 10000
        },
        dependencies: []
      },
      {
        id: 'transform',
        type: 'execute',
        name: 'transform_data',
        description: 'Clean and transform data',
        parameters: {
          operations: [
            'remove_duplicates',
            'normalize_dates',
            'validate_schema'
          ]
        },
        dependencies: ['extract']
      },
      {
        id: 'load',
        type: 'execute',
        name: 'load_data',
        description: 'Load data to warehouse',
        parameters: {
          destination: 'warehouse',
          table: 'processed_data',
          mode: 'append'
        },
        dependencies: ['transform']
      },
      {
        id: 'verify',
        type: 'observe',
        name: 'verify_load',
        description: 'Verify data was loaded correctly',
        parameters: {
          checks: ['row_count', 'data_integrity']
        },
        dependencies: ['load']
      }
    ],
    resources: [
      {
        id: uuidv4(),
        type: 'compute',
        name: 'Processing',
        amount: 4,
        unit: 'cores',
        allocated: false
      },
      {
        id: uuidv4(),
        type: 'memory',
        name: 'Memory',
        amount: 8,
        unit: 'GB',
        allocated: false
      },
      {
        id: uuidv4(),
        type: 'storage',
        name: 'Temp Storage',
        amount: 50,
        unit: 'GB',
        allocated: false
      }
    ]
  });

  // Execute the pipeline
  const result = await ap2Manager.executeTask(task.id);

  if (result.success) {
    console.log('Pipeline completed successfully');
    console.log('Execution time:', result.executionTime, 'ms');
  } else {
    console.error('Pipeline failed:', result.error);
  }
}
```

### Example 2: Multi-Agent Workflow

```typescript
async function multiAgentWorkflow() {
  const task = await ap2Manager.createTask({
    name: 'Multi-Agent Analysis',
    description: 'Coordinate multiple agents for analysis',
    agentId: 'coordinator',
    actions: [
      {
        id: 'plan',
        type: 'plan',
        name: 'create_plan',
        description: 'Create execution plan',
        parameters: {
          goal: 'analyze_customer_behavior',
          agents: ['data-agent', 'ml-agent', 'report-agent']
        },
        dependencies: []
      },
      {
        id: 'delegate-data',
        type: 'delegate',
        name: 'delegate_to_data_agent',
        description: 'Send data collection task to data agent',
        parameters: {
          targetAgent: 'data-agent',
          task: 'collect_customer_data'
        },
        dependencies: ['plan']
      },
      {
        id: 'delegate-ml',
        type: 'delegate',
        name: 'delegate_to_ml_agent',
        description: 'Send analysis task to ML agent',
        parameters: {
          targetAgent: 'ml-agent',
          task: 'analyze_patterns'
        },
        dependencies: ['delegate-data']
      },
      {
        id: 'delegate-report',
        type: 'delegate',
        name: 'delegate_to_report_agent',
        description: 'Send report generation to report agent',
        parameters: {
          targetAgent: 'report-agent',
          task: 'generate_insights_report'
        },
        dependencies: ['delegate-ml']
      }
    ],
    resources: [
      {
        id: uuidv4(),
        type: 'credits',
        name: 'Agent Credits',
        amount: 1000,
        unit: 'credits',
        allocated: false
      }
    ]
  });

  // Monitor progress
  ap2Manager.on('task:progress', ({ taskId, progress }) => {
    if (taskId === task.id) {
      console.log(`Workflow progress: ${progress}%`);
    }
  });

  // Execute
  await ap2Manager.executeTask(task.id);
}
```

### Example 3: Parallel Processing

```typescript
async function parallelProcessing() {
  const task = await ap2Manager.createTask({
    name: 'Parallel Data Processing',
    description: 'Process multiple data sources in parallel',
    agentId: 'processor',
    actions: [
      // Fetch from multiple sources in parallel
      {
        id: 'fetch-db',
        type: 'query',
        name: 'fetch_from_database',
        parameters: { source: 'database' },
        dependencies: []
      },
      {
        id: 'fetch-api',
        type: 'query',
        name: 'fetch_from_api',
        parameters: { source: 'api' },
        dependencies: []
      },
      {
        id: 'fetch-file',
        type: 'query',
        name: 'fetch_from_files',
        parameters: { source: 'filesystem' },
        dependencies: []
      },
      // Merge all sources
      {
        id: 'merge',
        type: 'execute',
        name: 'merge_all_data',
        parameters: { strategy: 'union' },
        dependencies: ['fetch-db', 'fetch-api', 'fetch-file']
      },
      // Process merged data
      {
        id: 'process',
        type: 'execute',
        name: 'process_merged_data',
        parameters: { operations: ['dedupe', 'enrich'] },
        dependencies: ['merge']
      }
    ],
    resources: [
      {
        id: uuidv4(),
        type: 'compute',
        name: 'CPU',
        amount: 8,
        unit: 'cores',
        allocated: false
      },
      {
        id: uuidv4(),
        type: 'network',
        name: 'Bandwidth',
        amount: 100,
        unit: 'Mbps',
        allocated: false
      }
    ]
  });

  // Execute with progress monitoring
  const result = await ap2Manager.executeTask(task.id);

  console.log('Processing complete:', {
    success: result.success,
    time: result.executionTime,
    resourcesUsed: result.resourcesUsed.length
  });
}
```

## Best Practices

1. **Break Down Complex Tasks** - Use multiple actions instead of one large action
2. **Define Clear Dependencies** - Ensure action order is correct
3. **Allocate Sufficient Resources** - Avoid resource exhaustion
4. **Use Appropriate Action Types** - Choose the right type for each operation
5. **Handle Errors Gracefully** - Implement proper error handling
6. **Monitor Progress** - Use events to track execution
7. **Set Realistic Timeouts** - Don't wait forever for actions
8. **Document Actions** - Add clear descriptions
9. **Test Action Dependencies** - Verify dependency chains work
10. **Clean Up Resources** - Ensure resources are released

## Integration with A2A and MCP

### AP2 + A2A

Combine AP2 tasks with A2A messaging:

```typescript
import { ap2Manager } from '@/lib/ap2-manager';
import { a2aManager } from '@/lib/a2a-manager';

// Create task with A2A delegation
const task = await ap2Manager.createTask({
  name: 'Agent Collaboration',
  actions: [
    {
      type: 'delegate',
      name: 'send_to_agent',
      parameters: {
        agentId: 'analysis-agent',
        capability: 'analyze'
      }
    }
  ]
});

// When delegate action executes, use A2A
ap2Manager.on('action:execute', async ({ action }) => {
  if (action.type === 'delegate') {
    await a2aManager.makeRequest({
      capability: action.parameters.capability,
      parameters: action.parameters,
      targetAgent: action.parameters.agentId
    }, 'coordinator');
  }
});
```

### AP2 + MCP

Combine AP2 tasks with MCP tools:

```typescript
import { ap2Manager } from '@/lib/ap2-manager';
import { mcpClientManager } from '@/lib/mcp-client';

// Create task using MCP tools
const task = await ap2Manager.createTask({
  name: 'MCP Tool Execution',
  actions: [
    {
      type: 'execute',
      name: 'call_mcp_tool',
      parameters: {
        serverId: 'mcp-server-1',
        toolName: 'read_file',
        args: { path: '/data/file.txt' }
      }
    }
  ]
});

// When execute action runs, call MCP tool
ap2Manager.on('action:execute', async ({ action }) => {
  if (action.name === 'call_mcp_tool') {
    const result = await mcpClientManager.callTool(
      action.parameters.serverId,
      action.parameters.toolName,
      action.parameters.args
    );
    return result;
  }
});
```

## Troubleshooting

### Task Not Starting

**Problem**: Task stuck in pending status

**Solutions**:
1. Check that agent exists and is available
2. Verify resources are available
3. Review action dependencies for cycles
4. Check for errors in task configuration

### Actions Failing

**Problem**: Actions completing with errors

**Solutions**:
1. Verify action parameters are correct
2. Check that dependencies are met
3. Ensure resources are sufficient
4. Review action type is appropriate for operation

### Progress Not Updating

**Problem**: Progress stuck at certain percentage

**Solution**: Check event listeners and ensure UI is subscribed to progress events.

### Resource Allocation Issues

**Problem**: Resources not being allocated

**Solutions**:
1. Verify resource definitions are correct
2. Check that resources aren't already allocated
3. Ensure resource types are valid
4. Review resource requirements vs availability

## Next Steps

- Implement real action execution (replace mock execution)
- Add action retry logic
- Implement resource pools and quotas
- Add task scheduling and queuing
- Create visual workflow builder
- Implement task templates
- Add execution history and analytics

## Resources

- [AP2 Protocol Specification](https://developers.google.com/agent-protocol)
- [A2A Integration Guide](./A2A.md)
- [MCP Integration Guide](./MCP.md)
- [Component Library](./COMPONENTS.md)
- [API Integration Guide](./API-INTEGRATION.md)
