import api from '@/lib/api';
import { Project, CreateProjectInput, BillingSummary } from '@/types';

export interface ProjectResponse {
  message: string;
  project: Project;
}

export interface ProjectsResponse {
  projects: Project[];
}

export interface BillingSummaryResponse {
  summary: BillingSummary;
}

export const createProject = async (
  data: CreateProjectInput
): Promise<ProjectResponse> => {
  const response = await api.post('/projects', data);
  return response.data;
};

export const getProjects = async (): Promise<ProjectsResponse> => {
  const response = await api.get('/projects');
  return response.data;
};

export const getProject = async (id: string): Promise<{ project: Project }> => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const updateProject = async (
  id: string,
  data: Partial<CreateProjectInput>
): Promise<ProjectResponse> => {
  const response = await api.put(`/projects/${id}`, data);
  return response.data;
};

export const archiveProject = async (
  id: string
): Promise<ProjectResponse> => {
  const response = await api.patch(`/projects/${id}/archive`);
  return response.data;
};

export const getBillingSummary = async (
  id: string
): Promise<BillingSummaryResponse> => {
  const response = await api.get(`/projects/${id}/billing-summary`);
  return response.data;
};
