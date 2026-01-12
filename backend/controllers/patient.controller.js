import Patient from '../models/patient.model.js';

/**
 * @desc    Get all patients
 * @route   GET /api/patients
 * @access  Private (Admin/Doctor only check in routes usually)
 */
export const getPatients = async (req, res) => {
    try {
        const patients = await Patient.find({});
        const formattedPatients = patients.map(p => ({
            ...p._doc,
            id: p._id
        }));
        res.json(formattedPatients);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

/**
 * @desc    Get patient by ID
 * @route   GET /api/patients/:id
 * @access  Private
 */
export const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.json({ ...patient._doc, id: patient._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};