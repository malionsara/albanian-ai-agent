import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { GeminiLiveAudioSession } from './gemini-live-audio.js';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Generate ephemeral token for Gemini Live API
app.post('/api/token', async (req, res) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1alpha/auth:generateToken?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uses: 1,
          expireTime: Math.floor(Date.now() / 1000) + 1800, // 30 minutes
          newSessionExpireTime: Math.floor(Date.now() / 1000) + 60, // 1 minute
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Token generation error:', error);
      return res.status(response.status).json({ error: 'Failed to generate token' });
    }

    const data = await response.json();
    res.json({ token: data.token });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('New client connected');

  let geminiSession = null;

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);

      switch (data.type) {
        case 'start':
          // Initialize Gemini Live Audio session
          geminiSession = new GeminiLiveAudioSession({
            apiKey: process.env.GEMINI_API_KEY,
            token: data.config?.token, // Ephemeral token from client
            systemPrompt: data.config?.systemPrompt || 'You are a helpful Albanian AI assistant. Speak naturally and conversationally.',
            language: data.config?.language || 'sq', // Albanian
          });

          await geminiSession.connect();

          // Forward Gemini responses to client
          geminiSession.on('ready', () => {
            ws.send(JSON.stringify({ type: 'ready' }));
          });

          geminiSession.on('response', (response) => {
            ws.send(JSON.stringify({
              type: 'response',
              data: response
            }));
          });

          geminiSession.on('audio', (audioData) => {
            ws.send(JSON.stringify({
              type: 'audio',
              data: audioData
            }));
          });

          geminiSession.on('turnComplete', () => {
            ws.send(JSON.stringify({
              type: 'turnComplete'
            }));
          });

          // Forward VAD events (user speaking detection)
          geminiSession.on('userSpeaking', (data) => {
            ws.send(JSON.stringify({
              type: 'userSpeaking',
              speaking: data.speaking
            }));
          });

          // Forward AI speaking state
          geminiSession.on('aiSpeaking', (data) => {
            ws.send(JSON.stringify({
              type: 'aiSpeaking',
              speaking: data.speaking
            }));
          });

          // Forward interruption events
          geminiSession.on('aiInterrupted', () => {
            ws.send(JSON.stringify({
              type: 'aiInterrupted'
            }));
          });

          geminiSession.on('error', (error) => {
            ws.send(JSON.stringify({
              type: 'error',
              message: error.message
            }));
          });

          break;

        case 'audio':
          // Forward audio to Gemini
          if (geminiSession) {
            await geminiSession.sendAudio(data.audio);
          }
          break;

        case 'text':
          // Forward text message to Gemini
          if (geminiSession) {
            await geminiSession.sendText(data.text);
          }
          break;

        case 'stop':
          // Stop the session
          if (geminiSession) {
            await geminiSession.disconnect();
            geminiSession = null;
          }
          break;

        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error handling message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: error.message
      }));
    }
  });

  ws.on('close', async () => {
    console.log('Client disconnected');
    if (geminiSession) {
      await geminiSession.disconnect();
      geminiSession = null;
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`WebSocket server ready at ws://localhost:${PORT}`);
});
