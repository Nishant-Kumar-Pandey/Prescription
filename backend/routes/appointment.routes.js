import express from 'express';
import {
    bookAppointment,
    getAppointments,
    cancelAppointment
} from '../controllers/appointment.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   POST /api/appointments
 * @desc    Book a new appointment
 * @access  Private
 */
router.post('/', authMiddleware, bookAppointment);

/**
 * @route   GET /api/appointments
 * @desc    Get all appointments for the logged-in user
 * @access  Private
 */
router.get('/', authMiddleware, getAppointments);

/**
 * @route   PUT /api/appointments/:id/cancel
 * @desc    Cancel an appointment
 * @access  Private
 */
router.put('/:id/cancel', authMiddleware, cancelAppointment);

export default router;