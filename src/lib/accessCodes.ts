/**
 * Access Code Management (client-side)
 *
 * Tracks access code usage in localStorage.
 * Each code can be used up to 5 times for video generation.
 * Server-side validation ensures only legitimate codes are accepted.
 */

const ACCESS_CODE_USAGE_KEY = 'patient_education_access_code_usage';
const MAX_USES_PER_CODE = 5;

interface AccessCodeUsage {
  [code: string]: number;
}

/**
 * Get usage counts for all access codes from localStorage
 */
function getUsageData(): AccessCodeUsage {
  try {
    const data = localStorage.getItem(ACCESS_CODE_USAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

/**
 * Save usage counts to localStorage
 */
function saveUsageData(data: AccessCodeUsage): void {
  localStorage.setItem(ACCESS_CODE_USAGE_KEY, JSON.stringify(data));
}

/**
 * Get number of times a code has been used
 */
export function getCodeUsageCount(code: string): number {
  const data = getUsageData();
  return data[code] || 0;
}

/**
 * Get remaining uses for a code
 */
export function getRemainingUses(code: string): number {
  return Math.max(0, MAX_USES_PER_CODE - getCodeUsageCount(code));
}

/**
 * Check if a code has remaining uses
 */
export function hasRemainingUses(code: string): boolean {
  return getRemainingUses(code) > 0;
}

/**
 * Record a usage of the access code (call this when video generation starts)
 */
export function recordCodeUsage(code: string): void {
  const data = getUsageData();
  data[code] = (data[code] || 0) + 1;
  saveUsageData(data);
}

/**
 * Validate access code against the server and check local usage
 * Returns: { valid, remainingUses, error? }
 */
export async function validateAccessCode(code: string): Promise<{
  valid: boolean;
  remainingUses: number;
  error?: string;
}> {
  const trimmedCode = code.trim();

  if (!trimmedCode) {
    return { valid: false, remainingUses: 0, error: 'Please enter an access code.' };
  }

  // Check local usage first
  const remaining = getRemainingUses(trimmedCode);
  if (remaining <= 0) {
    return {
      valid: false,
      remainingUses: 0,
      error: 'This access code has reached its maximum number of uses (5). Please use a different code.',
    };
  }

  // Validate against server
  try {
    const response = await fetch('/api/validate-access-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: trimmedCode }),
    });

    const data = await response.json();

    if (!response.ok || !data.valid) {
      return {
        valid: false,
        remainingUses: 0,
        error: data.error || 'Invalid access code.',
      };
    }

    return {
      valid: true,
      remainingUses: remaining,
    };
  } catch {
    return {
      valid: false,
      remainingUses: 0,
      error: 'Failed to validate access code. Please try again.',
    };
  }
}

export { MAX_USES_PER_CODE };
