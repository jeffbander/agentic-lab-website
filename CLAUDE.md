# Claude Development Configuration

## Development Server

The development service should run on port 8000.

### Commands

- `npm run dev` - Start the Netlify dev server on port 8000
- `npm run dev:vite` - Start Vite dev server directly
- `npm run build` - Build the production version
- `npm run preview` - Preview the production build

### Port Configuration

The dev server is configured to run on port 8000 in the netlify.toml file.

## Environment Variables Setup

### Local Development

1. **Create your local environment file:**
   ```bash
   # The .env file already exists in the root directory
   # Edit it to add your API keys
   ```

2. **Add your API keys to `.env`:**

   Open the `.env` file and add your keys:

   ```bash
   # Replicate API token (for AI features)
   REPLICATE_API_TOKEN=r8_your_token_here

   # OpenAI API Key (for Sora 2 video generation)
   OPENAI_API_KEY=sk-your_openai_key_here

   # Google Analytics (optional)
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

3. **Important Notes:**
   - The `.env` file is already in `.gitignore` and will NOT be committed to git
   - Never share or commit your API keys
   - Variables prefixed with `VITE_` are exposed to the client-side code
   - Variables without `VITE_` prefix are only available in serverless functions

### Netlify Deployment

To use the same environment variables in production:

1. **Go to Netlify Dashboard:**
   - Navigate to your site
   - Go to Site settings → Environment variables

2. **Add the same variables:**
   - `REPLICATE_API_TOKEN` = your replicate token
   - `OPENAI_API_KEY` = your openai key
   - `VITE_GA_MEASUREMENT_ID` = your GA ID (if using)

3. **Deploy:**
   - Netlify will automatically use these variables in production
   - Serverless functions will have access to all environment variables
   - Client-side code will only have access to `VITE_*` prefixed variables

### Testing Environment Variables

After adding your keys, restart the dev server:

```bash
# Stop the current dev server (Ctrl+C)
# Start it again
npm run dev
```

The serverless functions at `/api/*` will now have access to your API keys.
