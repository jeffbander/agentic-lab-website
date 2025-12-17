import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Check, X, Play, AlertCircle } from 'lucide-react';
import type { SoraPromptResult, OnScreenText } from '../../lib/patientEducation';

interface PreviewCardProps {
  result: SoraPromptResult;
  promptPart2?: string; // New: Part 2 prompt if 24-second video
  onGenerate: (prompt: string, ost: OnScreenText, promptPart2?: string, model?: string) => void;
  onBack: () => void;
}

interface BeatCardProps {
  beatNumber: number;
  title: string;
  text: string;
  timeRange: string;
  onEdit: (newText: string) => void;
}

const MAX_LINE_LENGTH = 48;
const MAX_LINES = 2;

function BeatCard({ beatNumber, title, text, timeRange, onEdit }: BeatCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const [error, setError] = useState<string | null>(null);

  const validateText = (value: string): boolean => {
    const lines = value.split('\n');
    if (lines.length > MAX_LINES) {
      setError(`Max ${MAX_LINES} lines allowed`);
      return false;
    }

    const tooLong = lines.find(line => line.length > MAX_LINE_LENGTH);
    if (tooLong) {
      setError(`Max ${MAX_LINE_LENGTH} chars per line`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleSave = () => {
    if (validateText(editedText)) {
      onEdit(editedText);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedText(text);
    setError(null);
    setIsEditing(false);
  };

  const charCount = editedText.length;
  const lineCount = editedText.split('\n').length;

  return (
    <motion.div
      layout
      className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-sinai-cyan-300 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 bg-sinai-cyan-600 text-white rounded-full font-bold text-sm">
              {beatNumber}
            </span>
            <div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <span className="text-xs text-gray-500">{timeRange}</span>
            </div>
          </div>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-600 hover:text-sinai-cyan-700 hover:bg-sinai-cyan-50 rounded-lg transition-colors"
            aria-label={`Edit ${title}`}
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="editing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <textarea
              value={editedText}
              onChange={(e) => {
                setEditedText(e.target.value);
                validateText(e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sinai-cyan-500 focus:border-transparent resize-none font-medium text-gray-900"
              rows={2}
              maxLength={MAX_LINE_LENGTH * MAX_LINES}
            />

            <div className="flex items-center justify-between">
              <div className="text-xs space-y-1">
                <div className={`${charCount > MAX_LINE_LENGTH ? 'text-red-600' : 'text-gray-500'}`}>
                  {charCount}/{MAX_LINE_LENGTH} chars per line
                </div>
                <div className={`${lineCount > MAX_LINES ? 'text-red-600' : 'text-gray-500'}`}>
                  {lineCount}/{MAX_LINES} lines
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Cancel editing"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSave}
                  disabled={!!error}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Save changes"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-red-600">
                <AlertCircle className="w-3 h-3" />
                {error}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            <p className="text-lg font-medium text-gray-900 whitespace-pre-wrap leading-relaxed">
              {text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PreviewCard({ result, promptPart2, onGenerate, onBack }: PreviewCardProps) {
  const [ost, setOst] = useState<OnScreenText>(result.ost);

  const handleBeatEdit = (beat: keyof OnScreenText, newText: string) => {
    setOst(prev => ({
      ...prev,
      [beat]: newText,
    }));
  };

  const handleGenerate = () => {
    onGenerate(result.prompt, ost, promptPart2, result.params.model);
  };

  // Check if we have an extended 24-second video (8 beats)
  const hasExtendedBeats = !!ost.beat5;

  const beatsPart1 = [
    { key: 'beat1' as const, title: 'Mount Sinai Logo', timeRange: '0-3s' },
    { key: 'beat2' as const, title: 'Greeting + Conditions', timeRange: '3-6s' },
    { key: 'beat3' as const, title: 'Condition Overview', timeRange: '6-9s' },
    { key: 'beat4' as const, title: 'Recent Test Results', timeRange: '9-12s' },
  ];

  const beatsPart2 = [
    { key: 'beat5' as const, title: 'Current Medications', timeRange: '12-15s' },
    { key: 'beat6' as const, title: 'Treatment Options', timeRange: '15-18s' },
    { key: 'beat7' as const, title: 'Next Steps', timeRange: '18-21s' },
    { key: 'beat8' as const, title: 'Safety + Call to Action', timeRange: '21-24s' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Preview {hasExtendedBeats ? '24s' : '12s'} Mount Sinai Script
        </h2>
        <p className="text-gray-600 mt-1">
          Review and edit the on-screen text for each 3-second beat
        </p>
      </div>

      {/* Metadata Display */}
      <div className="bg-sinai-cyan-50 border border-sinai-cyan-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Model:</span>
            <span className="ml-2 font-semibold text-gray-900">
              {result.params.model === 'sora-2-pro' ? 'Sora 2 Pro' : 'Sora 2'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Language:</span>
            <span className="ml-2 font-semibold text-gray-900">{result.audit.language}</span>
          </div>
          <div>
            <span className="text-gray-600">Duration:</span>
            <span className="ml-2 font-semibold text-gray-900">
              {hasExtendedBeats ? '24s (Part 1 + Part 2)' : '12s'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Resolution:</span>
            <span className="ml-2 font-semibold text-gray-900">
              {result.params.width}×{result.params.height}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Hospital:</span>
            <span className="ml-2 font-semibold text-sinai-cyan-700">Mount Sinai NYC</span>
          </div>
        </div>
      </div>

      {/* Part 1 Storyboard */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-sinai-cyan-700 mb-3">
          Part 1: Mount Sinai Branding + Patient Introduction
        </h3>
        <div className="grid gap-4">
          {beatsPart1.map((beat, index) => (
            <BeatCard
              key={beat.key}
              beatNumber={index + 1}
              title={beat.title}
              text={ost[beat.key]}
              timeRange={beat.timeRange}
              onEdit={(newText) => handleBeatEdit(beat.key, newText)}
            />
          ))}
        </div>
      </div>

      {/* Part 2 Storyboard (if exists) */}
      {hasExtendedBeats && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-sinai-cyan-700 mb-3">
            Part 2: Medications + Treatment Plan
          </h3>
          <div className="grid gap-4">
            {beatsPart2.map((beat, index) => {
              const text = ost[beat.key];
              return text ? (
                <BeatCard
                  key={beat.key}
                  beatNumber={index + 5}
                  title={beat.title}
                  text={text}
                  timeRange={beat.timeRange}
                  onEdit={(newText) => handleBeatEdit(beat.key, newText)}
                />
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            <strong>Automatic Disclaimer:</strong> All videos include "Not medical advice. Talk with
            your clinician." footer. Possible risks are shown based on detected medications.
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          ← Back to Note
        </button>
        <button
          onClick={handleGenerate}
          className="flex-1 py-3 px-6 bg-gradient-to-r from-sinai-cyan-600 to-sinai-magenta-600 text-black font-semibold rounded-lg hover:from-sinai-cyan-700 hover:to-sinai-magenta-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          style={{ color: '#000000' }}
        >
          <Play className="w-5 h-5" style={{ color: '#000000' }} />
          <span style={{ color: '#000000' }}>
            Generate {hasExtendedBeats ? '24s Mount Sinai Video' : '12s Video'}
          </span>
        </button>
      </div>
    </motion.div>
  );
}
