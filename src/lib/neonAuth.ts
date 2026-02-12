/**
 * Neon Auth Integration
 * Handles authentication via Neon Auth service
 */

import type { User } from '@/types';

const NEON_AUTH_URL = import.meta.env.VITE_NEON_AUTH_URL || 'https://ep-solitary-cloud-abmfowfq.neonauth.eu-west-2.aws.neon.tech/neondb/auth';

interface NeonAuthUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export const neonAuth = {
  /**
   * Get the login URL for Neon Auth
   */
  getLoginUrl(): string {
    const redirectUri = `${window.location.origin}/auth/callback`;
    return `${NEON_AUTH_URL}?redirect_uri=${encodeURIComponent(redirectUri)}&mode=login`;
  },

  /**
   * Get the signup URL for Neon Auth
   */
  getSignupUrl(): string {
    const redirectUri = `${window.location.origin}/auth/callback`;
    return `${NEON_AUTH_URL}?redirect_uri=${encodeURIComponent(redirectUri)}&mode=signup`;
  },

  /**
   * Handle auth callback - exchange code for tokens
   */
  async handleCallback(code: string): Promise<{ user: User; token: string } | null> {
    try {
      const response = await fetch(`${NEON_AUTH_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          redirect_uri: `${window.location.origin}/auth/callback`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for tokens');
      }

      const tokens: AuthTokens = await response.json();
      
      // Store tokens
      localStorage.setItem('neon_access_token', tokens.access_token);
      localStorage.setItem('neon_refresh_token', tokens.refresh_token);
      localStorage.setItem('neon_expires_at', tokens.expires_at.toString());

      // Get user info
      const user = await this.getCurrentUser(tokens.access_token);
      
      if (user) {
        return { user, token: tokens.access_token };
      }
      
      return null;
    } catch (error) {
      console.error('Auth callback error:', error);
      return null;
    }
  },

  /**
   * Get current user from token
   */
  async getCurrentUser(token?: string): Promise<User | null> {
    const accessToken = token || localStorage.getItem('neon_access_token');
    
    if (!accessToken) {
      return null;
    }

    try {
      const response = await fetch(`${NEON_AUTH_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        // Token might be expired, try to refresh
        if (response.status === 401) {
          const refreshed = await this.refreshToken();
          if (refreshed) {
            return this.getCurrentUser(refreshed.access_token);
          }
        }
        return null;
      }

      const neonUser: NeonAuthUser = await response.json();
      
      return {
        id: neonUser.id,
        email: neonUser.email,
        name: neonUser.name || neonUser.email.split('@')[0],
        avatar_url: neonUser.avatar_url,
        role: 'user', // Default role
      };
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<AuthTokens | null> {
    const refreshToken = localStorage.getItem('neon_refresh_token');
    
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${NEON_AUTH_URL}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const tokens: AuthTokens = await response.json();
      
      localStorage.setItem('neon_access_token', tokens.access_token);
      localStorage.setItem('neon_refresh_token', tokens.refresh_token);
      localStorage.setItem('neon_expires_at', tokens.expires_at.toString());
      
      return tokens;
    } catch (error) {
      console.error('Refresh token error:', error);
      return null;
    }
  },

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('neon_access_token');
    localStorage.removeItem('neon_refresh_token');
    localStorage.removeItem('neon_expires_at');
    
    // Redirect to Neon Auth logout
    window.location.href = `${NEON_AUTH_URL}/logout?redirect_uri=${encodeURIComponent(window.location.origin)}`;
  },

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem('neon_expires_at');
    if (!expiresAt) return true;
    return Date.now() >= parseInt(expiresAt) * 1000;
  },

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('neon_access_token');
  },
};
