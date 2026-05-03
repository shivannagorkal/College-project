import express from 'express';
import { body } from 'express-validator';
import {
  getAllGallery,
  uploadGalleryImage,
  deleteGalleryImage,
} from '../controllers/galleryController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getAllGallery);

router.post(
  '/',
  authMiddleware,
  upload.single('image'),
  [body('title').notEmpty().withMessage('Title is required')],
  uploadGalleryImage
);

router.delete('/:id', authMiddleware, deleteGalleryImage);

export default router;
