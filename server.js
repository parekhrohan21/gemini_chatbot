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

// Using Gemini 2.0 Flash - latest stable model
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
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
        console.error('Error calling Gemini API:', error);
        res.status(500).json({ error: 'Error processing your request' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});