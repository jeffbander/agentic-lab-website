/**
 * Patient Education Micro-Videos (12s) Transformation Library
 * Converts clinician provider notes into HIPAA-compliant, readable Sora prompts
 */

export interface ProviderNote {
  patient?: string;
  okToShowName?: boolean;
  language?: 'English' | 'Spanish';
  conditions?: string;
  focus?: string;
  treatment?: string;
  topPoints?: string[];
  risks?: string;
  tone?: 'reassuring' | 'practical' | 'motivational';
}

export interface OnScreenText {
  beat1: string; // Greeting + condition
  beat2: string; // Key takeaway
  beat3: string; // How treatment helps
  beat4: string; // Next step + safety
}

export interface SoraPromptResult {
  prompt: string;
  ost: OnScreenText;
  params: {
    model: string;
    width: number;
    height: number;
    n_seconds: number;
  };
  audit: {
    promptHash: string;
    brandPresent: boolean;
    language: string;
    timestamp: string;
  };
}

const MAX_LINE_LENGTH = 48;
const MAX_LINES = 2;

/**
 * Truncate text to fit character limit while preserving words
 */
function truncateToLimit(text: string, maxChars: number = MAX_LINE_LENGTH): string {
  if (text.length <= maxChars) return text;

  const truncated = text.substring(0, maxChars);
  const lastSpace = truncated.lastIndexOf(' ');

  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
}

/**
 * Validate OST (on-screen text) constraints
 */
function validateOST(text: string): boolean {
  const lines = text.split('\n');
  if (lines.length > MAX_LINES) return false;

  return lines.every(line => line.length <= MAX_LINE_LENGTH);
}

/**
 * Parse provider note from free text or structured format
 * Handles both simple templates AND complex clinical notes
 */
export function parseProviderNote(noteText: string): ProviderNote {
  const note: ProviderNote = {
    okToShowName: false,
    language: 'English',
    topPoints: [],
    tone: 'reassuring',
  };

  // Parse line by line
  const lines = noteText.split('\n');
  let inTopPoints = false;
  let inConditions = false;
  const conditionsList: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    // Patient name and consent
    if (trimmed.toLowerCase().startsWith('patient name:') || trimmed.toLowerCase().startsWith('patient:')) {
      const match = trimmed.match(/Patient(?:\s+Name)?:\s*(.+?)(?:\s*\(OK to show name:\s*(yes|no)\))?$/i);
      if (match) {
        note.patient = match[1].trim();
        note.okToShowName = match[2]?.toLowerCase() === 'yes';
      }
    }

    // Language
    else if (trimmed.toLowerCase().startsWith('language:')) {
      const lang = trimmed.replace(/language:\s*/i, '').trim();
      note.language = lang.toLowerCase() === 'spanish' ? 'Spanish' : 'English';
    }

    // Conditions - handle both single-line and multi-line formats
    else if (trimmed.toLowerCase().startsWith('condition')) {
      const inline = trimmed.replace(/condition\(s\)?:\s*/i, '').trim();
      if (inline && !inline.match(/^\d+\./)) {
        // Single-line format: "Condition(s): Type 2 diabetes, heart failure"
        note.conditions = inline;
      } else {
        // Multi-line format - start collecting conditions
        inConditions = true;
      }
    }
    // Collect numbered conditions
    else if (inConditions && trimmed.match(/^\d+\.\s+(.+?):/)) {
      const conditionMatch = trimmed.match(/^\d+\.\s+(.+?):/);
      if (conditionMatch) {
        conditionsList.push(conditionMatch[1].trim());
      }
    }
    // Stop collecting conditions when we hit a non-condition line
    else if (inConditions && !trimmed.match(/^\d+\./) && !trimmed.startsWith('•') && trimmed.length > 0) {
      inConditions = false;
    }

    // Focus
    else if (trimmed.toLowerCase().startsWith('focus')) {
      note.focus = trimmed.replace(/focus.*?:\s*/i, '').trim();
    }

    // Treatment - extract from multiple possible formats
    else if (trimmed.toLowerCase().startsWith('treatment:')) {
      note.treatment = trimmed.replace(/treatment:\s*/i, '').trim();
    }
    // Also look for medication lists
    else if (trimmed.match(/^-\s+\w+\s+\d+\s*mg/i)) {
      const medMatch = trimmed.match(/^-\s+(\w+)/i);
      if (medMatch && !note.treatment) {
        note.treatment = medMatch[1];
      }
    }

    // Top 3 points
    else if (trimmed.toLowerCase().startsWith('top 3') || trimmed.toLowerCase().startsWith('top points')) {
      inTopPoints = true;
    } else if (inTopPoints && (trimmed.startsWith('-') || trimmed.startsWith('•'))) {
      note.topPoints!.push(trimmed.replace(/^[-•]\s*/, ''));
    } else if (inTopPoints && !trimmed.startsWith('-') && !trimmed.startsWith('•') && trimmed.length > 0) {
      inTopPoints = false;
    }

    // Risks
    if (trimmed.toLowerCase().startsWith('risk')) {
      note.risks = trimmed.replace(/risk.*?:\s*/i, '').trim();
    }

    // Tone
    if (trimmed.toLowerCase().startsWith('tone:')) {
      const tone = trimmed.replace(/tone:\s*/i, '').trim().toLowerCase();
      if (tone === 'practical' || tone === 'motivational') {
        note.tone = tone as 'practical' | 'motivational';
      }
    }
  }

  // Combine collected conditions
  if (conditionsList.length > 0 && !note.conditions) {
    note.conditions = conditionsList.slice(0, 3).join(', '); // Limit to top 3 conditions
  }

  return note;
}

/**
 * Detect brand names and return common risks
 */
function detectBrandRisks(treatment?: string): { brandPresent: boolean; risks: string[] } {
  if (!treatment) return { brandPresent: false, risks: [] };

  const treatmentLower = treatment.toLowerCase();

  // Common medications and their risks
  const brandRisks: { [key: string]: string[] } = {
    'jardiance': ['dehydration', 'low BP', 'genital/urinary infections'],
    'empagliflozin': ['dehydration', 'low BP', 'genital/urinary infections'],
    'entresto': ['low BP', 'kidney changes', 'high potassium'],
    'sacubitril/valsartan': ['low BP', 'kidney changes', 'high potassium'],
    'ozempic': ['nausea', 'pancreatitis risk', 'thyroid concerns'],
    'semaglutide': ['nausea', 'pancreatitis risk', 'thyroid concerns'],
  };

  for (const [brand, risks] of Object.entries(brandRisks)) {
    if (treatmentLower.includes(brand)) {
      return { brandPresent: true, risks };
    }
  }

  return { brandPresent: false, risks: [] };
}

/**
 * Get condition-specific icons
 */
function getConditionIcons(conditions?: string): string {
  if (!conditions) return 'heart, lungs';

  const conditionsLower = conditions.toLowerCase();
  const icons: string[] = [];

  if (conditionsLower.includes('diabetes') || conditionsLower.includes('t2d')) {
    icons.push('glucose meter', 'pancreas');
  }
  if (conditionsLower.includes('heart') || conditionsLower.includes('hf') || conditionsLower.includes('chf')) {
    icons.push('heart');
  }
  if (conditionsLower.includes('kidney') || conditionsLower.includes('ckd')) {
    icons.push('kidneys');
  }
  if (conditionsLower.includes('hiv')) {
    icons.push('immune cells');
  }
  if (conditionsLower.includes('herpes')) {
    icons.push('virus shield');
  }

  return icons.length > 0 ? icons.join(', ') : 'heart, lungs';
}

/**
 * Generate caption chips based on condition and treatment
 */
function generateChips(conditions?: string, treatment?: string): { chip2: string; chip3: string } {
  const chips: string[] = [];

  if (conditions?.toLowerCase().includes('diabetes')) {
    chips.push('A1C ↓');
  }
  if (conditions?.toLowerCase().includes('heart') || conditions?.toLowerCase().includes('hf')) {
    chips.push('HF hospitalization risk ↓');
  }
  if (conditions?.toLowerCase().includes('kidney') || conditions?.toLowerCase().includes('ckd')) {
    chips.push('kidney support');
  }

  return {
    chip2: chips.slice(0, 2).join(' • ') || 'better control',
    chip3: chips.slice(2, 4).join(' • ') || 'daily support',
  };
}

/**
 * Simple hash function for audit logging
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Main transformation function: note → Sora prompt
 */
export function noteToSoraPrompt(noteText: string): SoraPromptResult {
  const note = parseProviderNote(noteText);

  // Determine personalization
  const personalizationAllowed = note.okToShowName && note.patient && note.patient.length > 0;
  const patientName = personalizationAllowed ? note.patient!.split(' ')[0] : '';

  // Detect brand and risks
  const { brandPresent, risks: brandRisks } = detectBrandRisks(note.treatment);
  const noteRisks = note.risks?.split(/[,;]/).map(r => r.trim()).filter(r => r.length > 0) || [];
  const allRisks = [...brandRisks, ...noteRisks].slice(0, 2);
  const risksShort = allRisks.length > 0 ? allRisks.join(', ') : 'side effects vary';

  // Generate condition icons and chips
  const conditionIcons = getConditionIcons(note.conditions);
  const { chip2, chip3 } = generateChips(note.conditions, note.treatment);

  // Build OST (On-Screen Text) for each beat
  const ost: OnScreenText = {
    beat1: '',
    beat2: '',
    beat3: '',
    beat4: '',
  };

  // Beat 1: Greeting + condition
  if (personalizationAllowed) {
    const conditionsShort = note.conditions?.split(/[;,]/).map(c => c.trim()).slice(0, 2).join(' & ') || 'your condition';
    ost.beat1 = truncateToLimit(`Hi ${patientName} — you have ${conditionsShort}`);
  } else {
    const conditionsShort = note.conditions?.split(/[;,]/).map(c => c.trim()).slice(0, 2).join(' and ') || 'your condition';
    ost.beat1 = truncateToLimit(`You're managing ${conditionsShort}`);
  }

  // Beat 2: Key takeaway (focus)
  if (note.focus) {
    ost.beat2 = truncateToLimit(`Focus: ${note.focus}`);
  } else if (note.topPoints && note.topPoints.length > 0) {
    ost.beat2 = truncateToLimit(`Focus: ${note.topPoints[0]}`);
  } else {
    ost.beat2 = truncateToLimit('Focus: managing your health daily');
  }

  // Beat 3: How treatment helps
  if (note.treatment) {
    // Extract generic name if present
    const genericMatch = note.treatment.match(/\(([^)]+)\)/);
    const brandMatch = note.treatment.match(/^([^(]+)/);

    if (brandMatch) {
      const brandName = brandMatch[1].trim();
      const mechanismHints: { [key: string]: string } = {
        'Jardiance': 'helps lower blood sugar (SGLT2)',
        'empagliflozin': 'helps lower blood sugar (SGLT2)',
        'Entresto': 'supports heart pumping (ARNI)',
        'sacubitril/valsartan': 'supports heart pumping (ARNI)',
      };

      const mechanism = mechanismHints[brandName] || mechanismHints[genericMatch?.[1] || ''] || 'helps manage your condition';
      ost.beat3 = truncateToLimit(`${brandName} ${mechanism}`);
    } else {
      ost.beat3 = truncateToLimit(`Your medication helps manage symptoms`);
    }
  } else {
    ost.beat3 = truncateToLimit('Daily treatment helps you stay healthy');
  }

  // Beat 4: Next step + safety
  if (note.topPoints && note.topPoints.length > 0) {
    const firstAction = note.topPoints[0].replace(/^(take|use|do)\s+/i, '');
    ost.beat4 = truncateToLimit(firstAction);
  } else {
    ost.beat4 = truncateToLimit('Take as prescribed; follow your plan');
  }

  // Build the Sora prompt
  const prompt = `Create a calm, friendly 12-second patient-education explainer video.
Language: ${note.language}. Tone: ${note.tone}.
Visual style: simple medical animation with clean 3D icons (heart, kidneys, blood vessels, pill bottle), high-contrast captions, hospital-bright soft lighting.
Camera: gentle dolly-in, cross-dissolves between four scenes; steady exposure; 24 fps; 1920x1080.

Beat 1 (0–3s) — Greeting + condition
On-screen text: "${ost.beat1}"
Visual: patient silhouette in clinic hallway with floating ${conditionIcons}.
${personalizationAllowed ? `Show first name "${patientName}" on badge.` : 'Generic; no name.'}

Beat 2 (3–6s) — Key takeaway
On-screen text: "${ost.beat2}"
Visual: focused icon narrative (e.g., glucose meter trending to target; kidney/heart icons linked).
Small caption chips: ${chip2}.

Beat 3 (6–9s) — How treatment helps
On-screen text: "${ost.beat3}"
Visual: simplified pathway or action; no brand logos.
Small caption chips: ${chip3}.

Beat 4 (9–12s) — Next step + safety
On-screen text: "${ost.beat4}"
Footer banner (small text): "Possible risks: ${risksShort}. Not medical advice."
End card: "Talk with your clinician."

Audio: soft neutral music; friendly voiceover mirrors on-screen text.
Pacing: calm and clear. Respect privacy; no identifiable faces.`;

  return {
    prompt,
    ost,
    params: {
      model: 'sora-2',
      width: 1920,
      height: 1080,
      n_seconds: 12,
    },
    audit: {
      promptHash: hashString(prompt),
      brandPresent,
      language: note.language || 'English',
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Validate that all OST meets constraints
 */
export function validatePromptResult(result: SoraPromptResult): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check each beat
  Object.entries(result.ost).forEach(([beat, text]) => {
    if (!validateOST(text)) {
      errors.push(`${beat}: exceeds ${MAX_LINE_LENGTH} chars/line or ${MAX_LINES} lines`);
    }
  });

  // Check duration
  if (result.params.n_seconds !== 12) {
    errors.push(`Duration must be 12 seconds, got ${result.params.n_seconds}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
