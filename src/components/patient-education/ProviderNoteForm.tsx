import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardCopy, Info } from 'lucide-react';
import { parseProviderNote, noteToSoraPrompt, type ProviderNote } from '../../lib/patientEducation';

interface ProviderNoteFormProps {
  onPreview: (result: ReturnType<typeof noteToSoraPrompt>) => void;
}

const TEMPLATE = `Patient: [Name] (OK to show name: yes/no)
Language: English
Condition(s): Type 2 diabetes, heart failure
Focus: Better control of blood sugar and heart health
Treatment: Jardiance (empagliflozin)
Top 3 Points:
- Take once daily with breakfast
- Drink plenty of water
- Monitor blood sugar regularly
Risks: Dehydration, low blood pressure, genital infections
Tone: reassuring`;

export default function ProviderNoteForm({ onPreview }: ProviderNoteFormProps) {
  const [noteText, setNoteText] = useState('');
  const [showTemplate, setShowTemplate] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(TEMPLATE);
    // Brief visual feedback could be added here
  };

  const handlePreview = async () => {
    setError(null);
    setIsGenerating(true);

    if (!noteText.trim()) {
      setError('Please enter a provider note.');
      setIsGenerating(false);
      return;
    }

    try {
      // Parse the note
      const parsedNote = parseProviderNote(noteText);

      // Call GPT-4 to generate robust script
      const response = await fetch('/api/generate-patient-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedNote),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate script');
      }

      const scriptData = await response.json();

      // Build result in expected format
      const result = {
        prompt: scriptData.fullSoraPrompt,
        ost: {
          beat1: scriptData.beat1Text,
          beat2: scriptData.beat2Text,
          beat3: scriptData.beat3Text,
          beat4: scriptData.beat4Text,
        },
        params: {
          model: 'sora-2',
          width: 1920,
          height: 1080,
          n_seconds: 20,
        },
        audit: {
          promptHash: Math.abs(scriptData.fullSoraPrompt.split('').reduce((a: number, b: string) => ((a << 5) - a) + b.charCodeAt(0), 0)).toString(16),
          brandPresent: !!(parsedNote.treatment),
          language: parsedNote.language || 'English',
          timestamp: new Date().toISOString(),
        },
      };

      onPreview(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate script');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Paste Provider Note</h2>
          <p className="text-gray-600 mt-1">
            Enter clinician notes to generate a 20-second patient education video
          </p>
        </div>

        <button
          onClick={handleCopyTemplate}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-sinai-cyan-700 bg-sinai-cyan-50 rounded-lg hover:bg-sinai-cyan-100 transition-colors"
          aria-label="Copy template to clipboard"
        >
          <ClipboardCopy className="w-4 h-4" />
          Copy Template
        </button>
      </div>

      {/* Template Helper */}
      {showTemplate && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-sinai-cyan-50 border border-sinai-cyan-200 rounded-lg p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-sinai-cyan-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-sinai-cyan-900 mb-2">Template Format</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono bg-white/50 p-3 rounded border border-sinai-cyan-100">
{TEMPLATE}
              </pre>
              <button
                onClick={() => setShowTemplate(false)}
                className="text-sm text-sinai-cyan-700 hover:text-sinai-cyan-900 mt-2 underline"
              >
                Hide template
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {!showTemplate && (
        <button
          onClick={() => setShowTemplate(true)}
          className="text-sm text-sinai-cyan-700 hover:text-sinai-cyan-900 mb-4 underline"
        >
          Show template
        </button>
      )}

      {/* Main Textarea */}
      <div className="space-y-4">
        <div>
          <label htmlFor="provider-note" className="block text-sm font-medium text-gray-700 mb-2">
            Provider Note
          </label>
          <textarea
            id="provider-note"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Paste your provider note here..."
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sinai-cyan-500 focus:border-transparent resize-none font-mono text-sm"
            aria-describedby={error ? "note-error" : undefined}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-500">
              {noteText.length} characters
            </span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4"
            id="note-error"
            role="alert"
          >
            <p className="text-sm text-red-800">{error}</p>
          </motion.div>
        )}

        {/* Privacy Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <strong>Privacy Protection:</strong> Patient names are only included if you explicitly mark
              "OK to show name: yes". All other PHI is automatically redacted. Videos include
              "Not medical advice" disclaimers.
            </div>
          </div>
        </div>

        {/* Preview Button */}
        <button
          onClick={handlePreview}
          disabled={!noteText.trim() || isGenerating}
          className="w-full py-3 px-6 bg-gradient-to-r from-sinai-cyan-600 to-sinai-magenta-600 text-white font-semibold rounded-lg hover:from-sinai-cyan-700 hover:to-sinai-magenta-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Script with GPT-4...
            </>
          ) : (
            'Preview 20s Script →'
          )}
        </button>
      </div>
    </motion.div>
  );
}
