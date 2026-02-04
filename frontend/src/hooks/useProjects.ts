import { useState, useCallback } from 'react';
import { Project, CreateProjectInput, UpdateTimeLogInput } from '@/types';
import { getProjects, createProject } from '@/services/projectService';
import { createTimeLog, updateTimeLog, deleteTimeLog } from '@/services/timeLogService';

interface ProjectsState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  addProject: (data: CreateProjectInput) => Promise<void>;
  addTimeLog: (
    projectId: string,
    data: Omit<UpdateTimeLogInput, 'projectId'>
  ) => Promise<void>;
  removeTimeLog: (timeLogId: string) => Promise<void>;
}

export const useProjects = (): ProjectsState => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getProjects();
      setProjects(response.projects);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addProject = useCallback(async (data: CreateProjectInput) => {
    setIsLoading(true);
    setError(null);
    try {
      await createProject(data);
      await fetchProjects();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create project');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchProjects]);

  const addTimeLog = useCallback(
    async (
      projectId: string,
      data: Omit<UpdateTimeLogInput, 'projectId'>
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        await createTimeLog({ ...data, projectId });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to create time log');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const removeTimeLog = useCallback(async (timeLogId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteTimeLog(timeLogId);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete time log');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    projects,
    isLoading,
    error,
    fetchProjects,
    addProject,
    addTimeLog,
    removeTimeLog,
  };
};
