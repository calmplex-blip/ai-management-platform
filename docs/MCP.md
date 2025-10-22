# MCP Integration Guide

Model Context Protocol (MCP) integration in ConsciousOps provides a powerful interface for connecting to and managing MCP servers, discovering tools, browsing resources, and executing prompts.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Adding MCP Servers](#adding-mcp-servers)
- [Managing Connections](#managing-connections)
- [MCP Playground](#mcp-playground)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)

## Overview

MCP (Model Context Protocol) is a protocol for AI models to interact with external tools, resources, and data sources. ConsciousOps provides:

- **Server Management** - Connect to MCP servers via multiple transports
- **Tool Discovery** - Discover and execute available tools
- **Resource Browsing** - Browse and view resources with mime-type handling
- **Prompt Execution** - Execute prompts with custom arguments
- **Interactive Playground** - Test MCP capabilities in real-time

## Architecture

### Core Components

```
src/
├── types/mcp.ts              # MCP protocol types
├── lib/
│   ├── mcp-client.ts         # Client manager and connection logic
│   └── mcp-store.ts          # Zustand state management
└── components/
    ├── mcp/                  # Server management UI
    │   ├── MCPServerCard.tsx
    │   ├── AddMCPServerModal.tsx
    │   └── MCPServerDetails.tsx
    └── mcp-ui/               # Interactive playground
        ├── ToolCaller.tsx
        ├── ResourceBrowser.tsx
        └── PromptExecutor.tsx
```

### Type Definitions

**Key Types** (`src/types/mcp.ts`):

```typescript
// Server Configuration
interface MCPServerConfig {
  id: string;
  name: string;
  url: string;
  transportType: 'stdio' | 'sse' | 'websocket';
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  description?: string;
}

// Connection
interface MCPConnection {
  serverId: string;
  client: Client | null;
  status: 'connected' | 'disconnected' | 'error';
  error?: string;
  capabilities?: {
    tools?: MCPTool[];
    resources?: MCPResource[];
    prompts?: MCPPrompt[];
  };
}

// Tool
interface MCPTool {
  name: string;
  description?: string;
  inputSchema: {
    type: 'object';
    properties?: Record<string, any>;
    required?: string[];
  };
}

// Resource
interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

// Prompt
interface MCPPrompt {
  name: string;
  description?: string;
  arguments?: Array<{
    name: string;
    description?: string;
    required?: boolean;
  }>;
}
```

## Getting Started

### 1. Access MCP Servers Page

Navigate to the MCP Servers page from the main navigation or dashboard:

```
http://localhost:3000/mcp-servers
```

### 2. View Server Statistics

The page displays:
- Total number of servers
- Connected servers count
- Available tools count
- Available resources count

## Adding MCP Servers

### Via UI

1. Click the **"Add Server"** button
2. Fill in the server details:
   - **Name**: Display name for the server
   - **Description**: Optional description
   - **Transport Type**: Choose from:
     - `SSE` (Server-Sent Events)
     - `WebSocket`
     - `STDIO` (requires server-side API)
   - **URL/Command**:
     - For SSE/WebSocket: Enter the server URL
     - For STDIO: Enter the command to start the server

3. Click **"Add Server"**

### Programmatically

Using the MCP store:

```typescript
import { useMCPStore } from '@/lib/mcp-store';

const addServer = () => {
  const { addServer } = useMCPStore.getState();

  addServer({
    id: crypto.randomUUID(),
    name: 'My MCP Server',
    url: 'http://localhost:8080/sse',
    transportType: 'sse',
    status: 'disconnected',
    description: 'Custom MCP server'
  });
};
```

### Transport Types

#### SSE (Server-Sent Events)
- **Best for**: Simple request-response patterns
- **URL Format**: `http://localhost:8080/sse`
- **Browser Compatible**: Yes
- **Bidirectional**: No

#### WebSocket
- **Best for**: Real-time bidirectional communication
- **URL Format**: `ws://localhost:8080` or `wss://localhost:8080`
- **Browser Compatible**: Yes
- **Bidirectional**: Yes

#### STDIO
- **Best for**: Local command-line tools
- **Command Format**: `npx @modelcontextprotocol/server-filesystem /path`
- **Browser Compatible**: No (requires server-side API)
- **Bidirectional**: Yes

**Important**: STDIO transport requires Node.js modules (`child_process`, `fs`) and must be implemented via server-side API routes. In the browser, STDIO servers are marked as connected placeholders.

## Managing Connections

### Connect to Server

1. Find the server card in the list
2. Click **"Connect"**
3. Wait for connection status to update
4. View available capabilities when connected

### View Server Details

Click **"Details"** on a server card to see:
- Connection status
- Server information
- Available tools (count)
- Available resources (count)
- Available prompts (count)

### Disconnect from Server

1. Click **"Disconnect"** on a connected server
2. Server status will update to "disconnected"
3. Capabilities will be cleared

### Delete Server

1. Click **"Delete"** on a server card
2. Confirm deletion
3. Server will be removed from the list

## MCP Playground

The MCP Playground provides an interactive environment for testing MCP capabilities.

### Access Playground

Navigate to:
```
http://localhost:3000/mcp-playground
```

### Features

#### 1. Tool Caller

**Execute MCP Tools**:

1. Select a connected server from the dropdown
2. Choose a tool from the available tools
3. Fill in the parameter form (dynamically generated from tool schema)
4. Click **"Call Tool"**
5. View the JSON response

**Example**:
```json
// Tool: read_file
// Parameters:
{
  "path": "/home/user/document.txt"
}

// Response:
{
  "content": "File contents here...",
  "mimeType": "text/plain"
}
```

#### 2. Resource Browser

**Browse MCP Resources**:

1. Select a connected server
2. View list of available resources
3. Click **"View"** to see resource details
4. View content based on mime type

**Mime Type Handling**:
- `text/*` - Displayed as text
- `application/json` - Formatted JSON view
- `image/*` - Image preview
- Others - Download link

#### 3. Prompt Executor

**Execute MCP Prompts**:

1. Select a connected server
2. Choose a prompt from the dropdown
3. Fill in required arguments
4. Click **"Execute Prompt"**
5. View the generated prompt or response

## API Reference

### MCPClientManager

Located in `src/lib/mcp-client.ts`:

#### `connect(config: MCPServerConfig): Promise<MCPConnection>`

Connect to an MCP server.

```typescript
import { mcpClientManager } from '@/lib/mcp-client';

const connection = await mcpClientManager.connect({
  id: 'server-1',
  name: 'My Server',
  url: 'http://localhost:8080/sse',
  transportType: 'sse',
  status: 'disconnected'
});
```

#### `disconnect(serverId: string): Promise<void>`

Disconnect from an MCP server.

```typescript
await mcpClientManager.disconnect('server-1');
```

#### `listTools(serverId: string): Promise<MCPTool[]>`

List available tools on a server.

```typescript
const tools = await mcpClientManager.listTools('server-1');
```

#### `callTool(serverId: string, toolName: string, args: Record<string, any>): Promise<any>`

Execute a tool on a server.

```typescript
const result = await mcpClientManager.callTool(
  'server-1',
  'read_file',
  { path: '/home/user/file.txt' }
);
```

#### `listResources(serverId: string): Promise<MCPResource[]>`

List available resources on a server.

```typescript
const resources = await mcpClientManager.listResources('server-1');
```

#### `readResource(serverId: string, uri: string): Promise<any>`

Read a resource from a server.

```typescript
const content = await mcpClientManager.readResource(
  'server-1',
  'file:///home/user/document.txt'
);
```

#### `listPrompts(serverId: string): Promise<MCPPrompt[]>`

List available prompts on a server.

```typescript
const prompts = await mcpClientManager.listPrompts('server-1');
```

#### `executePrompt(serverId: string, promptName: string, args: Record<string, string>): Promise<any>`

Execute a prompt on a server.

```typescript
const result = await mcpClientManager.executePrompt(
  'server-1',
  'summarize',
  { text: 'Long text to summarize...' }
);
```

### useMCPStore

Zustand store for MCP state management:

```typescript
import { useMCPStore } from '@/lib/mcp-store';

// In a component
const { servers, addServer, updateServer, removeServer } = useMCPStore();

// Add server
addServer(newServerConfig);

// Update server
updateServer(serverId, { status: 'connected' });

// Remove server
removeServer(serverId);
```

**Store State**:
```typescript
{
  servers: MCPServerConfig[];
  addServer: (server: MCPServerConfig) => void;
  updateServer: (id: string, updates: Partial<MCPServerConfig>) => void;
  removeServer: (id: string) => void;
}
```

## Troubleshooting

### Connection Issues

**Problem**: Server won't connect

**Solutions**:
1. Verify the server URL is correct and accessible
2. Check that the server is running
3. Ensure the transport type matches the server configuration
4. Check browser console for CORS errors
5. For WebSocket, ensure the URL starts with `ws://` or `wss://`

**Problem**: STDIO transport not working

**Solution**: STDIO requires server-side implementation. Create an API route to spawn the process:

```typescript
// app/api/mcp/stdio/route.ts
import { spawn } from 'child_process';

export async function POST(req: Request) {
  const { command } = await req.json();
  const process = spawn(command, { shell: true });
  // Handle process communication
}
```

### Tool Execution Issues

**Problem**: Tool parameters not validating

**Solution**: Check the tool's `inputSchema` for required fields and correct types.

**Problem**: Tool execution timeout

**Solution**: Increase the timeout in the MCP client configuration or check server performance.

### Resource Access Issues

**Problem**: Resource not loading

**Solutions**:
1. Verify the resource URI is correct
2. Check server permissions
3. Ensure the resource exists on the server

### State Persistence

The MCP store uses `localStorage` for persistence. To clear saved state:

```typescript
localStorage.removeItem('mcp-store');
window.location.reload();
```

## Example: Complete MCP Integration

```typescript
import { useMCPStore } from '@/lib/mcp-store';
import { mcpClientManager } from '@/lib/mcp-client';
import { useEffect, useState } from 'react';

export function MCPExample() {
  const { servers, addServer } = useMCPStore();
  const [tools, setTools] = useState([]);

  useEffect(() => {
    // Add server on mount
    addServer({
      id: 'example-server',
      name: 'Example MCP Server',
      url: 'http://localhost:8080/sse',
      transportType: 'sse',
      status: 'disconnected'
    });
  }, []);

  const connectAndLoadTools = async () => {
    // Connect to server
    const connection = await mcpClientManager.connect(servers[0]);

    // List available tools
    const availableTools = await mcpClientManager.listTools(servers[0].id);
    setTools(availableTools);
  };

  const executeTool = async (toolName: string, args: any) => {
    const result = await mcpClientManager.callTool(
      servers[0].id,
      toolName,
      args
    );
    console.log('Tool result:', result);
  };

  return (
    <div>
      <button onClick={connectAndLoadTools}>
        Connect and Load Tools
      </button>

      {tools.map(tool => (
        <button
          key={tool.name}
          onClick={() => executeTool(tool.name, {})}
        >
          Execute {tool.name}
        </button>
      ))}
    </div>
  );
}
```

## Best Practices

1. **Always handle connection errors** - MCP servers may be unreliable
2. **Validate tool parameters** - Use the tool's inputSchema for validation
3. **Implement retries** - Network issues are common
4. **Cache capabilities** - Don't fetch tools/resources on every render
5. **Use TypeScript** - Type safety prevents runtime errors
6. **Test with mock servers** - Create mock MCP servers for testing
7. **Monitor connection status** - Display clear status to users
8. **Handle STDIO carefully** - Requires proper server-side security

## Next Steps

- Implement server-side API for STDIO transport
- Add authentication for MCP servers
- Implement caching for tools and resources
- Add batch tool execution
- Create custom tool templates
- Integrate with AP2 for complex workflows

## Resources

- [MCP Specification](https://modelcontextprotocol.io/)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [Component Library](./COMPONENTS.md)
- [API Integration Guide](./API-INTEGRATION.md)
