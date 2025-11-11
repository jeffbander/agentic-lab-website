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
  // Part 1 (0-12s): Mount Sinai branding + patient intro
  beat1Text: string; // Mount Sinai logo
  beat2Text: string; // Patient greeting with name + conditions
  beat3Text: string; // Condition overview
  beat4Text: string; // Recent test results
  // Part 2 (12-24s): Medications + treatment plan
  beat5Text: string; // Current medications
  beat6Text: string; // Treatment options discussed
  beat7Text: string; // Next steps and monitoring
  beat8Text: string; // Risks/side effects + call to action
  testResults?: string; // Optional: Recent test results
  medications?: string; // Optional: Current medications list
  treatmentOptions?: string; // Optional: Treatment options discussed
  fullSoraPromptPart1: string;
  fullSoraPromptPart2: string;
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Use OpenAI GPT-4 to transform clinical note into structured patient education script
 */
async function generateScriptWithGPT(rawClinicalNote: string): Promise<ScriptOutput> {
  const systemPrompt = `You are a medical education specialist who creates patient-friendly video scripts from clinical notes for Mount Sinai Health System in New York City.

Your job: Read the clinical note and create a clear, empathetic 24-second patient education video script (8 beats × 3 seconds each). The video will be Mount Sinai-branded and provide comprehensive patient education.

CRITICAL RULES:
1. Character limits: ≤48 characters per line, max 2 lines per beat
2. Language: 7th-8th grade reading level
3. Tone: reassuring, never alarming
4. Privacy: NEVER use patient names unless explicitly stated "OK to show name: yes"
5. No medical promises: Use "helps" or "may help", never "cures" or "guarantees"
6. Safety-first: Always mention risks/side effects in Beat 8
7. Extract comprehensive clinical details: conditions, test results, medications, treatment options
8. Be specific: Use actual condition names, medication names (generic preferred), and concrete actions

ANALYSIS STRATEGY:
- Look for "Assessment and Plan" or "conditions:" sections
- Identify the top 1-3 conditions that are most important for the patient
- Extract recent test results (labs, imaging, vitals)
- List current medications and their purposes
- Identify treatment options discussed with the doctor
- Find actionable advice (lifestyle, medication adherence, monitoring)
- Identify relevant risks or side effects to mention

VIDEO STRUCTURE (24 seconds total):
Part 1 (0-12s): Mount Sinai branding + patient introduction
Part 2 (12-24s): Medications + treatment plan

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
  "testResults": "BP 145/90, HR 88, A1C 7.2%" (recent test results if available),
  "medications": "Metoprolol 50mg daily, Lisinopril 10mg daily" (current meds if available),
  "treatmentOptions": "Continue meds, increase exercise, reduce sodium" (treatment options discussed),
  "beat1Text": "Mount Sinai Health System" (logo introduction),
  "beat2Text": "Hi [Name], you're managing AFib & high BP" (greeting with conditions),
  "beat3Text": "These affect your heart rhythm & pressure" (condition overview),
  "beat4Text": "Your recent BP: 145/90, HR: 88 bpm" (test results),
  "beat5Text": "You're taking Metoprolol & Lisinopril daily" (medications),
  "beat6Text": "Dr. discussed: Continue meds, more exercise" (treatment options),
  "beat7Text": "Next: Monitor BP at home twice daily" (next steps),
  "beat8Text": "Possible effects: dizziness, fatigue" (risks + call to action)
}`;

  const userPrompt = `Read this clinical note and create a comprehensive patient education script for Mount Sinai Health System.

Extract all relevant clinical information and create a 24-second video script (8 beats × 3 seconds).

CLINICAL NOTE:
${rawClinicalNote}

Generate the JSON output following the format. Ensure all beat text ≤48 chars per line, max 2 lines.

IMPORTANT: Beat 1 should always be "Mount Sinai Health System" to introduce the branding.`;

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

  // Build two Sora prompts with template (Part 1 and Part 2)
  const { part1, part2 } = buildTwoPartSoraPrompts(scriptData);

  return {
    ...scriptData,
    fullSoraPromptPart1: part1,
    fullSoraPromptPart2: part2,
  };
}

/**
 * Build two complete Sora prompts for 24-second video (Part 1 + Part 2)
 */
function buildTwoPartSoraPrompts(script: any): { part1: string; part2: string } {
  const firstName = script.firstName || '';

  // Mount Sinai brand colors
  const mountSinaiBranding = `Mount Sinai Health System branding: Show intersecting lines in cyan (#06ABEB) and magenta (#DC298D) that overlap to create violet. Professional, modern medical aesthetic.`;

  const part1 = `Create a calm, friendly 12-second Mount Sinai Health System patient-education video (Part 1 of 2) in English.
${firstName ? `Personalize with the first name "${firstName}" on a badge only; do not show birth dates, MRNs, or other identifiers.` : 'Generic; no patient name shown.'}

${mountSinaiBranding}

Visual style: clean medical animation with simple 3D icons (heart, kidneys, blood vessels, BP cuff, pill bottle), high-contrast captions, hospital-bright soft lighting with Mount Sinai brand colors (cyan #06ABEB, magenta #DC298D).
Camera: gentle dolly-in; cross-dissolves between four scenes; steady exposure; 24 fps; 1920×1080.
Audio: soft neutral music; friendly voiceover that speaks the same lines as the on-screen text. IMPORTANT: In Beat 4 (9-12s), the voiceover should complete the sentence naturally but trail off/fade out smoothly around 10-11 seconds, ending 1-2 seconds before the video ends at 12s. This creates a natural pause for the transition to Part 2.
Respect privacy; no identifiable faces.

Beat 1 (0–3s) — Mount Sinai Health System Logo
On-screen text: "${script.beat1Text}"
Visual: Mount Sinai logo with intersecting cyan and magenta lines creating violet. Clean, professional branding introduction.

Beat 2 (3–6s) — Greeting + Conditions
On-screen text: "${script.beat2Text}"
Visual: clinic hallway; ${firstName ? `badge showing first name only; ` : ''}floating icons for ${script.conditionIcons}.

Beat 3 (6–9s) — Condition Overview
On-screen text: "${script.beat3Text}"
Visual: focused icon narrative showing how conditions affect the body (e.g., heart rhythm, blood pressure).
Small caption chips: ${script.chip2}

Beat 4 (9–12s) — Recent Test Results
On-screen text: "${script.beat4Text}"
Visual: simple display of recent test results with medical icons and trending indicators.
Small caption chips showing metrics.

Caption rules: max ~48 characters per line, up to 2 lines per beat; high contrast; large, readable sans-serif.
Pacing: calm and clear. Avoid promise/cure language; use "helps" or "may help."`;

  const part2 = `Create a calm, friendly 12-second Mount Sinai Health System patient-education video (Part 2 of 2) in English.
${firstName ? `Continue personalizing with the first name "${firstName}".` : 'Continue generic presentation.'}

Visual style: clean medical animation with simple 3D icons (pills, treatment pathways, calendar, checklist), high-contrast captions, hospital-bright soft lighting with Mount Sinai brand colors (cyan #06ABEB, magenta #DC298D).
Camera: gentle dolly-in; cross-dissolves between four scenes; steady exposure; 24 fps; 1920×1080.
Audio: soft neutral music continues; friendly voiceover that speaks the same lines as the on-screen text. IMPORTANT: The voiceover should begin at the very start (0s) with a new sentence or phrase that flows naturally as if continuing a conversation. The audio in Beat 1 should start immediately, picking up seamlessly from Part 1. In Beat 4 (9-12s), the voiceover should complete naturally and end 1-2 seconds before the video ends at 12s to avoid an abrupt cutoff.
Respect privacy; no identifiable faces.

Beat 1 (0–3s) — Current Medications
On-screen text: "${script.beat5Text}"
Visual: pill bottles and medication icons with simple labels; no brand logos.
Small caption chips: ${script.chip3}

Beat 2 (3–6s) — Treatment Options Discussed
On-screen text: "${script.beat6Text}"
Visual: simple pathway/action animation showing treatment plan; educational and non-promotional.

Beat 3 (6–9s) — Next Steps & Monitoring
On-screen text: "${script.beat7Text}"
Visual: calendar icons, checklist, monitoring devices (BP cuff, glucose meter).

Beat 4 (9–12s) — Safety & Call to Action
On-screen text: "${script.beat8Text}"
Footer banner, small text: "Possible risks: ${script.twoCommonRisks}. Not medical advice."
End card: "Talk with your Mount Sinai clinician" with subtle Mount Sinai branding.

Caption rules: max ~48 characters per line, up to 2 lines per beat; high contrast; large, readable sans-serif.
Pacing: calm and clear. Avoid promise/cure language; use "helps" or "may help."`;

  return { part1, part2 };
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
