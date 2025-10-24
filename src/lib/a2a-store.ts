'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { A2AAgent, A2AConversation } from '@/types/a2a';

interface A2AStore {
  agents: A2AAgent[];
  conversations: A2AConversation[];

  // Agent management
  addAgent: (agent: A2AAgent) => void;
  updateAgent: (id: string, updates: Partial<A2AAgent>) => void;
  removeAgent: (id: string) => void;
  getAgent: (id: string) => A2AAgent | undefined;

  // Conversation management
  addConversation: (conversation: A2AConversation) => void;
  updateConversation: (id: string, updates: Partial<A2AConversation>) => void;
  removeConversation: (id: string) => void;
  getConversation: (id: string) => A2AConversation | undefined;
}

export const useA2AStore = create<A2AStore>()(
  persist(
    (set, get) => ({
      agents: [],
      conversations: [],

      // Agent management
      addAgent: (agent) =>
        set((state) => ({
          agents: [...state.agents, agent],
        })),

      updateAgent: (id, updates) =>
        set((state) => ({
          agents: state.agents.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        })),

      removeAgent: (id) =>
        set((state) => ({
          agents: state.agents.filter((a) => a.id !== id),
        })),

      getAgent: (id) => get().agents.find((a) => a.id === id),

      // Conversation management
      addConversation: (conversation) =>
        set((state) => ({
          conversations: [...state.conversations, conversation],
        })),

      updateConversation: (id, updates) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      removeConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
        })),

      getConversation: (id) => get().conversations.find((c) => c.id === id),
    }),
    {
      name: 'a2a-storage',
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('Failed to rehydrate A2A store:', error);
          localStorage.removeItem('a2a-storage');
        }
      }
    }
  )
);
