import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

interface ReplicatePrediction {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled' | 'queued';
  output?: string | string[];
  error?: string;
  logs?: string;
  metrics?: {
    predict_time?: number;
  };
}

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const REPLICATE_API_URL = 'https://api.replicate.com/v1';

/**
 * Checks the status of a Sora video generation prediction
 */
async function checkSoraStatus(jobId: string): Promise<ReplicatePrediction> {
  const response = await fetch(`${REPLICATE_API_URL}/predictions/${jobId}`, {
    headers: {
      'Authorization': `Token ${REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to check status: ${response.status} ${error}`);
  }

  return await response.json();
}

/**
 * Netlify Function Handler - Check Sora Video Status
 * GET /api/sora/status?id=job_123
 */
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: '',
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
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
    // Get job ID from query string
    const jobId = event.queryStringParameters?.id;

    if (!jobId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Job ID is required (?id=job_123)' }),
      };
    }

    // Check the prediction status
    console.log(`[Sora Status] Checking status for job: ${jobId}`);
    const prediction = await checkSoraStatus(jobId);
    console.log(`[Sora Status] Replicate response:`, JSON.stringify(prediction, null, 2));

    // Return status based on prediction state
    if (prediction.status === 'succeeded') {
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
          id: jobId,
          status: 'succeeded',
          generations: [
            {
              id: `${jobId}_gen`,
              url: videoUrl,
            },
          ],
          videoUrl, // For backward compatibility
          logs: prediction.logs,
        }),
      };
    }

    if (prediction.status === 'failed' || prediction.status === 'canceled') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          id: jobId,
          status: prediction.status,
          error: prediction.error || `Video generation ${prediction.status}`,
          logs: prediction.logs,
        }),
      };
    }

    // Still processing (queued/starting/processing)
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        id: jobId,
        status: prediction.status,
        logs: prediction.logs,
      }),
    };

  } catch (error) {
    console.error('[Sora] Error checking status:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
    };
  }
};
