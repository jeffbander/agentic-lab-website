import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

interface ConcatenateRequest {
  video1Url: string;
  video2Url: string;
}

/**
 * Netlify Function Handler - Concatenate Two Videos
 * POST /api/concatenate-videos
 *
 * NOTE: This is a simplified version that returns instructions for client-side concatenation.
 * For production, consider using a video processing service like Mux, Cloudinary, or AWS MediaConvert.
 *
 * Netlify Functions have a 10-second timeout, which may not be enough for video processing.
 * Background functions have a 15-minute timeout but are only available on Pro plans.
 */
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
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

  try {
    const body: ConcatenateRequest = JSON.parse(event.body || '{}');

    // Validate request
    if (!body.video1Url || !body.video2Url) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Both video URLs are required' }),
      };
    }

    console.log('[Concatenate] Request to concatenate:', {
      video1: body.video1Url.substring(0, 50) + '...',
      video2: body.video2Url.substring(0, 50) + '...',
    });

    // For now, return both URLs for client-side handling
    // In production, this would use ffmpeg or a video processing service
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        method: 'client-side',
        video1Url: body.video1Url,
        video2Url: body.video2Url,
        instructions: 'Download both videos and concatenate client-side or use a video processing service',
        // Alternative: Use ffmpeg concat demuxer
        // ffmpegCommand: `ffmpeg -f concat -safe 0 -i filelist.txt -c copy output.mp4`
      }),
    };

  } catch (error) {
    console.error('[Concatenate] Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
    };
  }
};
