import express from 'express';
import {
  getCompetitiveResults,
  createCompetitiveResult,
  updateCompetitiveResult,
  deleteCompetitiveResult,
} from '../controllers/competitiveResultController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', getCompetitiveResults);
router.post('/', authMiddleware, createCompetitiveResult);
router.put('/:id', authMiddleware, updateCompetitiveResult);
router.delete('/:id', authMiddleware, deleteCompetitiveResult);
export default router;
