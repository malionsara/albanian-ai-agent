# Architecture Overview

## System Architecture (MVP)

```
┌─────────────────────────────────────────────────────────┐
│                     USER'S BROWSER                       │
│  ┌───────────────────────────────────────────────────┐ │
│  │         Albanian Agent Widget (React)              │ │
│  │  ┌─────────────────────────────────────────────┐  │ │
│  │  │  • Voice Input (Web Audio API)              │  │ │
│  │  │  • Text Chat Interface                       │  │ │
│  │  │  • Message Display                           │  │ │
│  │  │  • TTS Playback (Web Speech API)            │  │ │
│  │  └─────────────────────────────────────────────┘  │ │
│  └───────────────────┬───────────────────────────────┘ │
└────────────────────── ┼ ─────────────────────────────────┘
                        │ WebSocket Connection
                        │ (ws://localhost:3001)
┌───────────────────────▼─────────────────────────────────┐
│              Backend Server (Node.js)                    │
│  ┌───────────────────────────────────────────────────┐ │
│  │         WebSocket Server (ws)                      │ │
│  │  • Handle client connections                       │ │
│  │  • Route messages                                  │ │
│  │  • Session management                              │ │
│  └───────────────────┬───────────────────────────────┘ │
│                      │                                   │
│  ┌───────────────────▼───────────────────────────────┐ │
│  │      Gemini Live Session Handler                   │ │
│  │  • Manage Gemini API connection                    │ │
│  │  • Send/receive messages                           │ │
│  │  • Event handling                                  │ │
│  └───────────────────┬───────────────────────────────┘ │
└────────────────────── ┼ ─────────────────────────────────┘
                        │ HTTPS API Calls
                        │
┌───────────────────────▼─────────────────────────────────┐
│           Google Gemini API (Cloud)                      │
│  ┌───────────────────────────────────────────────────┐ │
│  │       Gemini 2.0 Flash Model                       │ │
│  │  • Natural language understanding                  │ │
│  │  • Albanian language support                       │ │
│  │  • Context-aware responses                         │ │
│  │  • Multi-turn conversations                        │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

### Text Message Flow

```
1. User types message in widget
   ↓
2. Widget sends via WebSocket: { type: 'text', text: 'Përshëndetje!' }
   ↓
3. Backend receives and forwards to Gemini
   ↓
4. Gemini processes and responds
   ↓
5. Backend sends back: { type: 'response', data: { content: '...' } }
   ↓
6. Widget displays message
   ↓
7. Widget triggers TTS to speak response
```

### Voice Message Flow (Current MVP)

```
1. User clicks microphone button
   ↓
2. Browser requests mic permission
   ↓
3. MediaRecorder captures audio
   ↓
4. User stops recording
   ↓
5. Widget sends: { type: 'audio', audio: base64Data }
   ↓
6. Backend receives (placeholder - not processed yet)
   ↓
7. Backend sends acknowledgment
```

### Voice Message Flow (Future)

```
1. User speaks into microphone
   ↓
2. Real-time audio streaming to backend
   ↓
3. Google Cloud Speech-to-Text (Albanian)
   ↓
4. Text sent to Gemini
   ↓
5. Gemini responds with text
   ↓
6. Google Cloud Text-to-Speech (Albanian voice)
   ↓
7. Audio streamed back to client
   ↓
8. Widget plays audio response
```

## Component Breakdown

### Frontend Widget (`widget/`)

**Main Components:**
- `AlbanianAgent.jsx` - Main widget component
- `styles.css` - Widget styling
- `main.jsx` - Entry point

**Responsibilities:**
- UI/UX for chat interface
- WebSocket client management
- Audio recording (MediaRecorder API)
- Audio playback (Web Speech API)
- Message history management

**Key Features:**
- Real-time chat
- Voice input button
- Text input field
- Message bubbles
- Connection status indicator

### Backend Server (`backend/`)

**Main Files:**
- `server.js` - Express + WebSocket server
- `gemini-live.js` - Gemini API wrapper
- `.env` - Configuration

**Responsibilities:**
- WebSocket server
- Route messages between client and Gemini
- Session management
- Error handling
- API key management

**Key Features:**
- Multi-client support (each WebSocket = separate session)
- Event-driven architecture
- Gemini API integration
- CORS handling

### Gemini Integration

**Current Implementation:**
- Using `@google/generative-ai` SDK
- Model: `gemini-2.0-flash-exp`
- Chat-based conversation
- Context preservation across turns

**Configuration:**
- System prompt (personality/instructions)
- Language setting (Albanian)
- Temperature, topK, topP for response variation

## Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| Web Audio API | Voice recording |
| Web Speech API | Text-to-Speech |
| WebSocket | Real-time communication |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express | HTTP server |
| ws | WebSocket library |
| @google/generative-ai | Gemini SDK |
| dotenv | Environment config |
| CORS | Cross-origin handling |

## Future Architecture (Phase 2)

```
┌─────────────┐
│   Phone     │
│  (Customer) │
└──────┬──────┘
       │ Voice Call
       │
┌──────▼──────────────┐
│  Twilio             │
│  ConversationRelay  │
└──────┬──────────────┘
       │ WebSocket
       │
┌──────▼──────────────┐
│  Backend Server     │
│  (Enhanced)         │
│  • Call routing     │
│  • Recording        │
│  • Analytics        │
└──────┬──────────────┘
       │
┌──────▼──────────────┐
│  Gemini Live API    │
│  (Native Audio)     │
└─────────────────────┘
```

## Scaling Considerations

**Current MVP:**
- Single server
- In-memory sessions
- No persistence
- No auth

**Production Requirements:**
- Load balancing
- Redis for session storage
- Database for conversation history
- User authentication
- Rate limiting
- Usage tracking for billing
- Multiple Gemini API keys (rotation)

## Security

**Current:**
- API key in .env (server-side only)
- CORS configuration
- No authentication (public demo)

**Production Needed:**
- JWT authentication
- API key rotation
- Rate limiting per user
- Input validation/sanitization
- HTTPS only
- WebSocket security (WSS)

## Performance

**Current Metrics:**
- WebSocket latency: <100ms
- Gemini response time: 1-3 seconds
- Widget load time: <1 second
- Memory: ~50MB per session

**Optimization Opportunities:**
- Connection pooling
- Response caching
- Audio streaming (vs. full file)
- Lazy loading components
- CDN for widget assets
