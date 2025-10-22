'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/Button';
import type { A2AAgent, AgentCapability } from '@/types/a2a';

interface AddAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (agent: A2AAgent) => void;
}

export function AddAgentModal({ isOpen, onClose, onAdd }: AddAgentModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [provider, setProvider] = useState('');
  const [model, setModel] = useState('');
  const [tags, setTags] = useState('');
  const [capabilities, setCapabilities] = useState<AgentCapability[]>([]);
  const [newCapability, setNewCapability] = useState({ name: '', description: '' });

  const handleAddCapability = () => {
    if (newCapability.name) {
      setCapabilities([...capabilities, { ...newCapability }]);
      setNewCapability({ name: '', description: '' });
    }
  };

  const handleRemoveCapability = (index: number) => {
    setCapabilities(capabilities.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const agent: A2AAgent = {
      id: uuidv4(),
      name,
      description: description || undefined,
      status: 'online',
      endpoint: endpoint || undefined,
      capabilities,
      metadata: {
        provider: provider || undefined,
        model: model || undefined,
        tags: tags ? tags.split(',').map(t => t.trim()) : undefined,
        version: '1.0.0',
      },
      createdAt: new Date(),
      lastActive: new Date(),
      messageCount: 0,
    };

    onAdd(agent);
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setEndpoint('');
    setProvider('');
    setModel('');
    setTags('');
    setCapabilities([]);
    setNewCapability({ name: '', description: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add A2A Agent
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Agent Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="My AI Agent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="A brief description of this agent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Endpoint URL
            </label>
            <input
              type="url"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
              placeholder="https://agent.example.com/a2a"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Provider
              </label>
              <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="OpenAI, Anthropic, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Model
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="gpt-4, claude-3, etc."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="nlp, translation, summarization"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Capabilities
            </label>
            <div className="space-y-2">
              {capabilities.map((cap, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                >
                  <div>
                    <span className="font-medium text-sm text-gray-900 dark:text-white">
                      {cap.name}
                    </span>
                    {cap.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">{cap.description}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCapability(index)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCapability.name}
                  onChange={(e) =>
                    setNewCapability({ ...newCapability, name: e.target.value })
                  }
                  placeholder="Capability name"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
                <input
                  type="text"
                  value={newCapability.description}
                  onChange={(e) =>
                    setNewCapability({ ...newCapability, description: e.target.value })
                  }
                  placeholder="Description"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
                <Button type="button" variant="outline" size="sm" onClick={handleAddCapability}>
                  Add
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Agent
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
