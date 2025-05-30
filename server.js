const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const GEMINI_API_KEY = 'AIzaSyBa9kXU0K6Qg36sNnoWgjEPbhpaH7if4hk';  // Replace with your real API key
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
// Note: Ensure you have the correct API key and model name
// for your use case.
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  try {
    const response = await axios.post(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      contents: [{ parts: [{ text: userMessage }] }]
    });
    const botReply = response.data.candidates[0].content.parts[0].text;
    res.json({ reply: botReply });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error calling Gemini API');
  }
});

app.use(express.static('public'));  // Serve frontend files

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
