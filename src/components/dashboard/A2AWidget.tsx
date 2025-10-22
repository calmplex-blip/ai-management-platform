'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useA2AStore } from '@/lib/a2a-store';

export function A2AWidget() {
  const agents = useA2AStore((state) => state.agents);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const onlineAgents = agents.filter(a => a.status === 'online');
  const totalAgents = agents.length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>A2A Agents</CardTitle>
        <Link href="/a2a-agents">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {totalAgents === 0 ? (
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
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              No A2A agents configured
            </p>
            <Link href="/a2a-agents">
              <Button variant="primary" size="sm" className="mt-4">
                Add Agent
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {onlineAgents.length} / {totalAgents}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Online Agents
                </div>
              </div>
              <div className="text-purple-600 dark:text-purple-400">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              {agents.slice(0, 3).map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {agent.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {agent.capabilities.length} capabilities
                    </p>
                  </div>
                  <Badge
                    variant={
                      agent.status === 'online'
                        ? 'success'
                        : agent.status === 'busy'
                        ? 'warning'
                        : 'neutral'
                    }
                  >
                    {agent.status}
                  </Badge>
                </div>
              ))}
            </div>

            {totalAgents > 3 && (
              <Link href="/a2a-agents">
                <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:underline py-2">
                  View {totalAgents - 3} more agents
                </button>
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
