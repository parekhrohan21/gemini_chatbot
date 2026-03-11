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

// Using Gemini 2.5 Flash - the latest available preview model
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
});

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        // Generate content (Text only for Flash model compatibility)
        const result = await model.generateContent({
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: "You are a helpful and charismatic AI agent. Reply to the following user message. Keep your answer concise but friendly." },
                        { text: userMessage }
                    ]
                }
            ],
            // generationConfig removed as audio is not supported on Flash
        });

        const response = result.response;
        const candidates = response.candidates;

        if (!candidates || candidates.length === 0) {
            throw new Error("No candidates returned");
        }

        const parts = candidates[0].content.parts;
        let textReply = "";
        let audioData = null;

        // Extract Text and Audio
        for (const part of parts) {
            if (part.text) {
                textReply += part.text;
            }
            if (part.inlineData && part.inlineData.mimeType.startsWith('audio')) {
                audioData = part.inlineData.data;
            }
        }

        res.json({
            reply: textReply || "I'm listening...",
            audio: audioData
        });

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({ error: 'Error processing your request' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});