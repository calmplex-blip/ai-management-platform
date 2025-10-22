'use client';

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { MCPServerConfig } from '@/types/mcp';

interface MCPServerDetailsProps {
  server: MCPServerConfig | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MCPServerDetails({ server, isOpen, onClose }: MCPServerDetailsProps) {
  if (!isOpen || !server) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Server Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Basic Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Name:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{server.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                <Badge variant={server.status === 'connected' ? 'success' : server.status === 'error' ? 'error' : 'neutral'}>
                  {server.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Transport:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white uppercase">{server.transportType}</span>
              </div>
            </div>
          </div>

          {/* Connection Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Connection Details
            </h3>
            {server.command && (
              <div className="mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Command:</span>
                <code className="block mt-1 bg-gray-100 dark:bg-gray-900 px-3 py-2 rounded text-sm">
                  {server.command} {server.args?.join(' ')}
                </code>
              </div>
            )}
            {server.url && (
              <div className="mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">URL:</span>
                <code className="block mt-1 bg-gray-100 dark:bg-gray-900 px-3 py-2 rounded text-sm break-all">
                  {server.url}
                </code>
              </div>
            )}
            {server.env && Object.keys(server.env).length > 0 && (
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Environment Variables:</span>
                <pre className="mt-1 bg-gray-100 dark:bg-gray-900 px-3 py-2 rounded text-sm overflow-x-auto">
                  {JSON.stringify(server.env, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Tools */}
          {server.tools && server.tools.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Available Tools ({server.tools.length})
              </h3>
              <div className="space-y-2">
                {server.tools.map((tool, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-gray-900 dark:text-white">
                        {tool.name}
                      </span>
                      <Badge variant="info">Tool</Badge>
                    </div>
                    {tool.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {tool.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          {server.resources && server.resources.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Available Resources ({server.resources.length})
              </h3>
              <div className="space-y-2">
                {server.resources.map((resource, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-gray-900 dark:text-white">
                        {resource.name}
                      </span>
                      <Badge variant="success">Resource</Badge>
                    </div>
                    <code className="text-xs text-gray-600 dark:text-gray-400 break-all">
                      {resource.uri}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prompts */}
          {server.prompts && server.prompts.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Available Prompts ({server.prompts.length})
              </h3>
              <div className="space-y-2">
                {server.prompts.map((prompt, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-gray-900 dark:text-white">
                        {prompt.name}
                      </span>
                      <Badge variant="warning">Prompt</Badge>
                    </div>
                    {prompt.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {prompt.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
