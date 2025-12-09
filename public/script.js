const outputDiv = document.getElementById('output');
const visualizer = document.getElementById('visualizer');
const micButton = document.getElementById('mic-button');

let recognition;
let isListening = false;
let audioContext, analyser, dataArray, source;

function initVisualizer() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
}

function updateVisualizer(isActive) {
    if (!visualizer) return;

    if (isActive) {
        visualizer.classList.add('active');
        visualizer.classList.remove('speaking');
    } else {
        visualizer.classList.remove('active');
        visualizer.classList.remove('speaking');
    }
}

function setSpeakingState(speaking) {
    if (speaking) {
        visualizer.classList.add('speaking');
    } else {
        visualizer.classList.remove('speaking');
    }
}


function setupRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        outputDiv.innerHTML = "Speech Recognition not supported in this browser.";
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
    };

    recognition.onend = () => {
        isListening = false;
        micButton.classList.remove('listening');
        // Don't turn off visualizer immediately if we are going to process
    };

    recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        outputDiv.textContent = `You: ${transcript}`;
        updateVisualizer(false); // Stop listening anim
        visualizer.classList.add('thinking'); // Start thinking anim

        await sendToGemini(transcript);
    };

    recognition.onerror = (event) => {
        outputDiv.textContent = `Error: ${event.error}`;
        micButton.classList.remove('listening');
        updateVisualizer(false);
    };
}

async function sendToGemini(text) {
    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();
        visualizer.classList.remove('thinking');

        // Handle Text
        if (data.reply) {
            outputDiv.innerHTML = `<div><b>Gemini:</b> ${data.reply}</div>`;
        }

        // Handle Audio
        if (data.audio) {
            playAudio(data.audio);
        }

    } catch (error) {
        console.error('Error:', error);
        outputDiv.textContent = "Error communicating with Gemini.";
        visualizer.classList.remove('thinking');
    }
}

function playAudio(base64Audio) {
    const audioStr = "data:audio/wav;base64," + base64Audio;
    const audio = new Audio(audioStr);

    setSpeakingState(true);

    audio.onended = () => {
        setSpeakingState(false);
    };

    audio.play().catch(e => console.error("Playback error:", e));
}

micButton.addEventListener('click', () => {
    if (!recognition) setupRecognition();

    if (isListening) {
        recognition.stop();
    } else {
        recognition.start();
    }
});

// Initial greeting
outputDiv.textContent = "Click the microphone to start chatting.";
initVisualizer();
