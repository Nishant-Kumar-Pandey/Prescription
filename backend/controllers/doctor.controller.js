import Doctor from "../models/doctor.model.js";

export const getDoctors = async (req, res) => {
    try {
        const { search, specialization } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { specialization: { $regex: search, $options: "i" } }
            ];
        }

        if (specialization && specialization !== "All") {
            query.specialization = specialization;
        }

        const doctors = await Doctor.find(query);

        // Map to ensure frontend gets 'id' instead of just '_id' if needed
        const formattedDoctors = doctors.map(doc => ({
            ...doc._doc,
            id: doc._id
        }));

        res.json(formattedDoctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        res.json({ ...doctor._doc, id: doctor._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};