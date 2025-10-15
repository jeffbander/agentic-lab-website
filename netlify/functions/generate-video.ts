import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

interface VideoGenerationRequest {
  prompt: string;
  width?: number;
  height?: number;
  duration?: number;
}

interface VideoGenerationJob {
  id: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  videoUrl?: string;
  error?: string;
}

const AZURE_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const API_VERSION = process.env.AZURE_OPENAI_API_VERSION || 'preview';
const MODEL = process.env.AZURE_OPENAI_MODEL || 'sora';

/**
 * Creates a video generation job with Azure OpenAI Sora
 */
async function createVideoJob(prompt: string, width: number, height: number, duration: number): Promise<string> {
  const url = `${AZURE_ENDPOINT}/openai/v1/video/generations/jobs?api-version=${API_VERSION}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'api-key': AZURE_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      width,
      height,
      n_seconds: duration,
      model: MODEL,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create video job: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.id;
}

/**
 * Checks the status of a video generation job
 */
async function checkJobStatus(jobId: string): Promise<VideoGenerationJob> {
  const url = `${AZURE_ENDPOINT}/openai/v1/video/generations/jobs/${jobId}?api-version=${API_VERSION}`;

  const response = await fetch(url, {
    headers: {
      'api-key': AZURE_API_KEY!,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to check job status: ${response.status} ${error}`);
  }

  const data = await response.json();

  return {
    id: jobId,
    status: data.status,
    videoUrl: data.status === 'succeeded' ? data.video_url : undefined,
    error: data.error?.message,
  };
}

/**
 * Downloads the generated video
 */
async function getVideo(generationId: string): Promise<string> {
  const url = `${AZURE_ENDPOINT}/openai/v1/video/generations/${generationId}/content/video?api-version=${API_VERSION}`;

  const response = await fetch(url, {
    headers: {
      'api-key': AZURE_API_KEY!,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to retrieve video: ${response.status} ${error}`);
  }

  // Return the blob URL
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

/**
 * Netlify Function Handler
 */
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Validate environment variables
  if (!AZURE_ENDPOINT || !AZURE_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Azure OpenAI credentials not configured. Please set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY environment variables.'
      }),
    };
  }

  try {
    const body: VideoGenerationRequest = JSON.parse(event.body || '{}');

    // Validate request
    if (!body.prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Prompt is required' }),
      };
    }

    // Set defaults
    const width = body.width || 480;
    const height = body.height || 480;
    const duration = body.duration || 5;

    // Validate dimensions
    if (width < 128 || width > 1920 || height < 128 || height > 1920) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid dimensions. Width and height must be between 128 and 1920 pixels.' }),
      };
    }

    // Validate duration
    if (duration < 1 || duration > 60) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid duration. Must be between 1 and 60 seconds.' }),
      };
    }

    // Create the video generation job
    console.log(`Creating video job with prompt: "${body.prompt}"`);
    const jobId = await createVideoJob(body.prompt, width, height, duration);

    // Poll for completion (with timeout)
    const maxAttempts = 60; // 5 minutes max (5 second intervals)
    let attempts = 0;

    while (attempts < maxAttempts) {
      const status = await checkJobStatus(jobId);

      if (status.status === 'succeeded') {
        console.log(`Video generation succeeded: ${jobId}`);
        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            jobId,
            videoUrl: status.videoUrl,
          }),
        };
      }

      if (status.status === 'failed') {
        console.error(`Video generation failed: ${status.error}`);
        return {
          statusCode: 500,
          body: JSON.stringify({
            success: false,
            error: status.error || 'Video generation failed',
          }),
        };
      }

      // Wait 5 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 5000));
      attempts++;
    }

    // Timeout
    return {
      statusCode: 408,
      body: JSON.stringify({
        success: false,
        error: 'Video generation timed out. Please try again.',
        jobId,
      }),
    };

  } catch (error) {
    console.error('Error generating video:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
    };
  }
};
