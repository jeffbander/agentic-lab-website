import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

// Admin API key for authentication (set in Netlify environment variables)
const BLOG_ADMIN_KEY = process.env.BLOG_ADMIN_KEY;

interface CreateBlogPostRequest {
  title: string;
  subtitle?: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  coverImage?: string;
  tags: string[];
  category: 'Healthcare AI' | 'Security' | 'Development' | 'Case Study' | 'Tutorial' | 'News';
  status?: 'draft' | 'published';
  featured?: boolean;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

function validateRequest(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.title || typeof data.title !== 'string') {
    errors.push('Title is required');
  }
  if (!data.excerpt || typeof data.excerpt !== 'string') {
    errors.push('Excerpt is required');
  }
  if (!data.content || typeof data.content !== 'string') {
    errors.push('Content is required');
  }
  if (!data.author || !data.author.name) {
    errors.push('Author name is required');
  }
  if (!data.tags || !Array.isArray(data.tags)) {
    errors.push('Tags must be an array');
  }
  if (!data.category) {
    errors.push('Category is required');
  }

  const validCategories = ['Healthcare AI', 'Security', 'Development', 'Case Study', 'Tutorial', 'News'];
  if (data.category && !validCategories.includes(data.category)) {
    errors.push(`Category must be one of: ${validCategories.join(', ')}`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Netlify Function Handler - Create Blog Post
 * POST /api/blog-create
 * Headers:
 *   - Authorization: Bearer <BLOG_ADMIN_KEY>
 * Body: CreateBlogPostRequest
 */
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
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
  // In production, set BLOG_ADMIN_KEY environment variable
  if (BLOG_ADMIN_KEY && providedKey !== BLOG_ADMIN_KEY) {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ error: 'Invalid admin key' }),
    };
  }

  try {
    const data: CreateBlogPostRequest = JSON.parse(event.body || '{}');

    // Validate request
    const validation = validateRequest(data);
    if (!validation.valid) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Validation failed', details: validation.errors }),
      };
    }

    // Create the blog post object
    const now = new Date().toISOString();
    const newPost = {
      id: generateId(),
      slug: generateSlug(data.title),
      title: data.title,
      subtitle: data.subtitle || '',
      excerpt: data.excerpt,
      content: data.content,
      author: {
        name: data.author.name,
        role: data.author.role || '',
        avatar: data.author.avatar,
      },
      coverImage: data.coverImage,
      tags: data.tags,
      category: data.category,
      status: data.status || 'draft',
      publishedAt: data.status === 'published' ? now : '',
      updatedAt: now,
      readingTime: calculateReadingTime(data.content),
      featured: data.featured || false,
    };

    // In a production environment, you would save this to a database
    // For this implementation, we return the created post object
    // The frontend admin can then save it to local storage or
    // you can integrate with a database/CMS

    console.log('[Blog Create] New post created:', newPost.slug);

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Blog post created successfully',
        post: newPost,
        // Instructions for persistence
        instructions: 'To persist this post, either: (1) Add it to src/data/blogPosts.ts and redeploy, (2) Save to localStorage for demo purposes, or (3) Integrate with a database like MongoDB, Supabase, or a headless CMS.',
      }),
    };
  } catch (error) {
    console.error('[Blog Create] Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
    };
  }
};
