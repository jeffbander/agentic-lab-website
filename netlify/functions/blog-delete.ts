import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

// Admin API key for authentication (set in Netlify environment variables)
const BLOG_ADMIN_KEY = process.env.BLOG_ADMIN_KEY;

/**
 * Netlify Function Handler - Delete Blog Post
 * DELETE /api/blog-delete?id=<id>
 * Headers:
 *   - Authorization: Bearer <BLOG_ADMIN_KEY>
 */
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'DELETE') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Authenticate request
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Authorization header required' }),
    };
  }

  const providedKey = authHeader.replace('Bearer ', '');

  // If no admin key is configured, allow any key for development
  if (BLOG_ADMIN_KEY && providedKey !== BLOG_ADMIN_KEY) {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ error: 'Invalid admin key' }),
    };
  }

  try {
    const params = event.queryStringParameters || {};
    const { id } = params;

    if (!id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Post ID is required' }),
      };
    }

    // In a production environment, you would delete from the database
    // For this implementation, we return deletion confirmation

    console.log('[Blog Delete] Post deletion requested:', id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Blog post deletion prepared',
        postId: id,
        instructions: 'To persist this deletion, remove the post from your database or update src/data/blogPosts.ts and redeploy.',
      }),
    };
  } catch (error) {
    console.error('[Blog Delete] Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
    };
  }
};
