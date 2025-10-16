import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

interface ClinicalNote {
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

interface ScriptOutput {
  firstName: string;
  primaryCondition: string;
  conditionIcons: string;
  keyTakeaway: string;
  chip2: string;
  chip3: string;
  treatmentMechanism: string;
  actionLine: string;
  twoCommonRisks: string;
  beat1Text: string;
  beat2Text: string;
  beat3Text: string;
  beat4Text: string;
  fullSoraPrompt: string;
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Use OpenAI GPT-4 to transform clinical note into structured patient education script
 */
async function generateScriptWithGPT(note: ClinicalNote): Promise<ScriptOutput> {
  const systemPrompt = `You are a medical education specialist who creates patient-friendly video scripts.
Your job is to transform clinical provider notes into clear, empathetic 20-second patient education videos.

CRITICAL RULES:
1. Character limits: ≤48 characters per line, max 2 lines per beat
2. Language: 7th-8th grade reading level
3. Tone: ${note.tone || 'reassuring'}, never alarming
4. Privacy: Use first name ONLY if explicitly approved
5. No medical promises: Use "helps" or "may help", never "cures" or "guarantees"
6. Safety-first: Always mention risks in Beat 4

OUTPUT FORMAT (JSON):
{
  "firstName": "Maria" or "" if not approved,
  "primaryCondition": "Type 2 diabetes & heart failure",
  "conditionIcons": "glucose meter, heart, kidneys",
  "keyTakeaway": "Protect your heart & kidneys",
  "chip2": "A1C ↓ · kidney support",
  "chip3": "HF hospitalization risk ↓",
  "treatmentMechanism": "Your SGLT2 med helps lower blood sugar",
  "actionLine": "Take daily; hydrate; monitor BP",
  "twoCommonRisks": "dehydration, low blood pressure",
  "beat1Text": "Hi Maria — you're managing Type 2 diabetes & heart failure",
  "beat2Text": "Focus: Protect your heart & kidneys",
  "beat3Text": "Your SGLT2 med helps lower blood sugar",
  "beat4Text": "Take daily; hydrate; monitor BP"
}`;

  const userPrompt = `Transform this clinical note into a patient education script:

CLINICAL NOTE:
Patient: ${note.patient || 'N/A'}
OK to show name: ${note.okToShowName ? 'yes' : 'no'}
Language: ${note.language || 'English'}
Condition(s): ${note.conditions || 'N/A'}
Focus: ${note.focus || 'N/A'}
Treatment: ${note.treatment || 'N/A'}
Top 3 Points:
${note.topPoints?.map((p, i) => `${i + 1}. ${p}`).join('\n') || 'N/A'}
Risks: ${note.risks || 'N/A'}
Tone: ${note.tone || 'reassuring'}

Generate a structured script following the output format. Ensure all text fields respect the 48 character per line limit.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  const scriptData = JSON.parse(data.choices[0].message.content);

  // Build full Sora prompt with template
  const fullSoraPrompt = buildSoraPrompt(note, scriptData);

  return {
    ...scriptData,
    fullSoraPrompt,
  };
}

/**
 * Build complete Sora prompt using template
 */
function buildSoraPrompt(note: ClinicalNote, script: any): string {
  const language = note.language || 'English';
  const firstName = script.firstName || '';

  return `Create a calm, friendly 20-second patient-education explainer video in ${language}.
${firstName ? `Personalize with the first name "${firstName}" on a badge only; do not show birth dates, MRNs, or other identifiers.` : 'Generic; no patient name shown.'}

Visual style: clean medical animation with simple 3D icons (heart, kidneys, blood vessels, BP cuff, pill bottle), high-contrast captions, hospital-bright soft lighting.
Camera: gentle dolly-in; cross-dissolves between four scenes; steady exposure; 24 fps; 1920×1080.
Audio: soft neutral music; friendly voiceover that speaks the same lines as the on-screen text.
No brand logos. Respect privacy; no identifiable faces.

Beat 1 (0–5s) — Greeting + condition
On-screen text: "${script.beat1Text}"
Visual: clinic hallway; ${firstName ? `badge showing first name only; ` : ''}floating icons for ${script.conditionIcons}.

Beat 2 (5–10s) — What matters now
On-screen text: "${script.beat2Text}"
Visual: focused icon narrative (e.g., BP cuff easing to target; glucose meter trending to goal).
Small caption chips: ${script.chip2}

Beat 3 (10–15s) — How the treatment helps
On-screen text: "${script.beat3Text}"
Visual: simple pathway/action animation; keep it educational and non-promotional.
Small caption chips: ${script.chip3}

Beat 4 (15–20s) — Next step + safety
On-screen text: "${script.beat4Text}"
Footer banner, small text: "Possible risks: ${script.twoCommonRisks}. Not medical advice."
End card button: "Talk with your clinician"

Caption rules: max ~48 characters per line, up to 2 lines per beat; high contrast; large, readable sans-serif.
Pacing: calm and clear. Avoid promise/cure language; use "helps" or "may help."`;
}

/**
 * Netlify Function Handler - Generate Patient Education Script
 * POST /api/generate-patient-script
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

  // Validate environment variables
  if (!OPENAI_API_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'OpenAI API key not configured.',
      }),
    };
  }

  try {
    const note: ClinicalNote = JSON.parse(event.body || '{}');

    // Validate required fields
    if (!note.conditions || note.conditions.trim().length === 0) {
      console.log('[Script Generator] Validation failed - missing conditions:', note);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Condition(s) field is required. Please ensure your note includes a line starting with "Condition:" or "Conditions:"',
          example: 'Condition(s): Type 2 diabetes, heart failure'
        }),
      };
    }

    console.log('[Script Generator] Generating script with GPT-4...');
    const script = await generateScriptWithGPT(note);
    console.log('[Script Generator] Script generated successfully');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(script),
    };

  } catch (error) {
    console.error('[Script Generator] Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
    };
  }
};
