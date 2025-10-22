'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AP2Task, AP2Tool } from '@/types/ap2';

interface AP2Store {
  tasks: AP2Task[];
  tools: AP2Tool[];

  // Task management
  addTask: (task: AP2Task) => void;
  updateTask: (id: string, updates: Partial<AP2Task>) => void;
  removeTask: (id: string) => void;
  getTask: (id: string) => AP2Task | undefined;

  // Tool management
  addTool: (tool: AP2Tool) => void;
  updateTool: (id: string, updates: Partial<AP2Tool>) => void;
  removeTool: (id: string) => void;
  getTool: (id: string) => AP2Tool | undefined;
}

export const useAP2Store = create<AP2Store>()(
  persist(
    (set, get) => ({
      tasks: [],
      tools: [],

      // Task management
      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, task],
        })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      removeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      getTask: (id) => get().tasks.find((t) => t.id === id),

      // Tool management
      addTool: (tool) =>
        set((state) => ({
          tools: [...state.tools, tool],
        })),

      updateTool: (id, updates) =>
        set((state) => ({
          tools: state.tools.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      removeTool: (id) =>
        set((state) => ({
          tools: state.tools.filter((t) => t.id !== id),
        })),

      getTool: (id) => get().tools.find((t) => t.id === id),
    }),
    {
      name: 'ap2-storage',
    }
  )
);
