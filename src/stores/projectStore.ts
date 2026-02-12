import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Project, CodeFile } from '@/types';

interface ProjectState {
  projects: Project[];
  activeProject: Project | null;
  files: CodeFile[];
  activeFile: CodeFile | null;
  isLoading: boolean;
  error: string | null;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: number, data: Partial<Project>) => void;
  deleteProject: (id: number) => void;
  setActiveProject: (project: Project | null) => void;
  setFiles: (files: CodeFile[]) => void;
  addFile: (file: CodeFile) => void;
  updateFile: (id: number, content: string) => void;
  deleteFile: (id: number) => void;
  setActiveFile: (file: CodeFile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProjectStore = create<ProjectState>()(
  immer((set) => ({
    projects: [],
    activeProject: null,
    files: [],
    activeFile: null,
    isLoading: false,
    error: null,
    setProjects: (projects) => set({ projects }),
    addProject: (project) =>
      set((state) => {
        state.projects.push(project);
      }),
    updateProject: (id, data) =>
      set((state) => {
        const index = state.projects.findIndex((p) => p.id === id);
        if (index !== -1) {
          Object.assign(state.projects[index], data);
        }
      }),
    deleteProject: (id) =>
      set((state) => {
        state.projects = state.projects.filter((p) => p.id !== id);
      }),
    setActiveProject: (project) => set({ activeProject: project }),
    setFiles: (files) => set({ files }),
    addFile: (file) =>
      set((state) => {
        state.files.push(file);
      }),
    updateFile: (id, content) =>
      set((state) => {
        const file = state.files.find((f) => f.id === id);
        if (file) {
          file.content = content;
        }
      }),
    deleteFile: (id) =>
      set((state) => {
        state.files = state.files.filter((f) => f.id !== id);
      }),
    setActiveFile: (file) => set({ activeFile: file }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
  }))
);
