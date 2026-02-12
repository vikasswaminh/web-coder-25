import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/api/endpoints';
import { toast } from '@/hooks/use-toast';
import type { User } from '@/types';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { email: string; password: string; name: string }) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, login: setAuth, logout: clearAuth, setLoading } = useAuthStore();

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await authApi.login(email, password);
      const { user, access_token } = response.data;
      setAuth(user, access_token);
      toast({
        title: 'Success',
        description: 'Welcome back!',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid credentials',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setAuth, navigate, setLoading]);

  const signup = useCallback(async (data: { email: string; password: string; name: string }): Promise<void> => {
    try {
      setLoading(true);
      const response = await authApi.signup(data);
      const { user, access_token } = response.data;
      setAuth(user, access_token);
      toast({
        title: 'Success',
        description: 'Account created successfully!',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create account',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setAuth, navigate, setLoading]);

  const logout = useCallback((): void => {
    clearAuth();
    toast({
      title: 'Logged out',
      description: 'See you soon!',
    });
    navigate('/login');
  }, [clearAuth, navigate]);

  const checkAuth = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await authApi.me();
      useAuthStore.getState().setUser(response.data);
    } catch {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    checkAuth,
  };
}
