import express from 'express';
import { body } from 'express-validator';
import {
  getAllHistory,
  createHistory,
  updateHistory,
  deleteHistory,
} from '../controllers/historyController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getAllHistory);

router.post(
  '/',
  authMiddleware,
  upload.single('image'),
  [
    body('year').notEmpty().withMessage('Year is required'),
    body('title').notEmpty().withMessage('Title is required'),
  ],
  createHistory
);

router.put(
  '/:id',
  authMiddleware,
  upload.single('image'),
  [body('year').optional().notEmpty().withMessage('Year cannot be empty')],
  updateHistory
);

router.delete('/:id', authMiddleware, deleteHistory);

export default router;
