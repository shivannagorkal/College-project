import express from 'express';

import {
    getStudentsResult,
    createStudentResult,
    updateStudentsResult,
    deleteStudentsResult
} from '../controllers/StudentsResultController.js';

import authMiddleware from '../middleware/authMiddleware.js';

import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();


// GET ALL
router.get(
    '/',
    getStudentsResult
);


// CREATE
router.post(
    '/',
    authMiddleware,
    upload.single('studentImage'),
    createStudentResult
);


// UPDATE
router.put(
    '/:id',
    authMiddleware,
    upload.single('studentImage'),
    updateStudentsResult
);



// DELETE
router.delete(
    '/:id',
    authMiddleware,
    deleteStudentsResult
);

export default router;