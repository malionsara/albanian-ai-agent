# Quick Reference Card

## 🚀 Quick Start (3 Steps)

```bash
# 1. Get API key: https://aistudio.google.com/app/apikey

# 2. Add to backend/.env
GEMINI_API_KEY=your_key_here

# 3. Run
start.bat
# Or manually:
cd backend && npm run dev
cd widget && npm run dev
```

Open: http://localhost:5173

## 📁 Project Structure

```
albanian-agent/
├── backend/           # Node.js WebSocket server + Gemini
│   ├── src/
│   │   ├── server.js       # Main server
│   │   └── gemini-live.js  # Gemini integration
│   └── .env               # Config (API key here!)
│
├── widget/           # React chat widget
│   └── src/
│       ├── AlbanianAgent.jsx  # Main component
│       └── styles.css         # Styling
│
├── SETUP.md         # Detailed setup
├── TEST.md          # Testing guide
└── NEXT_STEPS.md    # Roadmap
```

## 🔑 Environment Variables

**backend/.env:**
```env
GEMINI_API_KEY=your_key_here        # Required!
PORT=3001                           # Optional
CORS_ORIGIN=http://localhost:5173  # Optional
```

## 📡 API Reference

### WebSocket Messages (Client → Server)

**Start Session:**
```json
{
  "type": "start",
  "config": {
    "systemPrompt": "You are a helpful assistant",
    "language": "sq"
  }
}
```

**Send Text:**
```json
{
  "type": "text",
  "text": "Përshëndetje!"
}
```

**Send Audio:**
```json
{
  "type": "audio",
  "audio": "base64_audio_data"
}
```

**Stop Session:**
```json
{
  "type": "stop"
}
```

### WebSocket Messages (Server → Client)

**Ready:**
```json
{
  "type": "ready"
}
```

**Response:**
```json
{
  "type": "response",
  "data": {
    "type": "text",
    "content": "Përshëndetje! Si mund t'ju ndihmoj?",
    "timestamp": 1234567890
  }
}
```

**Audio:**
```json
{
  "type": "audio",
  "data": {
    "text": "...",
    "language": "sq"
  }
}
```

**Error:**
```json
{
  "type": "error",
  "message": "Error description"
}
```

## 🧩 React Widget Usage

**Basic:**
```jsx
import { AlbanianAgent } from './AlbanianAgent';

<AlbanianAgent
  serverUrl="ws://localhost:3001"
/>
```

**With Config:**
```jsx
<AlbanianAgent
  serverUrl="ws://localhost:3001"
  config={{
    systemPrompt: "You are a helpful Albanian assistant",
    language: "sq"
  }}
/>
```

## 💻 Useful Commands

```bash
# Install dependencies
cd backend && npm install
cd widget && npm install

# Development
cd backend && npm run dev    # Start backend
cd widget && npm run dev     # Start widget

# Build widget for production
cd widget && npm run build

# Check for issues
npm audit
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Connection error" | Start backend: `cd backend && npm run dev` |
| "Invalid API key" | Check `backend/.env` has correct key |
| Widget won't load | Check http://localhost:5173 (not https) |
| No AI response | Check backend terminal for errors |
| Mic not working | Allow browser permission |
| Port already in use | Kill process on 3001/5173 |

## 📊 Cost Calculator

**Your Costs:**
- Gemini: $0.025/minute
- Infrastructure: ~$0.01/minute
- **Total: ~$0.035/minute**

**vs ElevenLabs:**
- ElevenLabs: ~$0.10/minute
- **You save: 65%**

## 🎯 Testing Phrases (Albanian)

```
"Përshëndetje! Si je?"
"Çfarë mund të bësh?"
"Më trego për veten tënde"
"A flet shqip?"
"Mund të më ndihmosh me diçka?"
```

## 📞 Future: Phone Integration

```bash
# Step 1: Get Twilio account
# https://www.twilio.com/try-twilio

# Step 2: Buy phone number (~$1/month)

# Step 3: Configure webhook
# Point to: wss://your-domain.com/voice

# Step 4: Test by calling your number!
```

## 🔒 Security Checklist

**Before Production:**
- [ ] Move API key to environment variable
- [ ] Enable HTTPS/WSS only
- [ ] Add rate limiting
- [ ] Add authentication
- [ ] Validate all inputs
- [ ] Set CORS properly
- [ ] Add request logging
- [ ] Set up monitoring

## 📈 Metrics to Track

**Technical:**
- Response time
- Uptime
- Error rate
- WebSocket connections

**Business:**
- Active users
- Minutes consumed
- Revenue
- Churn rate

## 🔗 Important Links

- Gemini API: https://aistudio.google.com/app/apikey
- Gemini Docs: https://ai.google.dev/gemini-api/docs/live
- Twilio: https://www.twilio.com
- Google Cloud Console: https://console.cloud.google.com

## 💡 Tips

1. **Always check backend logs first** when debugging
2. **Use Chrome DevTools** (F12) to debug WebSocket
3. **Test with Albanian speakers** for pronunciation feedback
4. **Start simple** - don't over-engineer
5. **Document as you go** - future you will thank you

## 🎓 What You Built

- ✅ Real-time WebSocket communication
- ✅ Gemini AI integration
- ✅ Albanian language support
- ✅ Voice recording (captured)
- ✅ Text-to-Speech
- ✅ Modern React UI
- ✅ Embeddable widget

**Total Lines of Code:** ~600
**Time to Build:** 1-2 hours
**Time to Market:** Add TTS/STT and you're ready!

---

**Need help?** Check the other .md files:
- `SETUP.md` - Detailed setup
- `TEST.md` - Testing guide
- `ARCHITECTURE.md` - How it works
- `NEXT_STEPS.md` - Roadmap
