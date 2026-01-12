import Prescription from "../models/prescription.model.js";

export const createPrescription = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Prescription content is required" });
    }

    const prescription = await Prescription.create({
      userId: req.user.id,
      content: content
    });

    res.status(201).json({
      message: "Prescription saved successfully",
      prescription: { ...prescription._doc, id: prescription._id }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    const formattedPrescriptions = prescriptions.map(p => ({
      ...p._doc,
      id: p._id
    }));

    res.json(formattedPrescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
