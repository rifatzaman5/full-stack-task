import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';

// Validation rules for user registration
export const registerValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
];

// Validation rules for login
export const loginValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Validation rules for project creation/update
export const projectValidation: ValidationChain[] = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Project name is required'),
  body('billingRate')
    .isFloat({ min: 0 })
    .withMessage('Billing rate must be a positive number'),
  body('description')
    .optional()
    .trim(),
];

// Validation rules for time log creation/update
export const timeLogValidation: ValidationChain[] = [
  body('hours')
    .isFloat({ min: 0.5, max: 12 })
    .withMessage('Hours must be between 0.5 and 12'),
  body('notes')
    .optional()
    .trim(),
  body('logDate')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('status')
    .isIn(['TODO', 'IN_PROGRESS', 'DONE'])
    .withMessage('Invalid status'),
  body('projectId')
    .isUUID()
    .withMessage('Invalid project ID'),
];

// Middleware to check validation results
export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};
