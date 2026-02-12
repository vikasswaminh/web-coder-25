export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar_url?: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  is_public?: boolean;
}

export interface CodeFile {
  id: number;
  project_id: number;
  file_path: string;
  content: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: number;
  project_id: number;
  role: 'user' | 'assistant';
  message: string;
  created_at: string;
}

export interface CodeSnippet {
  id: number;
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
  user_id: string;
  is_public: boolean;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface EditorState {
  code: string;
  language: string;
  theme: string;
  fontSize: number;
}
