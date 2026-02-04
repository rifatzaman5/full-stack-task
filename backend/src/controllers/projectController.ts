import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import projectService from '../services/projectService';

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    const { name, description, billingRate } = req.body;
    const project = await projectService.createProject({
      name,
      description,
      billingRate: parseFloat(billingRate),
      userId: req.user.id,
    });
    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    const projects = await projectService.getProjects(req.user.id, req.user.role);
    res.status(200).json({ projects });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const project = await projectService.getProjectById(id);
    res.status(200).json({ project });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, billingRate, status } = req.body;
    const project = await projectService.updateProject(id, {
      name,
      description,
      billingRate: billingRate ? parseFloat(billingRate) : undefined,
      status,
    });
    res.status(200).json({ message: 'Project updated successfully', project });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const archiveProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const project = await projectService.archiveProject(id);
    res.status(200).json({ message: 'Project archived successfully', project });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getBillingSummary = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const summary = await projectService.getBillingSummary(id);
    res.status(200).json({ summary });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};
