import User from '../models/user.model.js';
import Doctor from '../models/doctor.model.js';
import Patient from '../models/patient.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendMail from './mail.controller.js';

// Signup controller
export const signup = async (req, res) => {
    try {
        console.log("Signup Request Body:", req.body);
        const {
            name, email, password, role, preferredLanguage,
            specialization, experience, licenseNumber,
            adminKey, verificationDocument, consultationFee
        } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email." });
        }

        // Role-specific validation
        if (role === 'doctor') {
            if (!specialization || !experience || !licenseNumber) {
                return res.status(400).json({ message: "Doctors must provide specialization, experience, and license number." });
            }
        }

        if (role === 'admin') {
            const secretAdminKey = process.env.ADMIN_SECRET_KEY || 'ADMIN_SECRET_KEY_123';
            if (adminKey !== secretAdminKey) {
                return res.status(403).json({ message: "Invalid Admin Key for registration." });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'patient',
            preferredLanguage: preferredLanguage || 'en',
            status: 'active'
        });

        // Create Doctor Profile if role is doctor
        if (role === 'doctor') {
            await Doctor.create({
                userId: user._id,
                name: user.name,
                specialization,
                experience,
                licenseNumber,
                rating: 0,
                languages: [preferredLanguage === 'hi' ? 'Hindi' : 'English'],
                availability: ['Mon-Fri 9AM-5PM'],
                image: '',
                consultationFee: consultationFee || 500,
                maxPatientsPerDay: 10,
                verificationDocument: verificationDocument || ''
            });
        }

        // Create Patient Profile if role is patient
        if (role === 'patient' || !role) {
            const [first_name, ...last_name_parts] = name.split(' ');
            const last_name = last_name_parts.join(' ') || 'User';
            await Patient.create({
                userId: user._id,
                first_name,
                last_name,
                email: user.email,
                gender: 'Not Specified',
                age: 0,
                status: 'active'
            });
        }

        // Send Welcome Email
        try {
            await sendMail({
                to: email,
                subject: "Welcome to RxExplain AI!",
                text: `Hello ${name},\n\nThank you for joining RxExplain AI as a ${role || 'patient'}. Your account is now active.\n\nBest regards,\nThe RxExplain Team`
            });
        } catch (mailError) {
            console.error("Welcome mail failed:", mailError);
        }

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Check if user is banned
        if (user.status === 'banned') {
            return res.status(403).json({ message: "Your account has been banned. Please contact administration." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '30d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                preferredLanguage: user.preferredLanguage,
                status: user.status,
                image: user.image
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};