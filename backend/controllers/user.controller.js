import User from "../models/user.model.js";
import Doctor from "../models/doctor.model.js";
import bcrypt from 'bcryptjs';

/**
 * @desc    Get current user profile
 * @route   GET /api/users/me
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            preferredLanguage: user.preferredLanguage,
            image: user.image,
            createdAt: user.createdAt
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.name = req.body.name || user.name;
        user.preferredLanguage = req.body.preferredLanguage || user.preferredLanguage;

        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }

        const updatedUser = await user.save();
        res.json({
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            preferredLanguage: updatedUser.preferredLanguage,
            image: updatedUser.image
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Upload profile picture
 * @route   POST /api/users/profile-pic
 * @access  Private
 */
export const uploadProfilePic = async (req, res) => {
    try {
        console.log("Upload Request Received");
        console.log("File:", req.file);
        console.log("User from Token:", req.user);

        if (!req.file) {
            console.log("No file in request");
            return res.status(400).json({ message: "No file uploaded" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            console.log("User not found in DB:", req.user.id);
            return res.status(404).json({ message: "User not found" });
        }

        const imagePath = `/uploads/${req.file.filename}`;
        user.image = imagePath;
        console.log("Saving user profile with image:", imagePath);
        await user.save();

        // If user is a doctor, update doctor profile image as well
        if (user.role === 'doctor') {
            console.log("Updating doctor profile image...");
            await Doctor.findOneAndUpdate({ userId: user._id }, { image: imagePath });
        }

        console.log("Profile update successful");
        res.json({
            message: "Profile picture updated successfully",
            image: imagePath
        });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: error.message });
    }
};
