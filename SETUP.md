# Setup Instructions

## Step 1: Get Gemini API Key

1. Visit: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

## Step 2: Configure Backend

Edit `backend/.env` and replace `YOUR_API_KEY_HERE` with your actual Gemini API key:

```
GEMINI_API_KEY=your_actual_api_key_here
```

## Step 3: Start the Backend

Open a terminal and run:

```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 3001
WebSocket server ready at ws://localhost:3001
```

## Step 4: Start the Widget (in a new terminal)

Open another terminal and run:

```bash
cd widget
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

## Step 5: Test!

1. Open your browser to http://localhost:5173
2. You should see the Albanian AI Agent widget
3. Type a message in Albanian or English
4. The AI will respond!

## Testing Albanian

Try these messages:

**Albanian:**
- "Përshëndetje! Si je?"
- "Mund të më ndihmosh?"
- "Më trego për veten tënde"

**English:**
- "Hello, can you speak Albanian?"
- "What can you help me with?"

## Troubleshooting

### "Connection error" in the widget
- Make sure the backend is running on port 3001
- Check that you added your Gemini API key in backend/.env

### "Invalid API key" error
- Verify your Gemini API key is correct
- Make sure you copied the entire key without spaces

### Voice recording not working
- Click "Allow" when the browser asks for microphone permission
- Note: Audio processing is not fully implemented yet (MVP phase)

### Can't connect to WebSocket
- Check firewall settings
- Try http://localhost:5173 instead of 127.0.0.1

## What Works Now (MVP)

✅ Text chat with Gemini AI
✅ Albanian language responses
✅ Real-time WebSocket communication
✅ Basic voice recording (captured but not processed yet)
✅ Text-to-Speech for responses

## What's Next

- Full audio processing (speech-to-text)
- Better Albanian TTS with Google Cloud
- Phone integration with Twilio
- Admin dashboard
- Multi-agent support
