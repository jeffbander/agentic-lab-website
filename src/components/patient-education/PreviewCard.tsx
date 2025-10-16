import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Check, X, Play, AlertCircle } from 'lucide-react';
import type { SoraPromptResult, OnScreenText } from '../../lib/patientEducation';

interface PreviewCardProps {
  result: SoraPromptResult;
  onGenerate: (prompt: string, ost: OnScreenText) => void;
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

export default function PreviewCard({ result, onGenerate, onBack }: PreviewCardProps) {
  const [ost, setOst] = useState<OnScreenText>(result.ost);

  const handleBeatEdit = (beat: keyof OnScreenText, newText: string) => {
    setOst(prev => ({
      ...prev,
      [beat]: newText,
    }));
  };

  const handleGenerate = () => {
    onGenerate(result.prompt, ost);
  };

  const beats = [
    { key: 'beat1' as const, title: 'Greeting + Condition', timeRange: '0-5s' },
    { key: 'beat2' as const, title: 'Key Takeaway', timeRange: '5-10s' },
    { key: 'beat3' as const, title: 'How Treatment Helps', timeRange: '10-15s' },
    { key: 'beat4' as const, title: 'Next Step + Safety', timeRange: '15-20s' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Preview 20s Script</h2>
        <p className="text-gray-600 mt-1">
          Review and edit the on-screen text for each 5-second beat
        </p>
      </div>

      {/* Metadata Display */}
      <div className="bg-sinai-cyan-50 border border-sinai-cyan-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Language:</span>
            <span className="ml-2 font-semibold text-gray-900">{result.audit.language}</span>
          </div>
          <div>
            <span className="text-gray-600">Duration:</span>
            <span className="ml-2 font-semibold text-gray-900">{result.params.n_seconds}s</span>
          </div>
          <div>
            <span className="text-gray-600">Resolution:</span>
            <span className="ml-2 font-semibold text-gray-900">
              {result.params.width}×{result.params.height}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Brand Detected:</span>
            <span className="ml-2 font-semibold text-gray-900">
              {result.audit.brandPresent ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>

      {/* 4-Beat Storyboard */}
      <div className="grid gap-4 mb-6">
        {beats.map((beat, index) => (
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
          className="flex-1 py-3 px-6 bg-gradient-to-r from-sinai-cyan-600 to-sinai-magenta-600 text-white font-semibold rounded-lg hover:from-sinai-cyan-700 hover:to-sinai-magenta-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          Generate 20s Video
        </button>
      </div>
    </motion.div>
  );
}
