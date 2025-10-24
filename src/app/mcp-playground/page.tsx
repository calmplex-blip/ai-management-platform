'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ToolCaller } from '@/components/mcp-ui/ToolCaller';
import { ResourceBrowser } from '@/components/mcp-ui/ResourceBrowser';
import { PromptExecutor } from '@/components/mcp-ui/PromptExecutor';
import { useMCPStore } from '@/lib/mcp-store';
import { mcpClientManager } from '@/lib/mcp-client';
import type { MCPServerConfig } from '@/types/mcp';

type TabType = 'tools' | 'resources' | 'prompts';

export default function MCPPlaygroundPage() {
  const servers = useMCPStore((state) => state.servers);
  const [selectedServer, setSelectedServer] = useState<MCPServerConfig | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('tools');
  const [isConnecting, setIsConnecting] = useState(false);
  const [serverCapabilities, setServerCapabilities] = useState<{
    tools: any[];
    resources: any[];
    prompts: any[];
  }>({
    tools: [],
    resources: [],
    prompts: [],
  });

  // Auto-select first connected server
  useEffect(() => {
    const connectedServer = servers.find((s) => s.status === 'connected');
    if (connectedServer && !selectedServer) {
      setSelectedServer(connectedServer);
      loadServerCapabilities(connectedServer.id);
    }
  }, [servers, selectedServer]);

  const loadServerCapabilities = async (serverId: string) => {
    const connection = mcpClientManager.getConnection(serverId);
    if (!connection?.client) {
      setServerCapabilities({ tools: [], resources: [], prompts: [] });
      return;
    }

    try {
      const [toolsList, resourcesList, promptsList] = await Promise.all([
        connection.client.listTools().catch(() => ({ tools: [] })),
        connection.client.listResources().catch(() => ({ resources: [] })),
        connection.client.listPrompts().catch(() => ({ prompts: [] })),
      ]);

      setServerCapabilities({
        tools: toolsList.tools || [],
        resources: resourcesList.resources || [],
        prompts: promptsList.prompts || [],
      });
    } catch (error) {
      console.error('Failed to load server capabilities:', error);
      setServerCapabilities({ tools: [], resources: [], prompts: [] });
    }
  };

  const handleServerSelect = async (server: MCPServerConfig) => {
    setSelectedServer(server);

    if (server.status === 'connected') {
      await loadServerCapabilities(server.id);
    } else if (server.status === 'disconnected') {
      // Try to connect
      setIsConnecting(true);
      try {
        await mcpClientManager.connect(server);
        await loadServerCapabilities(server.id);
      } catch (error) {
        console.error('Failed to connect:', error);
      } finally {
        setIsConnecting(false);
      }
    }
  };

  const connectedServers = servers.filter((s) => s.status === 'connected');

  const tabs = [
    { id: 'tools' as TabType, label: 'Tools', count: serverCapabilities.tools.length },
    { id: 'resources' as TabType, label: 'Resources', count: serverCapabilities.resources.length },
    { id: 'prompts' as TabType, label: 'Prompts', count: serverCapabilities.prompts.length },
  ];

  return (
    <div className="min-h-screen">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">MCP Playground</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Interact with your MCP servers - call tools, browse resources, and execute prompts
          </p>
        </div>

        {connectedServers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                No Connected Servers
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Connect to an MCP server to start using the playground
              </p>
              <div className="mt-6">
                <Button variant="primary" onClick={() => (window.location.href = '/mcp-servers')}>
                  Go to MCP Servers
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Server Selector */}
            <Card>
              <CardHeader>
                <CardTitle>Select MCP Server</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {connectedServers.map((server) => (
                    <button
                      key={server.id}
                      onClick={() => handleServerSelect(server)}
                      disabled={isConnecting}
                      className={`p-4 rounded-lg border transition-colors text-left ${
                        selectedServer?.id === server.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                            {server.name}
                          </h4>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 uppercase">
                            {server.transportType}
                          </p>
                        </div>
                        {selectedServer?.id === server.id ? (
                          <Badge variant="info">Active</Badge>
                        ) : (
                          <Badge variant="success">Connected</Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedServer && (
              <>
                {/* Tab Navigation */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="flex space-x-8">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                      >
                        {tab.label}
                        <span
                          className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                            activeTab === tab.id
                              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                          }`}
                        >
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                  {activeTab === 'tools' && (
                    <ToolCaller serverId={selectedServer.id} tools={serverCapabilities.tools} />
                  )}
                  {activeTab === 'resources' && (
                    <ResourceBrowser
                      serverId={selectedServer.id}
                      resources={serverCapabilities.resources}
                    />
                  )}
                  {activeTab === 'prompts' && (
                    <PromptExecutor
                      serverId={selectedServer.id}
                      prompts={serverCapabilities.prompts}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
