const outputDiv = document.getElementById('output');
const visualizerContainer = document.getElementById('visualizer-container');
const visualizer = document.getElementById('visualizer');
const orbStatus = document.getElementById('orb-status');
const micButton = document.getElementById('mic-button');
const muteButton = document.getElementById('mute-button');

let recognition;
let isListening = false;
let isMuted = false;
let audioContext, analyser, dataArray;
let currentUtterance = null;
let conversationHistory = [];

// ──────────────────────────────────────────
// Visualizer
// ──────────────────────────────────────────
function initVisualizer() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
}

function setOrbState(state) {
    // Remove all states from both elements
    ['active', 'thinking', 'speaking'].forEach(s => {
        visualizer.classList.remove(s);
        visualizerContainer.classList.remove(`state-${s}`);
    });
    visualizerContainer.classList.remove('state-listening');

    if (!state) {
        orbStatus.textContent = '';
        return;
    }

    if (state === 'listening') {
        visualizer.classList.add('active');
        visualizerContainer.classList.add('state-listening');
        orbStatus.textContent = 'Listening...';
    } else if (state === 'thinking') {
        visualizer.classList.add('thinking');
        visualizerContainer.classList.add('state-thinking');
        orbStatus.textContent = 'Processing...';
    } else if (state === 'speaking') {
        visualizer.classList.add('speaking');
        visualizerContainer.classList.add('state-speaking');
        orbStatus.textContent = 'Speaking...';
    }
}

function updateVisualizer(isActive) {
    if (!visualizer) return;
    if (isActive) {
        setOrbState('listening');
    } else {
        setOrbState(null);
    }
}

function setSpeakingState(speaking) {
    if (speaking) {
        setOrbState('speaking');
    } else {
        setOrbState(null);
    }
}

// ──────────────────────────────────────────
// Text-to-Speech (Web Speech API)
// ──────────────────────────────────────────
function speakText(text) {
    if (!window.speechSynthesis) {
        console.warn('SpeechSynthesis not supported in this browser.');
        return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    if (isMuted) return;

    // Strip markdown-style symbols for cleaner speech
    const cleanText = text
        .replace(/\*\*(.*?)\*\*/g, '$1')   // bold
        .replace(/\*(.*?)\*/g, '$1')        // italic
        .replace(/#+\s/g, '')               // headings
        .replace(/`([^`]+)`/g, '$1')        // inline code
        .replace(/\n/g, ' ')               // newlines
        .trim();

    currentUtterance = new SpeechSynthesisUtterance(cleanText);
    currentUtterance.lang = 'en-GB';
    currentUtterance.volume = 1.0;

    // Prefer British English female voices
    const voices = window.speechSynthesis.getVoices();
    const preferred =
        voices.find(v => v.name === 'Google UK English Female') ||
        voices.find(v => v.name.toLowerCase().includes('female') && v.lang === 'en-GB') ||
        voices.find(v => v.lang === 'en-GB') ||
        voices.find(v => v.lang.startsWith('en-GB')) ||
        voices.find(v => v.lang.startsWith('en'));
    if (preferred) currentUtterance.voice = preferred;

    // Slightly slower, deliberate pace — suits a dry British delivery
    currentUtterance.rate = 0.93;
    currentUtterance.pitch = 1.0;

    currentUtterance.onstart = () => setSpeakingState(true);
    currentUtterance.onend = () => setSpeakingState(false);
    currentUtterance.onerror = () => setSpeakingState(false);

    window.speechSynthesis.speak(currentUtterance);
}

// Load voices (Chrome loads them async)
if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => { /* voices loaded */ };
}

// ──────────────────────────────────────────
// Mute Toggle
// ──────────────────────────────────────────
if (muteButton) {
    muteButton.addEventListener('click', () => {
        isMuted = !isMuted;
        muteButton.textContent = isMuted ? '🔇' : '🔊';
        muteButton.title = isMuted ? 'Unmute voice' : 'Mute voice';
        if (isMuted && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setSpeakingState(false);
        }
    });
}

// ──────────────────────────────────────────
// Speech Recognition
// ──────────────────────────────────────────
function setupRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        outputDiv.innerHTML = "⚠️ Speech Recognition not supported. Try Chrome or Edge.";
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        isListening = true;
        micButton.classList.add('listening');
        updateVisualizer(true);
        outputDiv.textContent = "Listening...";
        // Stop any ongoing TTS when user starts speaking
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        setSpeakingState(false);
    };

    recognition.onend = () => {
        isListening = false;
        micButton.classList.remove('listening');
    };

    recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        outputDiv.textContent = `You: ${transcript}`;
        setOrbState('thinking');
        await sendToGemini(transcript);
    };

    recognition.onerror = (event) => {
        outputDiv.textContent = `Error: ${event.error}`;
        micButton.classList.remove('listening');
        updateVisualizer(false);
    };
}

// ──────────────────────────────────────────
// Gemini API Call
// ──────────────────────────────────────────
async function sendToGemini(text) {
    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, history: conversationHistory })
        });

        const data = await response.json();
        setOrbState(null);

        if (data.error) {
            outputDiv.innerHTML = `<div style="color:#e05c5c;">⚠️ ${data.error}</div>`;
            return;
        }

        if (data.reply) {
            // Update conversation history with this exchange
            conversationHistory.push({ role: 'user', parts: [{ text: text }] });
            conversationHistory.push({ role: 'model', parts: [{ text: data.reply }] });

            outputDiv.innerHTML = `<div><b>Gemini:</b> ${data.reply}</div>`;
            speakText(data.reply);
        }

    } catch (error) {
        console.error('Error:', error);
        outputDiv.textContent = "Error communicating with Gemini.";
        setOrbState(null);
    }
}

// ──────────────────────────────────────────
// Mic Button
// ──────────────────────────────────────────
micButton.addEventListener('click', () => {
    if (!recognition) setupRecognition();
    if (isListening) {
        recognition.stop();
    } else {
        recognition.start();
    }
});

// Initial setup
outputDiv.textContent = "Click the microphone to start chatting.";
initVisualizer();
