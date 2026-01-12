import express from "express";
import { analyzeImage } from "../controllers/ocr.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/ocr/analyze
 * @desc    Analyze uploaded medical image
 * @access  Private
 */
router.post("/analyze", authMiddleware, upload.single('medicalImage'), analyzeImage);

export default router;
