import express from 'express';
import { createPrescription, getPrescriptions } from '../controllers/prescription.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   POST /api/prescriptions
 * @desc    Create/Save a new prescription explanation
 * @access  Private
 */
router.post('/', authMiddleware, createPrescription);

/**
 * @route   GET /api/prescriptions
 * @desc    Get all prescriptions for the logged-in user
 * @access  Private
 */
router.get('/', authMiddleware, getPrescriptions);

export default router;