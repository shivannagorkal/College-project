import express from 'express';
import { body } from 'express-validator';
import {
  submitAdmission,
  getAllAdmissions,
  updateAdmissionStatus,
} from '../controllers/admissionController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
  ],
  submitAdmission
);

router.get('/', authMiddleware, getAllAdmissions);

router.put(
  '/:id',
  authMiddleware,
  [body('status').notEmpty().withMessage('Status is required')],
  updateAdmissionStatus
);

export default router;
