import Appointment from "../models/appointment.model.js";
import sendMail from "./mail.controller.js";
import User from "../models/user.model.js";
import Doctor from "../models/doctor.model.js";

export const bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, time } = req.body;
        if (!doctorId || !date || !time) {
            return res.status(400).json({ message: "Missing required fields: doctorId, date, time" });
        }

        // Check Doctor's limit for the day
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });

        const appointmentsCount = await Appointment.countDocuments({
            doctorId,
            date,
            status: { $ne: 'canceled' }
        });

        if (appointmentsCount >= doctor.maxPatientsPerDay) {
            return res.status(400).json({ message: "Doctor's limit for this day is reached. Please try another date." });
        }

        const appointment = await Appointment.create({
            userId: req.user.id,
            doctorId,
            date,
            time,
            status: 'scheduled',
            paymentStatus: 'pending', // Initially pending
            amount: doctor.consultationFee || 500
        });

        res.status(201).json({
            message: "Appointment created. Please complete payment to confirm.",
            appointment: { ...appointment._doc, id: appointment._id }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAppointments = async (req, res) => {
    try {
        const query = req.user.role === 'doctor'
            ? { doctorId: (await Doctor.findOne({ userId: req.user.id }))._id }
            : { userId: req.user.id };

        const appointments = await Appointment.find(query)
            .populate('doctorId', 'name specialization image consultationFee')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        const formattedAppointments = appointments.map(appt => ({
            ...appt._doc,
            id: appt._id
        }));

        res.json(formattedAppointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        // Authorization check
        if (appointment.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized to cancel this appointment" });
        }

        appointment.status = 'canceled';
        await appointment.save();

        res.json({
            message: "Appointment canceled successfully",
            appointment: { ...appointment._doc, id: appointment._id }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};