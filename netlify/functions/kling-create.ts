import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

interface KlingCreateRequest {
  prompt: string;
  duration?: 5 | 10;
  aspect_ratio?: '16:9' | '9:16' | '1:1';
  negative_prompt?: string;
  cfg_scale?: number;
}

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const REPLICATE_API_URL = 'https://api.replicate.com/v1';

// Kling 2.5 Turbo Pro model
const KLING_MODEL = 'kwaivgi/kling-v2.5-turbo-pro';
const KLING_VERSION = '939cd1851c5b112f284681b57ee9b0f36d0f913ba97de5845a7eef92d52837df';

/**
 * Sleep helper for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Creates a Kling video generation prediction with retry logic for rate limits
 */
async function createKlingVideo(
  prompt: string,
  duration: 5 | 10,
  aspect_ratio: '16:9' | '9:16' | '1:1',
  negative_prompt: string,
  cfg_scale: number,
  maxRetries: number = 3
): Promise<string> {
  console.log(`[Kling Create] Request params:`, {
    prompt: prompt.substring(0, 100) + '...',
    duration,
    aspect_ratio,
    cfg_scale,
  });

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const response = await fetch(`${REPLICATE_API_URL}/predictions`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: KLING_VERSION,
        input: {
          prompt,
          duration: String(duration), // API expects string
          aspect_ratio,
          negative_prompt,
          cfg_scale,
        },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.id;
    }

    const errorText = await response.text();

    // Check for rate limiting (429)
    if (response.status === 429) {
      let retryAfter = 10; // default 10 seconds
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.retry_after) {
          retryAfter = Math.ceil(errorJson.retry_after);
        }
      } catch {
        // Use default retry_after
      }

      console.log(`[Kling Create] Rate limited (attempt ${attempt}/${maxRetries}). Retrying in ${retryAfter}s...`);

      if (attempt < maxRetries) {
        await sleep(retryAfter * 1000);
        continue;
      }
    }

    lastError = new Error(`Failed to create Kling video: ${response.status} ${errorText}`);

    // For non-429 errors, don't retry
    if (response.status !== 429) {
      throw lastError;
    }
  }

  throw lastError || new Error('Failed to create Kling video after retries');
}

/**
 * Netlify Function Handler - Create Kling Video
 * POST /api/kling-create
 *
 * Benefits over Sora 2:
 * - 1080p resolution (vs 720p)
 * - Better motion quality and physics
 * - No OpenAI API key required
 * - Better style consistency
 */
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  if (!REPLICATE_API_TOKEN) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Replicate API token not configured.' }),
    };
  }

  try {
    const body: KlingCreateRequest = JSON.parse(event.body || '{}');

    if (!body.prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Prompt is required' }),
      };
    }

    // Set defaults optimized for patient education videos
    const duration = body.duration || 10; // 10 seconds default (max for Kling)
    const aspect_ratio = body.aspect_ratio || '16:9'; // Landscape for healthcare videos
    const negative_prompt = body.negative_prompt || 'blur, distort, low quality, text overlays, watermarks';
    const cfg_scale = body.cfg_scale ?? 0.5;

    // Validate duration
    if (duration !== 5 && duration !== 10) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Duration must be 5 or 10 seconds',
          hint: 'Kling 2.5 supports 5s or 10s videos'
        }),
      };
    }

    // Validate aspect ratio
    const validAspectRatios = ['16:9', '9:16', '1:1'];
    if (!validAspectRatios.includes(aspect_ratio)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: `Invalid aspect ratio. Must be one of: ${validAspectRatios.join(', ')}`,
          resolutions: {
            '16:9': '1920x1080',
            '9:16': '1080x1920',
            '1:1': '1440x1440'
          }
        }),
      };
    }

    console.log(`[Kling] Creating video (${duration}s, ${aspect_ratio})`);
    const jobId = await createKlingVideo(body.prompt, duration, aspect_ratio, negative_prompt, cfg_scale);
    console.log(`[Kling] Job created: ${jobId}`);

    return {
      statusCode: 202,
      headers,
      body: JSON.stringify({
        id: jobId,
        status: 'queued',
        model: KLING_MODEL,
        params: {
          duration,
          aspect_ratio,
          resolution: aspect_ratio === '16:9' ? '1920x1080' :
                      aspect_ratio === '9:16' ? '1080x1920' : '1440x1440'
        },
        message: 'Video generation job created. Poll /api/kling-status for updates.',
      }),
    };

  } catch (error) {
    console.error('[Kling] Error creating video:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
    };
  }
};
