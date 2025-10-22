'use client';

import { v4 as uuidv4 } from 'uuid';
import type {
  A2AAgent,
  A2AMessage,
  A2AConversation,
  A2ARequest,
  A2AResponse,
  MessageType,
  MessagePriority,
  AgentDiscoveryRequest,
  AgentDiscoveryResponse,
} from '@/types/a2a';

class A2AManager {
  private conversations: Map<string, A2AConversation> = new Map();
  private messageHandlers: Map<string, (message: A2AMessage) => void> = new Map();

  // Send a message to an agent
  async sendMessage(
    fromAgent: string,
    toAgent: string,
    type: MessageType,
    payload: any,
    options?: {
      capability?: string;
      priority?: MessagePriority;
      conversationId?: string;
      replyTo?: string;
    }
  ): Promise<A2AMessage> {
    const message: A2AMessage = {
      id: uuidv4(),
      type,
      priority: options?.priority || 'normal',
      fromAgent,
      toAgent,
      capability: options?.capability,
      payload,
      timestamp: new Date(),
      conversationId: options?.conversationId,
      replyTo: options?.replyTo,
    };

    // Store message in conversation if conversationId is provided
    if (message.conversationId) {
      this.addMessageToConversation(message.conversationId, message);
    }

    // In a real implementation, this would send the message over the network
    // For now, we'll just log it
    console.log('Sending A2A message:', message);

    return message;
  }

  // Make a request to an agent and wait for response
  async makeRequest(request: A2ARequest, fromAgent: string): Promise<A2AResponse> {
    const message = await this.sendMessage(fromAgent, request.targetAgent, 'request', {
      capability: request.capability,
      parameters: request.parameters,
    }, {
      capability: request.capability,
      priority: request.priority,
    });

    // In a real implementation, this would wait for the actual response
    // For now, we'll simulate a response
    await new Promise(resolve => setTimeout(resolve, 1000));

    const response: A2AResponse = {
      messageId: uuidv4(),
      requestId: message.id,
      success: true,
      result: {
        message: 'Simulated response',
        data: request.parameters,
      },
      metadata: {
        processingTime: 1000,
        agentId: request.targetAgent,
      },
    };

    return response;
  }

  // Create a new conversation
  createConversation(participants: string[]): A2AConversation {
    const conversation: A2AConversation = {
      id: uuidv4(),
      participants,
      messages: [],
      status: 'active',
      startedAt: new Date(),
    };

    this.conversations.set(conversation.id, conversation);
    return conversation;
  }

  // Add message to conversation
  private addMessageToConversation(conversationId: string, message: A2AMessage): void {
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.messages.push(message);
      conversation.status = 'active';
    }
  }

  // Get conversation by ID
  getConversation(conversationId: string): A2AConversation | undefined {
    return this.conversations.get(conversationId);
  }

  // Get all conversations for an agent
  getAgentConversations(agentId: string): A2AConversation[] {
    return Array.from(this.conversations.values()).filter(conv =>
      conv.participants.includes(agentId)
    );
  }

  // Discover agents based on criteria
  async discoverAgents(
    request: AgentDiscoveryRequest,
    availableAgents: A2AAgent[]
  ): Promise<AgentDiscoveryResponse> {
    let filteredAgents = availableAgents.filter(agent => agent.status === 'online');

    // Filter by capabilities
    if (request.capabilities && request.capabilities.length > 0) {
      filteredAgents = filteredAgents.filter(agent =>
        request.capabilities!.some(cap =>
          agent.capabilities.some(agentCap => agentCap.name === cap)
        )
      );
    }

    // Filter by tags
    if (request.tags && request.tags.length > 0) {
      filteredAgents = filteredAgents.filter(agent =>
        request.tags!.some(tag => agent.metadata?.tags?.includes(tag))
      );
    }

    // Filter by provider
    if (request.provider) {
      filteredAgents = filteredAgents.filter(
        agent => agent.metadata?.provider === request.provider
      );
    }

    return {
      agents: filteredAgents,
      total: filteredAgents.length,
    };
  }

  // Register a message handler
  registerMessageHandler(agentId: string, handler: (message: A2AMessage) => void): void {
    this.messageHandlers.set(agentId, handler);
  }

  // Unregister a message handler
  unregisterMessageHandler(agentId: string): void {
    this.messageHandlers.delete(agentId);
  }

  // Complete a conversation
  completeConversation(conversationId: string): void {
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.status = 'completed';
      conversation.endedAt = new Date();
    }
  }

  // Get conversation statistics
  getConversationStats(conversationId: string) {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) return null;

    const messagesByType = conversation.messages.reduce((acc, msg) => {
      acc[msg.type] = (acc[msg.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      messageCount: conversation.messages.length,
      messagesByType,
      duration: conversation.endedAt
        ? conversation.endedAt.getTime() - conversation.startedAt.getTime()
        : Date.now() - conversation.startedAt.getTime(),
      participants: conversation.participants.length,
    };
  }
}

// Singleton instance
export const a2aManager = new A2AManager();
