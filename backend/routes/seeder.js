import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load Models
import Patient from '../models/patient.model.js';
import Doctor from '../models/Doctor.js';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Read JSON files
const patients = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'patients', 'PATIENTS_DATA(1).json'), 'utf-8')
);

const doctors = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'doctors', 'DOC_DATA(1).json'), 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    await Patient.deleteMany();
    await Doctor.deleteMany();
    await Patient.insertMany(patients);
    await Doctor.insertMany(doctors);
    console.log('Data successfully imported!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Patient.deleteMany();
    await Doctor.deleteMany();
    console.log('Data successfully destroyed!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}