export type Role = 'ADMIN' | 'EMPLOYEE';

export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

export type TimeLogStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  billingRate: number;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  _count?: {
    timeLogs: number;
  };
  timeLogs?: TimeLog[];
}

export interface TimeLog {
  id: string;
  projectId: string;
  userId: string;
  hours: number;
  notes?: string;
  logDate: string;
  status: TimeLogStatus;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  project?: {
    id: string;
    name: string;
    billingRate: number;
  };
}

export interface BillingSummary {
  projectId: string;
  projectName: string;
  billingRate: number;
  totalHours: number;
  totalAmount: number;
  hoursByUser: {
    name: string;
    hours: number;
  }[];
  hoursByDate: Record<string, number>;
  timeLogCount: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role?: Role;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  billingRate: number;
}

export interface CreateTimeLogInput {
  projectId: string;
  hours: number;
  notes?: string;
  logDate: string;
  status: TimeLogStatus;
}

export interface UpdateTimeLogInput {
  hours?: number;
  notes?: string;
  logDate?: string;
  status?: TimeLogStatus;
}

export interface KanbanColumn {
  id: TimeLogStatus;
  title: string;
  timeLogs: TimeLog[];
}
