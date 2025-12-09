const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); // Good practice to have, though we might rely on system envs

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize Gemini API
const apiKey = 'AIzaSyBa9kXU0K6Qg36sNnoWgjEPbhpaH7if4hk'; // In production use process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(apiKey);

// We use the flash model which supports audio generation
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash-exp", 
});

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    
    try {
        // Generate content with audio modality
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
             generationConfig: {
                 responseModalities: ["TEXT", "AUDIO"],
                 speechConfig: {
                    voiceConfig: {
                      prebuiltVoiceConfig: {
                        voiceName: "Puck"
                      }
                    }
                 }
             }
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