import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

interface VideoGenerationRequest {
  prompt: string;
  width?: number;
  height?: number;
  duration?: number;
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
const SORA_MODEL = 'openai/sora-2';

/**
 * Creates a video generation prediction with Replicate Sora 2
 */
async function createPrediction(prompt: string, width: number, height: number, duration: number): Promise<string> {
  const response = await fetch(`${REPLICATE_API_URL}/predictions`, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: SORA_MODEL,
      input: {
        prompt,
        width,
        height,
        num_seconds: duration,
        quality: width >= 1920 ? 'pro' : 'standard', // Pro for 1080p+, standard for 720p
      },
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
 * Checks the status of a video generation prediction
 */
async function checkPredictionStatus(predictionId: string): Promise<ReplicatePrediction> {
  const response = await fetch(`${REPLICATE_API_URL}/predictions/${predictionId}`, {
    headers: {
      'Authorization': `Token ${REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to check prediction status: ${response.status} ${error}`);
  }

  return await response.json();
}

/**
 * Netlify Function Handler
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
        error: 'Replicate API token not configured. Please set REPLICATE_API_TOKEN environment variable.',
        setup: 'Run: node scripts/setup-video-generator.js'
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

    // Set defaults
    const width = body.width || 1280; // 720p default
    const height = body.height || 720;
    const duration = body.duration || 5;

    // Validate dimensions
    if (width < 128 || width > 1920 || height < 128 || height > 1920) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid dimensions. Width and height must be between 128 and 1920 pixels.' }),
      };
    }

    // Validate duration
    if (duration < 1 || duration > 20) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid duration. Must be between 1 and 20 seconds for Replicate.' }),
      };
    }

    // Create the video generation prediction
    console.log(`Creating prediction with prompt: "${body.prompt.substring(0, 50)}..."`);
    const predictionId = await createPrediction(body.prompt, width, height, duration);
    console.log(`Prediction created: ${predictionId}`);

    // Poll for completion (with timeout)
    const maxAttempts = 120; // 10 minutes max (5 second intervals)
    let attempts = 0;

    while (attempts < maxAttempts) {
      const prediction = await checkPredictionStatus(predictionId);

      if (prediction.status === 'succeeded') {
        console.log(`Video generation succeeded: ${predictionId}`);

        // Extract video URL from output
        let videoUrl: string;
        if (Array.isArray(prediction.output)) {
          videoUrl = prediction.output[0];
        } else {
          videoUrl = prediction.output as string;
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            jobId: predictionId,
            videoUrl,
            logs: prediction.logs,
          }),
        };
      }

      if (prediction.status === 'failed' || prediction.status === 'canceled') {
        console.error(`Video generation ${prediction.status}: ${prediction.error}`);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            error: prediction.error || `Video generation ${prediction.status}`,
            logs: prediction.logs,
          }),
        };
      }

      // Still processing
      console.log(`Attempt ${attempts + 1}/${maxAttempts}: Status = ${prediction.status}`);

      // Wait 5 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 5000));
      attempts++;
    }

    // Timeout
    console.error(`Video generation timed out after ${maxAttempts * 5} seconds`);
    return {
      statusCode: 408,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Video generation timed out. The video may still be processing. Check Replicate dashboard.',
        jobId: predictionId,
      }),
    };

  } catch (error) {
    console.error('Error generating video:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error instanceof Error ? error.stack : undefined
      }),
    };
  }
};
