import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
   date: { type: String, required: true }, // Format: YYYY-MM-DD
   time: { type: String, required: true }, // Format: HH:MM
   status: { type: String, enum: ['scheduled', 'completed', 'canceled'], default: 'scheduled' },
   paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
   paymentId: { type: String },
   amount: { type: Number, required: true }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;