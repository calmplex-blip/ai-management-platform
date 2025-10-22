'use client';

import React, { useState } from 'react';
import { IFrameComponentProps } from '@/types/skin';

export function IFrameComponent(props: IFrameComponentProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError('Failed to load content');
  };

  const displaySrc = props.src || (props.mcpResource ? `mcp-resource://${props.mcpResource}` : '');

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {props.title || 'Portal'}
        </span>
        {displaySrc && (
          <span className="text-xs text-gray-500 dark:text-gray-400 truncate ml-2 max-w-[200px]">
            {displaySrc}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="relative flex-1">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <div className="text-red-600 dark:text-red-400 mb-2">⚠️</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{error}</div>
            </div>
          </div>
        )}

        {!displaySrc && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <div className="text-gray-400 mb-2">🖼️</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                No source configured
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Set a URL or MCP resource in the properties
              </div>
            </div>
          </div>
        )}

        {displaySrc && !error && (
          <iframe
            src={displaySrc}
            title={props.title || 'Portal'}
            sandbox={props.sandbox || 'allow-same-origin allow-scripts'}
            allow={props.allow}
            onLoad={handleLoad}
            onError={handleError}
            className="w-full h-full border-0"
          />
        )}
      </div>
    </div>
  );
}
