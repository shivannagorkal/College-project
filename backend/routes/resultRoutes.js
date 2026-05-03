import express from 'express';
import {
  getResults,
  createResult,
  updateResult,
  deleteResult,
} from '../controllers/resultController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getResults);
router.post('/', authMiddleware, createResult);
router.put('/:id', authMiddleware, updateResult);
router.delete('/:id', authMiddleware, deleteResult);

export default router;
