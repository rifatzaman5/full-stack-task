import prisma from '../config/database';
import { deleteCache } from '../utils/cache';

export interface CreateTimeLogInput {
  projectId: string;
  userId: string;
  hours: number;
  notes?: string;
  logDate: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

export interface UpdateTimeLogInput {
  hours?: number;
  notes?: string;
  logDate?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

export const checkDailyHoursLimit = async (
  userId: string,
  logDate: string,
  excludeLogId?: string
): Promise<boolean> => {
  const startOfDay = new Date(logDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(logDate);
  endOfDay.setHours(23, 59, 59, 999);

  const where: any = {
    userId,
    logDate: {
      gte: startOfDay,
      lte: endOfDay,
    },
  };

  if (excludeLogId) {
    where.id = { not: excludeLogId };
  }

  const totalHours = await prisma.timeLog.aggregate({
    where,
    _sum: {
      hours: true,
    },
  });

  const currentHours = Number(totalHours._sum.hours || 0);
  return currentHours < 12;
};

export const createTimeLog = async (input: CreateTimeLogInput) => {
  const { projectId, userId, hours, notes, logDate, status = 'TODO' } = input;

  // Check daily hours limit
  const canAdd = await checkDailyHoursLimit(userId, logDate);
  if (!canAdd) {
    throw new Error('Daily hours limit exceeded (max 12 hours)');
  }

  // Check if hours are positive
  if (hours <= 0) {
    throw new Error('Hours must be positive');
  }

  const timeLog = await prisma.timeLog.create({
    data: {
      projectId,
      userId,
      hours,
      notes,
      logDate: new Date(logDate),
      status,
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          billingRate: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // Invalidate billing summary cache
  deleteCache(`billing-summary:${projectId}`);

  return timeLog;
};

export const getTimeLogsByProject = async (projectId: string) => {
  const timeLogs = await prisma.timeLog.findMany({
    where: { projectId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return timeLogs;
};

export const getTimeLogsByUser = async (userId: string) => {
  const timeLogs = await prisma.timeLog.findMany({
    where: { userId },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return timeLogs;
};

export const getTimeLogById = async (id: string) => {
  const timeLog = await prisma.timeLog.findUnique({
    where: { id },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          billingRate: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!timeLog) {
    throw new Error('Time log not found');
  }

  return timeLog;
};

export const updateTimeLog = async (id: string, input: UpdateTimeLogInput) => {
  const { logDate, hours } = input;

  // If updating date or hours, check daily limit
  if (logDate || hours) {
    const existingLog = await prisma.timeLog.findUnique({
      where: { id },
    });

    if (existingLog) {
      const checkDate = logDate || existingLog.logDate.toISOString();
      const checkHours = hours || Number(existingLog.hours);

      const canAdd = await checkDailyHoursLimit(
        existingLog.userId,
        checkDate,
        id
      );
      if (!canAdd) {
        throw new Error('Daily hours limit exceeded (max 12 hours)');
      }
    }
  }

  const timeLog = await prisma.timeLog.update({
    where: { id },
    data: {
      ...input,
      logDate: logDate ? new Date(logDate) : undefined,
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          billingRate: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // Invalidate billing summary cache
  deleteCache(`billing-summary:${timeLog.projectId}`);

  return timeLog;
};

export const updateTimeLogStatus = async (
  id: string,
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
) => {
  const timeLog = await prisma.timeLog.update({
    where: { id },
    data: { status },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          billingRate: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // Invalidate billing summary cache
  deleteCache(`billing-summary:${timeLog.projectId}`);

  return timeLog;
};

export const deleteTimeLog = async (id: string) => {
  const timeLog = await prisma.timeLog.findUnique({
    where: { id },
  });

  if (!timeLog) {
    throw new Error('Time log not found');
  }

  await prisma.timeLog.delete({
    where: { id },
  });

  // Invalidate billing summary cache
  deleteCache(`billing-summary:${timeLog.projectId}`);

  return { message: 'Time log deleted successfully' };
};

export default {
  createTimeLog,
  getTimeLogsByProject,
  getTimeLogsByUser,
  getTimeLogById,
  updateTimeLog,
  updateTimeLogStatus,
  deleteTimeLog,
  checkDailyHoursLimit,
};
