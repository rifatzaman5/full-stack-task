import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  archiveProject,
  getBillingSummary,
} from '../controllers/projectController';
import {
  projectValidation,
  validate,
} from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Admin only routes
router.post(
  '/',
  authorize('ADMIN'),
  projectValidation,
  validate,
  createProject
);
router.put(
  '/:id',
  authorize('ADMIN'),
  projectValidation,
  validate,
  updateProject
);
router.patch('/:id/archive', authorize('ADMIN'), archiveProject);

// All authenticated routes
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.get('/:id/billing-summary', getBillingSummary);

export default router;
