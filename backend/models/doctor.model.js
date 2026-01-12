import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    licenseNumber: { type: String, required: true },
    rating: { type: Number, default: 0 },
    languages: { type: [String], default: ['English'] },
    availability: { type: [String], default: ['Mon-Fri 9AM-5PM'] },
    image: { type: String, default: '' },
    consultationFee: { type: Number, default: 500 },
    maxPatientsPerDay: { type: Number, default: 10 },
    verificationDocument: { type: String, default: '' },
}, { timestamps: true });

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;