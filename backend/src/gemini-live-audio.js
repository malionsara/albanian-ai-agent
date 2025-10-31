import { EventEmitter } from 'events';
import { GoogleGenAI } from '@google/genai';

/**
 * Gemini Live API with native audio streaming using official SDK
 */
export class GeminiLiveAudioSession extends EventEmitter {
  constructor({ apiKey, systemPrompt, language = 'sq' }) {
    super();
    this.apiKey = apiKey;
    this.systemPrompt = systemPrompt;
    this.language = language;
    this.session = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      // Initialize Google Gen AI client
      const ai = new GoogleGenAI({ apiKey: this.apiKey });

      console.log('🔗 Connecting to Gemini Live API using SDK...');

      // Connect to Live API with configuration
      this.session = await ai.live.connect({
        model: 'gemini-2.0-flash-live-001',
        config: {
          responseModalities: ['TEXT', 'AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: 'Kore'
              }
            }
          },
          systemInstruction: {
            parts: [{ text: this.systemPrompt }]
          }
        },
        callbacks: {
          onopen: () => {
            console.log('✅ Connected to Gemini Live API');
            this.isConnected = true;
            this.emit('ready');
          },

          onmessage: (message) => {
            console.log('📩 Gemini message:', JSON.stringify(message, null, 2));
            this.handleGeminiMessage(message);
          },

          onerror: (error) => {
            console.error('❌ Live API error:', error);
            this.emit('error', error);
          },

          onclose: (event) => {
            console.log(`❌ Disconnected from Gemini Live API - Code: ${event.code}, Reason: ${event.reason || 'No reason provided'}`);
            this.isConnected = false;
            this.emit('disconnected');
          }
        }
      });

    } catch (error) {
      console.error('Failed to connect to Gemini:', error);
      this.emit('error', error);
      throw error;
    }
  }

  handleGeminiMessage(message) {
    // Handle setup complete
    if (message.setupComplete) {
      console.log('Setup complete');
      return;
    }

    // Handle tool call (if any)
    if (message.toolCall) {
      console.log('Tool call:', message.toolCall);
    }

    // Handle tool call cancellation
    if (message.toolCallCancellation) {
      console.log('Tool call cancelled:', message.toolCallCancellation);
    }

    // Handle server content (responses)
    if (message.serverContent) {
      const content = message.serverContent;

      // Detect when AI starts speaking (for UI indicator)
      if (content.modelTurn) {
        this.emit('aiSpeaking', { speaking: true });

        const parts = content.modelTurn.parts || [];

        for (const part of parts) {
          // Text response
          if (part.text) {
            this.emit('response', {
              type: 'text',
              content: part.text,
              timestamp: Date.now()
            });
          }

          // Audio response (base64 PCM)
          if (part.inlineData && part.inlineData.mimeType.startsWith('audio/')) {
            this.emit('audio', {
              type: 'audio',
              data: part.inlineData.data, // base64 PCM audio
              mimeType: part.inlineData.mimeType,
              timestamp: Date.now()
            });
          }
        }
      }

      // Handle turn complete
      if (content.turnComplete) {
        this.emit('aiSpeaking', { speaking: false });
        this.emit('turnComplete');
      }

      // Handle interruption (user started speaking while AI was speaking)
      if (content.interrupted) {
        console.log('AI was interrupted by user');
        this.emit('aiInterrupted');
      }
    }

    // Handle activity detection (user speaking events from VAD)
    if (message.activityStart) {
      console.log('User started speaking (VAD detected)');
      this.emit('userSpeaking', { speaking: true });
    }

    if (message.activityEnd) {
      console.log('User stopped speaking (VAD detected)');
      this.emit('userSpeaking', { speaking: false });
    }
  }

  /**
   * Send audio chunk to Gemini
   * @param {Buffer|string} audioData - PCM audio data (16-bit, 16kHz) as Buffer or base64 string
   */
  sendAudio(audioData) {
    if (!this.isConnected || !this.session) {
      throw new Error('Session not connected');
    }

    // Convert buffer to base64 if needed
    const base64Audio = Buffer.isBuffer(audioData)
      ? audioData.toString('base64')
      : audioData;

    this.session.sendRealtimeInput({
      audio: {
        data: base64Audio,
        mimeType: 'audio/pcm;rate=16000'
      }
    });
  }

  /**
   * Send text message to Gemini
   */
  sendText(text) {
    if (!this.isConnected || !this.session) {
      throw new Error('Session not connected');
    }

    this.session.sendClientMessage({
      clientContent: {
        turns: [
          {
            role: 'user',
            parts: [{ text }]
          }
        ],
        turnComplete: true
      }
    });
  }

  async disconnect() {
    if (this.session) {
      this.session.close();
      this.session = null;
    }
    this.isConnected = false;
  }
}
