'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { A2AAgent, MessagePriority, AgentCapability } from '@/types/a2a';

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: A2AAgent | null;
  fromAgents: A2AAgent[];
  onSend: (fromAgentId: string, toAgentId: string, capability: string, parameters: any, priority: MessagePriority) => void;
}

export function SendMessageModal({ isOpen, onClose, agent, fromAgents, onSend }: SendMessageModalProps) {
  const [fromAgentId, setFromAgentId] = useState('');
  const [selectedCapability, setSelectedCapability] = useState<AgentCapability | null>(null);
  const [parameters, setParameters] = useState('{}');
  const [priority, setPriority] = useState<MessagePriority>('normal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent || !fromAgentId || !selectedCapability) return;

    try {
      const parsedParams = JSON.parse(parameters);
      onSend(fromAgentId, agent.id, selectedCapability.name, parsedParams, priority);
      handleClose();
    } catch (error) {
      alert('Invalid JSON parameters');
    }
  };

  const handleClose = () => {
    setFromAgentId('');
    setSelectedCapability(null);
    setParameters('{}');
    setPriority('normal');
    onClose();
  };

  if (!isOpen || !agent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Send Message to {agent.name}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From Agent *
            </label>
            <select
              value={fromAgentId}
              onChange={(e) => setFromAgentId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select agent...</option>
              {fromAgents
                .filter(a => a.id !== agent.id)
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Capability *
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {agent.capabilities.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No capabilities available
                </p>
              ) : (
                agent.capabilities.map((cap, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedCapability(cap)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedCapability?.name === cap.name
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-sm text-gray-900 dark:text-white">
                          {cap.name}
                        </span>
                        {cap.description && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {cap.description}
                          </p>
                        )}
                      </div>
                      {selectedCapability?.name === cap.name && (
                        <Badge variant="info">Selected</Badge>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Parameters (JSON) *
            </label>
            <textarea
              value={parameters}
              onChange={(e) => setParameters(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
              placeholder='{"key": "value"}'
              required
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Provide parameters as JSON object
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as MessagePriority)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Send Message
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
