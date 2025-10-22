'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { MCPServerConfig } from '@/types/mcp';

interface MCPServerCardProps {
  server: MCPServerConfig;
  onConnect: (server: MCPServerConfig) => void;
  onDisconnect: (serverId: string) => void;
  onDelete: (serverId: string) => void;
  onViewDetails: (server: MCPServerConfig) => void;
}

export function MCPServerCard({
  server,
  onConnect,
  onDisconnect,
  onDelete,
  onViewDetails,
}: MCPServerCardProps) {
  const getStatusBadge = () => {
    switch (server.status) {
      case 'connected':
        return <Badge variant="success">Connected</Badge>;
      case 'disconnected':
        return <Badge variant="neutral">Disconnected</Badge>;
      case 'connecting':
        return <Badge variant="info">Connecting...</Badge>;
      case 'error':
        return <Badge variant="error">Error</Badge>;
      default:
        return <Badge variant="neutral">Unknown</Badge>;
    }
  };

  const getTransportIcon = () => {
    switch (server.transportType) {
      case 'stdio':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
      case 'sse':
      case 'websocket':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
        );
    }
  };

  return (
    <Card hover>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-400">
              {getTransportIcon()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {server.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {server.description || 'No description'}
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium w-24">Transport:</span>
            <span className="uppercase">{server.transportType}</span>
          </div>
          {server.command && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium w-24">Command:</span>
              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                {server.command}
              </code>
            </div>
          )}
          {server.url && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium w-24">URL:</span>
              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs truncate">
                {server.url}
              </code>
            </div>
          )}
          {server.tools && server.tools.length > 0 && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium w-24">Tools:</span>
              <span>{server.tools.length} available</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            {server.status === 'connected' ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onDisconnect(server.id)}
              >
                Disconnect
              </Button>
            ) : (
              <Button
                size="sm"
                variant="primary"
                onClick={() => onConnect(server)}
                disabled={server.status === 'connecting'}
              >
                {server.status === 'connecting' ? 'Connecting...' : 'Connect'}
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(server)}
            >
              Details
            </Button>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(server.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
