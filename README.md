# Voice-Enabled Gemini Agent

This project transforms a simple chatbot into a voice-enabled Agent using Gemini 2.0 Flash features.

## Features
### 1. Backend (`server.js`)
- Integrated `@google/generative-ai` SDK.
- Configured `gemini-2.0-flash-exp` model.
- Enabled `response_modalities: ["TEXT", "AUDIO"]` to receive native audio from Gemini.
- Backend now returns both text and a base64 audio string.

### 2. Frontend (`public/`)
- **Agent UI**: Replaced the simple form with a "Visualizer Orb" that pulses when listening and speaking.
- **Voice Logic**: Implemented `SpeechRecognition` to capture user voice, and `Audio` API to play Gemini's response.
- **Dark Mode**: Applied a premium dark aesthetics with animations.

## How to Run
1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start the Server**:
    ```bash
    npm start
    ```
3.  **Open Browser**: Go to `http://localhost:3000`.
4.  **Permissions**: Allow Microphone access when prompted.
5.  **Interact**:
    - Click the **Microphone Icon**.
    - Speak to the agent (e.g., "Tell me a joke").
    - **Watch**: The orb will change state (Listening -> Thinking -> Speaking).
    - **Listen**: You will hear Gemini's voice response.

## Visualization Of States
- **Idle**: Pulsing Blue Orb.
- **Listening**: Red Glow, Active Pulse.
- **Thinking**: Fast White Spin.
- **Speaking**: Ripple Effect.

> [!NOTE]
> Ensure you have your `GEMINI_API_KEY` set correctly in the environment or `server.js` (currently hardcoded for demo).
