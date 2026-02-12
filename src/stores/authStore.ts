import { create } from 'zustand';
import { neonAuth } from '@/lib/neonAuth';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: (user, token) => {
    set({ user, token, isAuthenticated: true, isLoading: false, error: null });
  },

  logout: () => {
    neonAuth.logout();
    set({ user: null, token: null, isAuthenticated: false, isLoading: false, error: null });
  },

  setUser: (user) => set({ user }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  initialize: async () => {
    set({ isLoading: true });
    try {
      // Check if we have a token
      const token = neonAuth.getAccessToken();
      
      if (!token || neonAuth.isTokenExpired()) {
        // Try to refresh token
        const refreshed = await neonAuth.refreshToken();
        if (!refreshed) {
          set({ isLoading: false, isAuthenticated: false });
          return;
        }
      }

      // Get current user
      const user = await neonAuth.getCurrentUser();
      
      if (user) {
        const currentToken = neonAuth.getAccessToken();
        set({
          user,
          token: currentToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Failed to initialize authentication',
      });
    }
  },
}));

// Initialize auth on app load
export const initializeAuth = () => {
  useAuthStore.getState().initialize();
};
