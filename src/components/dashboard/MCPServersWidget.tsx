'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useMCPStore } from '@/lib/mcp-store';
import type { MCPServerConfig } from '@/types/mcp';

export function MCPServersWidget() {
  const servers = useMCPStore((state) => state.servers);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const connectedServers = servers.filter(s => s.status === 'connected');
  const totalServers = servers.length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>MCP Servers</CardTitle>
        <Link href="/mcp-servers">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {totalServers === 0 ? (
          <div className="text-center py-8">
            <svg
              className="mx-auto h-10 w-10 text-gray-400"
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
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              No MCP servers configured
            </p>
            <Link href="/mcp-servers">
              <Button variant="primary" size="sm" className="mt-4">
                Add Server
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {connectedServers.length} / {totalServers}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Connected Servers
                </div>
              </div>
              <div className="text-green-600 dark:text-green-400">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              {servers.slice(0, 3).map((server) => (
                <div
                  key={server.id}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {server.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                      {server.transportType}
                    </p>
                  </div>
                  <Badge
                    variant={
                      server.status === 'connected'
                        ? 'success'
                        : server.status === 'error'
                        ? 'error'
                        : 'neutral'
                    }
                  >
                    {server.status}
                  </Badge>
                </div>
              ))}
            </div>

            {totalServers > 3 && (
              <Link href="/mcp-servers">
                <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:underline py-2">
                  View {totalServers - 3} more servers
                </button>
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
