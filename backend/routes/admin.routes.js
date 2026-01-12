import express from 'express';
import { getAllUsers, updateUserStatus, deleteUser, getStats } from '../controllers/admin.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/role.middleware.js';

const router = express.Router();

router.use(authMiddleware, adminOnly);

router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/stats', getStats);

export default router;
