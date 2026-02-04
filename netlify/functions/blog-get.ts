import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

/**
 * Netlify Function Handler - Get Single Blog Post
 * GET /api/blog-get?slug=<slug>
 * GET /api/blog-get?id=<id>
 */
export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
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

  try {
    const params = event.queryStringParameters || {};
    const { slug, id } = params;

    if (!slug && !id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Either slug or id parameter is required' }),
      };
    }

    // In production, fetch from database
    // For now, we return a message indicating the post should be fetched from static data
    // The frontend will use the static data directly
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Use static data from blogPosts.ts for now',
        slug,
        id,
        // In a real implementation with a database:
        // post: await fetchPostFromDB(slug || id)
      }),
    };
  } catch (error) {
    console.error('[Blog Get] Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
    };
  }
};
