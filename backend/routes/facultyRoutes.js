import express from 'express';
import { body } from 'express-validator';
import {
  getAllFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} from '../controllers/facultyController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getAllFaculty);

router.post(
  '/',
  authMiddleware,
  upload.single('photo'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
  ],
  createFaculty
);

router.put(
  '/:id',
  authMiddleware,
  upload.single('photo'),
  [body('name').optional().notEmpty().withMessage('Name cannot be empty')],
  updateFaculty
);

router.delete('/:id', authMiddleware, deleteFaculty);

export default router;
