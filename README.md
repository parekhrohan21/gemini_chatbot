# 🤖 Gemini Chatbot

A voice-enabled AI chatbot powered by **Google Gemini 2.5 Flash Lite**, featuring a web interface with a visualiser orb and a Python CLI speaking assistant.

---

## Features

- **Web UI** — Chat via browser with a pulsing visualiser orb that reacts to conversation states (Idle → Listening → Thinking → Speaking)
- **Python CLI** — Terminal chatbot with native text-to-speech via `pyttsx3`
- **Gemini 2.5 Flash Lite** — Fast, efficient responses through the Gemini API
- **Secure API key handling** — Key loaded from `.env`, never hardcoded

---

## Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (3.8+)
- A **Gemini API key** (see below)

### 2. Get a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key — you'll need it in the next step

### 3. Clone the Repo

```bash
git clone https://github.com/parekhrohan21/gemini_chatbot.git
cd gemini_chatbot
```

### 4. Set Up Your API Key

Create a `.env` file in the root of the project:

```bash
cp .env.example .env
```

Then open `.env` and replace the placeholder with your actual key:

```
GEMINI_API_KEY=your_api_key_here
```

> [!IMPORTANT]
> Never share or commit your `.env` file. It is already listed in `.gitignore`.

---

## Running the Web Interface

```bash
npm install
npm start
```

Open your browser at `http://localhost:3000`.

**Orb States:**
| State | Appearance |
|---|---|
| Idle | Pulsing blue orb |
| Listening | Red glow, active pulse |
| Thinking | Fast white spin |
| Speaking | Ripple effect |

---

## Running the Python CLI Chatbot

```bash
pip install google-generativeai python-dotenv pyttsx3
python main.py
```

Type your message and press Enter. Say `quit`, `exit`, or `bye` to end the session.

---

## Project Structure

```
gemini_chatbot/
├── public/          # Frontend (HTML, JS, CSS)
├── server.js        # Express backend — handles Gemini API calls
├── main.py          # Python CLI chatbot with text-to-speech
├── .env.example     # Template for environment variables
├── .env             # Your local API key (gitignored)
└── package.json
```
