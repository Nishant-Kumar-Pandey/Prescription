import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: String,
    age: Number,
    dateOfBirth: String,
    phoneNumber: String,
    address: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    bloodType: String,
    height: Number,
    weight: Number,
    allergies: String,
    medications: String,
    emergencyContactRelationship: String,
    primaryCarePhysician: String,
    lastVisitDate: String,
    nextAppointmentDate: String,
    status: { type: String, enum: ['active', 'banned'], default: 'active' },
}, {
    timestamps: true
});

// Note: The 'id' and 'patient_id' from the JSON are redundant. Mongoose's '_id' will serve as the unique identifier.

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;