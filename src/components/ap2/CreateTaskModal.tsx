'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { AP2Action, AP2Resource, ActionType, ResourceType } from '@/types/ap2';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (
    name: string,
    description: string,
    agentId: string,
    actions: Omit<AP2Action, 'id' | 'taskId' | 'status'>[],
    resources: Omit<AP2Resource, 'id' | 'allocated'>[]
  ) => void;
  availableAgents: Array<{ id: string; name: string }>;
}

export function CreateTaskModal({ isOpen, onClose, onCreate, availableAgents }: CreateTaskModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [agentId, setAgentId] = useState('');
  const [actions, setActions] = useState<Omit<AP2Action, 'id' | 'taskId' | 'status'>[]>([]);
  const [resources, setResources] = useState<Omit<AP2Resource, 'id' | 'allocated'>[]>([]);
  const [newAction, setNewAction] = useState({
    type: 'query' as ActionType,
    name: '',
    description: '',
    parameters: '{}',
  });
  const [newResource, setNewResource] = useState({
    type: 'memory' as ResourceType,
    name: '',
    capacity: 1000,
  });

  const handleAddAction = () => {
    if (newAction.name) {
      try {
        const parameters = JSON.parse(newAction.parameters);
        setActions([
          ...actions,
          {
            type: newAction.type,
            name: newAction.name,
            description: newAction.description || undefined,
            parameters,
          },
        ]);
        setNewAction({ type: 'query', name: '', description: '', parameters: '{}' });
      } catch (error) {
        alert('Invalid JSON parameters');
      }
    }
  };

  const handleAddResource = () => {
    if (newResource.name) {
      setResources([
        ...resources,
        {
          type: newResource.type,
          name: newResource.name,
          capacity: newResource.capacity,
        },
      ]);
      setNewResource({ type: 'memory', name: '', capacity: 1000 });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentId) {
      alert('Please select an agent');
      return;
    }
    onCreate(name, description, agentId, actions, resources);
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setAgentId('');
    setActions([]);
    setResources([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Create AP2 Task
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Task Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Data Processing Task"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Process data from source and generate insights"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Assign to Agent *
            </label>
            <select
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select agent...</option>
              {availableAgents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Actions
            </label>
            <div className="space-y-2 mb-2">
              {actions.map((action, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                >
                  <div>
                    <span className="font-medium text-sm text-gray-900 dark:text-white">
                      {action.name}
                    </span>
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                      ({action.type})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActions(actions.filter((_, i) => i !== index))}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-12 gap-2">
              <select
                value={newAction.type}
                onChange={(e) => setNewAction({ ...newAction, type: e.target.value as ActionType })}
                className="col-span-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="query">Query</option>
                <option value="execute">Execute</option>
                <option value="observe">Observe</option>
                <option value="plan">Plan</option>
                <option value="delegate">Delegate</option>
              </select>
              <input
                type="text"
                value={newAction.name}
                onChange={(e) => setNewAction({ ...newAction, name: e.target.value })}
                placeholder="Action name"
                className="col-span-4 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <input
                type="text"
                value={newAction.parameters}
                onChange={(e) => setNewAction({ ...newAction, parameters: e.target.value })}
                placeholder="{}"
                className="col-span-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddAction} className="col-span-2">
                Add
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Resources
            </label>
            <div className="space-y-2 mb-2">
              {resources.map((resource, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                >
                  <div>
                    <span className="font-medium text-sm text-gray-900 dark:text-white">
                      {resource.name}
                    </span>
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                      ({resource.type})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setResources(resources.filter((_, i) => i !== index))}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-12 gap-2">
              <select
                value={newResource.type}
                onChange={(e) => setNewResource({ ...newResource, type: e.target.value as ResourceType })}
                className="col-span-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="memory">Memory</option>
                <option value="storage">Storage</option>
                <option value="compute">Compute</option>
                <option value="network">Network</option>
                <option value="tool">Tool</option>
              </select>
              <input
                type="text"
                value={newResource.name}
                onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                placeholder="Resource name"
                className="col-span-5 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <input
                type="number"
                value={newResource.capacity}
                onChange={(e) => setNewResource({ ...newResource, capacity: parseInt(e.target.value) })}
                placeholder="Capacity"
                className="col-span-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddResource} className="col-span-2">
                Add
              </Button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
