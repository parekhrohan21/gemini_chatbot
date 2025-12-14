import os
import google.generativeai as genai
from google.generativeai import types
from dotenv import load_dotenv
import wave

class GeminiNativeTTS:
    """Using Gemini's built-in TTS capabilities for speech generation"""
    
    def __init__(self):
        load_dotenv()
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found")
        
        genai.configure(api_key=api_key)
        
    def save_audio_to_wav(self, pcm_data, filename, sample_rate=24000, channels=1, sample_width=2):
        """Save PCM audio data to WAV file"""
        with wave.open(filename, 'wb') as wf:
            wf.setnchannels(channels)
            wf.setsampwidth(sample_width)
            wf.setframerate(sample_rate)
            wf.writeframes(pcm_data)
    
    def generate_speech(self, text, output_file="output.wav", voice_name="Puck"):
        """Generate speech using Gemini's native TTS"""
        try:
            model = genai.GenerativeModel("gemini-2.0-flash-exp")
            
            response = model.generate_content(
                f"Say cheerfully: {text}",
                generation_config={
                    "response_modalities": ["AUDIO"],
                    "speech_config": {
                        "voice_config": {
                            "prebuilt_voice_config": {
                                "voice_name": voice_name
                            }
                        }
                    }
                }
            )
            
            # Extract audio data
            if response.candidates and response.candidates[0].content.parts:
                audio_part = response.candidates[0].content.parts[0]
                if hasattr(audio_part, 'inline_data'):
                    pcm_data = audio_part.inline_data.data
                    self.save_audio_to_wav(pcm_data, output_file)
                    print(f"✓ Audio saved to {output_file}")
                    return output_file
            
            return None
            
        except Exception as e:
            print(f"Error generating speech: {e}")
            return None

# Example usage
if __name__ == "__main__":
    tts = GeminiNativeTTS()
    tts.generate_speech("Hello! I am your Gemini voice assistant.", "greeting.wav")
