# Testing Guide

## Before You Start

Make sure you have:
1. ✅ Node.js installed (v18 or higher)
2. ✅ Gemini API key from https://aistudio.google.com/app/apikey
3. ✅ API key added to `backend/.env`

## Quick Test Checklist

### 1. Backend Connection Test

Start the backend:
```bash
cd backend
npm run dev
```

Expected output:
```
✅ Connected to Gemini Live API
🚀 Server running on port 3001
WebSocket server ready at ws://localhost:3001
```

If you see "Connected to Gemini Live API" - your API key works! ✅

### 2. Widget Test

In a new terminal:
```bash
cd widget
npm run dev
```

Open http://localhost:5173

Expected: You should see a chat widget with "Connected" status in green.

### 3. Text Chat Test

Type in the text box:
```
Përshëndetje! Si je?
```

Expected: AI responds in Albanian within 1-2 seconds.

### 4. Voice Input Test

1. Click the microphone button (blue circle)
2. Allow microphone access if prompted
3. Say something in Albanian or English
4. Click the red stop button

Note: Audio processing is not fully implemented yet, so you'll get a placeholder response.

### 5. Text-to-Speech Test

After the AI responds with text, it should automatically speak the response using your browser's TTS.

On Windows: You might hear Albanian text spoken with an English accent (browser limitation).

## Albanian Test Phrases

Try these to test Albanian understanding:

1. **Greeting:**
   - "Tungjatjeta! Si jeni?"
   - "Mirëmëngjes!"

2. **Questions:**
   - "Çfarë mund të bësh?"
   - "A mund të më ndihmosh?"
   - "Si funksionon ky sistem?"

3. **Conversation:**
   - "Më trego për veten tënde"
   - "Çfarë gjuhe flet?"
   - "A je i mirë në shqip?"

## Expected Behavior

✅ **Working:**
- Text chat (Albanian & English)
- Real-time responses from Gemini
- WebSocket connection
- Message history
- Basic TTS output

⚠️ **Not Yet Implemented:**
- Actual voice-to-text processing
- High-quality Albanian TTS (currently using browser's basic TTS)
- Phone integration
- Dashboard
- User management

## Common Issues

### Widget shows "Disconnected"
- Backend not running
- Wrong WebSocket URL
- Firewall blocking connection

### No AI response
- Invalid API key
- API quota exceeded
- Network issue

### Microphone doesn't work
- Browser permission denied
- No microphone available
- HTTPS required for mic in production

## Performance Expectations

- Response time: 1-3 seconds
- WebSocket latency: <100ms
- First message may be slower (cold start)

## Next Steps After Testing

Once everything works:

1. ✅ Test with longer conversations
2. ✅ Try different Albanian dialects/phrases
3. ✅ Check response quality
4. 📝 Document any issues
5. 🚀 Plan next features:
   - Better TTS with Google Cloud
   - Actual STT processing
   - Phone integration
   - Dashboard

## Need Help?

Check:
- `SETUP.md` for detailed setup
- `README.md` for project overview
- Console logs in browser DevTools (F12)
- Backend terminal for error messages
