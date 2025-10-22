// Google's AP2 (Agent Protocol 2) Types

export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
export type ActionType = 'query' | 'execute' | 'observe' | 'plan' | 'delegate';
export type ResourceType = 'memory' | 'storage' | 'compute' | 'network' | 'tool';

// AP2 Task Definition
export interface AP2Task {
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
  metadata?: Record<string, any>;
}

// AP2 Action
export interface AP2Action {
  id: string;
  taskId: string;
  type: ActionType;
  name: string;
  description?: string;
  parameters: Record<string, any>;
  dependencies?: string[]; // Other action IDs
  status: TaskStatus;
  result?: any;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
  retryCount?: number;
  maxRetries?: number;
}

// AP2 Resource
export interface AP2Resource {
  id: string;
  type: ResourceType;
  name: string;
  allocated: boolean;
  capacity?: number;
  usage?: number;
  metadata?: Record<string, any>;
}

// AP2 Agent Context
export interface AP2AgentContext {
  agentId: string;
  sessionId: string;
  state: Record<string, any>;
  memory: AP2Memory[];
  capabilities: string[];
  constraints?: AP2Constraints;
}

// AP2 Memory Entry
export interface AP2Memory {
  id: string;
  type: 'short_term' | 'long_term' | 'episodic' | 'semantic';
  content: any;
  timestamp: Date;
  importance?: number;
  tags?: string[];
}

// AP2 Constraints
export interface AP2Constraints {
  maxExecutionTime?: number; // milliseconds
  maxMemoryUsage?: number; // bytes
  maxRetries?: number;
  timeout?: number;
  priority?: 'low' | 'normal' | 'high' | 'critical';
}

// AP2 Execution Plan
export interface AP2ExecutionPlan {
  id: string;
  taskId: string;
  steps: AP2PlanStep[];
  estimatedDuration?: number;
  resourceRequirements: AP2Resource[];
  createdAt: Date;
}

// AP2 Plan Step
export interface AP2PlanStep {
  id: string;
  order: number;
  action: AP2Action;
  condition?: string;
  alternatives?: AP2Action[];
}

// AP2 Event
export interface AP2Event {
  id: string;
  type: 'task_started' | 'task_completed' | 'task_failed' | 'action_started' | 'action_completed' | 'resource_allocated' | 'resource_released';
  taskId?: string;
  actionId?: string;
  resourceId?: string;
  timestamp: Date;
  data?: any;
}

// AP2 Observation
export interface AP2Observation {
  id: string;
  agentId: string;
  type: 'environment' | 'user' | 'system' | 'agent';
  content: any;
  timestamp: Date;
  confidence?: number;
  source?: string;
}

// AP2 Tool Definition
export interface AP2Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
  outputSchema: {
    type: string;
    properties?: Record<string, any>;
  };
  async: boolean;
  timeout?: number;
}

// AP2 Protocol Message
export interface AP2Message {
  id: string;
  protocol: 'AP2';
  version: '2.0';
  from: string;
  to: string;
  type: 'request' | 'response' | 'notification' | 'error';
  payload: any;
  timestamp: Date;
  correlationId?: string;
}

// AP2 Task Result
export interface AP2TaskResult {
  taskId: string;
  status: TaskStatus;
  output?: any;
  error?: string;
  metrics: {
    duration: number;
    actionsCompleted: number;
    actionsFailed: number;
    resourcesUsed: number;
  };
  artifacts?: AP2Artifact[];
}

// AP2 Artifact
export interface AP2Artifact {
  id: string;
  type: string;
  name: string;
  content: any;
  createdAt: Date;
  metadata?: Record<string, any>;
}

// AP2 Delegation Request
export interface AP2DelegationRequest {
  fromAgentId: string;
  toAgentId: string;
  task: AP2Task;
  context?: AP2AgentContext;
  constraints?: AP2Constraints;
  callback?: string;
}

// AP2 State Snapshot
export interface AP2StateSnapshot {
  id: string;
  agentId: string;
  taskId: string;
  state: Record<string, any>;
  timestamp: Date;
  checksum?: string;
}
