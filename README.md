# Albanian AI Voice Agent

A conversational AI agent with excellent Albanian pronunciation, built with Gemini Live API.

## 🚀 Quick Start

### 1. Get Your Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Create a new API key
3. Copy it for the next step

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
npm run dev
```

The backend will start on `http://localhost:3001`

### 3. Setup Widget

```bash
cd widget
npm install
npm run dev
```

The widget will start on `http://localhost:5173`

### 4. Test It!

Open your browser to `http://localhost:5173` and you'll see the Albanian AI Agent widget.

- Click the microphone to speak
- Or type a message in the text box
- The agent will respond in Albanian with proper pronunciation!

## 📁 Project Structure

```
albanian-agent/
├── backend/          # WebSocket server + Gemini API integration
├── widget/           # React widget (embeddable)
├── dashboard/        # Admin dashboard (coming soon)
└── shared/           # Shared types/utilities (coming soon)
```

## 🎯 Features (MVP)

- ✅ Real-time voice chat
- ✅ Text chat interface
- ✅ Albanian language support
- ✅ WebSocket communication
- ✅ Gemini AI integration
- ✅ Embeddable widget

## 🔜 Coming Soon

- [ ] Phone integration (Twilio)
- [ ] Dashboard for agent configuration
- [ ] Usage analytics
- [ ] Custom voice settings
- [ ] Multi-tenant support
- [ ] Subscription billing

## 💡 Tech Stack

**Backend:**
- Node.js + Express
- WebSocket (ws)
- Google Gemini API

**Frontend:**
- React 18
- Vite
- Web Speech API
- Lucide Icons

## 🌐 Albanian Language

The agent uses Albanian (sq) language code and can:
- Understand spoken Albanian
- Respond in Albanian
- Use proper Albanian pronunciation via Web Speech API

## 📝 Notes

- Currently uses Web Speech API for TTS (basic Albanian support)
- Audio input is captured but not yet processed (placeholder)
- Next step: Integrate Google Cloud TTS for better Albanian voices
- Next step: Implement proper audio streaming with Gemini Live API

## 🤝 Contributing

This is an MVP. Feel free to iterate and improve!
