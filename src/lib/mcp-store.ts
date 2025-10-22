'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MCPServerConfig } from '@/types/mcp';

interface MCPStore {
  servers: MCPServerConfig[];
  addServer: (server: MCPServerConfig) => void;
  updateServer: (id: string, updates: Partial<MCPServerConfig>) => void;
  removeServer: (id: string) => void;
  getServer: (id: string) => MCPServerConfig | undefined;
}

export const useMCPStore = create<MCPStore>()(
  persist(
    (set, get) => ({
      servers: [],

      addServer: (server) =>
        set((state) => ({
          servers: [...state.servers, server]
        })),

      updateServer: (id, updates) =>
        set((state) => ({
          servers: state.servers.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),

      removeServer: (id) =>
        set((state) => ({
          servers: state.servers.filter((s) => s.id !== id),
        })),

      getServer: (id) => get().servers.find((s) => s.id === id),
    }),
    {
      name: 'mcp-servers-storage',
    }
  )
);
