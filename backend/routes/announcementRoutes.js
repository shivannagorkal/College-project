import express from 'express';
import { body } from 'express-validator';
import {
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcementController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getAllAnnouncements);

router.post(
  '/',
  authMiddleware,
  upload.single('file'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('date').notEmpty().withMessage('Date is required'),
  ],
  createAnnouncement
);

router.put(
  '/:id',
  authMiddleware,
  upload.single('file'),
  [body('title').optional().notEmpty().withMessage('Title cannot be empty')],
  updateAnnouncement
);

router.delete('/:id', authMiddleware, deleteAnnouncement);

export default router;
