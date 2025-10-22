'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { mcpClientManager } from '@/lib/mcp-client';
import type { MCPResource } from '@/types/mcp';

interface ResourceBrowserProps {
  serverId: string;
  resources: MCPResource[];
}

export function ResourceBrowser({ serverId, resources }: ResourceBrowserProps) {
  const [selectedResource, setSelectedResource] = useState<MCPResource | null>(null);
  const [resourceContent, setResourceContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResourceSelect = async (resource: MCPResource) => {
    setSelectedResource(resource);
    setResourceContent(null);
    setError(null);
    setIsLoading(true);

    try {
      const content = await mcpClientManager.readResource(serverId, resource.uri);
      setResourceContent(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load resource');
    } finally {
      setIsLoading(false);
    }
  };

  const getMimeTypeIcon = (mimeType?: string) => {
    if (!mimeType) return '📄';
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('text/')) return '📝';
    if (mimeType.includes('json')) return '{}';
    if (mimeType.includes('pdf')) return '📕';
    return '📄';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Resource List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Resources ({resources.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {resources.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
              No resources available
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {resources.map((resource, index) => (
                <button
                  key={index}
                  onClick={() => handleResourceSelect(resource)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedResource?.uri === resource.uri
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{getMimeTypeIcon(resource.mimeType)}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {resource.name}
                      </h4>
                      {resource.description && (
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          {resource.description}
                        </p>
                      )}
                      <code className="mt-1 text-xs text-gray-500 dark:text-gray-400 block truncate">
                        {resource.uri}
                      </code>
                      {resource.mimeType && (
                        <Badge variant="neutral" className="mt-2">
                          {resource.mimeType}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resource Content Viewer */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedResource ? selectedResource.name : 'Select a Resource'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedResource ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
              Select a resource from the list to view its content
            </p>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <h4 className="text-sm font-semibold text-red-900 dark:text-red-200 mb-2">
                Error Loading Resource
              </h4>
              <p className="text-xs text-red-700 dark:text-red-300">{error}</p>
            </div>
          ) : resourceContent ? (
            <div>
              {/* Resource Metadata */}
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">URI:</span>
                    <p className="text-gray-900 dark:text-white break-all">{selectedResource.uri}</p>
                  </div>
                  {selectedResource.mimeType && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Type:</span>
                      <p className="text-gray-900 dark:text-white">{selectedResource.mimeType}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Display */}
              <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                <pre className="text-xs text-gray-900 dark:text-white whitespace-pre-wrap overflow-x-auto max-h-96">
                  {JSON.stringify(resourceContent, null, 2)}
                </pre>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
