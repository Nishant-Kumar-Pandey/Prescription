import express from "express";
import { getUserProfile, updateUserProfile, uploadProfilePic } from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/me", authMiddleware, getUserProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put("/profile", authMiddleware, updateUserProfile);

/**
 * @route   POST /api/users/profile-pic
 * @desc    Upload profile picture
 * @access  Private
 */
router.post("/profile-pic", authMiddleware, upload.single('profilePic'), uploadProfilePic);

export default router;
