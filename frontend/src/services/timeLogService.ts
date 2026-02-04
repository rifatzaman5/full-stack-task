import api from '@/lib/api';
import { TimeLog, CreateTimeLogInput, UpdateTimeLogInput, TimeLogStatus } from '@/types';

export interface TimeLogResponse {
  message: string;
  timeLog: TimeLog;
}

export interface TimeLogsResponse {
  timeLogs: TimeLog[];
}

export const createTimeLog = async (
  data: CreateTimeLogInput
): Promise<TimeLogResponse> => {
  const response = await api.post('/timelogs', data);
  return response.data;
};

export const getTimeLogsByProject = async (
  projectId: string
): Promise<TimeLogsResponse> => {
  const response = await api.get(`/timelogs/project/${projectId}`);
  return response.data;
};

export const getTimeLogsByUser = async (): Promise<TimeLogsResponse> => {
  const response = await api.get('/timelogs/user');
  return response.data;
};

export const updateTimeLog = async (
  id: string,
  data: UpdateTimeLogInput
): Promise<TimeLogResponse> => {
  const response = await api.put(`/timelogs/${id}`, data);
  return response.data;
};

export const updateTimeLogStatus = async (
  id: string,
  status: TimeLogStatus
): Promise<TimeLogResponse> => {
  const response = await api.patch(`/timelogs/${id}/status`, { status });
  return response.data;
};

export const deleteTimeLog = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/timelogs/${id}`);
  return response.data;
};
