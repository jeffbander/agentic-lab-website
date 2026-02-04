import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

// Supported video generation models
type VideoModel = 'sora-2' | 'sora-2-pro' | 'wan-2.5' | 'hailuo-2.3' | 'kling-2.5' | 'veo-3.1-fast';

interface SoraCreateRequest {
  prompt: string;
  width?: number;
  height?: number;
  n_seconds?: number;
  model?: VideoModel;
}

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const REPLICATE_API_URL = 'https://api.replicate.com/v1';

// Model versions for video generation on Replicate
// Updated Jan 2026 with correct model identifiers
const VIDEO_MODEL_VERSIONS: Record<string, string> = {
  // OpenAI Sora models (via Replicate) - NOTE: May need OpenAI API key
  'sora-2': 'openai/sora-2',
  'sora-2-pro': 'openai/sora-2-pro',
  // Google Veo 3.1 Fast - State-of-the-art quality, context-aware audio
  'veo-3.1-fast': 'google/veo-3.1-fast',
  // Alibaba Wan 2.5 T2V Fast - Great for audio sync, lip-sync, multi-language, budget-friendly
  'wan-2.5': 'wan-video/wan-2.5-t2v-fast',
  // MiniMax Hailuo - Excellent for realistic human motion, medical content
  'hailuo-2.3': 'minimax/video-01',
  // Kling 2.5 - Cinematic quality, smooth motion
  'kling-2.5': 'kwaai/kling-v1.6-pro',
};

// Model-specific configuration
interface ModelConfig {
  requiresOpenAIKey: boolean;
  supportedDurations: number[];
  supportedResolutions: { width: number; height: number; label: string }[];
  maxDuration: number;
  usesAspectRatio: boolean;
}

const MODEL_CONFIGS: Record<string, ModelConfig> = {
  'sora-2': {
    requiresOpenAIKey: true,
    supportedDurations: [4, 8, 12],
    supportedResolutions: [
      { width: 1280, height: 720, label: 'landscape' },
      { width: 720, height: 1280, label: 'portrait' },
    ],
    maxDuration: 12,
    usesAspectRatio: true,
  },
  'sora-2-pro': {
    requiresOpenAIKey: true,
    supportedDurations: [4, 8, 12],
    supportedResolutions: [
      { width: 1280, height: 720, label: 'landscape' },
      { width: 720, height: 1280, label: 'portrait' },
    ],
    maxDuration: 12,
    usesAspectRatio: true,
  },
  'wan-2.5': {
    requiresOpenAIKey: false,
    supportedDurations: [5, 10],
    supportedResolutions: [
      { width: 1280, height: 720, label: '720p' },
      { width: 1920, height: 1080, label: '1080p' },
      { width: 720, height: 1280, label: 'portrait-720p' },
      { width: 1080, height: 1920, label: 'portrait-1080p' },
    ],
    maxDuration: 10,
    usesAspectRatio: false,
  },
  'hailuo-2.3': {
    requiresOpenAIKey: false,
    supportedDurations: [6, 10], // 10s only at 768p
    supportedResolutions: [
      { width: 1365, height: 768, label: '768p' },
      { width: 1920, height: 1080, label: '1080p' }, // 1080p only supports 6s
    ],
    maxDuration: 10,
    usesAspectRatio: false,
  },
  'kling-2.5': {
    requiresOpenAIKey: false,
    supportedDurations: [5, 10],
    supportedResolutions: [
      { width: 1280, height: 720, label: '16:9' },
      { width: 720, height: 1280, label: '9:16' },
      { width: 1080, height: 1080, label: '1:1' },
    ],
    maxDuration: 10,
    usesAspectRatio: true,
  },
  'veo-3.1-fast': {
    requiresOpenAIKey: false,
    supportedDurations: [5, 8],
    supportedResolutions: [
      { width: 1280, height: 720, label: '720p' },
      { width: 1920, height: 1080, label: '1080p' },
    ],
    maxDuration: 8,
    usesAspectRatio: false,
  },
};

/**
 * Sleep helper for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Build input parameters for different video models
 */
function buildModelInput(
  model: VideoModel,
  prompt: string,
  width: number,
  height: number,
  duration: number
): Record<string, unknown> {

  switch (model) {
    case 'sora-2':
    case 'sora-2-pro': {
      // Sora uses aspect_ratio and seconds
      const aspect_ratio = width > height ? 'landscape' : 'portrait';
      const validSeconds = duration <= 6 ? 4 : duration <= 10 ? 8 : 12;
      return {
        prompt,
        aspect_ratio,
        seconds: validSeconds,
        openai_api_key: OPENAI_API_KEY,
      };
    }

    case 'wan-2.5': {
      // Wan 2.5 uses size string (with * separator) and duration
      // Valid sizes: 1280*720, 720*1280, 1920*1080, 1080*1920
      const size = `${width}*${height}`;
      const validDuration = duration <= 7 ? 5 : 10;
      return {
        prompt,
        size,
        duration: validDuration,
        enable_prompt_expansion: true,
      };
    }

    case 'hailuo-2.3': {
      // Hailuo uses resolution string and duration
      // 1080p only supports 6s, 768p supports 6 or 10s
      const is1080p = width >= 1920 || height >= 1080;
      const resolution = is1080p ? '1080p' : '768p';
      const validDuration = is1080p ? 6 : (duration <= 8 ? 6 : 10);
      return {
        prompt,
        resolution,
        duration: validDuration,
        prompt_optimizer: true,
      };
    }

    case 'kling-2.5': {
      // Kling uses aspect_ratio
      let aspect_ratio = '16:9';
      if (width < height) {
        aspect_ratio = '9:16';
      } else if (width === height) {
        aspect_ratio = '1:1';
      }
      const validDuration = duration <= 7 ? 5 : 10;
      return {
        prompt,
        aspect_ratio,
        duration: validDuration,
      };
    }

    case 'veo-3.1-fast': {
      // Veo 3.1 Fast uses width/height and duration
      const validWidth = width >= 1920 ? 1920 : 1280;
      const validHeight = height >= 1080 ? 1080 : 720;
      const validDuration = duration <= 6 ? 5 : 8;
      return {
        prompt,
        width: validWidth,
        height: validHeight,
        duration: validDuration,
      };
    }

    default:
      throw new Error(`Unknown model: ${model}`);
  }
}

/**
 * Creates a video generation prediction with retry logic for rate limits
 * Supports multiple models: Sora 2, Wan 2.5, Hailuo 2.3, Kling 2.5
 */
async function createVideoJob(
  prompt: string,
  width: number,
  height: number,
  n_seconds: number,
  model: VideoModel = 'sora-2-pro',
  maxRetries: number = 3
): Promise<string> {
  const config = MODEL_CONFIGS[model];
  if (!config) {
    throw new Error(`Unknown model: ${model}. Supported: ${Object.keys(MODEL_CONFIGS).join(', ')}`);
  }

  // Build model-specific input
  const input = buildModelInput(model, prompt, width, height, n_seconds);
  const modelVersion = VIDEO_MODEL_VERSIONS[model];

  console.log(`[Video Create] Request params:`, {
    prompt: prompt.substring(0, 100) + '...',
    model,
    input: { ...input, prompt: '(truncated)' },
  });

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    // Use model identifier format (owner/model) instead of version hash
    // Don't use 'Prefer: wait' - Netlify functions timeout after 10s
    const response = await fetch(`${REPLICATE_API_URL}/models/${modelVersion}/predictions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`[Video Create] Job created: ${data.id} (model: ${model})`);
      return data.id;
    }

    const errorText = await response.text();

    // Check for rate limiting (429)
    if (response.status === 429) {
      // Parse retry_after from response if available
      let retryAfter = 10; // default 10 seconds
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.retry_after) {
          retryAfter = Math.ceil(errorJson.retry_after);
        }
      } catch {
        // Use default retry_after
      }

      console.log(`[Video Create] Rate limited (attempt ${attempt}/${maxRetries}). Retrying in ${retryAfter}s...`);

      if (attempt < maxRetries) {
        await sleep(retryAfter * 1000);
        continue;
      }
    }

    lastError = new Error(`Failed to create video (${model}): ${response.status} ${errorText}`);

    // For non-429 errors, don't retry
    if (response.status !== 429) {
      throw lastError;
    }
  }

  throw lastError || new Error(`Failed to create video after ${maxRetries} retries`);
}

/**
 * Netlify Function Handler - Create Video
 * POST /api/sora-create
 *
 * Supports multiple models for patient education videos:
 * - sora-2, sora-2-pro: OpenAI Sora (high quality, 4/8/12s)
 * - wan-2.5: Alibaba Wan (audio sync, lip-sync, budget-friendly, 5/10s)
 * - hailuo-2.3: MiniMax Hailuo (realistic human motion, 6/10s)
 * - kling-2.5: Kling (cinematic quality, smooth motion, 5/10s)
 */
export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
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
    const width = body.width || 1920;
    const height = body.height || 1080;
    const n_seconds = body.n_seconds || 12;
    const model = (body.model || 'wan-2.5') as VideoModel; // Default to Wan 2.5 (best value)

    // Validate model
    const validModels = Object.keys(VIDEO_MODEL_VERSIONS);
    if (!validModels.includes(model)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: `Invalid model: ${model}. Supported: ${validModels.join(', ')}`,
        }),
      };
    }

    // Check if OpenAI key is needed for Sora models
    const config = MODEL_CONFIGS[model];
    if (config.requiresOpenAIKey && !OPENAI_API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: `OpenAI API key required for ${model}. Try wan-2.5 or hailuo-2.3 instead.`,
        }),
      };
    }

    // Validate duration
    if (n_seconds < 1) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Duration must be at least 1 second.',
        }),
      };
    }

    // Log model-specific info
    const maxDuration = config.maxDuration;
    if (n_seconds > maxDuration) {
      console.log(`[Video] NOTE: Requested ${n_seconds}s but ${model} max is ${maxDuration}s. Will clamp.`);
    }

    // Create the video generation job
    console.log(`[Video] Creating patient education video (${model}, ${n_seconds}s, ${width}x${height})`);
    const jobId = await createVideoJob(body.prompt, width, height, n_seconds, model);

    // Return immediately with job ID (async pattern)
    return {
      statusCode: 202, // 202 Accepted
      headers,
      body: JSON.stringify({
        id: jobId,
        status: 'queued',
        model: model,
        message: `Video generation started with ${model}. Poll /api/sora-status for updates.`,
      }),
    };

  } catch (error) {
    console.error('[Video] Error creating video:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
    };
  }
};
