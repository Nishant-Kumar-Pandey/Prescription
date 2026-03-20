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
        try {
            console.log("Initializing Tesseract worker...");
            worker = await Tesseract.createWorker('eng', 1, {
                langPath: 'https://tessdata.projectnaptha.com/4.0.0_best',
                cachePath: '/tmp',
                logger: m => console.log(m)
            });
            console.log("Worker initialized successfully.");
        } catch (workerError) {
            console.error("Tesseract worker initialization failed:", workerError);
            return res.status(500).json({ 
                message: "OCR service initialization failed", 
                error: workerError.message,
                stack: process.env.NODE_ENV === 'development' ? workerError.stack : undefined
            });
        }

        try {
            console.log("Starting recognition...");
            const { data: { text, confidence } } = await worker.recognize(imagePath);
            console.log("Recognition complete. Confidence:", confidence);
            
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
            const commonMeds = ['paracetamol', 'amoxicillin', 'aspirin', 'ibuprofen', 'metformin'];
            analysis.detectedKeywords = commonMeds.filter(med => 
                text.toLowerCase().includes(med)
            );

            // Clean up uploaded file
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }

            res.json({ analysis });
        } catch (recogError) {
            console.error("Tesseract recognition failed:", recogError);
            if (worker) await worker.terminate();
            throw recogError; // Pass to outer catch
        }
    } catch (error) {
        console.error("OCR Error Details:", error);
        
        // Clean up worker if it exists
        if (worker) {
            try {
                await worker.terminate();
            } catch (tError) {
                console.error("Failed to terminate worker on error:", tError);
            }
        }

        // Clean up file
        if (req.file && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (fError) {
                console.error("Failed to delete file on error:", fError);
            }
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
