import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  register,
  login,
  getProfile,
} from '../controllers/authController';
import {
  registerValidation,
  loginValidation,
  validate,
} from '../middleware/validation';

const router = Router();

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);

// Protected routes
router.get('/profile', authenticate, getProfile);

export default router;
