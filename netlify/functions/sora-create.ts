import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

interface SoraCreateRequest {
  prompt: string;
  width?: number;
  height?: number;
  n_seconds?: number;
}

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const REPLICATE_API_URL = 'https://api.replicate.com/v1';
const SORA_MODEL_VERSION = '299f052ab4dd6c750621f8e2ce48e26edcde381ab041d61a7ec57785cef5b0d3';

/**
 * Creates a Sora video generation prediction
 */
async function createSoraVideo(
  prompt: string,
  width: number,
  height: number,
  n_seconds: number
): Promise<string> {
  // Replicate Sora-2 API only supports:
  // - aspect_ratio: "portrait" (720x1280) or "landscape" (1280x720)
  // - seconds: 4, 8, or 12 (max 12 seconds!)

  const aspect_ratio = width > height ? 'landscape' : 'portrait';

  // Clamp to maximum supported duration (12 seconds)
  const seconds = Math.min(Math.max(4, Math.round(n_seconds / 4) * 4), 12);
  if (seconds === 4 || seconds % 4 !== 0) {
    // Round to nearest valid value: 4, 8, or 12
    const validSeconds = seconds <= 6 ? 4 : seconds <= 10 ? 8 : 12;
    console.log(`[Sora Create] Adjusted duration from ${n_seconds}s to ${validSeconds}s (Replicate limit)`);
  }
  const finalSeconds = seconds <= 6 ? 4 : seconds <= 10 ? 8 : 12;

  console.log(`[Sora Create] Request params:`, {
    prompt: prompt.substring(0, 100) + '...',
    aspect_ratio,
    seconds: finalSeconds,
    requested: { width, height, n_seconds },
    actual: { width: aspect_ratio === 'landscape' ? 1280 : 720, height: aspect_ratio === 'landscape' ? 720 : 1280 }
  });

  const response = await fetch(`${REPLICATE_API_URL}/predictions`, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: SORA_MODEL_VERSION,
      input: {
        prompt,
        aspect_ratio,
        seconds: finalSeconds,
        openai_api_key: OPENAI_API_KEY,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create Sora video: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.id;
}

/**
 * Netlify Function Handler - Create Sora Video
 * POST /api/sora/create
 */
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Validate environment variables
  if (!REPLICATE_API_TOKEN) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Replicate API token not configured.',
      }),
    };
  }

  if (!OPENAI_API_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'OpenAI API key not configured.',
      }),
    };
  }

  try {
    const body: SoraCreateRequest = JSON.parse(event.body || '{}');

    // Validate request
    if (!body.prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Prompt is required' }),
      };
    }

    // Set defaults for patient education videos
    // NOTE: Replicate Sora-2 API limits: max 12 seconds, only 720p or 1280x720
    const width = body.width || 1920;
    const height = body.height || 1080;
    const n_seconds = body.n_seconds || 12; // Changed default from 20 to 12

    // Validate constraints
    if (n_seconds < 1) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Duration must be at least 1 second.',
        }),
      };
    }

    // Warn if requesting more than 12 seconds (will be clamped)
    if (n_seconds > 12) {
      console.log(`[Sora] WARNING: Requested ${n_seconds}s but Replicate Sora-2 max is 12s. Will clamp to 12s.`);
    }

    // Create the video generation job
    console.log(`[Sora] Creating patient education video (${n_seconds}s, ${width}x${height})`);
    const jobId = await createSoraVideo(body.prompt, width, height, n_seconds);
    console.log(`[Sora] Job created: ${jobId}`);

    // Return immediately with job ID (async pattern)
    return {
      statusCode: 202, // 202 Accepted
      headers,
      body: JSON.stringify({
        id: jobId,
        status: 'queued',
        message: 'Video generation job created. Poll /api/sora/status for updates.',
      }),
    };

  } catch (error) {
    console.error('[Sora] Error creating video:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
    };
  }
};
