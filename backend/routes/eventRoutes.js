import express from 'express';
import { body } from 'express-validator';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getAllEvents);
router.get('/:id', getEventById);

router.post(
  '/',
  authMiddleware,
  upload.single('image'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('date').notEmpty().withMessage('Date is required'),
  ],
  createEvent
);

router.put(
  '/:id',
  authMiddleware,
  upload.single('image'),
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  ],
  updateEvent
);

router.delete('/:id', authMiddleware, deleteEvent);

export default router;
