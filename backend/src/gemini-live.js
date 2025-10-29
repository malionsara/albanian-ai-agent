import { GoogleGenerativeAI } from '@google/generative-ai';
import { EventEmitter } from 'events';

export class GeminiLiveSession extends EventEmitter {
  constructor({ apiKey, systemPrompt, language = 'sq' }) {
    super();
    this.apiKey = apiKey;
    this.systemPrompt = systemPrompt;
    this.language = language;
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = null;
    this.chat = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      // Initialize Gemini 2.0 Flash model for Live API
      this.model = this.genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
        systemInstruction: this.systemPrompt,
      });

      // Start chat session
      this.chat = this.model.startChat({
        history: [],
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      });

      this.isConnected = true;
      console.log('✅ Connected to Gemini Live API');
    } catch (error) {
      console.error('Failed to connect to Gemini:', error);
      this.emit('error', error);
      throw error;
    }
  }

  async sendText(text) {
    if (!this.isConnected || !this.chat) {
      throw new Error('Session not connected');
    }

    try {
      const result = await this.chat.sendMessage(text);
      const response = result.response;
      const responseText = response.text();

      this.emit('response', {
        type: 'text',
        content: responseText,
        timestamp: Date.now()
      });

      // Also emit audio if available
      // Note: For now we'll use text response.
      // Gemini Live API native audio will be added when SDK supports it
      this.emit('audio', {
        text: responseText,
        language: this.language
      });

      return responseText;
    } catch (error) {
      console.error('Error sending text:', error);
      this.emit('error', error);
      throw error;
    }
  }

  async sendAudio(audioData) {
    // For MVP: Convert audio to text first (STT), then use sendText
    // In production: Use Gemini Live API's native audio streaming
    // This is a placeholder - we'll implement proper audio handling
    console.log('Audio received, length:', audioData.length);

    // TODO: Implement actual audio processing
    // For now, emit a placeholder response
    this.emit('response', {
      type: 'audio_received',
      content: 'Audio processing not yet implemented',
      timestamp: Date.now()
    });
  }

  async disconnect() {
    this.isConnected = false;
    this.chat = null;
    this.model = null;
    console.log('❌ Disconnected from Gemini Live API');
  }
}
