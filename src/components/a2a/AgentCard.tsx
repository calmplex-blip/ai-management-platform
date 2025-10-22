'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { A2AAgent } from '@/types/a2a';

interface AgentCardProps {
  agent: A2AAgent;
  onViewDetails: (agent: A2AAgent) => void;
  onSendMessage: (agent: A2AAgent) => void;
  onDelete: (agentId: string) => void;
}

export function AgentCard({ agent, onViewDetails, onSendMessage, onDelete }: AgentCardProps) {
  const getStatusBadge = () => {
    switch (agent.status) {
      case 'online':
        return <Badge variant="success">Online</Badge>;
      case 'offline':
        return <Badge variant="neutral">Offline</Badge>;
      case 'busy':
        return <Badge variant="warning">Busy</Badge>;
      case 'error':
        return <Badge variant="error">Error</Badge>;
      default:
        return <Badge variant="neutral">Unknown</Badge>;
    }
  };

  const getAgentIcon = () => {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    );
  };

  return (
    <Card hover>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg text-purple-600 dark:text-purple-400">
              {getAgentIcon()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {agent.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {agent.description || 'No description'}
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        <div className="space-y-2 mb-4">
          {agent.metadata?.provider && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium w-24">Provider:</span>
              <span>{agent.metadata.provider}</span>
            </div>
          )}
          {agent.metadata?.model && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium w-24">Model:</span>
              <span>{agent.metadata.model}</span>
            </div>
          )}
          {agent.capabilities.length > 0 && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium w-24">Capabilities:</span>
              <span>{agent.capabilities.length} available</span>
            </div>
          )}
          {agent.messageCount !== undefined && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium w-24">Messages:</span>
              <span>{agent.messageCount}</span>
            </div>
          )}
          {agent.metadata?.tags && agent.metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {agent.metadata.tags.map((tag, index) => (
                <Badge key={index} variant="neutral" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="primary"
              onClick={() => onSendMessage(agent)}
              disabled={agent.status === 'offline'}
            >
              Send Message
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(agent)}
            >
              Details
            </Button>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(agent.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
