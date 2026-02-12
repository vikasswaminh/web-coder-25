import { useState, useCallback, useEffect } from 'react';
import { projectsApi } from '@/api/endpoints';
import { useProjectStore } from '@/stores/projectStore';
import { toast } from '@/hooks/use-toast';
import type { Project } from '@/types';

interface UseProjectsReturn {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (data: Partial<Project>) => Promise<void>;
  updateProject: (id: number, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
}

export function useProjects(): UseProjectsReturn {
  const { projects, setProjects, addProject, updateProject: updateStoreProject, deleteProject: deleteStoreProject, setLoading, setError, isLoading, error } = useProjectStore();

  const fetchProjects = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectsApi.getAll();
      setProjects(response.data.items);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch projects';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [setProjects, setLoading, setError]);

  const createProject = useCallback(async (data: Partial<Project>): Promise<void> => {
    try {
      setLoading(true);
      const response = await projectsApi.create(data);
      addProject(response.data);
      toast({
        title: 'Success',
        description: 'Project created successfully',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create project';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [addProject, setLoading]);

  const updateProject = useCallback(async (id: number, data: Partial<Project>): Promise<void> => {
    try {
      setLoading(true);
      const response = await projectsApi.update(id, data);
      updateStoreProject(id, response.data);
      toast({
        title: 'Success',
        description: 'Project updated successfully',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update project';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateStoreProject, setLoading]);

  const deleteProject = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      await projectsApi.delete(id);
      deleteStoreProject(id);
      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete project';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [deleteStoreProject, setLoading]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    isLoading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}
