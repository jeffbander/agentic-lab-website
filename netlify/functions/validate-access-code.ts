import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

/**
 * Valid access codes for video generation
 * Each code can be used up to 5 times (tracked client-side via localStorage)
 * Codes: MSWlab101, MSWlab106, MSWlab111, ... MSWlab196 (incrementing by 5, 20 codes total)
 */
const VALID_ACCESS_CODES = new Set([
  'MSWlab101',
  'MSWlab106',
  'MSWlab111',
  'MSWlab116',
  'MSWlab121',
  'MSWlab126',
  'MSWlab131',
  'MSWlab136',
  'MSWlab141',
  'MSWlab146',
  'MSWlab151',
  'MSWlab156',
  'MSWlab161',
  'MSWlab166',
  'MSWlab171',
  'MSWlab176',
  'MSWlab181',
  'MSWlab186',
  'MSWlab191',
  'MSWlab196',
]);

export const MAX_USES_PER_CODE = 5;

/**
 * Check if an access code is valid
 */
export function isValidAccessCode(code: string): boolean {
  return VALID_ACCESS_CODES.has(code);
}

/**
 * Netlify Function Handler - Validate Access Code
 * POST /api/validate-access-code
 *
 * Validates that an access code is legitimate.
 * Usage tracking is handled client-side via localStorage.
 */
export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

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

  try {
    const body = JSON.parse(event.body || '{}');
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Access code is required' }),
      };
    }

    const valid = isValidAccessCode(code.trim());

    if (!valid) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({
          valid: false,
          error: 'Invalid access code. Please check your code and try again.',
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        valid: true,
        maxUses: MAX_USES_PER_CODE,
        message: 'Access code is valid.',
      }),
    };
  } catch (error) {
    console.error('[AccessCode] Error validating code:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to validate access code',
      }),
    };
  }
};
