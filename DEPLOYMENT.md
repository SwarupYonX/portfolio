# 🚀 Static Website Deployment Guide

Your portfolio is a **static website** that uses **serverless functions** for API calls. No backend server needed!

## 📦 How It Works

- **Frontend**: Pure HTML/CSS/JS (static files)
- **API Calls**: Serverless functions (run on-demand)
- **No Server**: No Node.js server running 24/7
- **Hosting**: Deploy to Netlify, Vercel, or Cloudflare Pages

## 🎯 Recommended: Deploy to Netlify (FREE)

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify
```bash
netlify login
```

### Step 3: Initialize Your Site
```bash
netlify init
```

### Step 4: Set Environment Variables
```bash
netlify env:set TWITTER_BEARER_TOKEN "your_token_here"
netlify env:set TWITTER_USERNAME "your_username"
```

### Step 5: Deploy
```bash
netlify deploy --prod
```

**That's it!** Your site is live with working serverless functions! 🎉

---

## 🔧 Alternative: Deploy to Vercel

### Install Vercel CLI
```bash
npm install -g vercel
```

### Create vercel.json
```json
{
  "functions": {
    "api/twitter-posts.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

### Move Functions (for Vercel)
```bash
mkdir -p api
cp netlify/functions/twitter-posts.js api/
cp netlify/functions/linkedin-posts.js api/
```

### Deploy
```bash
vercel --prod
```

### Set Environment Variables
```bash
vercel env add TWITTER_BEARER_TOKEN
vercel env add TWITTER_USERNAME
```

---

## 🌐 Alternative: GitHub Pages + External API

If you want to use **GitHub Pages** (which doesn't support serverless functions):

### Option A: Use a CORS Proxy Service
Update `main.js` to use a proxy:
```javascript
const response = await fetch('https://your-backend.herokuapp.com/api/twitter/posts');
```

Then deploy a separate tiny backend to Heroku/Railway.

### Option B: Keep Demo Data
The site already has fallback demo posts, so it works without APIs.

---

## 📝 Environment Variables Needed

### For Twitter API:
- `TWITTER_BEARER_TOKEN` - Get from [developer.twitter.com](https://developer.twitter.com/)
- `TWITTER_USERNAME` - Your Twitter handle (without @)

### For LinkedIn API (optional):
- `LINKEDIN_ACCESS_TOKEN` - Get from [linkedin.com/developers](https://www.linkedin.com/developers/)

---

## 🧪 Local Development

### Test Serverless Functions Locally
```bash
npm install
netlify dev
```

This starts a local server at `http://localhost:8888` with working functions!

---

## ✅ What You Get

✨ **Free Hosting**
- Netlify Free Tier: Unlimited sites
- Automatic HTTPS
- Global CDN
- Instant deploys

🚀 **Serverless Functions**
- Run on-demand (only when called)
- No server to maintain
- Auto-scaling
- Free tier: 125K requests/month

🔒 **Secure**
- Environment variables on server
- No API keys in code
- Automatic HTTPS

---

## 🎯 Quick Deploy Commands

### For Netlify:
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify env:set TWITTER_BEARER_TOKEN "your_token"
netlify deploy --prod
```

### For Vercel:
```bash
npm install -g vercel
vercel login
vercel --prod
vercel env add TWITTER_BEARER_TOKEN
```

**No npm server needed in production!** Serverless functions handle everything. 🎉
