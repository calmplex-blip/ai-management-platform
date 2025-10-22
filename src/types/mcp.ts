export type MCPServerStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

export type MCPTransportType = 'stdio' | 'sse' | 'websocket';

export interface MCPServerConfig {
  id: string;
  name: string;
  description?: string;
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  url?: string;
  transportType: MCPTransportType;
  status: MCPServerStatus;
  lastConnected?: Date;
  tools?: MCPTool[];
  resources?: MCPResource[];
  prompts?: MCPPrompt[];
}

export interface MCPTool {
  name: string;
  description?: string;
  inputSchema: {
    type: string;
    properties?: Record<string, unknown>;
    required?: string[];
  };
}

export interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface MCPPrompt {
  name: string;
  description?: string;
  arguments?: Array<{
    name: string;
    description?: string;
    required?: boolean;
  }>;
}

export interface MCPConnection {
  serverId: string;
  client: any; // MCP Client instance
  status: MCPServerStatus;
  error?: string;
}
