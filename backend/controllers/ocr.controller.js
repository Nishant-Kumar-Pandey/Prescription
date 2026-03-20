import Tesseract from 'tesseract.js';
import path from 'path';
import fs from 'fs';
import { explainPrescription as aiExplainPrescription, prepareTTSText } from '../services/ai.service.js';

/**
 * @desc    Analyze medical image (Prescription/License)
 * @route   POST /api/ocr/analyze
 * @access  Private
 */
export const analyzeImage = async (req, res) => {
    let worker;
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image file uploaded" });
        }

        const imagePath = req.file.path;
        console.log("Analyzing image at:", imagePath);

        // Initialize Tesseract worker with cache in /tmp for cloud environments
        worker = await Tesseract.createWorker('eng', 1, {
            langPath: fs.existsSync(path.join(process.cwd(), 'eng.traineddata')) ? process.cwd() : '/tmp',
            cachePath: '/tmp',
            logger: m => console.log(m)
        });

        const { data: { text, confidence } } = await worker.recognize(imagePath);
        
        // Clean up worker
        await worker.terminate();
        worker = null;

        // Simple parsing logic (can be expanded)
        const analysis = {
            rawText: text,
            detectedKeywords: [],
            isPrescription: text.toLowerCase().includes('rx') || text.toLowerCase().includes('prescription'),
            confidence: confidence
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
        // Clean up worker if it exists
        if (worker) {
            try { await worker.terminate(); } catch (e) {}
        }
        // Clean up file if it exists to avoid filling up disk on 500s
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            try { fs.unlinkSync(req.file.path); } catch (e) {}
        }
        res.status(500).json({ 
            message: "Failed to analyze image", 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
        });
    }
};

/**
 * @desc    Explain prescription using AI
 * @route   POST /api/ocr/explain
 * @access  Private
 */
export const explainPrescription = async (req, res) => {
    try {
        const { ocrText, language } = req.body;

        // Validate input
        if (!ocrText) {
            return res.status(400).json({
                message: "OCR text is required",
                valid: false,
                reason: "No text provided for analysis"
            });
        }

        // Create target language variable
        const targetLanguage = language || 'English';

        // Get AI explanation
        const explanation = await aiExplainPrescription(ocrText, targetLanguage);

        // Prepare TTS text (only explanation, general_advice, disclaimer)
        const ttsText = prepareTTSText(explanation, targetLanguage);

        // Return full explanation + TTS text
        res.json({
            ...explanation,
            language: targetLanguage,
            ttsText  // Field for frontend to send to Google TTS
        });

    } catch (error) {
        console.error("Prescription Explanation Error:", error);
        res.status(500).json({
            message: "Failed to explain prescription",
            error: error.message,
            valid: false
        });
    }
};
