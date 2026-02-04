import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import timeLogService from '../services/timeLogService';

export const createTimeLog = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    const { projectId, hours, notes, logDate, status } = req.body;
    const timeLog = await timeLogService.createTimeLog({
      projectId,
      userId: req.user.id,
      hours: parseFloat(hours),
      notes,
      logDate,
      status,
    });
    res.status(201).json({ message: 'Time log created successfully', timeLog });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getTimeLogsByProject = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const timeLogs = await timeLogService.getTimeLogsByProject(projectId);
    res.status(200).json({ timeLogs });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTimeLogsByUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    const timeLogs = await timeLogService.getTimeLogsByUser(req.user.id);
    res.status(200).json({ timeLogs });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTimeLogById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const timeLog = await timeLogService.getTimeLogById(id);
    res.status(200).json({ timeLog });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const updateTimeLog = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { hours, notes, logDate, status } = req.body;
    const timeLog = await timeLogService.updateTimeLog(id, {
      hours: hours ? parseFloat(hours) : undefined,
      notes,
      logDate,
      status,
    });
    res.status(200).json({ message: 'Time log updated successfully', timeLog });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTimeLogStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const timeLog = await timeLogService.updateTimeLogStatus(
      id,
      status as 'TODO' | 'IN_PROGRESS' | 'DONE'
    );
    res
      .status(200)
      .json({ message: 'Time log status updated successfully', timeLog });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTimeLog = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await timeLogService.deleteTimeLog(id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
