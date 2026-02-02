import dotenv from 'dotenv';
dotenv.config();

async function findModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_AI_API_KEY}`);
        const data = await response.json();
        const models = data.models || [];

        console.log("Searching for Gemini models...");
        const filtered = models.filter(m => m.name.includes('gemini'));
        filtered.forEach(m => {
            console.log(`- ${m.name} (${m.displayName})`);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

findModels();
