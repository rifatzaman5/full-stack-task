import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  createTimeLog,
  getTimeLogsByProject,
  getTimeLogsByUser,
  getTimeLogById,
  updateTimeLog,
  updateTimeLogStatus,
  deleteTimeLog,
} from '../controllers/timeLogController';
import {
  timeLogValidation,
  validate,
} from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create time log
router.post(
  '/',
  timeLogValidation,
  validate,
  createTimeLog
);

// Get time logs
router.get('/project/:projectId', getTimeLogsByProject);
router.get('/user', getTimeLogsByUser);

// Get single time log
router.get('/:id', getTimeLogById);

// Update time log
router.put(
  '/:id',
  timeLogValidation,
  validate,
  updateTimeLog
);

// Update time log status (for drag & drop)
router.patch('/:id/status', updateTimeLogStatus);

// Delete time log
router.delete('/:id', deleteTimeLog);

export default router;
