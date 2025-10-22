'use client';

import React, { useState, useRef, useEffect } from 'react';
import { TerminalComponentProps } from '@/types/skin';

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error';
  content: string;
}

export function TerminalComponent(props: TerminalComponentProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: '1',
      type: 'output',
      content: `ConsciousOps Terminal (${props.shell || 'bash'})`,
    },
    {
      id: '2',
      type: 'output',
      content: `Working directory: ${props.workingDirectory || '~'}`,
    },
    {
      id: '3',
      type: 'output',
      content: 'Type "help" for available commands',
    },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [lines]);

  const handleCommand = (command: string) => {
    if (!command.trim()) return;

    // Add command to lines
    setLines((prev) => [
      ...prev,
      { id: crypto.randomUUID(), type: 'command', content: `$ ${command}` },
    ]);

    // Add to history
    setHistory((prev) => [...prev, command]);
    setHistoryIndex(-1);

    // Simulate command execution
    setTimeout(() => {
      let output: TerminalLine;

      switch (command.trim().toLowerCase()) {
        case 'help':
          output = {
            id: crypto.randomUUID(),
            type: 'output',
            content: `Available commands:
  help    - Show this help message
  clear   - Clear terminal
  pwd     - Print working directory
  ls      - List directory contents
  echo    - Echo text

Note: This is a simulated terminal. Full terminal functionality requires backend integration.`,
          };
          break;

        case 'clear':
          setLines([]);
          return;

        case 'pwd':
          output = {
            id: crypto.randomUUID(),
            type: 'output',
            content: props.workingDirectory || '~',
          };
          break;

        case 'ls':
          output = {
            id: crypto.randomUUID(),
            type: 'output',
            content: 'file1.txt  file2.js  directory/  README.md',
          };
          break;

        default:
          if (command.startsWith('echo ')) {
            output = {
              id: crypto.randomUUID(),
              type: 'output',
              content: command.substring(5),
            };
          } else {
            output = {
              id: crypto.randomUUID(),
              type: 'error',
              content: `Command not found: ${command}. Type "help" for available commands.`,
            };
          }
      }

      setLines((prev) => [...prev, output]);
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div
      className="flex flex-col h-full bg-black text-green-400 font-mono text-sm rounded-lg border border-gray-700 overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 bg-gray-900">
        <span className="text-xs text-gray-400">
          Terminal - {props.shell || 'bash'}
        </span>
        <button
          onClick={() => setLines([])}
          className="text-xs text-gray-500 hover:text-gray-300"
        >
          Clear
        </button>
      </div>

      {/* Terminal output */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {lines.map((line) => (
          <div
            key={line.id}
            className={
              line.type === 'command'
                ? 'text-green-400'
                : line.type === 'error'
                ? 'text-red-400'
                : 'text-gray-300'
            }
          >
            {line.content.split('\n').map((text, i) => (
              <div key={i}>{text}</div>
            ))}
          </div>
        ))}

        {/* Input line */}
        <div className="flex items-center gap-2">
          <span className="text-green-400">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-green-400 caret-green-400"
            autoFocus
          />
        </div>

        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}
