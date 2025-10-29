import { EventEmitter } from 'events';
import WebSocket from 'ws';

/**
 * Gemini Live API with native audio streaming
 * Uses WebSocket connection for real-time bidirectional audio
 */
export class GeminiLiveAudioSession extends EventEmitter {
  constructor({ apiKey, systemPrompt, language = 'sq' }) {
    super();
    this.apiKey = apiKey;
    this.systemPrompt = systemPrompt;
    this.language = language;
    this.ws = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      // Gemini Live API WebSocket endpoint
      const model = 'gemini-2.0-flash-exp';
      const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${this.apiKey}`;

      this.ws = new WebSocket(url);

      this.ws.on('open', () => {
        console.log('✅ Connected to Gemini Live API (Native Audio)');

        // Send initial setup message
        const setupMessage = {
          setup: {
            model: `models/${model}`,
            generation_config: {
              response_modalities: ['AUDIO'], // Native audio output
              speech_config: {
                voice_config: {
                  prebuilt_voice_config: {
                    voice_name: 'Kore' // Natural voice
                  }
                }
              },
              // Enable automatic Voice Activity Detection
              automatic_activity_detection: {
                disabled: false,
                speech_start_sensitivity: 0.5, // 0-1, lower = more sensitive
                speech_end_timeout_ms: 1500, // Wait 1.5s of silence before ending turn
                padding_ms: 200 // Add 200ms padding around speech
              }
            },
            system_instruction: {
              parts: [{ text: this.systemPrompt }]
            }
          }
        };

        this.ws.send(JSON.stringify(setupMessage));
        this.isConnected = true;
        this.emit('ready');
      });

      this.ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleGeminiMessage(message);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });

      this.ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.emit('error', error);
      });

      this.ws.on('close', () => {
        console.log('❌ Disconnected from Gemini Live API');
        this.isConnected = false;
        this.emit('disconnected');
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
    if (!this.isConnected || !this.ws) {
      throw new Error('Session not connected');
    }

    // Convert buffer to base64 if needed
    const base64Audio = Buffer.isBuffer(audioData)
      ? audioData.toString('base64')
      : audioData;

    const message = {
      realtimeInput: {
        mediaChunks: [
          {
            mimeType: 'audio/pcm;rate=16000',
            data: base64Audio
          }
        ]
      }
    };

    this.ws.send(JSON.stringify(message));
  }

  /**
   * Send text message to Gemini
   */
  sendText(text) {
    if (!this.isConnected || !this.ws) {
      throw new Error('Session not connected');
    }

    const message = {
      clientContent: {
        turns: [
          {
            role: 'user',
            parts: [{ text }]
          }
        ],
        turnComplete: true
      }
    };

    this.ws.send(JSON.stringify(message));
  }

  async disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }
}
