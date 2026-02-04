import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

/**
 * Netlify Function Handler - Download Sora Video
 * GET /api/sora/download?url=https://replicate.delivery/...
 *
 * Simple redirect to Replicate CDN URL (videos are publicly accessible)
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

  try {
    // Get video URL from query string
    const videoUrl = event.queryStringParameters?.url;

    if (!videoUrl) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Video URL is required (?url=https://...)' }),
      };
    }

    // Validate URL is from Replicate
    if (!videoUrl.includes('replicate.delivery') && !videoUrl.includes('replicate.com')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid video URL. Must be from Replicate CDN.' }),
      };
    }

    // Redirect to the video URL
    // Replicate CDN URLs are publicly accessible and permanent
    return {
      statusCode: 302,
      headers: {
        ...headers,
        'Location': videoUrl,
        'Cache-Control': 'private, max-age=3600',
      },
      body: '',
    };

  } catch (error) {
    console.error('[Sora] Error downloading video:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
    };
  }
};
