# 🆓 FREE Deployment Guide (No Costs!)

Deploy your Albanian AI Voice Agent **completely free** to show friends and test.

## Platform: Render (100% Free)

**What you get:**
- Backend hosting (FREE)
- Widget hosting (FREE)
- SSL/HTTPS (FREE)
- WebSocket support (FREE)
- No credit card required (FREE)

**Limitation:**
- Backend sleeps after 15 min inactivity
- Takes 30-60 seconds to wake up on first use
- Fine for demos!

---

## 🚀 Deploy in 10 Minutes (Zero Cost)

### Step 1: Sign Up for Render

1. Go to: https://render.com
2. Click "Get Started"
3. Sign up with GitHub (easiest)

---

### Step 2: Deploy Backend (5 min)

1. **Click "New +"** in Render dashboard
2. **Select "Web Service"**
3. **Connect your GitHub repo**
4. **Configure:**
   - Name: `albanian-agent-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Branch: `main`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - **Instance Type: FREE** ⚠️ Important!

5. **Add Environment Variables:**
   Click "Advanced" then add:
   ```
   GEMINI_API_KEY = your_actual_gemini_key_here
   NODE_ENV = production
   PORT = 3001
   CORS_ORIGIN = * (we'll update this after widget deploy)
   ```

6. **Click "Create Web Service"**
   - Wait 2-3 minutes for deployment
   - You'll get a URL like: `https://albanian-agent-backend.onrender.com`
   - **SAVE THIS URL!** You need it for next step

---

### Step 3: Deploy Widget (3 min)

1. **Click "New +" again**
2. **Select "Static Site"**
3. **Connect same GitHub repo**
4. **Configure:**
   - Name: `albanian-agent-widget`
   - Root Directory: `widget`
   - Branch: `main`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

5. **Add Environment Variable:**
   Click "Advanced" then add:
   ```
   VITE_BACKEND_URL = wss://albanian-agent-backend.onrender.com
   ```

   ⚠️ **Important:**
   - Use `wss://` (secure WebSocket)
   - Replace with YOUR backend URL from Step 2
   - No trailing slash!

6. **Click "Create Static Site"**
   - Wait 1-2 minutes
   - You'll get URL like: `https://albanian-agent-widget.onrender.com`

---

### Step 4: Update Backend CORS (1 min)

1. **Go back to backend service** in Render
2. **Click "Environment"**
3. **Edit `CORS_ORIGIN`:**
   ```
   CORS_ORIGIN = https://albanian-agent-widget.onrender.com
   ```
   Replace with YOUR widget URL from Step 3

4. **Save Changes**
   - Render will auto-redeploy (takes 1 min)

---

### Step 5: Test! (1 min)

1. **Open your widget URL:**
   `https://albanian-agent-widget.onrender.com`

2. **Wait 30-60 seconds** (first time - backend is waking up)

3. **Look for green "Connected" status**

4. **Click microphone and speak Albanian!**
   - "Përshëndetje!"
   - Should respond with voice

---

## ✅ You're Live!

Your Albanian AI Voice Agent is now live at:
- **Widget:** `https://albanian-agent-widget.onrender.com`
- **Backend:** `https://albanian-agent-backend.onrender.com`

**Share with friends!** Just send them the widget URL.

---

## 💡 Free Tier Limits

**What's FREE:**
- ✅ Hosting (backend + widget)
- ✅ SSL/HTTPS
- ✅ Unlimited bandwidth
- ✅ No time limit
- ✅ WebSocket support

**Limitations:**
- ⏰ Backend sleeps after 15 min inactivity
- 🐌 First request takes 30-60 sec to wake up
- 💾 750 hours/month free (plenty for demos!)

**Good for:**
- Demos
- Showing friends
- Testing
- Portfolio

**Not good for:**
- 24/7 production
- High traffic
- Instant response needed

---

## 🚀 Upgrade Later (When Ready)

When you want 24/7 uptime:

**Option 1: Render Paid**
- $7/month per service
- No sleep
- Always on

**Option 2: Railway**
- $5/month total
- Better for WebSockets
- Recommended for production

But for now, FREE is perfect!

---

## 🔧 Managing Your Deployment

### View Logs

**Backend:**
1. Go to backend service
2. Click "Logs"
3. See real-time logs

**Widget:**
1. Go to widget service
2. Click "Events"
3. See deployment logs

### Redeploy

**Automatic:**
- Push to GitHub → Auto-deploys

**Manual:**
1. Go to service
2. Click "Manual Deploy"
3. Select branch
4. Deploy

### Keep Backend Awake

If you're showing friends soon:

**Option A: Ping service**
```bash
# Run this 5 minutes before demo
curl https://your-backend.onrender.com/health
```

**Option B: Use Uptime Robot (FREE)**
1. Sign up: https://uptimerobot.com
2. Add monitor: Your backend URL
3. Ping every 5 minutes
4. Backend never sleeps!

---

## 🎯 Demo Script for Friends

When showing your friends:

1. **First time (backend sleeping):**
   - "Hold on 30 seconds, server is waking up..."
   - Refresh page
   - Now it works!

2. **After that:**
   - Instant responses
   - Show voice feature
   - Show Albanian conversation

3. **Impress them:**
   - "This costs me $0 to run!"
   - "I built this in [your time]"
   - "It's using Google's latest AI"

---

## 📊 Free vs Paid Comparison

### FREE (Render)
- Cost: $0
- Uptime: Sleeps after 15 min
- Good for: Demos, testing
- Bandwidth: Unlimited
- Setup: 10 minutes

### PAID (Railway + Vercel)
- Cost: $5/month
- Uptime: 24/7
- Good for: Production, business
- Bandwidth: Unlimited
- Setup: 10 minutes

Start FREE, upgrade when you're ready to launch for real!

---

## 🚨 Troubleshooting

**Backend won't wake up:**
- Give it 60 seconds
- Check logs for errors
- Verify API key is correct

**Widget shows disconnected:**
- Backend might be sleeping
- Wait 30 seconds and refresh
- Check CORS_ORIGIN matches widget URL

**Can't hear audio:**
- Must use HTTPS (Render provides this)
- Allow microphone permission
- Check browser console

**Deployment failed:**
- Check build logs in Render
- Verify package.json is correct
- Try manual deploy

---

## 💸 Actual Costs

**Hosting: $0**
**Gemini API: ~$0.025/minute of voice conversation**

For demos with friends:
- 10 friends × 5 min each = 50 minutes
- Cost: 50 × $0.025 = **$1.25 total**

Very cheap to test!

---

## 🎉 Summary

**You just deployed for FREE:**
1. Backend with WebSocket support
2. Frontend widget with voice AI
3. SSL/HTTPS security
4. Global accessibility

**Total cost: $0/month**
**Total time: 10 minutes**

Perfect for showing friends and getting feedback before investing in paid hosting!

When you're ready to go pro: Railway ($5/month)
Until then: FREE on Render! 🎉

---

## Next Steps

1. ✅ Share link with friends
2. ✅ Get feedback on Albanian pronunciation
3. ✅ Test different use cases
4. 📊 See how much they use it
5. 💰 Upgrade when you're ready to launch

Have fun showing it off! 🚀🇦🇱
