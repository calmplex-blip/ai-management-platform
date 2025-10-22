# API Integration Guide

This guide explains how to integrate ConsciousOps with backend services to replace mock implementations with real API calls for production use.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [MCP Backend Integration](#mcp-backend-integration)
- [A2A Backend Integration](#a2a-backend-integration)
- [AP2 Backend Integration](#ap2-backend-integration)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [WebSocket Real-time Updates](#websocket-real-time-updates)
- [Deployment](#deployment)

## Overview

ConsciousOps currently uses mock implementations for protocol operations. For production deployment, you'll need to:

1. **Create Backend APIs** - Build REST/GraphQL APIs for each protocol
2. **Replace Mock Calls** - Update managers to call real APIs
3. **Add Authentication** - Implement auth for secure access
4. **Setup WebSockets** - Enable real-time updates
5. **Deploy Services** - Deploy frontend and backend

## Architecture

### Current Architecture (Mock)

```
┌─────────────────┐
│   Frontend      │
│   (Next.js)     │
├─────────────────┤
│ MCP Manager     │──▶ Mock Execution
│ A2A Manager     │──▶ Mock Execution
│ AP2 Manager     │──▶ Mock Execution
└─────────────────┘
```

### Production Architecture

```
┌─────────────────┐
│   Frontend      │
│   (Next.js)     │
├─────────────────┤
│ API Client      │
└────────┬────────┘
         │ HTTPS
         │
┌────────▼────────┐
│   Backend API   │
├─────────────────┤
│ MCP Service     │──▶ MCP Servers
│ A2A Service     │──▶ Agent Network
│ AP2 Service     │──▶ Task Queue
└─────────────────┘
         │
         ▼
┌─────────────────┐
│   Database      │
│   (PostgreSQL)  │
└─────────────────┘
```

## MCP Backend Integration

### API Endpoints

Create these REST endpoints for MCP operations:

#### POST /api/mcp/servers

Add a new MCP server.

**Request:**
```json
{
  "name": "My MCP Server",
  "url": "http://localhost:8080/sse",
  "transportType": "sse",
  "description": "Server description"
}
```

**Response:**
```json
{
  "id": "server-123",
  "name": "My MCP Server",
  "status": "disconnected",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### POST /api/mcp/servers/:id/connect

Connect to an MCP server.

**Response:**
```json
{
  "serverId": "server-123",
  "status": "connected",
  "capabilities": {
    "tools": [...],
    "resources": [...],
    "prompts": [...]
  }
}
```

#### GET /api/mcp/servers/:id/tools

List available tools.

**Response:**
```json
{
  "tools": [
    {
      "name": "read_file",
      "description": "Read a file from disk",
      "inputSchema": {...}
    }
  ]
}
```

#### POST /api/mcp/servers/:id/tools/:toolName

Execute a tool.

**Request:**
```json
{
  "arguments": {
    "path": "/home/user/file.txt"
  }
}
```

**Response:**
```json
{
  "result": {
    "content": "File contents...",
    "mimeType": "text/plain"
  }
}
```

### STDIO Transport Support

For STDIO transport, create a server-side endpoint:

#### POST /api/mcp/stdio/spawn

Spawn a STDIO process.

**Request:**
```json
{
  "command": "npx @modelcontextprotocol/server-filesystem /path"
}
```

**Response:**
```json
{
  "processId": "proc-123",
  "status": "running"
}
```

### Updating MCP Client

Replace mock implementation in `src/lib/mcp-client.ts`:

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

class MCPClientManager {
  private apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  async connect(config: MCPServerConfig): Promise<MCPConnection> {
    try {
      // Call backend API
      const response = await fetch(`${this.apiUrl}/api/mcp/servers/${config.id}/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Connection failed');
      }

      const data = await response.json();

      // Create actual client connection
      let client: Client | null = null;

      if (config.transportType === 'sse') {
        const transport = new SSEClientTransport(new URL(config.url));
        client = new Client({
          name: 'consciousops-client',
          version: '1.0.0'
        }, {
          capabilities: {}
        });
        await client.connect(transport);
      }

      const connection: MCPConnection = {
        serverId: config.id,
        client,
        status: 'connected',
        capabilities: data.capabilities
      };

      this.connections.set(config.id, connection);
      return connection;

    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  }

  async callTool(serverId: string, toolName: string, args: Record<string, any>): Promise<any> {
    try {
      const response = await fetch(
        `${this.apiUrl}/api/mcp/servers/${serverId}/tools/${toolName}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify({ arguments: args })
        }
      );

      if (!response.ok) {
        throw new Error('Tool execution failed');
      }

      return await response.json();

    } catch (error) {
      console.error('Tool execution error:', error);
      throw error;
    }
  }
}
```

## A2A Backend Integration

### API Endpoints

#### POST /api/a2a/agents

Register a new agent.

**Request:**
```json
{
  "name": "data-agent",
  "description": "Data processing agent",
  "capabilities": [
    {
      "name": "process_data",
      "description": "Process data"
    }
  ],
  "provider": "Custom"
}
```

**Response:**
```json
{
  "id": "agent-123",
  "name": "data-agent",
  "status": "active",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### POST /api/a2a/messages

Send a message between agents.

**Request:**
```json
{
  "fromAgent": "agent-1",
  "toAgent": "agent-2",
  "type": "request",
  "content": {
    "capability": "process_data",
    "parameters": {...}
  },
  "priority": "high"
}
```

**Response:**
```json
{
  "id": "msg-123",
  "status": "sent",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### GET /api/a2a/messages/:id

Get message status.

**Response:**
```json
{
  "id": "msg-123",
  "status": "delivered",
  "response": {
    "result": {...}
  }
}
```

#### POST /api/a2a/agents/discover

Discover agents by criteria.

**Request:**
```json
{
  "capability": "analyze_data",
  "tags": ["production"],
  "provider": "OpenAI"
}
```

**Response:**
```json
{
  "agents": [
    {
      "id": "agent-123",
      "name": "analyzer",
      "capabilities": [...]
    }
  ]
}
```

### Updating A2A Manager

Replace mock implementation in `src/lib/a2a-manager.ts`:

```typescript
class A2AManager {
  private apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  async registerAgent(agent: A2AAgent): Promise<void> {
    const response = await fetch(`${this.apiUrl}/api/a2a/agents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(agent)
    });

    if (!response.ok) {
      throw new Error('Failed to register agent');
    }

    const data = await response.json();
    this.agents.set(data.id, { ...agent, id: data.id });
    this.emit('agent:registered', agent);
  }

  async sendMessage(
    fromAgent: string,
    toAgent: string,
    type: MessageType,
    content: any,
    metadata?: Record<string, any>
  ): Promise<A2AMessage> {
    const message: A2AMessage = {
      id: uuidv4(),
      fromAgent,
      toAgent,
      type,
      content,
      timestamp: new Date(),
      status: 'pending',
      ...metadata
    };

    // Send to backend
    const response = await fetch(`${this.apiUrl}/api/a2a/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      message.status = 'failed';
      throw new Error('Failed to send message');
    }

    const data = await response.json();
    message.status = 'sent';
    message.id = data.id;

    this.emit('message:sent', message);
    return message;
  }

  async makeRequest(request: A2ARequest, fromAgent: string): Promise<A2AResponse> {
    const message = await this.sendMessage(
      fromAgent,
      request.targetAgent,
      'request',
      {
        capability: request.capability,
        parameters: request.parameters
      },
      {
        capability: request.capability,
        priority: request.priority
      }
    );

    // Poll for response
    const response = await this.pollForResponse(message.id, request.timeout || 30000);

    return {
      messageId: uuidv4(),
      requestId: message.id,
      success: response.status === 'delivered',
      result: response.response?.result,
      error: response.response?.error
    };
  }

  private async pollForResponse(messageId: string, timeout: number): Promise<any> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const response = await fetch(`${this.apiUrl}/api/a2a/messages/${messageId}`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'delivered' || data.status === 'failed') {
          return data;
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    throw new Error('Request timeout');
  }
}
```

## AP2 Backend Integration

### API Endpoints

#### POST /api/ap2/tasks

Create a new task.

**Request:**
```json
{
  "name": "Data Pipeline",
  "description": "ETL pipeline",
  "agentId": "agent-1",
  "actions": [...],
  "resources": [...]
}
```

**Response:**
```json
{
  "id": "task-123",
  "name": "Data Pipeline",
  "status": "pending",
  "progress": 0,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### POST /api/ap2/tasks/:id/execute

Execute a task.

**Response:**
```json
{
  "taskId": "task-123",
  "status": "running",
  "startedAt": "2024-01-15T10:30:00Z"
}
```

#### GET /api/ap2/tasks/:id

Get task status.

**Response:**
```json
{
  "id": "task-123",
  "status": "running",
  "progress": 45,
  "actions": [
    {
      "id": "action-1",
      "status": "completed",
      "result": {...}
    },
    {
      "id": "action-2",
      "status": "running"
    }
  ]
}
```

#### POST /api/ap2/tasks/:id/cancel

Cancel a running task.

**Response:**
```json
{
  "taskId": "task-123",
  "status": "cancelled"
}
```

### Updating AP2 Manager

Replace mock implementation in `src/lib/ap2-manager.ts`:

```typescript
class AP2Manager {
  private apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  async createTask(params: CreateTaskParams): Promise<AP2Task> {
    const response = await fetch(`${this.apiUrl}/api/ap2/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      throw new Error('Failed to create task');
    }

    const task = await response.json();
    this.tasks.set(task.id, task);
    this.emit('task:created', task);

    return task;
  }

  async executeTask(taskId: string): Promise<AP2TaskResult> {
    // Start execution
    const response = await fetch(`${this.apiUrl}/api/ap2/tasks/${taskId}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to execute task');
    }

    this.emit('task:started', taskId);

    // Poll for completion
    return await this.pollTaskCompletion(taskId);
  }

  private async pollTaskCompletion(taskId: string): Promise<AP2TaskResult> {
    while (true) {
      const response = await fetch(`${this.apiUrl}/api/ap2/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get task status');
      }

      const task = await response.json();

      // Update local task
      this.tasks.set(taskId, task);
      this.emit('task:progress', { taskId, progress: task.progress });

      if (task.status === 'completed') {
        this.emit('task:completed', { taskId, result: task.result });
        return {
          taskId,
          success: true,
          result: task.result,
          executionTime: Date.now() - new Date(task.startedAt).getTime(),
          resourcesUsed: task.resources
        };
      }

      if (task.status === 'failed') {
        this.emit('task:failed', { taskId, error: task.error });
        return {
          taskId,
          success: false,
          error: task.error,
          executionTime: Date.now() - new Date(task.startedAt).getTime(),
          resourcesUsed: task.resources
        };
      }

      // Wait before polling again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  async cancelTask(taskId: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/api/ap2/tasks/${taskId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to cancel task');
    }

    const task = this.tasks.get(taskId);
    if (task) {
      task.status = 'cancelled';
      this.tasks.set(taskId, task);
      this.emit('task:cancelled', taskId);
    }
  }
}
```

## Authentication

### JWT Authentication

Implement JWT-based authentication:

#### Login Flow

1. **Login page** (`src/app/login/page.tsx`):

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem('authToken', token);
      router.push('/');
    } else {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

2. **Auth utility** (`src/lib/auth.ts`):

```typescript
export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
}

export function setAuthToken(token: string): void {
  localStorage.setItem('authToken', token);
}

export function clearAuthToken(): void {
  localStorage.removeItem('authToken');
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
}
```

3. **Protected route wrapper**:

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/lib/auth';

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const router = useRouter();

    useEffect(() => {
      const token = getAuthToken();
      if (!token) {
        router.push('/login');
      }
    }, [router]);

    return <Component {...props} />;
  };
}
```

## Error Handling

### Centralized Error Handler

Create `src/lib/api-client.ts`:

```typescript
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new APIError(
        error.message || 'Request failed',
        response.status,
        error
      );
    }

    return await response.json();

  } catch (error) {
    if (error instanceof APIError) {
      // Handle specific HTTP errors
      if (error.statusCode === 401) {
        clearAuthToken();
        window.location.href = '/login';
      }
      throw error;
    }

    // Handle network errors
    throw new APIError('Network error', 0);
  }
}
```

### Usage in Components

```typescript
import { apiRequest, APIError } from '@/lib/api-client';

async function fetchData() {
  try {
    const data = await apiRequest<MyData>('/api/endpoint');
    setData(data);
  } catch (error) {
    if (error instanceof APIError) {
      if (error.statusCode === 404) {
        setError('Not found');
      } else if (error.statusCode === 403) {
        setError('Access denied');
      } else {
        setError('An error occurred');
      }
    }
  }
}
```

## WebSocket Real-time Updates

### Backend WebSocket Server

```typescript
// backend/websocket-server.ts
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send initial data
  ws.send(JSON.stringify({
    type: 'connected',
    timestamp: new Date()
  }));

  // Handle messages
  ws.on('message', (data) => {
    const message = JSON.parse(data.toString());
    console.log('Received:', message);
  });

  // Send updates
  const interval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({
        type: 'update',
        data: { /* update data */ }
      }));
    }
  }, 1000);

  ws.on('close', () => {
    clearInterval(interval);
    console.log('Client disconnected');
  });
});
```

### Frontend WebSocket Client

```typescript
// src/lib/websocket-client.ts
class WebSocketClient {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  connect(url: string) {
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.emit('connected');
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.emit(message.type, message.data);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.emit('disconnected');

      // Reconnect after delay
      setTimeout(() => this.connect(url), 5000);
    };
  }

  on(event: string, handler: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }

  off(event: string, handler: Function) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  private emit(event: string, data?: any) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  send(type: string, data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsClient = new WebSocketClient();
```

### Using WebSocket in Components

```typescript
'use client';

import { useEffect, useState } from 'react';
import { wsClient } from '@/lib/websocket-client';

export function RealtimeComponent() {
  const [updates, setUpdates] = useState<any[]>([]);

  useEffect(() => {
    // Connect to WebSocket
    wsClient.connect('ws://localhost:8080');

    // Listen for updates
    const handleUpdate = (data: any) => {
      setUpdates(prev => [...prev, data]);
    };

    wsClient.on('update', handleUpdate);

    return () => {
      wsClient.off('update', handleUpdate);
      wsClient.disconnect();
    };
  }, []);

  return (
    <div>
      {updates.map((update, i) => (
        <div key={i}>{JSON.stringify(update)}</div>
      ))}
    </div>
  );
}
```

## Deployment

### Backend Deployment

**Node.js/Express Backend:**

```typescript
// backend/server.ts
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// MCP routes
app.use('/api/mcp', mcpRoutes);

// A2A routes
app.use('/api/a2a', a2aRoutes);

// AP2 routes
app.use('/api/ap2', ap2Routes);

// Auth routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
```

**Docker Compose:**

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3001
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/consciousops
      - JWT_SECRET=your-secret-key
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=consciousops
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Environment Variables

**Frontend `.env.production`:**
```env
NEXT_PUBLIC_API_URL=https://api.consciousops.com
NEXT_PUBLIC_WS_URL=wss://api.consciousops.com
```

**Backend `.env`:**
```env
PORT=3001
DATABASE_URL=postgresql://user:pass@localhost:5432/consciousops
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=https://consciousops.com
```

## Next Steps

1. **Implement Backend Services** - Build the API endpoints
2. **Replace Mock Implementations** - Update all managers
3. **Add Authentication** - Implement JWT auth flow
4. **Setup Database** - Configure PostgreSQL/MongoDB
5. **Enable WebSockets** - Add real-time updates
6. **Deploy to Production** - Deploy both frontend and backend
7. **Monitor and Scale** - Add logging, monitoring, and scaling

## Resources

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Express.js Documentation](https://expressjs.com/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [JWT Authentication](https://jwt.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
