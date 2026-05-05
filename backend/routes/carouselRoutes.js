import express from 'express';
import {
  getCarouselImages,
  uploadCarouselImage,
  deleteCarouselImage,
} from '../controllers/carouselController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();
router.get('/', getCarouselImages);
router.post(
  '/',
  authMiddleware,
  upload.single('image'),
  uploadCarouselImage
);
router.delete('/:id', authMiddleware, deleteCarouselImage);
export default router;
