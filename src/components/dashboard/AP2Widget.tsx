'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useAP2Store } from '@/lib/ap2-store';

export function AP2Widget() {
  const tasks = useAP2Store((state) => state.tasks);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const runningTasks = tasks.filter(t => t.status === 'running');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const totalTasks = tasks.length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>AP2 Tasks</CardTitle>
        <Link href="/ap2-tasks">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {totalTasks === 0 ? (
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              No AP2 tasks created
            </p>
            <Link href="/ap2-tasks">
              <Button variant="primary" size="sm" className="mt-4">
                Create Task
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-xs text-blue-600 dark:text-blue-400">Running</div>
                <div className="text-xl font-bold text-blue-900 dark:text-blue-200">
                  {runningTasks.length}
                </div>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-xs text-green-600 dark:text-green-400">Completed</div>
                <div className="text-xl font-bold text-green-900 dark:text-green-200">
                  {completedTasks.length}
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {totalTasks}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {tasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {task.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {task.actions.length} actions
                    </p>
                  </div>
                  <Badge
                    variant={
                      task.status === 'completed'
                        ? 'success'
                        : task.status === 'running'
                        ? 'info'
                        : task.status === 'failed'
                        ? 'error'
                        : 'neutral'
                    }
                  >
                    {task.status}
                  </Badge>
                </div>
              ))}
            </div>

            {totalTasks > 3 && (
              <Link href="/ap2-tasks">
                <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:underline py-2">
                  View {totalTasks - 3} more tasks
                </button>
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
