'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { MCPServerCard } from '@/components/mcp/MCPServerCard';
import { AddMCPServerModal } from '@/components/mcp/AddMCPServerModal';
import { MCPServerDetails } from '@/components/mcp/MCPServerDetails';
import { useMCPStore } from '@/lib/mcp-store';
import { mcpClientManager } from '@/lib/mcp-client';
import type { MCPServerConfig } from '@/types/mcp';

export default function MCPServersPage() {
  const { servers, addServer, updateServer, removeServer } = useMCPStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<MCPServerConfig | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleAddServer = (server: MCPServerConfig) => {
    addServer(server);
  };

  const handleConnect = async (server: MCPServerConfig) => {
    try {
      updateServer(server.id, { status: 'connecting' });
      await mcpClientManager.connect(server);
      updateServer(server.id, {
        status: 'connected',
        lastConnected: new Date(),
      });
    } catch (error) {
      console.error('Failed to connect:', error);
      updateServer(server.id, {
        status: 'error',
      });
    }
  };

  const handleDisconnect = async (serverId: string) => {
    try {
      await mcpClientManager.disconnect(serverId);
      updateServer(serverId, { status: 'disconnected' });
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  const handleDelete = (serverId: string) => {
    if (confirm('Are you sure you want to delete this server?')) {
      handleDisconnect(serverId);
      removeServer(serverId);
    }
  };

  const handleViewDetails = (server: MCPServerConfig) => {
    setSelectedServer(server);
    setIsDetailsOpen(true);
  };

  return (
    <div className="min-h-screen">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              MCP Servers
            </h1>
            <p className="mt-2 text-gray-300">
              Manage your Model Context Protocol server connections
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Server
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Servers
            </div>
            <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {servers.length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Connected
            </div>
            <div className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
              {servers.filter(s => s.status === 'connected').length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Disconnected
            </div>
            <div className="mt-2 text-3xl font-bold text-gray-600 dark:text-gray-400">
              {servers.filter(s => s.status === 'disconnected').length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Errors
            </div>
            <div className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
              {servers.filter(s => s.status === 'error').length}
            </div>
          </div>
        </div>

        {/* Server List */}
        {servers.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
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
              No MCP servers configured
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by adding your first MCP server connection.
            </p>
            <div className="mt-6">
              <Button
                variant="primary"
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Your First Server
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {servers.map((server) => (
              <MCPServerCard
                key={server.id}
                server={server}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                onDelete={handleDelete}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddMCPServerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddServer}
      />

      <MCPServerDetails
        server={selectedServer}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedServer(null);
        }}
      />
    </div>
  );
}
