'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { CodeEditorComponentProps } from '@/types/skin';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-900 text-gray-400">
      Loading editor...
    </div>
  ),
});

export function CodeEditorComponent(props: CodeEditorComponentProps) {
  const [value, setValue] = useState(props.value || '// Start coding...\n');

  const handleChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      setValue(newValue);
      props.onChange?.(newValue);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {props.file || 'Untitled'}
          </span>
          {props.language && (
            <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
              {props.language}
            </span>
          )}
        </div>
        {props.readOnly && (
          <span className="text-xs text-gray-500 dark:text-gray-400">Read Only</span>
        )}
      </div>

      {/* Editor */}
      <div className="flex-1">
        <MonacoEditor
          height="100%"
          language={props.language || 'typescript'}
          theme={props.theme || 'vs-dark'}
          value={value}
          onChange={handleChange}
          options={{
            readOnly: props.readOnly || false,
            minimap: { enabled: true },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
}
