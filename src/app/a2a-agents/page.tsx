'use client';

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/Button';
import { AgentCard } from '@/components/a2a/AgentCard';
import { AddAgentModal } from '@/components/a2a/AddAgentModal';
import { SendMessageModal } from '@/components/a2a/SendMessageModal';
import { useA2AStore } from '@/lib/a2a-store';
import { a2aManager } from '@/lib/a2a-manager';
import type { A2AAgent, MessagePriority } from '@/types/a2a';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';

export default function A2AAgentsPage() {
  const { agents, addAgent, removeAgent } = useA2AStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSendMessageOpen, setIsSendMessageOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<A2AAgent | null>(null);
  const [selectedAgentForDetails, setSelectedAgentForDetails] = useState<A2AAgent | null>(null);

  const handleAddAgent = (agent: A2AAgent) => {
    addAgent(agent);
  };

  const handleDelete = (agentId: string) => {
    if (confirm('Are you sure you want to delete this agent?')) {
      removeAgent(agentId);
    }
  };

  const handleSendMessage = (agent: A2AAgent) => {
    setSelectedAgent(agent);
    setIsSendMessageOpen(true);
  };

  const handleSendMessageSubmit = async (
    fromAgentId: string,
    toAgentId: string,
    capability: string,
    parameters: any,
    priority: MessagePriority
  ) => {
    try {
      const response = await a2aManager.makeRequest(
        {
          messageId: '',
          targetAgent: toAgentId,
          capability,
          parameters,
          priority,
        },
        fromAgentId
      );

      alert(`Message sent successfully!\n\nResponse: ${JSON.stringify(response.result, null, 2)}`);
    } catch (error) {
      alert(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleViewDetails = (agent: A2AAgent) => {
    setSelectedAgentForDetails(agent);
  };

  const onlineAgents = agents.filter(a => a.status === 'online').length;
  const busyAgents = agents.filter(a => a.status === 'busy').length;
  const totalMessages = agents.reduce((sum, agent) => sum + (agent.messageCount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              A2A Agents
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your Agent-to-Agent communication network
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Agent
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Agents
            </div>
            <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {agents.length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Online
            </div>
            <div className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
              {onlineAgents}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Busy
            </div>
            <div className="mt-2 text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {busyAgents}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Messages
            </div>
            <div className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
              {totalMessages}
            </div>
          </div>
        </div>

        {/* Agent List */}
        {agents.length === 0 ? (
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
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
              No A2A agents configured
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by adding your first AI agent to the network.
            </p>
            <div className="mt-6">
              <Button
                variant="primary"
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Your First Agent
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onViewDetails={handleViewDetails}
                onSendMessage={handleSendMessage}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <AddAgentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddAgent}
      />

      <SendMessageModal
        isOpen={isSendMessageOpen}
        onClose={() => {
          setIsSendMessageOpen(false);
          setSelectedAgent(null);
        }}
        agent={selectedAgent}
        fromAgents={agents}
        onSend={handleSendMessageSubmit}
      />

      {/* Agent Details Modal */}
      {selectedAgentForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Agent Details
              </h2>
              <button
                onClick={() => setSelectedAgentForDetails(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Basic Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Name:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedAgentForDetails.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedAgentForDetails.status}
                    </span>
                  </div>
                  {selectedAgentForDetails.endpoint && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Endpoint:</span>
                      <code className="text-sm text-gray-900 dark:text-white">
                        {selectedAgentForDetails.endpoint}
                      </code>
                    </div>
                  )}
                </div>
              </div>

              {selectedAgentForDetails.capabilities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Capabilities ({selectedAgentForDetails.capabilities.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedAgentForDetails.capabilities.map((cap, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                      >
                        <span className="font-medium text-sm text-gray-900 dark:text-white">
                          {cap.name}
                        </span>
                        {cap.description && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {cap.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <Button variant="outline" onClick={() => setSelectedAgentForDetails(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
