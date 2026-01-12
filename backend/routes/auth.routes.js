import express from 'express';
import { signup, login } from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user (patient/doctor/admin)
 * @access  Public
 */
router.post('/signup', signup);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT
 * @access  Public
 */
router.post('/login', login);

export default router;