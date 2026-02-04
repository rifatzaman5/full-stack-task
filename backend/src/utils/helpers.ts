import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Response } from 'express';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (payload: {
  id: string;
  email: string;
  role: string;
}): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const verifyToken = (token: string): {
  id: string;
  email: string;
  role: string;
} | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: string;
    };
  } catch {
    return null;
  }
};

export const sendResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any
): void => {
  res.status(statusCode).json({ message, ...(data && { data }) });
};

export const formatDate = (date: Date): string => {
  return new Date(date).toISOString().split('T')[0];
};
