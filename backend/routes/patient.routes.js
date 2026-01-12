import express from 'express';
import { getPatients, getPatientById } from '../controllers/patient.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Note: In a real app, this should probably be restricted to Doctors and Admins
/**
 * @route   GET /api/patients
 * @desc    Get all patients
 * @access  Private
 */
router.get('/', authMiddleware, getPatients);

/**
 * @route   GET /api/patients/:id
 * @desc    Get patient by ID
 * @access  Private
 */
router.get('/:id', authMiddleware, getPatientById);

export default router;