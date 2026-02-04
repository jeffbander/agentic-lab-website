# Quick Video Generator Setup (5 Minutes!)

## ✅ Works with Google Cloud, AWS, Azure, or NO cloud at all!

---

## 🚀 Super Fast Setup (CLI Tool)

Run this ONE command and follow the interactive prompts:

```bash
npm run setup:video
```

The setup tool will:
1. Guide you to create a free Replicate account
2. Help you get your API token
3. Configure everything automatically
4. Test your connection

---

## 📱 Manual Setup (3 Steps)

### Step 1: Get Replicate API Token (2 minutes)

1. Go to [https://replicate.com](https://replicate.com)
2. Click "Sign up" (free!)
3. Go to [https://replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)
4. Click "Create token"
5. Copy your token (starts with `r8_...`)

### Step 2: Configure Locally (30 seconds)

Create a `.env` file:

```bash
# Copy the example
cp .env.example .env

# Edit .env and add your token
REPLICATE_API_TOKEN=r8_your_token_here
```

### Step 3: Start Dev Server (10 seconds)

```bash
npm run dev
```

Visit: `http://localhost:5173/#video-generator`

---

## 🌐 Deploy to Netlify (Production)

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site
3. Go to: **Site settings** > **Environment variables**
4. Click "Add a variable"
5. Add:
   - **Name**: `REPLICATE_API_TOKEN`
   - **Value**: `r8_your_token_here`
6. Push to GitHub - Netlify auto-deploys!

---

## 💰 Pricing (Super Affordable!)

- **Free credits** to start
- **$0.10/second** for 720p (standard)
- **$0.50/second** for 1080p (pro)

Examples:
- 5-second video @ 720p = **$0.50**
- 10-second video @ 1080p = **$5.00**
- 20 videos/month @ 720p = **~$20/month**

---

## ❓ Why Replicate Instead of Azure?

| Feature | Replicate | Azure |
|---------|-----------|-------|
| **Setup Time** | 2 minutes | 30+ minutes |
| **Cloud Required** | NO ✅ | YES ❌ |
| **Works with GCP** | YES ✅ | NO ❌ |
| **Free Trial** | YES ✅ | Limited |
| **Pricing** | $0.10-0.50/sec | $0.10-0.30/sec |
| **API Simplicity** | Simple ✅ | Complex ❌ |

---

## 🐛 Troubleshooting

**Error: "Replicate API token not configured"**
- Run: `npm run setup:video`
- OR: Check your `.env` file exists
- OR: Restart dev server

**Error: "Failed to create prediction: 401"**
- Your API token is invalid
- Get a new one: [https://replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)

**Video generation slow/timeout**
- Normal: 2-5 minutes
- Check Replicate dashboard: [https://replicate.com/account](https://replicate.com/account)

---

## 📚 Full Documentation

Need more details? See [VIDEO_GENERATOR_SETUP.md](./VIDEO_GENERATOR_SETUP.md)

---

## 🎉 That's It!

You're ready to generate AI videos! No Azure, No GCP required! 🚀
