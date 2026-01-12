import express from 'express';
import { createOrder, verifyPayment } from '../controllers/payment.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.get('/config', (req, res) => {
    res.json({ razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_RxnV2h4dugjt6N' });
});

export default router;
