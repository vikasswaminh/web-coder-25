import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { ChatMessage } from '@/types';

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: number, content: string) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatState>()(
  immer((set) => ({
    messages: [],
    isLoading: false,
    error: null,
    setMessages: (messages) => set({ messages }),
    addMessage: (message) =>
      set((state) => {
        state.messages.push(message);
      }),
    updateMessage: (id, content) =>
      set((state) => {
        const msg = state.messages.find((m) => m.id === id);
        if (msg) {
          msg.message = content;
        }
      }),
    clearMessages: () =>
      set((state) => {
        state.messages = [];
      }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
  }))
);
