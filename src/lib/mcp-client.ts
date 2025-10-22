'use client';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import type { MCPServerConfig, MCPConnection, MCPServerStatus, MCPTool, MCPResource, MCPPrompt } from '@/types/mcp';

class MCPClientManager {
  private connections: Map<string, MCPConnection> = new Map();
  private listeners: Set<(servers: MCPServerConfig[]) => void> = new Set();

  subscribe(callback: (servers: MCPServerConfig[]) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(servers: MCPServerConfig[]) {
    this.listeners.forEach(callback => callback(servers));
  }

  async connect(config: MCPServerConfig): Promise<MCPConnection> {
    try {
      // STDIO transport requires server-side execution
      // It would need to be handled via API routes
      if (config.transportType === 'stdio') {
        // For now, mark as connected but note it needs backend implementation
        const connection: MCPConnection = {
          serverId: config.id,
          client: null,
          status: 'connected',
        };
        this.connections.set(config.id, connection);

        // In production, this would call an API route:
        // await fetch('/api/mcp/connect', { method: 'POST', body: JSON.stringify(config) });

        return connection;
      }

      // For SSE and WebSocket, connect directly from the browser
      const client = new Client({
        name: 'consciousops-client',
        version: '1.0.0',
      }, {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        }
      });

      let transport;

      if (config.transportType === 'sse' && config.url) {
        transport = new SSEClientTransport(new URL(config.url));
      } else if (config.transportType === 'websocket' && config.url) {
        // WebSocket transport would be implemented here
        throw new Error('WebSocket transport not yet implemented');
      } else {
        throw new Error(`Invalid configuration for transport type: ${config.transportType}`);
      }

      await client.connect(transport);

      const connection: MCPConnection = {
        serverId: config.id,
        client,
        status: 'connected',
      };

      this.connections.set(config.id, connection);

      // Fetch available tools, resources, and prompts
      await this.updateServerCapabilities(config.id);

      return connection;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const connection: MCPConnection = {
        serverId: config.id,
        client: null,
        status: 'error',
        error: errorMessage,
      };
      this.connections.set(config.id, connection);
      throw error;
    }
  }

  async disconnect(serverId: string): Promise<void> {
    const connection = this.connections.get(serverId);
    if (connection?.client) {
      await connection.client.close();
      this.connections.delete(serverId);
    }
  }

  async updateServerCapabilities(serverId: string): Promise<void> {
    const connection = this.connections.get(serverId);
    if (!connection?.client) return;

    try {
      const toolsList = await connection.client.listTools();
      const resourcesList = await connection.client.listResources();
      const promptsList = await connection.client.listPrompts();

      // Store capabilities - in a real app, you'd update the server config
      console.log('Server capabilities:', {
        tools: toolsList,
        resources: resourcesList,
        prompts: promptsList,
      });
    } catch (error) {
      console.error('Failed to fetch server capabilities:', error);
    }
  }

  async callTool(serverId: string, toolName: string, args: Record<string, unknown>) {
    const connection = this.connections.get(serverId);
    if (!connection?.client) {
      throw new Error('Server not connected');
    }

    return await connection.client.callTool({
      name: toolName,
      arguments: args,
    });
  }

  async readResource(serverId: string, uri: string) {
    const connection = this.connections.get(serverId);
    if (!connection?.client) {
      throw new Error('Server not connected');
    }

    return await connection.client.readResource({ uri });
  }

  async getPrompt(serverId: string, promptName: string, args?: Record<string, string>) {
    const connection = this.connections.get(serverId);
    if (!connection?.client) {
      throw new Error('Server not connected');
    }

    return await connection.client.getPrompt({
      name: promptName,
      arguments: args,
    });
  }

  getConnection(serverId: string): MCPConnection | undefined {
    return this.connections.get(serverId);
  }

  getConnectionStatus(serverId: string): MCPServerStatus {
    return this.connections.get(serverId)?.status || 'disconnected';
  }

  getAllConnections(): MCPConnection[] {
    return Array.from(this.connections.values());
  }
}

// Singleton instance
export const mcpClientManager = new MCPClientManager();
