# Deployment Guide

To make your Voice Agent live and accessible on the web, you need to deploy it to a cloud hosting provider. Since this is a Node.js Express application, platforms like **Render**, **Railway**, or **Heroku** are ideal.

## distinct Choice: Render (Free Tier Available)
We recommend **Render** for the easiest setup.

### Prerequisites
1.  Push your latest code to GitHub (you have already done this).
2.  Have your `GEMINI_API_KEY` ready.

### Steps
1.  **Sign Up**: Go to [render.com](https://render.com) and sign up with GitHub.
2.  **New Web Service**: Click "New +" and select "Web Service".
3.  **Connect Repo**: Select your `gemini_chatbot` repository from the list.
4.  **Configure**:
    - **Name**: `gemini-voice-agent` (or similar)
    - **Region**: Closest to you (e.g., Oregon, Frankfurt)
    - **Branch**: `main`
    - **Runtime**: `Node`
    - **Build Command**: `npm install`
    - **Start Command**: `node server.js`
5.  **Environment Variables** (Crucial!):
    - Scroll down to "Environment Variables".
    - Add Key: `GEMINI_API_KEY`
    - Add Value: `AIzaSy...` (Your actual API key)
    - *Note*: You typically shouldn't commit keys to code, but since we used env vars in `server.js` (`process.env.GEMINI_API_KEY`), this will work perfectly.
6.  **Deploy**: Click "Create Web Service".

Render will build your app and give you a URL like `https://gemini-voice-agent.onrender.com`.

## Alternative: Local Tunnel (Quick Testing)
If you just want to show a friend quickly without deploying:
1.  Install **ngrok**: `npm install -g ngrok`
2.  Start your app: `npm start`
3.  In a new terminal: `ngrok http 3000`
4.  Share the `https://...` link ngrok generates.

## Important Note on API Keys
In `server.js`, we have a hardcoded key as a fallback. **Before deploying**, it is best practice to remove the hardcoded key and rely ONLY on `process.env.GEMINI_API_KEY` to prevent others from stealing your quota.

### Update `server.js` snippet:
```javascript
// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY; // REMOVE the hardcoded string
if (!apiKey) {
    console.error("Error: GEMINI_API_KEY is missing!");
    process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);
```
