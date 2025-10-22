// Google's A2A (Agent-to-Agent) Protocol Types

export type AgentStatus = 'online' | 'offline' | 'busy' | 'error';
export type MessageType = 'request' | 'response' | 'notification' | 'error';
export type MessagePriority = 'low' | 'normal' | 'high' | 'urgent';

// Agent Capability Types
export interface AgentCapability {
  name: string;
  description: string;
  inputSchema?: {
    type: string;
    properties?: Record<string, any>;
    required?: string[];
  };
  outputSchema?: {
    type: string;
    properties?: Record<string, any>;
  };
}

// Agent Configuration
export interface A2AAgent {
  id: string;
  name: string;
  description?: string;
  status: AgentStatus;
  endpoint?: string;
  capabilities: AgentCapability[];
  metadata?: {
    version?: string;
    provider?: string;
    model?: string;
    tags?: string[];
  };
  createdAt: Date;
  lastActive?: Date;
  messageCount?: number;
}

// Message Structure
export interface A2AMessage {
  id: string;
  type: MessageType;
  priority: MessagePriority;
  fromAgent: string;
  toAgent: string;
  capability?: string;
  payload: any;
  timestamp: Date;
  conversationId?: string;
  replyTo?: string;
  metadata?: Record<string, any>;
}

// Conversation Thread
export interface A2AConversation {
  id: string;
  participants: string[];
  messages: A2AMessage[];
  status: 'active' | 'completed' | 'failed';
  startedAt: Date;
  endedAt?: Date;
  metadata?: Record<string, any>;
}

// Agent Discovery
export interface AgentDiscoveryRequest {
  capabilities?: string[];
  tags?: string[];
  provider?: string;
}

export interface AgentDiscoveryResponse {
  agents: A2AAgent[];
  total: number;
}

// Communication Protocol
export interface A2ARequest {
  messageId: string;
  targetAgent: string;
  capability: string;
  parameters: Record<string, any>;
  priority?: MessagePriority;
  timeout?: number;
}

export interface A2AResponse {
  messageId: string;
  requestId: string;
  success: boolean;
  result?: any;
  error?: string;
  metadata?: Record<string, any>;
}

// Agent Registry Event
export interface AgentRegistryEvent {
  type: 'registered' | 'unregistered' | 'updated' | 'status_changed';
  agentId: string;
  agent?: A2AAgent;
  timestamp: Date;
}
