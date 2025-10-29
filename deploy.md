# 🚀 Quick Deploy (10 Minutes)

Follow these steps to deploy your Albanian AI Voice Agent to production.

## Step 1: Deploy Backend (5 min)

### Option A: Railway (Recommended - Best WebSocket Support)

1. **Sign up:** https://railway.app (GitHub login)

2. **New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose this repository
   - Root path: `backend`

3. **Set Variables:**
   ```
   GEMINI_API_KEY = your_actual_key_here
   NODE_ENV = production
   CORS_ORIGIN = https://your-widget.vercel.app (add after widget deploy)
   ```

4. **Copy URL:**
   - Will be like: `albanian-agent-backend-production.up.railway.app`
   - Save this for next step!

**Cost:** $5/month

### Option B: Render (Free Tier Available)

1. **Sign up:** https://render.com

2. **New Web Service:**
   - Connect GitHub
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`

3. **Environment Variables:**
   - Add same variables as Railway above

4. **Copy URL**

**Cost:** FREE (with spin-down) or $7/month

---

## Step 2: Deploy Widget (3 min)

### Vercel (Recommended - Free & Fast)

1. **Sign up:** https://vercel.com (GitHub login)

2. **New Project:**
   - Import your GitHub repo
   - Framework: Vite
   - Root Directory: `widget`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variable:**
   ```
   VITE_BACKEND_URL = wss://your-railway-backend.railway.app
   ```

   **Important:**
   - Use `wss://` (secure)
   - Use the URL from Step 1
   - Don't include trailing slash

4. **Deploy!**
   - Click "Deploy"
   - Wait ~1 minute
   - Get your widget URL: `https://your-project.vercel.app`

5. **Update Backend CORS:**
   - Go back to Railway/Render
   - Update `CORS_ORIGIN` to your Vercel URL
   - Railway/Render will auto-redeploy

**Cost:** FREE

---

## Step 3: Test (2 min)

1. **Visit your Vercel URL**
   - Should see the chat widget
   - Green "Connected" indicator

2. **Test Voice:**
   - Click microphone button
   - Allow mic permission
   - Speak in Albanian
   - AI responds with voice!

3. **Test Text:**
   - Type: "Përshëndetje!"
   - Should get Albanian response

---

## ✅ Done!

Your Albanian AI Voice Agent is now live at:
- **Widget:** https://your-project.vercel.app
- **Backend:** https://your-backend.railway.app

### Share Your Widget

You can now:
1. Share the Vercel URL directly
2. Embed it in any website (coming soon)
3. Add custom domain (optional)

---

## 🔧 Next Steps

1. **Custom Domain:**
   - Vercel: Settings → Domains
   - Add: `agent.yourdomain.com`

2. **Monitor Usage:**
   - Railway: Check metrics dashboard
   - Gemini: Check API usage

3. **Add Features:**
   - Build the dashboard (Phase 4)
   - Add Twilio for phone calls
   - Add analytics

---

## 💡 Pro Tips

- **Free Tier Limits:**
  - Vercel: Unlimited on hobby
  - Render free: Spins down after 15min inactivity
  - Railway: $5 credit/month free

- **Cost Optimization:**
  - Start with Render free tier
  - Upgrade to Railway when traffic grows
  - Monitor Gemini API usage

- **Domain Names:**
  - Use short, memorable domains
  - SSL is automatic on Vercel/Railway
  - Albania domain: `.al` TLD available

---

## 🚨 If Something Goes Wrong

**Widget shows "Disconnected":**
- Check backend is running (visit /health endpoint)
- Verify CORS_ORIGIN is correct
- Use `wss://` not `ws://`

**Can't hear audio:**
- Check browser console for errors
- Ensure you're on HTTPS
- Try different browser

**Backend crashes:**
- Check Railway/Render logs
- Verify API key is correct
- Check error messages

---

## 📊 What You Just Deployed

**Technology Stack:**
- Backend: Node.js + WebSocket + Gemini API
- Frontend: React + Vite + Web Audio API
- Hosting: Railway + Vercel
- SSL: Automatic (free)
- CDN: Global (Vercel)

**Capabilities:**
- Real-time voice conversation
- Albanian language support
- Sub-second response time
- Embeddable anywhere
- Scalable architecture

**Total Setup Time:** ~10 minutes
**Total Cost:** ~$5/month (+ usage)
**Maintenance:** Almost zero (auto-deploys)

---

## 🎉 Congratulations!

You now have a production Albanian AI Voice Agent running!

**What's Next?**
- Test with Albanian speakers
- Gather feedback
- Build the dashboard
- Add phone integration
- Scale as needed

Need help? Check `DEPLOYMENT.md` for detailed troubleshooting.
