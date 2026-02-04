import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

// Admin API key for authentication (set in Netlify environment variables)
const BLOG_ADMIN_KEY = process.env.BLOG_ADMIN_KEY;

interface UpdateBlogPostRequest {
  id: string;
  title?: string;
  subtitle?: string;
  excerpt?: string;
  content?: string;
  author?: {
    name: string;
    role: string;
    avatar?: string;
  };
  coverImage?: string;
  tags?: string[];
  category?: 'Healthcare AI' | 'Security' | 'Development' | 'Case Study' | 'Tutorial' | 'News';
  status?: 'draft' | 'published';
  featured?: boolean;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Netlify Function Handler - Update Blog Post
 * PUT /api/blog-update
 * Headers:
 *   - Authorization: Bearer <BLOG_ADMIN_KEY>
 * Body: UpdateBlogPostRequest
 */
export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'PUT, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'PUT') {
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
    const data: UpdateBlogPostRequest = JSON.parse(event.body || '{}');

    if (!data.id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Post ID is required' }),
      };
    }

    const validCategories = ['Healthcare AI', 'Security', 'Development', 'Case Study', 'Tutorial', 'News'];
    if (data.category && !validCategories.includes(data.category)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: `Category must be one of: ${validCategories.join(', ')}` }),
      };
    }

    // Build the update object
    const now = new Date().toISOString();
    const updates: Record<string, unknown> = {
      updatedAt: now,
    };

    if (data.title) {
      updates.title = data.title;
      updates.slug = generateSlug(data.title);
    }
    if (data.subtitle !== undefined) updates.subtitle = data.subtitle;
    if (data.excerpt) updates.excerpt = data.excerpt;
    if (data.content) {
      updates.content = data.content;
      updates.readingTime = calculateReadingTime(data.content);
    }
    if (data.author) updates.author = data.author;
    if (data.coverImage !== undefined) updates.coverImage = data.coverImage;
    if (data.tags) updates.tags = data.tags;
    if (data.category) updates.category = data.category;
    if (data.status) {
      updates.status = data.status;
      if (data.status === 'published') {
        updates.publishedAt = updates.publishedAt || now;
      }
    }
    if (data.featured !== undefined) updates.featured = data.featured;

    // In a production environment, you would update the database
    // For this implementation, we return the update instructions

    console.log('[Blog Update] Post updated:', data.id, updates);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Blog post update prepared',
        postId: data.id,
        updates,
        instructions: 'To persist this update, apply these changes to your database or update src/data/blogPosts.ts and redeploy.',
      }),
    };
  } catch (error) {
    console.error('[Blog Update] Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
    };
  }
};
