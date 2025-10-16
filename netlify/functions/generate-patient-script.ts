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
async function generateScriptWithGPT(rawClinicalNote: string): Promise<ScriptOutput> {
  const systemPrompt = `You are a medical education specialist who creates patient-friendly video scripts from clinical notes.

Your job: Read the clinical note, identify the TOP 3 most important conditions/topics from the Assessment & Plan section, and create a clear, empathetic 12-second patient education video script.

CRITICAL RULES:
1. Character limits: ≤48 characters per line, max 2 lines per beat
2. Language: 7th-8th grade reading level
3. Tone: reassuring, never alarming
4. Privacy: NEVER use patient names unless explicitly stated "OK to show name: yes"
5. No medical promises: Use "helps" or "may help", never "cures" or "guarantees"
6. Safety-first: Always mention risks/side effects in Beat 4
7. Focus on Assessment & Plan: Extract the 1-3 most important conditions the patient should know about
8. Be specific: Use actual condition names, medication names (generic preferred), and concrete actions

ANALYSIS STRATEGY:
- Look for "Assessment and Plan" or "conditions:" sections
- Identify the top 1-3 conditions that are most important for the patient
- Extract key medications and their purposes
- Find actionable advice (lifestyle, medication adherence, monitoring)
- Identify relevant risks or side effects to mention

OUTPUT FORMAT (JSON):
{
  "firstName": "" (empty unless note says "OK to show name: yes"),
  "primaryCondition": "Atrial fibrillation, Hypertension, Hyperlipidemia" (top 1-3 conditions),
  "conditionIcons": "heart rhythm, blood pressure cuff, cholesterol" (relevant medical icons),
  "keyTakeaway": "Control heart rhythm & blood pressure" (main goal),
  "chip2": "HR controlled · BP monitored" (benefits/metrics),
  "chip3": "Stroke risk ↓" (key outcome),
  "treatmentMechanism": "Metoprolol helps control your heart rate" (how treatment works),
  "actionLine": "Take meds daily; monitor BP at home" (specific actions),
  "twoCommonRisks": "dizziness, fatigue" (top 2 side effects),
  "beat1Text": "You're managing AFib, high BP, and cholesterol",
  "beat2Text": "Focus: Control heart rhythm & blood pressure",
  "beat3Text": "Metoprolol helps control your heart rate",
  "beat4Text": "Take meds daily; monitor BP at home"
}`;

  const userPrompt = `Read this clinical note and create a patient education script focusing on the Assessment & Plan section.

Extract the TOP 3 most important conditions and create a 12-second video script (4 beats × 3 seconds).

CLINICAL NOTE:
${rawClinicalNote}

Generate the JSON output following the format. Ensure all beat text ≤48 chars per line, max 2 lines.`;

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
  console.log('[GPT-4] Raw API response:', JSON.stringify(data, null, 2));

  const rawContent = data.choices[0].message.content;
  console.log('[GPT-4] Raw content string:', rawContent);

  const scriptData = JSON.parse(rawContent);
  console.log('[GPT-4] Parsed script data:', JSON.stringify(scriptData, null, 2));

  // Build full Sora prompt with template
  const fullSoraPrompt = buildSoraPrompt(scriptData);

  return {
    ...scriptData,
    fullSoraPrompt,
  };
}

/**
 * Build complete Sora prompt using template
 */
function buildSoraPrompt(script: any): string {
  const firstName = script.firstName || '';

  return `Create a calm, friendly 12-second patient-education explainer video in English.
${firstName ? `Personalize with the first name "${firstName}" on a badge only; do not show birth dates, MRNs, or other identifiers.` : 'Generic; no patient name shown.'}

Visual style: clean medical animation with simple 3D icons (heart, kidneys, blood vessels, BP cuff, pill bottle), high-contrast captions, hospital-bright soft lighting.
Camera: gentle dolly-in; cross-dissolves between four scenes; steady exposure; 24 fps; 1920×1080.
Audio: soft neutral music; friendly voiceover that speaks the same lines as the on-screen text.
No brand logos. Respect privacy; no identifiable faces.

Beat 1 (0–3s) — Greeting + condition
On-screen text: "${script.beat1Text}"
Visual: clinic hallway; ${firstName ? `badge showing first name only; ` : ''}floating icons for ${script.conditionIcons}.

Beat 2 (3–6s) — What matters now
On-screen text: "${script.beat2Text}"
Visual: focused icon narrative (e.g., BP cuff easing to target; glucose meter trending to goal).
Small caption chips: ${script.chip2}

Beat 3 (6–9s) — How the treatment helps
On-screen text: "${script.beat3Text}"
Visual: simple pathway/action animation; keep it educational and non-promotional.
Small caption chips: ${script.chip3}

Beat 4 (9–12s) — Next step + safety
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
    const body = JSON.parse(event.body || '{}');
    const rawNote = body.noteText || body.rawNote || '';

    // Validate that we have some content
    if (!rawNote || rawNote.trim().length === 0) {
      console.log('[Script Generator] Validation failed - empty note');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Clinical note is required. Please paste a provider note with patient information.'
        }),
      };
    }

    console.log('[Script Generator] Generating script with GPT-4...');
    console.log('[Script Generator] Raw note length:', rawNote.length, 'characters');
    console.log('[Script Generator] Note preview:', rawNote.substring(0, 200) + '...');

    const script = await generateScriptWithGPT(rawNote);

    console.log('[Script Generator] Script generated successfully');
    console.log('[Script Generator] Final output:', JSON.stringify(script, null, 2));

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
