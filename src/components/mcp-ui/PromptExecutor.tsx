'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { mcpClientManager } from '@/lib/mcp-client';
import type { MCPPrompt } from '@/types/mcp';

interface PromptExecutorProps {
  serverId: string;
  prompts: MCPPrompt[];
}

export function PromptExecutor({ serverId, prompts }: PromptExecutorProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<MCPPrompt | null>(null);
  const [promptArgs, setPromptArgs] = useState<Record<string, string>>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePromptSelect = (prompt: MCPPrompt) => {
    setSelectedPrompt(prompt);
    setPromptArgs({});
    setResult(null);
    setError(null);
  };

  const handleArgChange = (argName: string, value: string) => {
    setPromptArgs(prev => ({
      ...prev,
      [argName]: value
    }));
  };

  const handleExecute = async () => {
    if (!selectedPrompt) return;

    setIsExecuting(true);
    setError(null);
    setResult(null);

    try {
      const response = await mcpClientManager.getPrompt(
        serverId,
        selectedPrompt.name,
        promptArgs
      );
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute prompt');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Prompt List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Prompts ({prompts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {prompts.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
              No prompts available
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {prompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptSelect(prompt)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedPrompt?.name === prompt.name
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {prompt.name}
                      </h4>
                      {prompt.description && (
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                          {prompt.description}
                        </p>
                      )}
                      {prompt.arguments && prompt.arguments.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {prompt.arguments.map((arg, i) => (
                            <Badge key={i} variant="neutral" className="text-xs">
                              {arg.name}
                              {arg.required && <span className="text-red-500">*</span>}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    {selectedPrompt?.name === prompt.name && (
                      <Badge variant="info">Selected</Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Prompt Execution Panel */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedPrompt ? `Execute: ${selectedPrompt.name}` : 'Select a Prompt'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedPrompt ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
              Select a prompt from the list to execute
            </p>
          ) : (
            <div>
              {/* Prompt Description */}
              {selectedPrompt.description && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedPrompt.description}
                  </p>
                </div>
              )}

              {/* Arguments */}
              {selectedPrompt.arguments && selectedPrompt.arguments.length > 0 ? (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Arguments
                  </h4>
                  {selectedPrompt.arguments.map((arg, index) => (
                    <div key={index} className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {arg.name}
                        {arg.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <input
                        type="text"
                        value={promptArgs[arg.name] || ''}
                        onChange={(e) => handleArgChange(arg.name, e.target.value)}
                        placeholder={arg.description || `Enter ${arg.name}`}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required={arg.required}
                      />
                      {arg.description && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {arg.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  No arguments required
                </p>
              )}

              {/* Execute Button */}
              <Button
                variant="primary"
                onClick={handleExecute}
                disabled={isExecuting}
                className="w-full mb-4"
              >
                {isExecuting ? 'Getting Prompt...' : 'Get Prompt'}
              </Button>

              {/* Result Display */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <h4 className="text-sm font-semibold text-red-900 dark:text-red-200 mb-2">
                    Error
                  </h4>
                  <pre className="text-xs text-red-700 dark:text-red-300 whitespace-pre-wrap">
                    {error}
                  </pre>
                </div>
              )}

              {result && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <h4 className="text-sm font-semibold text-green-900 dark:text-green-200 mb-2">
                    Prompt Result
                  </h4>
                  <pre className="text-xs text-green-700 dark:text-green-300 whitespace-pre-wrap overflow-x-auto max-h-96">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
