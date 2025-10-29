# Deployment Guide

This guide will help you deploy the Albanian AI Voice Agent to production.

## 🏗️ Architecture

**Recommended setup:**
- **Backend:** Railway or Render (WebSocket support)
- **Widget:** Vercel (fast, free CDN)
- **Total cost:** ~$5-10/month

## 📋 Prerequisites

Before deploying, make sure you have:
- ✅ Gemini API key from https://aistudio.google.com/app/apikey
- ✅ GitHub account (for connecting repos)
- ✅ Railway/Render account (for backend)
- ✅ Vercel account (for frontend)

---

## 🚂 Option 1: Deploy Backend to Railway (Recommended)

Railway has excellent WebSocket support and is easy to use.

### Step 1: Install Railway CLI (Optional)

```bash
npm install -g @railway/cli
railway login
```

### Step 2: Deploy via Railway Dashboard

1. **Go to:** https://railway.app
2. **Click:** "New Project"
3. **Select:** "Deploy from GitHub repo"
4. **Choose:** Your repository
5. **Select root path:** `/backend`
6. **Railway auto-detects** Node.js and starts deployment

### Step 3: Set Environment Variables

In Railway dashboard:
1. Go to your project
2. Click "Variables"
3. Add these:

```
GEMINI_API_KEY=your_actual_gemini_key_here
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://your-widget-domain.vercel.app
```

### Step 4: Get Your Backend URL

Railway will give you a URL like:
```
https://albanian-agent-backend.railway.app
```

**Important:** Note this URL - you'll need it for the widget!

**Cost:** $5/month (500 hours included, then $0.000231/minute)

---

## 🎨 Option 2: Deploy Widget to Vercel

### Step 1: Install Vercel CLI (Optional)

```bash
npm install -g vercel
vercel login
```

### Step 2: Deploy via Vercel Dashboard

1. **Go to:** https://vercel.com
2. **Click:** "New Project"
3. **Import** your GitHub repository
4. **Configure:**
   - Framework Preset: Vite
   - Root Directory: `widget`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Step 3: Set Environment Variables

In Vercel dashboard:
1. Go to Project Settings
2. Click "Environment Variables"
3. Add:

```
VITE_BACKEND_URL=wss://your-railway-backend.railway.app
```

**Note:** Use `wss://` (secure WebSocket) for production!

### Step 4: Deploy

Click "Deploy" and wait ~1 minute.

Your widget will be live at:
```
https://your-project.vercel.app
```

**Cost:** FREE (Hobby plan includes unlimited bandwidth)

---

## 🐳 Alternative: Deploy Backend to Render

If you prefer Render over Railway:

### Step 1: Deploy to Render

1. **Go to:** https://render.com
2. **Click:** "New +"
3. **Select:** "Web Service"
4. **Connect** your GitHub repo
5. **Configure:**
   - Name: albanian-agent-backend
   - Root Directory: backend
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`

### Step 2: Environment Variables

Add in Render dashboard:
```
GEMINI_API_KEY=your_key
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://your-widget.vercel.app
```

### Step 3: Get URL

Render gives you:
```
https://albanian-agent-backend.onrender.com
```

**Cost:** FREE tier available (spins down after inactivity), or $7/month for always-on

---

## 🔧 Quick Deploy Commands

### Backend (Railway)

```bash
cd backend
railway login
railway init
railway up
railway variables set GEMINI_API_KEY=your_key
```

### Widget (Vercel)

```bash
cd widget
vercel login
vercel --prod
vercel env add VITE_BACKEND_URL
```

---

## ✅ Post-Deployment Checklist

After deploying:

1. **Test Backend:**
   ```bash
   curl https://your-backend.railway.app/health
   ```
   Should return: `{"status":"ok"}`

2. **Test WebSocket:**
   Open browser console on your widget and check for:
   ```
   Connected to server
   Session ready
   ```

3. **Test Voice:**
   - Click microphone
   - Speak Albanian
   - Verify response

4. **Update CORS:**
   Make sure `CORS_ORIGIN` in backend matches your Vercel URL

5. **Check Logs:**
   - Railway: Project → Deployments → Logs
   - Vercel: Project → Deployments → Function Logs

---

## 🌐 Custom Domain (Optional)

### For Widget (Vercel):

1. Go to Project Settings
2. Click "Domains"
3. Add your domain (e.g., `agent.yourdomain.com`)
4. Update DNS records as shown
5. Wait for SSL certificate (~1 min)

### For Backend (Railway):

1. Go to Project Settings
2. Click "Domains"
3. Add custom domain
4. Update DNS with CNAME record

**Don't forget** to update `CORS_ORIGIN` after adding custom domain!

---

## 📊 Monitoring & Logs

### Railway:
- Dashboard → Project → Metrics
- Real-time logs in dashboard
- Automatic restarts on crash

### Vercel:
- Dashboard → Analytics
- Function logs
- Real User Monitoring (RUM)

---

## 💰 Cost Breakdown

**Railway (Backend):**
- $5/month for 500 hours
- Additional: $0.000231/min
- ~$5-7/month for moderate usage

**Vercel (Widget):**
- FREE for hobby projects
- Unlimited bandwidth
- 100GB bandwidth on free tier

**Gemini API:**
- ~$0.025/minute of conversation
- You set your own usage limits

**Total: ~$5-10/month + usage**

---

## 🔒 Security Best Practices

1. **Never commit `.env` files**
   - Already in `.gitignore`
   - Use platform environment variables

2. **Use WSS (secure WebSocket)**
   - Railway/Render provide SSL automatically
   - Always use `wss://` in production

3. **Set proper CORS**
   - Only allow your widget domain
   - Don't use `*` in production

4. **Rate limiting** (future)
   - Add rate limiting middleware
   - Prevent API abuse

5. **API key rotation**
   - Rotate Gemini API key periodically
   - Use separate keys for dev/prod

---

## 🚨 Troubleshooting

### Widget can't connect to backend:
- Check CORS_ORIGIN is set correctly
- Verify backend URL uses `wss://` (not `ws://`)
- Check backend is running (visit /health endpoint)

### Backend crashes:
- Check Railway/Render logs
- Verify GEMINI_API_KEY is valid
- Check for memory issues

### WebSocket disconnects:
- Railway/Render have connection timeouts
- Implement reconnection logic (already in widget)
- Check for network issues

### Audio not working:
- Verify HTTPS (required for microphone)
- Check browser console for errors
- Test with different browsers

---

## 🔄 CI/CD (Automatic Deployments)

Both Railway and Vercel auto-deploy when you push to GitHub:

1. **Push to `main` branch** → Auto-deploy to production
2. **Push to `dev` branch** → Deploy to preview (Vercel)
3. **Pull requests** → Preview deployments

**To set up:**
1. Connect GitHub repo in Railway/Vercel
2. Select branch to deploy
3. Every push triggers deployment

---

## 📈 Scaling

When you grow:

1. **Add more Railway instances**
   - Horizontal scaling
   - Load balancer included

2. **Use Redis for sessions**
   - Railway has Redis add-on
   - Share sessions across instances

3. **Add CDN for assets**
   - Vercel provides global CDN
   - Railway has edge caching

4. **Database for analytics**
   - Railway PostgreSQL add-on
   - Track usage, conversations

---

## 🎯 Production Checklist

Before going live:

- [ ] Backend deployed and accessible
- [ ] Widget deployed and accessible
- [ ] Environment variables set
- [ ] CORS configured properly
- [ ] SSL/TLS working (HTTPS/WSS)
- [ ] Health check returns OK
- [ ] WebSocket connection works
- [ ] Voice recording works
- [ ] Audio playback works
- [ ] Error handling tested
- [ ] Logs monitoring set up
- [ ] Custom domain configured (optional)
- [ ] Analytics set up (optional)

---

## 🚀 Quick Start Summary

**1. Deploy Backend (5 minutes):**
```bash
# Connect Railway to GitHub
# Set GEMINI_API_KEY
# Get backend URL
```

**2. Deploy Widget (3 minutes):**
```bash
# Connect Vercel to GitHub
# Set VITE_BACKEND_URL to backend URL
# Deploy
```

**3. Test (2 minutes):**
```bash
# Visit widget URL
# Click microphone
# Speak Albanian
# ✅ Done!
```

---

## 📞 Need Help?

- **Railway docs:** https://docs.railway.app
- **Vercel docs:** https://vercel.com/docs
- **Render docs:** https://render.com/docs

Common issues are usually:
1. Wrong environment variables
2. CORS misconfiguration
3. Using `ws://` instead of `wss://`

Check the logs first! They'll tell you what's wrong.

---

**Ready to deploy?** Start with Railway for backend, then Vercel for widget. You'll be live in 10 minutes!
