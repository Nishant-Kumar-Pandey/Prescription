import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../models/user.model.js';
import Doctor from '../models/doctor.model.js';
import Patient from '../models/patient.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Doctor.deleteMany();
        await Patient.deleteMany();
        await User.deleteMany({ role: { $in: ['doctor', 'patient'] } });

        const doctorsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'doctors.json'), 'utf-8'));
        const patientsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'patients.json'), 'utf-8'));

        // Hash a default password for all dummy doctors
        const hashedPassword = await bcrypt.hash('Doctor@123', 10);

        const doctorsToCreate = [];
        const usersToCreate = [];

        // Limit to 50 doctors for initial seed to keep it manageable
        const sampleDoctors = doctorsData.slice(0, 50);

        for (const doc of sampleDoctors) {
            const email = doc.email || `${doc.first_name.toLowerCase()}.${doc.last_name.toLowerCase()}@hospital.com`;

            const user = new User({
                name: `${doc.first_name} ${doc.last_name}`,
                email: email,
                password: hashedPassword,
                role: 'doctor',
                status: 'active',
                preferredLanguage: 'en'
            });

            usersToCreate.push(user);

            const doctorProfile = {
                userId: user._id,
                name: user.name,
                specialization: doc.specialty || 'General Medicine',
                experience: Math.floor(Math.random() * 20) + 5,
                licenseNumber: `LIC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
                languages: ['English', 'Hindi'],
                availability: ['Mon-Fri 10AM-4PM'],
                image: `https://i.pravatar.cc/150?u=${email}`,
                consultationFee: [500, 600, 800, 1000, 1200][Math.floor(Math.random() * 5)],
                maxPatientsPerDay: 15,
                verificationDocument: 'verified_auto.pdf'
            };

            doctorsToCreate.push(doctorProfile);
        }

        await User.insertMany(usersToCreate);
        await Doctor.insertMany(doctorsToCreate);

        console.log('Seeding Patients...');
        const patientsToCreate = [];
        const patientUsersToCreate = [];
        const samplePatients = patientsData.slice(0, 50);

        for (const pat of samplePatients) {
            const user = new User({
                name: `${pat.first_name} ${pat.last_name}`,
                email: pat.email,
                password: hashedPassword,
                role: 'patient',
                status: 'active',
                preferredLanguage: 'en'
            });
            patientUsersToCreate.push(user);

            patientsToCreate.push({
                userId: user._id,
                first_name: pat.first_name,
                last_name: pat.last_name,
                email: pat.email,
                gender: pat.gender,
                age: pat.age,
                date_of_birth: pat.date_of_birth,
                phone_number: pat.phone_number,
                address: pat.address,
                city: pat.city,
                state: pat.state,
                country: pat.country,
                blood_type: pat.blood_type,
                height: pat.height,
                weight: pat.weight,
                allergies: pat.allergies,
                medications: pat.medications,
                emergency_contact_relationship: pat.emergency_contact_relationship,
                primary_care_physician: pat.primary_care_physician,
                last_visit_date: pat.last_visit_date,
                next_appointment_date: pat.next_appointment_date
            });
        }

        await User.insertMany(patientUsersToCreate);
        await Patient.insertMany(patientsToCreate);

        console.log('Dummy Data Imported! (50 Doctors & 50 Patients Added)');
        process.exit();
    } catch (error) {
        console.error(`Error with data import: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await connectDB();
        await Doctor.deleteMany();
        await Patient.deleteMany();
        await User.deleteMany({ role: { $in: ['doctor', 'patient'] } });

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error with data destruction: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
