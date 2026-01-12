import Tesseract from 'tesseract.js';
import path from 'path';
import fs from 'fs';

/**
 * @desc    Analyze medical image (Prescription/License)
 * @route   POST /api/ocr/analyze
 * @access  Private
 */
export const analyzeImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image file uploaded" });
        }

        const imagePath = req.file.path;

        // Perform OCR
        const result = await Tesseract.recognize(
            imagePath,
            'eng',
            { logger: m => console.log(m) }
        );

        const text = result.data.text;

        // Simple parsing logic (can be expanded)
        const analysis = {
            rawText: text,
            detectedKeywords: [],
            isPrescription: text.toLowerCase().includes('rx') || text.toLowerCase().includes('prescription'),
            confidence: result.data.confidence
        };

        // Example keyword detection
        const keywords = ['mg', 'tablet', 'capsule', 'daily', 'twice', 'medical', 'license'];
        keywords.forEach(word => {
            if (text.toLowerCase().includes(word)) {
                analysis.detectedKeywords.push(word);
            }
        });

        // Cleanup: remove file after analysis if it was a temp upload (optional)
        // For now, let's keep it in uploads but maybe use a separate folder later

        res.json({
            message: "Image analyzed successfully",
            analysis
        });

    } catch (error) {
        console.error("OCR Error:", error);
        res.status(500).json({ message: "Failed to analyze image", error: error.message });
    }
};
