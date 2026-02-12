/**
 * Neon Auth Integration
 * Uses Stack Auth (Neon's auth provider) OAuth 2.0 flow
 */

import type { User } from '@/types';

// Get Neon Auth base URL from env or use fallback
const NEON_AUTH_BASE = import.meta.env.VITE_NEON_AUTH_URL || 
  'https://ep-solitary-cloud-abmfowfq.neonauth.eu-west-2.aws.neon.tech';

// Stack Auth OAuth endpoints
const STACK_AUTH_URL = `${NEON_AUTH_BASE}/neondb/auth`;
const USERINFO_ENDPOINT = `${NEON_AUTH_BASE}/api/v1/users/me`;

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
   * Get the login URL for Neon Auth (Stack Auth OAuth)
   */
  getLoginUrl(): string {
    const redirectUri = `${window.location.origin}/auth/callback`;
    const state = btoa(JSON.stringify({ redirect: '/dashboard', nonce: Math.random().toString(36) }));
    
    // Stack Auth OAuth authorization endpoint
    const params = new URLSearchParams({
      redirect_uri: redirectUri,
      state: state,
      after_callback_redirect_or_tenant: redirectUri,
      type: 'login'
    });
    
    return `${STACK_AUTH_URL}?${params.toString()}`;
  },

  /**
   * Get the signup URL for Neon Auth
   */
  getSignupUrl(): string {
    const redirectUri = `${window.location.origin}/auth/callback`;
    const state = btoa(JSON.stringify({ redirect: '/dashboard', nonce: Math.random().toString(36) }));
    
    const params = new URLSearchParams({
      redirect_uri: redirectUri,
      state: state,
      after_callback_redirect_or_tenant: redirectUri,
      type: 'register'
    });
    
    return `${STACK_AUTH_URL}?${params.toString()}`;
  },

  /**
   * Handle auth callback - exchange code for tokens
   */
  async handleCallback(code: string): Promise<{ user: User; token: string } | null> {
    try {
      // Stack Auth uses the callback endpoint to exchange code for session
      const response = await fetch(`${STACK_AUTH_URL}/callback`, {
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
        const error = await response.text();
        console.error('Token exchange failed:', error);
        throw new Error('Failed to exchange code for tokens');
      }

      // Stack Auth returns session in cookies and/or body
      const data = await response.json();
      
      // Extract tokens from response
      const accessToken = data.access_token || data.token;
      if (!accessToken) {
        console.error('No access token in response:', data);
        throw new Error('No access token received');
      }
      
      // Store tokens
      localStorage.setItem('neon_access_token', accessToken);
      if (data.refresh_token) {
        localStorage.setItem('neon_refresh_token', data.refresh_token);
      }
      if (data.expires_at) {
        localStorage.setItem('neon_expires_at', data.expires_at.toString());
      }

      // Get user info
      const user = await this.getCurrentUser(accessToken);
      
      if (user) {
        return { user, token: accessToken };
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
      const response = await fetch(USERINFO_ENDPOINT, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Try to refresh token
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
        role: 'user',
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
      const response = await fetch(`${NEON_AUTH_BASE}/api/v1/auth/refresh`, {
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

      const data = await response.json();
      
      localStorage.setItem('neon_access_token', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('neon_refresh_token', data.refresh_token);
      }
      if (data.expires_at) {
        localStorage.setItem('neon_expires_at', data.expires_at.toString());
      }
      
      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_at,
      };
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
    window.location.href = `${STACK_AUTH_URL}?type=logout&redirect_uri=${encodeURIComponent(window.location.origin)}`;
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
