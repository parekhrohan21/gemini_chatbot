"""Configuration settings for the Gemini chatbot"""

# Gemini Model Settings
MODEL_NAME = "gemini-3.0-pro-exp"
TTS_MODEL_NAME = "gemini-2.0-flash-tts"

# Voice Settings
VOICE_RATE = 175  # Speech rate (words per minute)
VOICE_VOLUME = 0.9  # Volume level (0.0 to 1.0)
VOICE_ID = 1  # 0 = male, 1 = female (system dependent)

# Available Gemini TTS voices
GEMINI_VOICES = [
    "Puck",      # Default cheerful voice
    "Charon",    # Deep authoritative voice
    "Kore",      # Warm friendly voice
    "Fenrir",    # Energetic voice
    "Aoede"      # Calm professional voice
]

# Chat Settings
MAX_HISTORY_LENGTH = 50  # Maximum conversation history to maintain
GREETING_MESSAGE = "Hello! I'm your Gemini speaking assistant. How can I help you today?"
FAREWELL_MESSAGE = "Goodbye! Have a great day!"

# Audio Settings
SAMPLE_RATE = 24000
CHANNELS = 1
SAMPLE_WIDTH = 2
