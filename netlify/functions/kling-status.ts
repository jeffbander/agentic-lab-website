import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const REPLICATE_API_URL = 'https://api.replicate.com/v1';

/**
 * Netlify Function Handler - Check Kling Video Status
 * GET /api/kling-status?id=<prediction_id>
 */
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
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

  const predictionId = event.queryStringParameters?.id;

  if (!predictionId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Prediction ID is required' }),
    };
  }

  try {
    const response = await fetch(`${REPLICATE_API_URL}/predictions/${predictionId}`, {
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Kling Status] API error: ${response.status} ${errorText}`);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          error: `Failed to get prediction status: ${response.status}`,
          details: errorText,
        }),
      };
    }

    const data = await response.json();

    // Map Replicate status to our format
    const status = data.status;
    const output = data.output;

    // Log progress
    if (status === 'processing' || status === 'starting') {
      console.log(`[Kling Status] ${predictionId}: ${status}`);
      if (data.logs) {
        console.log(`[Kling Status] Logs: ${data.logs.slice(-200)}`);
      }
    }

    // Build response based on status
    const result: Record<string, any> = {
      id: predictionId,
      status,
      model: 'kling-v2.5-turbo-pro',
    };

    if (status === 'succeeded' && output) {
      // Kling returns video URL directly in output
      const videoUrl = typeof output === 'string' ? output : output.video || output[0];
      result.videoUrl = videoUrl;
      result.generations = [{ id: predictionId, url: videoUrl }];
      console.log(`[Kling Status] ${predictionId}: succeeded - ${videoUrl}`);
    } else if (status === 'failed') {
      result.error = data.error || 'Video generation failed';
      console.error(`[Kling Status] ${predictionId}: failed - ${result.error}`);
    } else if (status === 'canceled') {
      result.error = 'Video generation was canceled';
    }

    // Include logs for debugging
    if (data.logs) {
      result.logs = data.logs;
    }

    // Include timing info
    if (data.started_at) {
      result.startedAt = data.started_at;
    }
    if (data.completed_at) {
      result.completedAt = data.completed_at;
    }

    // Include metrics if available
    if (data.metrics) {
      result.metrics = data.metrics;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result),
    };

  } catch (error) {
    console.error('[Kling Status] Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
    };
  }
};
