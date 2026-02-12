import apiClient from './client';
import type { User, Project, CodeFile, ChatMessage, CodeSnippet, PaginatedResponse } from '@/types';

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/api/v1/auth/login', { email, password }),
  signup: (data: { email: string; password: string; name: string }) =>
    apiClient.post('/api/v1/auth/signup', data),
  me: () => apiClient.get<User>('/api/v1/auth/me'),
  logout: () => apiClient.post('/api/v1/auth/logout'),
};

export const projectsApi = {
  getAll: (params?: { skip?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<Project>>('/api/v1/projects', { params }),
  getById: (id: number) =>
    apiClient.get<Project>(`/api/v1/projects/${id}`),
  create: (data: Partial<Project>) =>
    apiClient.post<Project>('/api/v1/projects', data),
  update: (id: number, data: Partial<Project>) =>
    apiClient.put<Project>(`/api/v1/projects/${id}`, data),
  delete: (id: number) =>
    apiClient.delete(`/api/v1/projects/${id}`),
};

export const codeFilesApi = {
  getByProject: (projectId: number) =>
    apiClient.get<PaginatedResponse<CodeFile>>('/api/v1/code_files', {
      params: { project_id: projectId },
    }),
  create: (data: Partial<CodeFile>) =>
    apiClient.post<CodeFile>('/api/v1/code_files', data),
  update: (id: number, data: Partial<CodeFile>) =>
    apiClient.put<CodeFile>(`/api/v1/code_files/${id}`, data),
  delete: (id: number) =>
    apiClient.delete(`/api/v1/code_files/${id}`),
};

export const aiApi = {
  generate: (data: {
    messages: Array<{ role: string; content: string }>;
    model?: string;
    stream?: boolean;
  }) => apiClient.post('/api/v1/aihub/gentxt', data),
  generateStream: (data: {
    messages: Array<{ role: string; content: string }>;
    model?: string;
  }) => {
    return fetch(`${import.meta.env.VITE_API_URL}/api/v1/aihub/gentxt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ ...data, stream: true }),
    });
  },
};

export const snippetsApi = {
  getAll: (params?: { skip?: number; limit?: number; tag?: string }) =>
    apiClient.get<PaginatedResponse<CodeSnippet>>('/api/v1/snippets', { params }),
  create: (data: Partial<CodeSnippet>) =>
    apiClient.post<CodeSnippet>('/api/v1/snippets', data),
  update: (id: number, data: Partial<CodeSnippet>) =>
    apiClient.put<CodeSnippet>(`/api/v1/snippets/${id}`, data),
  delete: (id: number) =>
    apiClient.delete(`/api/v1/snippets/${id}`),
};

export const chatApi = {
  getByProject: (projectId: number, params?: { skip?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<ChatMessage>>('/api/v1/chat', {
      params: { project_id: projectId, ...params },
    }),
  sendMessage: (data: { project_id: number; message: string }) =>
    apiClient.post<ChatMessage>('/api/v1/chat', data),
  clearHistory: (projectId: number) =>
    apiClient.delete(`/api/v1/chat?project_id=${projectId}`),
};
