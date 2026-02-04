import { Response } from 'express';
import authService from '../services/authService';
import { AuthRequest } from '../middleware/auth';

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name, role } = req.body;
    const result = await authService.register({ email, password, name, role });
    res.status(201).json({ message: 'User registered successfully', ...result });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.status(200).json({ message: 'Login successful', ...result });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    const user = await authService.getUserById(req.user.id);
    res.status(200).json({ user });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};
