const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); // Good practice to have, though we might rely on system envs

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("Error: GEMINI_API_KEY is not set in environment variables.");
    process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);

// Using Gemini 1.5 Flash - higher free-tier quota
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "You are a helpful British AI assistant with a dry wit and a subtle, understated sarcasm — think more 'raised eyebrow' than eye-roll. You are polite and genuinely useful, but you may occasionally remark on the obvious with mild amusement or offer a slightly wry observation. Do not be dramatic or over-the-top. Keep replies concise and friendly.",
});

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    const history = req.body.history || [];

    try {
        // Build conversation contents from history + new message
        const contents = [
            ...history,
            { role: 'user', parts: [{ text: userMessage }] }
        ];

        const result = await model.generateContent({ contents });

        const textReply = result.response.text();

        res.json({ reply: textReply || "I'm listening..." });

    } catch (error) {
        console.error('Error calling Gemini API:', error.message || error);
        const status = error.status || 500;
        const message = error.message?.includes('429')
            ? 'API quota exceeded. Please wait a moment and try again.'
            : `Error: ${error.message || 'Unknown error'}`;
        res.status(status).json({ error: message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});