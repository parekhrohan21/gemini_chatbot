const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // Note: getGenerativeModel doesn't validate existence, but we can't "list" models easily with the high-level SDK unless we use the model manager if available in this SDK version.
        // The node SDK usually doesn't have a listModels method exposed on the main class easily in all versions.
        // But let's try a direct fetch if needed, or just try a basic generation on a few known candidate names.

        // Actually, let's just try to generate content with a few different names and see which one doesn't 404.
        const candidates = [
            "gemini-1.5-flash-001",
            "gemini-1.5-flash-002",
            "gemini-1.5-flash-latest",
            "gemini-1.5-pro",
            "gemini-pro"
        ];

        for (const name of candidates) {
            console.log(`Checking ${name}...`);
            try {
                const m = genAI.getGenerativeModel({ model: name });
                await m.generateContent("Hello");
                console.log(`SUCCESS: ${name} is valid.`);
            } catch (e) {
                console.log(`FAILED: ${name} - ${e.message}`);
            }
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

listModels();
