import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

async function listModels() {
    try {
        const list = await genAI.getGenerativeModel({ model: "gemini-pro" }); // Dummy model to get model list if needed, but SDK usually has a separate method.
        // In newer SDKs, you might need to use a different approach to list but let's try gemini-pro first.
        console.log("Testing gemini-pro...");
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent("Say hello");
        const response = await result.response;
        console.log("gemini-pro Response:", response.text());
    } catch (error) {
        console.error("gemini-pro Error:", error);
    }
}

listModels();
