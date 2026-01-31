import express from 'express';
import { body } from 'express-validator';
import {
  createReport,
  getReports,
  getReport,
  updateReport,
  deleteReport,
  submitReport,
  reviewReport,
  getReportStats,
} from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Validation rules
const createReportValidation = [
  body('type').isIn(['daily', 'weekly']).withMessage('Type must be daily or weekly'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('tasks').isArray({ min: 1 }).withMessage('At least one task is required'),
  body('tasks.*.description').trim().notEmpty().withMessage('Task description is required'),
  body('tasks.*.duration').isNumeric().withMessage('Task duration must be a number'),
];

const updateReportValidation = [
  body('tasks').optional().isArray().withMessage('Tasks must be an array'),
  body('status')
    .optional()
    .isIn(['draft', 'submitted', 'approved', 'rejected'])
    .withMessage('Invalid status'),
];

const reviewValidation = [
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
  body('reviewNotes').optional().trim(),
];

router.get('/stats', protect, getReportStats);
router.post('/', protect, createReportValidation, validate, createReport);
router.get('/', protect, getReports);
router.get('/:id', protect, getReport);
router.put('/:id', protect, updateReportValidation, validate, updateReport);
router.delete('/:id', protect, deleteReport);
router.put('/:id/submit', protect, submitReport);
router.put('/:id/review', protect, authorize('admin'), reviewValidation, validate, reviewReport);

export default router;
