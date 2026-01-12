import Appointment from "../models/appointment.model.js";
import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import sendMail from "./mail.controller.js";
import User from "../models/user.model.js";

/**
 * @desc    Create Razorpay Order
 * @route   POST /api/payments/create-order
 * @access  Private
 */
export const createOrder = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        const platformFee = 49;
        const totalAmountRupees = appointment.amount + platformFee;
        const amountInPaise = totalAmountRupees * 100;

        const options = {
            amount: amountInPaise,
            currency: "INR",
            receipt: `receipt_${appointment._id}`,
        };

        console.log(`Creating Razorpay Order for Appointment ${appointmentId}. Total: ₹${totalAmountRupees} (${amountInPaise} paise)`);

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        res.status(500).json({
            message: "Razorpay order creation failed",
            error: error.description || error.message || "Internal Server Error",
            details: error
        });
    }
};

/**
 * @desc    Verify Razorpay Payment
 * @route   POST /api/payments/verify
 * @access  Private
 */
export const verifyPayment = async (req, res) => {
    try {
        const {
            appointmentId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        // Verify signature
        const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'DUMMY_SECRET_KEY');
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generatedSignature = hmac.digest("hex");

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (generatedSignature === razorpay_signature) {
            appointment.paymentStatus = 'paid';
            appointment.paymentId = razorpay_payment_id;
            appointment.status = 'scheduled';
            await appointment.save();

            await appointment.save();

            // Send Confirmation Email
            try {
                const user = await User.findById(appointment.userId);
                if (user) {
                    await sendMail({
                        to: user.email,
                        subject: "Appointment Confirmed - RxExplain AI",
                        text: `Hello ${user.name},\n\nYour appointment for ${appointment.date} at ${appointment.time} has been confirmed. Thank you for your payment.\n\nBest regards,\nThe RxExplain Team`
                    });
                }
            } catch (mailError) {
                console.error("Payment confirmation mail failed:", mailError);
            }

            res.json({
                success: true,
                message: "Payment verified and appointment confirmed",
                appointment
            });
        } else {
            appointment.paymentStatus = 'failed';
            await appointment.save();
            res.status(400).json({ success: false, message: "Invalid signature, payment verification failed" });
        }
    } catch (error) {
        console.error("Payment Verification Error:", error);
        res.status(500).json({ message: error.message });
    }
};
