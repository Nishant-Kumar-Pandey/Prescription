import express from "express";
import { analyzeImage, explainPrescription } from "../controllers/ocr.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/ocr/analyze
 * @desc    Analyze uploaded medical image
 * @access  Private
 */
router.post("/analyze", authMiddleware, upload.single('medicalImage'), analyzeImage);

/**
 * @route   POST /api/ocr/explain
 * @desc    Explain prescription using AI
 * @access  Private
 */
router.post("/explain", authMiddleware, explainPrescription);

export default router;
