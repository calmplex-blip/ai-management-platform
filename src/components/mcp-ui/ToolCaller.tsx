'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { mcpClientManager } from '@/lib/mcp-client';
import type { MCPTool } from '@/types/mcp';

interface ToolCallerProps {
  serverId: string;
  tools: MCPTool[];
}

export function ToolCaller({ serverId, tools }: ToolCallerProps) {
  const [selectedTool, setSelectedTool] = useState<MCPTool | null>(null);
  const [toolArgs, setToolArgs] = useState<Record<string, string>>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleToolSelect = (tool: MCPTool) => {
    setSelectedTool(tool);
    setToolArgs({});
    setResult(null);
    setError(null);
  };

  const handleArgChange = (paramName: string, value: string) => {
    setToolArgs(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const handleExecute = async () => {
    if (!selectedTool) return;

    setIsExecuting(true);
    setError(null);
    setResult(null);

    try {
      // Convert string values to appropriate types based on schema
      const parsedArgs: Record<string, any> = {};
      Object.entries(toolArgs).forEach(([key, value]) => {
        try {
          // Try to parse as JSON for objects/arrays, otherwise use as string
          parsedArgs[key] = JSON.parse(value);
        } catch {
          parsedArgs[key] = value;
        }
      });

      const response = await mcpClientManager.callTool(
        serverId,
        selectedTool.name,
        parsedArgs
      );
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute tool');
    } finally {
      setIsExecuting(false);
    }
  };

  const renderInputForParam = (paramName: string, paramSchema: any) => {
    const isRequired = selectedTool?.inputSchema.required?.includes(paramName);

    return (
      <div key={paramName} className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {paramName}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type="text"
          value={toolArgs[paramName] || ''}
          onChange={(e) => handleArgChange(paramName, e.target.value)}
          placeholder={paramSchema.description || `Enter ${paramName}`}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          required={isRequired}
        />
        {paramSchema.description && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {paramSchema.description}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Tool List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Tools ({tools.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {tools.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
              No tools available
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {tools.map((tool) => (
                <button
                  key={tool.name}
                  onClick={() => handleToolSelect(tool)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedTool?.name === tool.name
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {tool.name}
                      </h4>
                      {tool.description && (
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                          {tool.description}
                        </p>
                      )}
                    </div>
                    {selectedTool?.name === tool.name && (
                      <Badge variant="info">Selected</Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tool Execution Panel */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedTool ? `Execute: ${selectedTool.name}` : 'Select a Tool'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedTool ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
              Select a tool from the list to execute
            </p>
          ) : (
            <div>
              {/* Tool Description */}
              {selectedTool.description && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedTool.description}
                  </p>
                </div>
              )}

              {/* Input Parameters */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Parameters
                </h4>
                {selectedTool.inputSchema.properties &&
                Object.keys(selectedTool.inputSchema.properties).length > 0 ? (
                  Object.entries(selectedTool.inputSchema.properties).map(
                    ([paramName, paramSchema]: [string, any]) =>
                      renderInputForParam(paramName, paramSchema)
                  )
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No parameters required
                  </p>
                )}
              </div>

              {/* Execute Button */}
              <Button
                variant="primary"
                onClick={handleExecute}
                disabled={isExecuting}
                className="w-full mb-4"
              >
                {isExecuting ? 'Executing...' : 'Execute Tool'}
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
                    Result
                  </h4>
                  <pre className="text-xs text-green-700 dark:text-green-300 whitespace-pre-wrap overflow-x-auto max-h-64">
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
