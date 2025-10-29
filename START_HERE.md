# 🚀 START HERE!

Welcome to your **Albanian AI Voice Agent** project!

## ⚡ Quick Start (5 Minutes)

### Step 1: Get API Key (2 min)
👉 Visit: **https://aistudio.google.com/app/apikey**
- Click "Create API Key"
- Copy it

### Step 2: Add API Key (1 min)
Open `backend/.env` and replace:
```
GEMINI_API_KEY=YOUR_API_KEY_HERE
```
with your actual key

### Step 3: Run (2 min)

**Option A - Easy Way (Windows):**
Double-click `start.bat`

**Option B - Manual:**
```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd widget
npm run dev
```

### Step 4: Test!
Open: **http://localhost:5173**

Type: `Përshëndetje! Si je?`

✅ Done! Your AI agent is running!

---

## 📚 What to Read Next

**New to the project?**
1. Read `PROJECT_SUMMARY.md` - Overview of what we built
2. Read `SETUP.md` - Detailed setup if you had issues
3. Read `TEST.md` - How to test everything

**Ready to build?**
1. Read `ARCHITECTURE.md` - Understand how it works
2. Read `NEXT_STEPS.md` - See the roadmap
3. Read `QUICK_REFERENCE.md` - Quick help while coding

---

## 🎯 What You Have

✅ Real-time chat with Albanian AI
✅ Voice recording interface
✅ Text-to-Speech responses
✅ WebSocket communication
✅ Embeddable widget
✅ Full documentation

---

## 💰 The Opportunity

**Problem:** ElevenLabs has poor Albanian pronunciation and costs $20 for 200 minutes

**Your Solution:** Better Albanian voice + 65% cheaper

**Market:** 8M Albanian speakers, 50K+ businesses

**Revenue:** $49-249/month subscriptions

---

## 🔥 Next Actions

1. **Today:** Test the current MVP
2. **This Week:** Add Google Cloud TTS for better Albanian
3. **Next Week:** Test with Albanian speakers
4. **Month 1:** Add phone integration (Twilio)
5. **Month 2:** Build dashboard
6. **Month 3:** Launch beta!

---

## 📁 Project Structure

```
Albanian Agent/
├── 📄 START_HERE.md          ← You are here!
├── 📄 PROJECT_SUMMARY.md     ← Read this next
├── 📄 SETUP.md               ← If you need help
├── 📄 TEST.md                ← Testing guide
├── 📄 ARCHITECTURE.md        ← How it works
├── 📄 NEXT_STEPS.md          ← Roadmap
├── 📄 QUICK_REFERENCE.md     ← Quick help
│
├── 🚀 start.bat              ← Run this!
│
├── backend/                  ← Node.js server
│   ├── src/
│   │   ├── server.js         ← WebSocket server
│   │   └── gemini-live.js    ← AI integration
│   └── .env                  ← Add your API key here!
│
└── widget/                   ← React widget
    └── src/
        ├── AlbanianAgent.jsx ← Main component
        └── styles.css        ← Styling
```

---

## 🆘 Having Issues?

**"Connection error"**
→ Make sure backend is running: `cd backend && npm run dev`

**"Invalid API key"**
→ Check `backend/.env` has your real Gemini API key

**Widget won't load**
→ Use `http://` not `https://` for localhost

**More help:**
→ Check `SETUP.md` for detailed troubleshooting

---

## 🎉 You're All Set!

You have everything you need to build a successful Albanian AI voice agent business.

**Questions?** Check the documentation files.

**Ready?** Run `start.bat` and test it!

Good luck! 🚀🇦🇱
