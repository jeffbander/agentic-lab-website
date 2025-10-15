# Video Generator Setup Guide
## Azure OpenAI Sora 2 Integration

This guide walks you through setting up the AI Video Generator feature on your Mount Sinai Agentic Laboratory website.

---

## Prerequisites

1. **Azure Account** with OpenAI access
2. **Netlify Account** (for serverless functions)
3. **Node.js 20+** installed locally

---

## Step 1: Get Azure OpenAI Access

### Option A: Apply for Azure OpenAI Access

1. Go to [https://portal.azure.com](https://portal.azure.com)
2. Create or sign in to your Azure account
3. Apply for Azure OpenAI access:
   - Navigate to **Azure OpenAI Service**
   - Request access if you don't have it yet
   - Wait for approval (can take 1-3 business days)

### Option B: Use Existing Azure OpenAI Resource

If your organization already has Azure OpenAI:

1. Navigate to your Azure OpenAI resource
2. Go to **Keys and Endpoint** section
3. Copy:
   - **Endpoint URL** (e.g., `https://your-resource.openai.azure.com`)
   - **API Key** (Key 1 or Key 2)

---

## Step 2: Deploy Sora 2 Model in Azure

1. In Azure OpenAI Studio:
   - Go to **Deployments**
   - Click **Create new deployment**
   - Select model: **Sora 2** (or latest Sora version)
   - Name your deployment: `sora` (recommended)
   - Configure capacity settings
   - Click **Deploy**

2. Wait for deployment to complete (2-5 minutes)

3. Note your deployment name (you'll need this for environment variables)

---

## Step 3: Configure Environment Variables

### Local Development (.env file)

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your Azure credentials:
   ```env
   # Azure OpenAI Sora 2 API Configuration
   VITE_AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
   VITE_AZURE_OPENAI_API_KEY=your-api-key-here
   VITE_AZURE_OPENAI_API_VERSION=preview
   VITE_AZURE_OPENAI_MODEL=sora

   # Google Analytics (optional)
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

3. **IMPORTANT**: Add `.env` to your `.gitignore`:
   ```bash
   echo ".env" >> .gitignore
   ```

### Netlify Production Environment

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site
3. Navigate to **Site settings** > **Environment variables**
4. Click **Add a variable**
5. Add these variables:

   | Variable | Value | Description |
   |----------|-------|-------------|
   | `AZURE_OPENAI_ENDPOINT` | `https://your-resource.openai.azure.com` | Your Azure OpenAI endpoint |
   | `AZURE_OPENAI_API_KEY` | `your-api-key-here` | Your Azure OpenAI API key |
   | `AZURE_OPENAI_API_VERSION` | `preview` | API version (use "preview" for Sora) |
   | `AZURE_OPENAI_MODEL` | `sora` | Your deployment name |

6. Click **Save**

**Note**: In Netlify Functions, we use `AZURE_OPENAI_*` (without `VITE_` prefix) for server-side variables.

---

## Step 4: Test Locally

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the Video Generator section: `http://localhost:5173/#video-generator`

3. Select a preset prompt (e.g., "Cinematic Hospital Exterior")

4. Click **Generate Video**

5. Wait 2-5 minutes for generation

6. Check browser console for any errors

### Common Issues:

**Error: "Azure OpenAI credentials not configured"**
- Solution: Make sure `.env` file exists and has correct values
- Restart dev server after adding/changing `.env`

**Error: "Failed to create video job: 401"**
- Solution: Check your API key is correct
- Verify your Azure OpenAI resource is active

**Error: "Failed to create video job: 403"**
- Solution: Ensure your organization has Sora 2 access
- Check if you need to verify your organization at [platform.openai.com/settings/organization/general](https://platform.openai.com/settings/organization/general)

**Error: "Video generation timed out"**
- Solution: This is normal for complex prompts
- Try a shorter duration (5 seconds instead of 10-15)
- Try again with lower resolution (720p instead of 1080p)

---

## Step 5: Deploy to Production

1. Commit your changes (WITHOUT `.env` file):
   ```bash
   git add .
   git commit -m "feat: Add AI video generator with Sora 2 integration"
   git push origin main
   ```

2. Netlify will automatically deploy

3. After deployment, verify environment variables are set in Netlify Dashboard

4. Test on production: `https://your-site.netlify.app/#video-generator`

---

## Step 6: Monitor and Optimize

### Check Netlify Function Logs

1. Go to Netlify Dashboard > **Functions**
2. Click on **generate-video**
3. View real-time logs

### Monitor Azure OpenAI Usage

1. Go to Azure Portal
2. Navigate to your OpenAI resource
3. Go to **Metrics**
4. Monitor:
   - Token usage
   - API calls
   - Errors
   - Latency

### Cost Estimation

**Azure OpenAI Sora 2 Pricing** (as of 2025):
- ~$0.10-0.30 per video (depending on duration and resolution)
- 10 videos/day = ~$3-9/day
- 300 videos/month = ~$90-270/month

**Recommendations:**
- Start with low-resolution presets (480p)
- Set usage limits in Azure
- Monitor costs weekly
- Consider rate limiting if usage is high

---

## API Reference

### Netlify Function Endpoint

**POST** `/api/generate-video`

**Request Body:**
```json
{
  "prompt": "A cinematic shot of Mount Sinai West Hospital...",
  "width": 1920,
  "height": 1080,
  "duration": 10
}
```

**Response (Success):**
```json
{
  "success": true,
  "jobId": "job-12345",
  "videoUrl": "https://..."
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message here"
}
```

### Video Specifications

| Parameter | Min | Max | Recommended |
|-----------|-----|-----|-------------|
| Width | 128px | 1920px | 1920px (Full HD) |
| Height | 128px | 1920px | 1080px (Full HD) |
| Duration | 1s | 60s | 5-10s |

**Aspect Ratios:**
- 16:9 (landscape): 1920x1080
- 9:16 (portrait): 1080x1920
- 1:1 (square): 1080x1080

---

## Security Best Practices

1. **Never commit `.env` files** to Git
2. **Rotate API keys** every 90 days
3. **Use separate keys** for development and production
4. **Enable Azure Private Endpoint** for production
5. **Implement rate limiting** to prevent abuse
6. **Monitor usage alerts** in Azure
7. **Restrict CORS** to your domain only

---

## Troubleshooting

### Video Generation Fails

1. **Check Azure Portal**:
   - Is your OpenAI resource active?
   - Do you have sufficient quota?
   - Are there any service outages?

2. **Check Netlify Logs**:
   - Navigate to Netlify Dashboard > Functions > generate-video
   - Look for error messages
   - Check if environment variables are set

3. **Check Browser Console**:
   - Open Developer Tools (F12)
   - Look for network errors
   - Check API response

### Slow Generation Times

- Normal: 2-5 minutes
- Slow: 5-10 minutes (try lower resolution)
- Very slow: 10+ minutes (reduce duration, simplify prompt)

### Content Moderation Errors

Azure OpenAI filters harmful content. If you get moderation errors:
- Avoid violent or inappropriate content
- Use professional healthcare language
- Focus on medical and educational topics

---

## Advanced Configuration

### Custom Prompts

For best results with custom prompts, include:
- **Camera movement**: "slow pan", "aerial shot", "close-up"
- **Lighting**: "golden hour", "soft lighting", "dramatic"
- **Setting**: Specific location details
- **Colors**: Mount Sinai brand colors (#06ABEB cyan, #DC298D magenta)
- **Quality**: "4K", "cinematic", "professional"

Example:
```
A slow tracking shot through Mount Sinai West Hospital's modern
lobby at 1000 Tenth Avenue. Warm morning light streams through
floor-to-ceiling windows. Medical professionals in cyan scrubs
collaborate around an AI holographic display showing patient data.
Mount Sinai logo visible on wall. Professional documentary style,
shot on RED camera, 4K resolution.
```

### Rate Limiting

To prevent abuse, add rate limiting to your Netlify function:

```typescript
// Add to netlify/functions/generate-video.ts
const rateLimitMap = new Map();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = 5; // 5 videos per hour
  const window = 60 * 60 * 1000; // 1 hour

  const userRequests = rateLimitMap.get(ip) || [];
  const recentRequests = userRequests.filter(time => now - time < window);

  if (recentRequests.length >= limit) {
    return false;
  }

  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
}
```

---

## Support

**Azure OpenAI Support:**
- Documentation: [https://learn.microsoft.com/en-us/azure/ai-foundry/openai/](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/)
- Support: Create ticket in Azure Portal

**Netlify Support:**
- Documentation: [https://docs.netlify.com](https://docs.netlify.com)
- Community: [https://answers.netlify.com](https://answers.netlify.com)

**Website Issues:**
- GitHub: [https://github.com/jeffbander/agentic-lab-website/issues](https://github.com/jeffbander/agentic-lab-website/issues)

---

## Next Steps

1. ✅ Complete setup and test locally
2. ✅ Deploy to production
3. ✅ Generate sample videos with preset prompts
4. 📊 Monitor usage and costs
5. 🎨 Experiment with custom prompts
6. 🔒 Implement additional security measures
7. 📈 Scale based on user feedback

---

**Last Updated:** January 2025
**Sora Version:** 2.0
**API Version:** preview
