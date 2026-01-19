import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

// In a production environment, you would fetch from a database
// For now, we'll define posts here and they can be extended via the admin API
import type { BlogPost } from '../../src/data/blogPosts';

// Simple in-memory storage simulation (in production, use a database)
// This will be populated from the static data or through API calls
const blogPostsStore: BlogPost[] = [];

// Initialize with static data if needed
async function initializeStore() {
  if (blogPostsStore.length === 0) {
    // In a real app, you'd fetch from a database here
    // For now, return an empty array - posts are managed client-side via static data
    // or through the blog-create endpoint
    return [];
  }
  return blogPostsStore;
}

/**
 * Netlify Function Handler - List Blog Posts
 * GET /api/blog-list
 * Query params:
 *   - status: 'published' | 'draft' | 'all' (default: 'published')
 *   - category: filter by category
 *   - tag: filter by tag
 *   - limit: number of posts to return
 *   - offset: pagination offset
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
    const status = params.status || 'published';
    const category = params.category;
    const tag = params.tag;
    const limit = params.limit ? parseInt(params.limit, 10) : undefined;
    const offset = params.offset ? parseInt(params.offset, 10) : 0;

    let posts = await initializeStore();

    // Filter by status
    if (status !== 'all') {
      posts = posts.filter(post => post.status === status);
    }

    // Filter by category
    if (category) {
      posts = posts.filter(post => post.category === category);
    }

    // Filter by tag
    if (tag) {
      posts = posts.filter(post =>
        post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
      );
    }

    // Sort by published date (newest first)
    posts.sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    // Get total count before pagination
    const total = posts.length;

    // Apply pagination
    if (offset > 0) {
      posts = posts.slice(offset);
    }
    if (limit) {
      posts = posts.slice(0, limit);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        posts,
        total,
        limit,
        offset,
      }),
    };
  } catch (error) {
    console.error('[Blog List] Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
    };
  }
};

// Export the store for other functions to use
export { blogPostsStore };
