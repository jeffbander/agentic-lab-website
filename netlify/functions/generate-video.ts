import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

interface VideoGenerationRequest {
  prompt: string;
  duration?: number;
  aspect_ratio?: '16:9' | '9:16';
  resolution?: '720p' | '1080p';
  reference_images?: string[]; // Base64 encoded images or URLs
  negative_prompt?: string;
  generate_audio?: boolean;
}

interface ReplicatePrediction {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  output?: string | string[];
  error?: string;
  logs?: string;
}

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const REPLICATE_API_URL = 'https://api.replicate.com/v1';
// Google Veo 3.1 model on Replicate
const VEO_MODEL_VERSION = 'ed5b1767b711dd15d954b162af1e890d27882680f463a85e94f02d604012b972';

/**
 * Creates a video generation prediction with Google Veo 3.1
 */
async function createPrediction(
  prompt: string,
  duration: number,
  aspect_ratio: string,
  resolution: string,
  reference_images?: string[],
  negative_prompt?: string,
  generate_audio?: boolean
): Promise<string> {
  // Build input parameters for Veo 3.1
  const input: Record<string, unknown> = {
    prompt,
    duration,
    aspect_ratio,
    resolution,
    generate_audio: generate_audio ?? true,
  };

  // Add reference images if provided (up to 3)
  // Note: Reference images only work with 16:9 aspect ratio and 8-second duration
  if (reference_images && reference_images.length > 0) {
    input.reference_images = reference_images.slice(0, 3); // Max 3 images
    // Force compatible settings for reference images
    input.aspect_ratio = '16:9';
    input.duration = 8;
    console.log(`[Veo 3.1] Using ${reference_images.length} reference image(s)`);
  }

  if (negative_prompt) {
    input.negative_prompt = negative_prompt;
  }

  console.log(`[Veo 3.1] Creating prediction:`, {
    prompt: prompt.substring(0, 100) + '...',
    duration: input.duration,
    aspect_ratio: input.aspect_ratio,
    resolution,
    has_reference_images: !!reference_images?.length,
  });

  const response = await fetch(`${REPLICATE_API_URL}/predictions`, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: VEO_MODEL_VERSION,
      input,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create prediction: ${response.status} ${error}`);
  }

  const data: ReplicatePrediction = await response.json();
  return data.id;
}

/**
 * Netlify Function Handler
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
        error: 'Replicate API token not configured. Please set REPLICATE_API_TOKEN environment variable.',
      }),
    };
  }

  try {
    const body: VideoGenerationRequest = JSON.parse(event.body || '{}');

    // Validate request
    if (!body.prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Prompt is required' }),
      };
    }

    // Set defaults for Veo 3.1
    const duration = body.duration || 8; // Veo supports 4, 6, or 8 seconds
    const aspect_ratio = body.aspect_ratio || '16:9';
    const resolution = body.resolution || '1080p';
    const reference_images = body.reference_images;
    const negative_prompt = body.negative_prompt;
    const generate_audio = body.generate_audio;

    // Validate duration (Veo 3.1 supports 4, 6, or 8 seconds)
    const validDurations = [4, 6, 8];
    const finalDuration = validDurations.includes(duration) ? duration : 8;
    if (!validDurations.includes(duration)) {
      console.log(`[Veo 3.1] Adjusted duration from ${duration}s to ${finalDuration}s (valid: 4, 6, 8)`);
    }

    // Validate reference images
    if (reference_images && reference_images.length > 3) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Maximum 3 reference images allowed for Veo 3.1'
        }),
      };
    }

    // Create the video generation prediction
    const predictionId = await createPrediction(
      body.prompt,
      finalDuration,
      aspect_ratio,
      resolution,
      reference_images,
      negative_prompt,
      generate_audio
    );
    console.log(`[Veo 3.1] Prediction created: ${predictionId}`);

    // Return immediately with the job ID
    return {
      statusCode: 202,
      headers,
      body: JSON.stringify({
        success: true,
        jobId: predictionId,
        status: 'processing',
        message: 'Video generation started with Veo 3.1. Use the jobId to check status.',
        model: 'veo-3.1',
      }),
    };

  } catch (error) {
    console.error('[Veo 3.1] Error generating video:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
    };
  }
};
