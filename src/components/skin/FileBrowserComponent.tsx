'use client';

import React, { useState } from 'react';

interface FileItem {
  name: string;
  type: 'file' | 'directory';
  size?: string;
  modified?: Date;
}

export function FileBrowserComponent(props: { rootPath?: string; showHidden?: boolean }) {
  const [currentPath, setCurrentPath] = useState(props.rootPath || '/');
  const [files] = useState<FileItem[]>([
    { name: '..', type: 'directory' },
    { name: 'src', type: 'directory', modified: new Date() },
    { name: 'public', type: 'directory', modified: new Date() },
    { name: 'package.json', type: 'file', size: '2.1 KB', modified: new Date() },
    { name: 'tsconfig.json', type: 'file', size: '580 B', modified: new Date() },
    { name: 'README.md', type: 'file', size: '1.5 KB', modified: new Date() },
    { name: '.gitignore', type: 'file', size: '245 B', modified: new Date() },
  ]);

  const filteredFiles = files.filter(
    (file) => props.showHidden || !file.name.startsWith('.')
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate">
          {currentPath}
        </div>
      </div>

      {/* File list */}
      <div className="flex-1 overflow-y-auto">
        {filteredFiles.map((file, index) => (
          <div
            key={index}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0"
            onClick={() => {
              if (file.type === 'directory') {
                if (file.name === '..') {
                  const parts = currentPath.split('/');
                  parts.pop();
                  setCurrentPath(parts.join('/') || '/');
                } else {
                  setCurrentPath(`${currentPath}/${file.name}`);
                }
              }
            }}
          >
            <span className="text-lg">
              {file.type === 'directory' ? '📁' : '📄'}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-900 dark:text-white truncate">
                {file.name}
              </div>
              {file.size && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {file.size}
                </div>
              )}
            </div>
            {file.modified && (
              <div className="text-xs text-gray-400 dark:text-gray-500">
                {file.modified.toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {filteredFiles.length - 1} items
        </div>
      </div>
    </div>
  );
}
