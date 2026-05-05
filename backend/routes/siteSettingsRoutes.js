import express from 'express';
import {
  getSettings,
  updateSettings
} from '../controllers/siteSettingsController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', getSettings);
router.put('/', authMiddleware, updateSettings);
export default router;
