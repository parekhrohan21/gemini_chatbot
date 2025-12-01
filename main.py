import os
import google.generativeai as genai
import pyttsx3
from dotenv import load_dotenv
import sys

class SpeakingGeminiChatbot:
    """A speaking chatbot wrapper for Google Gemini API with text-to-speech capabilities"""
    
    def __init__(self):
        # Load environment variables
        load_dotenv()
        
        # Configure Gemini API
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in .env file")
        
        genai.configure(api_key=api_key)
        
        # Initialize the Gemini model
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
        # Initialize chat session with history
        self.chat = self.model.start_chat(history=[])
        
        # Initialize text-to-speech engine
        self.tts_engine = pyttsx3.init()
        self._configure_voice()
        
        print("✓ Gemini Speaking Chatbot initialized successfully!")
        
    def _configure_voice(self):
        """Configure the text-to-speech voice settings"""
        voices = self.tts_engine.getProperty('voices')
        
        # Set voice (0 = male, 1 = female typically)
        if len(voices) > 1:
            self.tts_engine.setProperty('voice', voices[1].id)
        
        # Set speech rate (default is 200)
        self.tts_engine.setProperty('rate', 175)
        
        # Set volume (0.0 to 1.0)
        self.tts_engine.setProperty('volume', 0.9)
    
    def speak(self, text):
        """Convert text to speech and play it"""
        print(f"\n🤖 Bot: {text}")
        self.tts_engine.say(text)
        self.tts_engine.runAndWait()
    
    def get_response(self, user_input):
        """Send message to Gemini and get response"""
        try:
            response = self.chat.send_message(user_input)
            return response.text
        except Exception as e:
            return f"Sorry, I encountered an error: {str(e)}"
    
    def chat_loop(self):
        """Main conversation loop"""
        greeting = "Hello! I'm your Gemini speaking assistant. How can I help you today?"
        self.speak(greeting)
        
        print("\n" + "="*60)
        print("Type 'quit', 'exit', or 'bye' to end the conversation")
        print("="*60 + "\n")
        
        while True:
            try:
                # Get user input
                user_input = input("\n👤 You: ").strip()
                
                if not user_input:
                    continue
                
                # Check for exit commands
                if user_input.lower() in ['quit', 'exit', 'bye', 'goodbye']:
                    farewell = "Goodbye! Have a great day!"
                    self.speak(farewell)
                    break
                
                # Get and speak response
                response = self.get_response(user_input)
                self.speak(response)
                
            except KeyboardInterrupt:
                print("\n\nInterrupted by user")
                farewell = "Goodbye!"
                self.speak(farewell)
                break
            except Exception as e:
                print(f"\nError: {e}")
                continue

def main():
    """Initialize and run the chatbot"""
    try:
        chatbot = SpeakingGeminiChatbot()
        chatbot.chat_loop()
    except Exception as e:
        print(f"Failed to initialize chatbot: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
