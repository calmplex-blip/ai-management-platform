'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { AP2Task } from '@/types/ap2';

interface TaskCardProps {
  task: AP2Task;
  onExecute: (task: AP2Task) => void;
  onCancel: (taskId: string) => void;
  onViewDetails: (task: AP2Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onExecute, onCancel, onViewDetails, onDelete }: TaskCardProps) {
  const getStatusBadge = () => {
    switch (task.status) {
      case 'pending':
        return <Badge variant="neutral">Pending</Badge>;
      case 'running':
        return <Badge variant="info">Running</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'failed':
        return <Badge variant="error">Failed</Badge>;
      case 'cancelled':
        return <Badge variant="neutral">Cancelled</Badge>;
      default:
        return <Badge variant="neutral">Unknown</Badge>;
    }
  };

  const getTaskIcon = () => {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    );
  };

  return (
    <Card hover>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg text-indigo-600 dark:text-indigo-400">
              {getTaskIcon()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {task.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {task.description}
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {/* Progress Bar */}
        {task.status === 'running' && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600 dark:text-gray-400">Progress</span>
              <span className="text-xs font-medium text-gray-900 dark:text-white">
                {task.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium w-24">Actions:</span>
            <span>{task.actions.length}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium w-24">Resources:</span>
            <span>{task.resources.length}</span>
          </div>
          {task.startedAt && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium w-24">Started:</span>
              <span>{new Date(task.startedAt).toLocaleString()}</span>
            </div>
          )}
          {task.completedAt && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium w-24">Completed:</span>
              <span>{new Date(task.completedAt).toLocaleString()}</span>
            </div>
          )}
          {task.error && (
            <div className="text-sm text-red-600 dark:text-red-400 mt-2">
              <span className="font-medium">Error:</span> {task.error}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            {task.status === 'pending' && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => onExecute(task)}
              >
                Execute
              </Button>
            )}
            {task.status === 'running' && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onCancel(task.id)}
              >
                Cancel
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(task)}
            >
              Details
            </Button>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(task.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
