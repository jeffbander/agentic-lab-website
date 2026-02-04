# Video Generator Setup Guide

## Prerequisites

You need TWO API keys:
1. **Replicate API Token** - r8_...
2. **OpenAI API Key** - sk-...

## Quick Setup

### 1. Get Replicate API Token
- Go to: https://replicate.com/account/api-tokens
- Create token, copy it (starts with r8_)

### 2. Get OpenAI API Key  
- Go to: https://platform.openai.com/api-keys
- Create key, copy it (starts with sk-)

### 3. Add to .env file

REPLICATE_API_TOKEN=r8_YOUR_TOKEN
OPENAI_API_KEY=sk_YOUR_KEY

### 4. Add Billing
- Replicate: https://replicate.com/account/billing ($5 minimum)
- OpenAI: https://platform.openai.com/settings/organization/billing

### 5. Start Server

npm run dev

Access: http://localhost:8888/#video-generator
