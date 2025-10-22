'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/Button';
import { TaskCard } from '@/components/ap2/TaskCard';
import { CreateTaskModal } from '@/components/ap2/CreateTaskModal';
import { useAP2Store } from '@/lib/ap2-store';
import { useA2AStore } from '@/lib/a2a-store';
import { ap2Manager } from '@/lib/ap2-manager';
import type { AP2Task, AP2Action, AP2Resource } from '@/types/ap2';

export default function AP2TasksPage() {
  const { tasks, addTask, updateTask, removeTask } = useAP2Store();
  const agents = useA2AStore((state) => state.agents);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<AP2Task | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Subscribe to task updates
  useEffect(() => {
    const unsubscribe = ap2Manager.on('task', (event) => {
      if (event.taskId) {
        const task = ap2Manager.getTask(event.taskId);
        if (task) {
          updateTask(task.id, task);
        }
      }
      setRefreshTrigger(prev => prev + 1);
    });

    return unsubscribe;
  }, [updateTask]);

  const handleCreateTask = (
    name: string,
    description: string,
    agentId: string,
    actions: Omit<AP2Action, 'id' | 'taskId' | 'status'>[],
    resources: Omit<AP2Resource, 'id' | 'allocated'>[]
  ) => {
    const task = ap2Manager.createTask(name, description, agentId, actions, resources);
    addTask(task);
  };

  const handleExecuteTask = async (task: AP2Task) => {
    try {
      updateTask(task.id, { status: 'running' });
      const result = await ap2Manager.executeTask(task.id);
      const updatedTask = ap2Manager.getTask(task.id);
      if (updatedTask) {
        updateTask(task.id, updatedTask);
      }
      alert(`Task completed!\n\nDuration: ${result.metrics.duration}ms\nActions: ${result.metrics.actionsCompleted}/${result.metrics.actionsCompleted + result.metrics.actionsFailed}`);
    } catch (error) {
      alert(`Task failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCancelTask = (taskId: string) => {
    ap2Manager.cancelTask(taskId);
    const task = ap2Manager.getTask(taskId);
    if (task) {
      updateTask(taskId, task);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      removeTask(taskId);
    }
  };

  const handleViewDetails = (task: AP2Task) => {
    setSelectedTask(task);
  };

  const stats = ap2Manager.getTaskStatistics();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              AP2 Tasks
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage Agent Protocol 2 tasks and executions
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            disabled={agents.length === 0}
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Task
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Total</div>
            <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Pending</div>
            <div className="mt-1 text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.pending}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Running</div>
            <div className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.running}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Completed</div>
            <div className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Failed</div>
            <div className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">{stats.failed}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Cancelled</div>
            <div className="mt-1 text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.cancelled}</div>
          </div>
        </div>

        {/* Task List */}
        {tasks.length === 0 ? (
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
              No tasks created
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {agents.length === 0
                ? 'Create an A2A agent first to start creating tasks'
                : 'Get started by creating your first AP2 task'}
            </p>
            <div className="mt-6">
              {agents.length === 0 ? (
                <Button variant="primary" onClick={() => (window.location.href = '/a2a-agents')}>
                  Go to A2A Agents
                </Button>
              ) : (
                <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                  Create Your First Task
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onExecute={handleExecuteTask}
                onCancel={handleCancelTask}
                onViewDetails={handleViewDetails}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateTask}
        availableAgents={agents.map(a => ({ id: a.id, name: a.name }))}
      />

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Task Details: {selectedTask.name}
              </h2>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Actions ({selectedTask.actions.length})
                </h3>
                <div className="space-y-2">
                  {selectedTask.actions.map((action) => (
                    <div
                      key={action.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm text-gray-900 dark:text-white">
                          {action.name}
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          {action.type}
                        </span>
                      </div>
                      {action.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          {action.description}
                        </p>
                      )}
                      <div className="text-xs">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>{' '}
                        <span className={
                          action.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                          action.status === 'failed' ? 'text-red-600 dark:text-red-400' :
                          action.status === 'running' ? 'text-blue-600 dark:text-blue-400' :
                          'text-gray-600 dark:text-gray-400'
                        }>
                          {action.status}
                        </span>
                      </div>
                      {action.result && (
                        <pre className="mt-2 text-xs bg-gray-50 dark:bg-gray-900 p-2 rounded overflow-x-auto">
                          {JSON.stringify(action.result, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              {selectedTask.resources.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Resources ({selectedTask.resources.length})
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedTask.resources.map((resource) => (
                      <div
                        key={resource.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                      >
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {resource.name}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {resource.type} - {resource.allocated ? 'Allocated' : 'Free'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Result */}
              {selectedTask.result && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Result
                  </h3>
                  <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-4 rounded overflow-x-auto">
                    {JSON.stringify(selectedTask.result, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <Button variant="outline" onClick={() => setSelectedTask(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
