import express from "express";
import { getDoctors, getDoctorById } from "../controllers/doctor.controller.js";

const router = express.Router();

/**
 * @route   GET /api/doctors
 * @desc    Get all doctors with optional search/specialization filter
 * @access  Public
 */
router.get("/", getDoctors);

/**
 * @route   GET /api/doctors/:id
 * @desc    Get doctor by ID
 * @access  Public
 */
router.get("/:id", getDoctorById);

export default router;