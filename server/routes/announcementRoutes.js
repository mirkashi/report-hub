import express from 'express';
import { body } from 'express-validator';
import {
  createAnnouncement,
  getAnnouncements,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  markAsRead,
} from '../controllers/announcementController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Validation rules
const createAnnouncementValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('type')
    .optional()
    .isIn(['general', 'urgent', 'event', 'policy'])
    .withMessage('Invalid type'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority'),
];

router.get('/', protect, getAnnouncements);
router.get('/:id', protect, getAnnouncement);
router.post(
  '/',
  protect,
  authorize('admin'),
  createAnnouncementValidation,
  validate,
  createAnnouncement
);
router.put('/:id', protect, authorize('admin'), updateAnnouncement);
router.delete('/:id', protect, authorize('admin'), deleteAnnouncement);
router.put('/:id/read', protect, markAsRead);

export default router;
