import express from 'express';
import {
  getBoardResults,
  createBoardResult,
  updateBoardResult,
  deleteBoardResult,
} from '../controllers/boardResultController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', getBoardResults);
router.post('/', authMiddleware, createBoardResult);
router.put('/:id', authMiddleware, updateBoardResult);
router.delete('/:id', authMiddleware, deleteBoardResult);
export default router;
