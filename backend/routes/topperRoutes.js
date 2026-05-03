import express from 'express';
import { body } from 'express-validator';
import {
  getAllToppers,
  createTopper,
  updateTopper,
  deleteTopper,
} from '../controllers/topperController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getAllToppers);

router.post(
  '/',
  authMiddleware,
  upload.single('photo'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('year').notEmpty().withMessage('Year is required'),
  ],
  createTopper
);

router.put(
  '/:id',
  authMiddleware,
  upload.single('photo'),
  [body('name').optional().notEmpty().withMessage('Name cannot be empty')],
  updateTopper
);

router.delete('/:id', authMiddleware, deleteTopper);

export default router;
