import prisma from '../config/database';
import { getCached, setCache, deleteCache } from '../utils/cache';

export interface CreateProjectInput {
  name: string;
  description?: string;
  billingRate: number;
  userId: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  billingRate?: number;
  status?: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
}

export const createProject = async (input: CreateProjectInput) => {
  const { name, description, billingRate, userId } = input;

  const project = await prisma.project.create({
    data: {
      name,
      description,
      billingRate,
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          timeLogs: true,
        },
      },
    },
  });

  return project;
};

export const getProjects = async (userId: string, role: string) => {
  const projects = await prisma.project.findMany({
    where: role === 'ADMIN' ? {} : { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          timeLogs: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return projects;
};

export const getProjectById = async (id: string) => {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      timeLogs: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!project) {
    throw new Error('Project not found');
  }

  return project;
};

export const updateProject = async (id: string, input: UpdateProjectInput) => {
  const project = await prisma.project.update({
    where: { id },
    data: input,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // Invalidate cache
  deleteCache(`billing-summary:${id}`);

  return project;
};

export const archiveProject = async (id: string) => {
  const project = await prisma.project.update({
    where: { id },
    data: {
      status: 'ARCHIVED',
    },
  });

  // Invalidate cache
  deleteCache(`billing-summary:${id}`);

  return project;
};

export const getBillingSummary = async (projectId: string) => {
  // Check cache first
  const cacheKey = `billing-summary:${projectId}`;
  const cached = getCached<any>(cacheKey);
  if (cached) {
    return cached;
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      timeLogs: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!project) {
    throw new Error('Project not found');
  }

  // Calculate totals
  const totalHours = project.timeLogs.reduce(
    (sum: number, log: { hours: string }) => sum + Number(log.hours),
    0
  );
  const totalAmount = totalHours * Number(project.billingRate);

  // Group by user
  const hoursByUser: Record<string, { name: string; hours: number }> = {};
  project.timeLogs.forEach((log: { hours: string; userId: string; user: { name: string } }) => {
    if (!hoursByUser[log.userId]) {
      hoursByUser[log.userId] = { name: log.user.name, hours: 0 };
    }
    hoursByUser[log.userId].hours += Number(log.hours);
  });

  // Group by date
  const hoursByDate: Record<string, number> = {};
  project.timeLogs.forEach((log: { hours: string; logDate: string }) => {
    const date = new Date(log.logDate).toISOString().split('T')[0];
    hoursByDate[date] = (hoursByDate[date] || 0) + Number(log.hours);
  });

  const result = {
    projectId: project.id,
    projectName: project.name,
    billingRate: Number(project.billingRate),
    totalHours,
    totalAmount,
    hoursByUser: Object.values(hoursByUser),
    hoursByDate,
    timeLogCount: project.timeLogs.length,
  };

  // Cache the result
  setCache(cacheKey, result);

  return result;
};

export default {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  archiveProject,
  getBillingSummary,
};
