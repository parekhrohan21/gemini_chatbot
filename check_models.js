const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        // Currently available models (as of 2025)
        const candidates = [
            "gemini-2.5-flash",
            "gemini-2.5-pro",
            "gemini-2.5-flash-lite",
            "gemini-3-flash-preview",
            "gemini-3-pro-preview",
            "gemini-2.0-flash",
            "gemini-2.0-flash-lite"
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
