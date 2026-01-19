import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

interface VideoGenerationRequest {
  prompt: string;
  width?: number;
  height?: number;
  duration?: number;
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1';

/**
 * Creates a video generation request directly with OpenAI Sora 2
 */
async function createVideoGeneration(prompt: string, width: number, height: number, duration: number): Promise<unknown> {
  const response = await fetch(`${OPENAI_API_URL}/video/generations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sora-2',
      prompt,
      size: `${width}x${height}`,
      duration_seconds: duration,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create video: ${response.status} ${error}`);
  }

  return await response.json();
}

/**
 * Netlify Function Handler
 */
export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
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
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'OpenAI API key not configured. Sora 2 requires an OpenAI API key.',
        setup: 'Get your key from https://platform.openai.com/api-keys and add it to your .env file as OPENAI_API_KEY=sk-...'
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

    // Create the video generation
    console.log(`Creating Sora 2 video with prompt: "${body.prompt.substring(0, 50)}..."`);
    const result = await createVideoGeneration(body.prompt, width, height, duration);
    console.log(`Video generation response:`, result);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        ...result
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
