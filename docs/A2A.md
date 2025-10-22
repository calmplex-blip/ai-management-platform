# A2A Integration Guide

Agent-to-Agent (A2A) protocol integration in ConsciousOps provides a comprehensive infrastructure for inter-agent communication, message passing, and collaborative AI workflows.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Agent Management](#agent-management)
- [Messaging](#messaging)
- [Conversations](#conversations)
- [Agent Discovery](#agent-discovery)
- [API Reference](#api-reference)
- [Examples](#examples)

## Overview

A2A (Agent-to-Agent) is a protocol designed by Google for structured communication between AI agents. ConsciousOps provides:

- **Agent Registry** - Register and manage AI agents with capabilities
- **Message Passing** - Send messages between agents with priority handling
- **Conversations** - Thread messages for context and history
- **Discovery** - Find agents by capabilities, tags, or provider
- **Event System** - Real-time updates on message status

## Architecture

### Core Components

```
src/
├── types/a2a.ts              # A2A protocol types
├── lib/
│   ├── a2a-manager.ts        # Message routing and agent management
│   └── a2a-store.ts          # Zustand state management
└── components/
    └── a2a/                  # Agent management UI
        ├── AgentCard.tsx
        ├── AddAgentModal.tsx
        └── SendMessageModal.tsx
```

### Type Definitions

**Key Types** (`src/types/a2a.ts`):

```typescript
// Agent
interface A2AAgent {
  id: string;
  name: string;
  description?: string;
  capabilities: A2ACapability[];
  status: 'active' | 'inactive' | 'busy';
  provider: string;
  endpoint?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
}

// Capability
interface A2ACapability {
  name: string;
  description?: string;
  inputSchema?: Record<string, any>;
  outputSchema?: Record<string, any>;
}

// Message
interface A2AMessage {
  id: string;
  fromAgent: string;
  toAgent: string;
  type: 'request' | 'response' | 'notification';
  content: any;
  timestamp: Date;
  conversationId?: string;
  metadata?: Record<string, any>;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
}

// Conversation
interface A2AConversation {
  id: string;
  participants: string[];
  messages: A2AMessage[];
  createdAt: Date;
  lastMessageAt: Date;
  metadata?: Record<string, any>;
}

// Request
interface A2ARequest {
  capability: string;
  parameters: Record<string, any>;
  targetAgent: string;
  priority?: 'low' | 'normal' | 'high';
  timeout?: number;
}

// Response
interface A2AResponse {
  messageId: string;
  requestId: string;
  success: boolean;
  result?: any;
  error?: string;
  timestamp?: Date;
}
```

## Getting Started

### 1. Access A2A Agents Page

Navigate to the A2A Agents page:

```
http://localhost:3000/a2a-agents
```

### 2. View Agent Statistics

The page displays:
- Total agents count
- Active agents count
- Total messages sent
- Active conversations count

## Agent Management

### Adding Agents

#### Via UI

1. Click **"Add Agent"** button
2. Fill in the agent details:
   - **Name**: Agent identifier
   - **Description**: What the agent does
   - **Provider**: Agent provider (e.g., "OpenAI", "Anthropic")
   - **Endpoint**: Optional API endpoint
   - **Tags**: Comma-separated tags

3. Add capabilities:
   - Click **"Add Capability"**
   - Enter capability name and description
   - Click **"+"** to add more capabilities

4. Click **"Add Agent"**

#### Programmatically

```typescript
import { useA2AStore } from '@/lib/a2a-store';
import { v4 as uuidv4 } from 'uuid';

const addAgent = () => {
  const { addAgent } = useA2AStore.getState();

  addAgent({
    id: uuidv4(),
    name: 'data-analyzer',
    description: 'Analyzes data and generates insights',
    capabilities: [
      {
        name: 'analyze_data',
        description: 'Analyze structured data',
        inputSchema: {
          type: 'object',
          properties: {
            data: { type: 'array' },
            format: { type: 'string' }
          }
        }
      }
    ],
    status: 'active',
    provider: 'Custom',
    tags: ['analysis', 'data'],
    createdAt: new Date()
  });
};
```

### Viewing Agent Details

Click on an agent card to see:
- Agent ID and name
- Description and provider
- Status (active/inactive/busy)
- List of capabilities with descriptions
- Tags
- Metadata

### Deleting Agents

1. Click **"Delete"** on an agent card
2. Confirm deletion
3. Agent and associated messages will be removed

## Messaging

### Sending Messages

#### Via UI

1. Click **"Send Message"** on an agent card
2. Select target agent from dropdown
3. Choose message type:
   - **Request**: Ask agent to perform a capability
   - **Response**: Reply to a previous message
   - **Notification**: Send an informational message

4. Select capability (for requests)
5. Enter message content (JSON format)
6. Set priority: Low, Normal, or High
7. Click **"Send Message"**

#### Programmatically

Using the A2A Manager:

```typescript
import { a2aManager } from '@/lib/a2a-manager';
import { v4 as uuidv4 } from 'uuid';

// Send a message
const message = await a2aManager.sendMessage(
  'agent-1',           // From agent
  'agent-2',           // To agent
  'request',           // Message type
  {                    // Content
    action: 'analyze',
    data: [1, 2, 3, 4]
  },
  {                    // Metadata
    priority: 'high',
    conversationId: uuidv4()
  }
);

console.log('Message sent:', message.id);
```

### Message Types

#### Request
Used to ask an agent to perform a capability:

```typescript
const message = await a2aManager.sendMessage(
  'agent-1',
  'agent-2',
  'request',
  {
    capability: 'summarize_text',
    parameters: {
      text: 'Long text to summarize...',
      maxLength: 100
    }
  }
);
```

#### Response
Used to reply to a request:

```typescript
const response = await a2aManager.sendMessage(
  'agent-2',
  'agent-1',
  'response',
  {
    requestId: originalMessage.id,
    result: {
      summary: 'Short summary...'
    }
  }
);
```

#### Notification
Used for informational messages:

```typescript
const notification = await a2aManager.sendMessage(
  'agent-1',
  'agent-2',
  'notification',
  {
    event: 'task_completed',
    taskId: 'task-123'
  }
);
```

### Message Priority

- **Low**: Background tasks, non-urgent notifications
- **Normal**: Standard requests and responses (default)
- **High**: Urgent requests requiring immediate attention

## Conversations

### Creating Conversations

Conversations are automatically created when messages include a `conversationId`:

```typescript
import { v4 as uuidv4 } from 'uuid';

const conversationId = uuidv4();

// First message in conversation
await a2aManager.sendMessage(
  'agent-1',
  'agent-2',
  'request',
  { action: 'start_task' },
  { conversationId }
);

// Follow-up message in same conversation
await a2aManager.sendMessage(
  'agent-2',
  'agent-1',
  'response',
  { status: 'started' },
  { conversationId }
);
```

### Viewing Conversations

```typescript
import { a2aManager } from '@/lib/a2a-manager';

// Get conversation by ID
const conversation = a2aManager.getConversation(conversationId);

// Get all messages in conversation
const messages = conversation.messages;

// Get participants
const participants = conversation.participants;
```

### Conversation Threading

Messages with the same `conversationId` are automatically threaded:

```typescript
const conv = a2aManager.getConversation(conversationId);

console.log(`Conversation with ${conv.participants.length} participants`);
console.log(`${conv.messages.length} messages`);
console.log(`Last message at: ${conv.lastMessageAt}`);
```

## Agent Discovery

### By Capability

Find agents that can perform a specific capability:

```typescript
import { a2aManager } from '@/lib/a2a-manager';

const agents = a2aManager.discoverAgents({
  capability: 'analyze_data'
});

console.log(`Found ${agents.length} agents with analyze_data capability`);
```

### By Tags

Find agents with specific tags:

```typescript
const agents = a2aManager.discoverAgents({
  tags: ['analysis', 'data']
});

// Agents must have ALL specified tags
```

### By Provider

Find agents from a specific provider:

```typescript
const agents = a2aManager.discoverAgents({
  provider: 'OpenAI'
});
```

### Combined Filters

Use multiple criteria:

```typescript
const agents = a2aManager.discoverAgents({
  capability: 'generate_text',
  tags: ['creative'],
  provider: 'Anthropic'
});
```

## API Reference

### A2AManager

Located in `src/lib/a2a-manager.ts`:

#### `registerAgent(agent: A2AAgent): void`

Register a new agent.

```typescript
import { a2aManager } from '@/lib/a2a-manager';

a2aManager.registerAgent({
  id: 'agent-1',
  name: 'assistant',
  capabilities: [{ name: 'help', description: 'Provide assistance' }],
  status: 'active',
  provider: 'Custom',
  createdAt: new Date()
});
```

#### `unregisterAgent(agentId: string): void`

Remove an agent from the registry.

```typescript
a2aManager.unregisterAgent('agent-1');
```

#### `sendMessage(fromAgent: string, toAgent: string, type: MessageType, content: any, metadata?: Record<string, any>): Promise<A2AMessage>`

Send a message between agents.

```typescript
const message = await a2aManager.sendMessage(
  'agent-1',
  'agent-2',
  'request',
  { action: 'process' },
  { priority: 'high' }
);
```

#### `makeRequest(request: A2ARequest, fromAgent: string): Promise<A2AResponse>`

Make a capability request to an agent.

```typescript
const response = await a2aManager.makeRequest(
  {
    capability: 'summarize',
    parameters: { text: 'Long text...' },
    targetAgent: 'agent-2',
    priority: 'normal'
  },
  'agent-1'
);

if (response.success) {
  console.log('Result:', response.result);
}
```

#### `discoverAgents(criteria: DiscoveryCriteria): A2AAgent[]`

Find agents matching criteria.

```typescript
const agents = a2aManager.discoverAgents({
  capability: 'analyze',
  tags: ['data'],
  provider: 'Custom'
});
```

#### `getConversation(conversationId: string): A2AConversation | undefined`

Get a conversation by ID.

```typescript
const conversation = a2aManager.getConversation('conv-123');
```

#### `on(event: string, handler: Function): void`

Listen for events.

```typescript
a2aManager.on('message:sent', (message) => {
  console.log('Message sent:', message);
});

a2aManager.on('message:received', (message) => {
  console.log('Message received:', message);
});
```

### useA2AStore

Zustand store for A2A state management:

```typescript
import { useA2AStore } from '@/lib/a2a-store';

const {
  agents,
  conversations,
  addAgent,
  removeAgent,
  addConversation,
  updateConversation
} = useA2AStore();

// Add agent
addAgent(newAgent);

// Remove agent
removeAgent(agentId);

// Add conversation
addConversation(newConversation);

// Update conversation
updateConversation(conversationId, { lastMessageAt: new Date() });
```

**Store State**:
```typescript
{
  agents: A2AAgent[];
  conversations: A2AConversation[];
  addAgent: (agent: A2AAgent) => void;
  removeAgent: (id: string) => void;
  addConversation: (conversation: A2AConversation) => void;
  updateConversation: (id: string, updates: Partial<A2AConversation>) => void;
}
```

## Examples

### Example 1: Multi-Agent Workflow

```typescript
import { a2aManager } from '@/lib/a2a-manager';
import { useA2AStore } from '@/lib/a2a-store';
import { v4 as uuidv4 } from 'uuid';

async function multiAgentWorkflow() {
  // Register agents
  const dataAgent = {
    id: 'data-agent',
    name: 'Data Processor',
    capabilities: [
      { name: 'fetch_data', description: 'Fetch data from sources' },
      { name: 'clean_data', description: 'Clean and normalize data' }
    ],
    status: 'active' as const,
    provider: 'Custom',
    createdAt: new Date()
  };

  const analysisAgent = {
    id: 'analysis-agent',
    name: 'Data Analyzer',
    capabilities: [
      { name: 'analyze', description: 'Analyze data patterns' },
      { name: 'visualize', description: 'Create visualizations' }
    ],
    status: 'active' as const,
    provider: 'Custom',
    createdAt: new Date()
  };

  a2aManager.registerAgent(dataAgent);
  a2aManager.registerAgent(analysisAgent);

  // Create conversation
  const conversationId = uuidv4();

  // Step 1: Request data
  const fetchRequest = await a2aManager.sendMessage(
    'coordinator',
    'data-agent',
    'request',
    { capability: 'fetch_data', source: 'database' },
    { conversationId, priority: 'high' }
  );

  // Step 2: Clean data
  const cleanRequest = await a2aManager.sendMessage(
    'data-agent',
    'data-agent',
    'request',
    { capability: 'clean_data', data: '...' },
    { conversationId }
  );

  // Step 3: Analyze data
  const analyzeRequest = await a2aManager.sendMessage(
    'data-agent',
    'analysis-agent',
    'request',
    { capability: 'analyze', data: '...' },
    { conversationId }
  );

  // Step 4: Send results
  const notification = await a2aManager.sendMessage(
    'analysis-agent',
    'coordinator',
    'notification',
    { status: 'complete', results: '...' },
    { conversationId }
  );

  // Get conversation history
  const conversation = a2aManager.getConversation(conversationId);
  console.log(`Workflow complete: ${conversation.messages.length} messages`);
}
```

### Example 2: Agent Discovery and Delegation

```typescript
async function delegateTask(taskType: string, taskData: any) {
  // Find suitable agents
  const agents = a2aManager.discoverAgents({
    capability: taskType,
    tags: ['production']
  });

  if (agents.length === 0) {
    throw new Error(`No agents found for capability: ${taskType}`);
  }

  // Select agent (e.g., least busy)
  const availableAgent = agents.find(a => a.status === 'active');

  if (!availableAgent) {
    throw new Error('All agents are busy');
  }

  // Make request
  const response = await a2aManager.makeRequest(
    {
      capability: taskType,
      parameters: taskData,
      targetAgent: availableAgent.id,
      priority: 'normal',
      timeout: 30000
    },
    'coordinator'
  );

  return response;
}

// Usage
const result = await delegateTask('generate_report', {
  reportType: 'monthly',
  period: '2024-01'
});
```

### Example 3: Event-Driven Updates

```typescript
import { useEffect } from 'react';
import { a2aManager } from '@/lib/a2a-manager';

function MessageMonitor() {
  useEffect(() => {
    // Listen for sent messages
    const handleSent = (message: A2AMessage) => {
      console.log(`Message sent: ${message.id}`);
      // Update UI
    };

    // Listen for received messages
    const handleReceived = (message: A2AMessage) => {
      console.log(`Message received: ${message.id}`);
      // Show notification
    };

    a2aManager.on('message:sent', handleSent);
    a2aManager.on('message:received', handleReceived);

    return () => {
      // Cleanup listeners
      a2aManager.off('message:sent', handleSent);
      a2aManager.off('message:received', handleReceived);
    };
  }, []);

  return <div>Monitoring messages...</div>;
}
```

## Best Practices

1. **Use Unique IDs** - Always use UUIDs for agents, messages, and conversations
2. **Define Clear Capabilities** - Document what each capability does
3. **Handle Errors** - Agents may fail or be unavailable
4. **Set Appropriate Priorities** - Don't mark everything as high priority
5. **Thread Conversations** - Use conversationId for related messages
6. **Tag Agents** - Use tags for better discovery
7. **Monitor Message Status** - Track delivery and failures
8. **Implement Timeouts** - Don't wait forever for responses
9. **Use Metadata** - Store additional context in message metadata
10. **Log Conversations** - Keep audit trail for debugging

## Integration with AP2

A2A can be combined with AP2 for complex workflows:

```typescript
import { ap2Manager } from '@/lib/ap2-manager';
import { a2aManager } from '@/lib/a2a-manager';

// Create AP2 task with A2A delegation action
const task = await ap2Manager.createTask({
  name: 'Multi-Agent Analysis',
  description: 'Coordinate multiple agents to analyze data',
  agentId: 'coordinator',
  actions: [
    {
      type: 'delegate',
      name: 'delegate_to_agents',
      parameters: {
        agents: ['data-agent', 'analysis-agent'],
        capability: 'analyze'
      }
    }
  ]
});

// Execute task
await ap2Manager.executeTask(task.id);
```

## Troubleshooting

### Messages Not Sending

**Problem**: Messages stuck in pending status

**Solutions**:
1. Check that target agent exists and is active
2. Verify agent IDs are correct
3. Check for network issues (in production)
4. Review message content format

### Agent Not Found

**Problem**: Discovery returns empty array

**Solutions**:
1. Verify capability name spelling
2. Check that agents have the required capabilities
3. Ensure agents are registered in the manager
4. Review tag matching (agents must have ALL specified tags)

### Conversation Not Threading

**Problem**: Messages not appearing in same conversation

**Solution**: Ensure all messages use the same `conversationId`:

```typescript
const conversationId = uuidv4();

// Use same conversationId for all messages
await a2aManager.sendMessage(..., { conversationId });
```

## Next Steps

- Implement real agent endpoints for production
- Add authentication and authorization
- Implement message persistence (database)
- Add message queuing for reliability
- Create monitoring dashboard for message flow
- Implement capability versioning
- Add agent health checks

## Resources

- [A2A Protocol Specification](https://developers.google.com/agent-to-agent)
- [AP2 Integration Guide](./AP2.md)
- [Component Library](./COMPONENTS.md)
- [API Integration Guide](./API-INTEGRATION.md)
