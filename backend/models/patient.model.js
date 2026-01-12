import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: String,
    age: Number,
    date_of_birth: String,
    phone_number: String,
    address: String,
    city: String,
    state: String,
    postal_code: String,
    country: String,
    blood_type: String,
    height: Number,
    weight: Number,
    allergies: String,
    medications: String,
    emergency_contact_relationship: String,
    primary_care_physician: String,
    last_visit_date: String,
    next_appointment_date: String,
}, {
    timestamps: true
});

// Note: The 'id' and 'patient_id' from the JSON are redundant. Mongoose's '_id' will serve as the unique identifier.

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;