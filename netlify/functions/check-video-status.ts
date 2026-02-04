import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

interface ReplicatePrediction {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  output?: string | string[];
  error?: string;
  logs?: string;
}

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const REPLICATE_API_URL = 'https://api.replicate.com/v1';

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
 * Netlify Function Handler - Check Video Generation Status
 */
export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
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
    // Get prediction ID from query string
    const predictionId = event.queryStringParameters?.id;

    if (!predictionId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Prediction ID is required' }),
      };
    }

    // Check the prediction status
    const prediction = await checkPredictionStatus(predictionId);

    // Return status
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
          status: 'succeeded',
          videoUrl,
          logs: prediction.logs,
        }),
      };
    }

    if (prediction.status === 'failed' || prediction.status === 'canceled') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: prediction.status,
          error: prediction.error || `Video generation ${prediction.status}`,
          logs: prediction.logs,
        }),
      };
    }

    // Still processing
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: prediction.status,
        logs: prediction.logs,
      }),
    };

  } catch (error) {
    console.error('Error checking video status:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
    };
  }
};
