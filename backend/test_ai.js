import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

async function test() {
    try {
        console.log("Testing API Key:", process.env.GOOGLE_AI_API_KEY ? "Present" : "Missing");
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent("Say hello");
        const response = await result.response;
        console.log("Response:", response.text());
    } catch (error) {
        console.error("Test Error:", error);
    }
}

test();
