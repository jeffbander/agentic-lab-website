import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Check, X, Play, AlertCircle, ChevronDown, Sparkles, Zap, Film, DollarSign } from 'lucide-react';
import type { SoraPromptResult, OnScreenText } from '../../lib/patientEducation';

// Video model options for patient education
type VideoModelOption = {
  id: string;
  name: string;
  description: string;
  badge?: string;
  badgeColor?: string;
  features: string[];
  durations: string;
  pricing: string;
};

const VIDEO_MODELS: VideoModelOption[] = [
  {
    id: 'wan-2.5',
    name: 'Wan 2.5',
    description: 'Best for patient education with audio sync',
    badge: 'Recommended',
    badgeColor: 'bg-green-500',
    features: ['Audio/lip sync', 'Multi-language', 'Budget-friendly', 'Up to 1080p'],
    durations: '5s or 10s',
    pricing: '$0.10-0.15/sec',
  },
  {
    id: 'hailuo-2.3',
    name: 'Hailuo 2.3',
    description: 'Excellent for realistic human motion',
    badge: 'Medical',
    badgeColor: 'bg-blue-500',
    features: ['Realistic motion', 'Cinematic VFX', 'Anatomical demos', '768p-1080p'],
    durations: '6s or 10s',
    pricing: '$0.28-0.56/video',
  },
  {
    id: 'kling-2.5',
    name: 'Kling 2.5',
    description: 'Cinematic quality with smooth motion',
    badge: 'Premium',
    badgeColor: 'bg-purple-500',
    features: ['Cinematic depth', 'Smooth motion', 'Prompt adherence', 'Multiple ratios'],
    durations: '5s or 10s',
    pricing: '$0.07/sec',
  },
  {
    id: 'sora-2-pro',
    name: 'Sora 2 Pro',
    description: 'OpenAI highest quality (requires API key)',
    badge: 'High Quality',
    badgeColor: 'bg-orange-500',
    features: ['Best realism', 'Physics accurate', 'Narrative depth', '720p'],
    durations: '4s, 8s, or 12s',
    pricing: 'Higher cost',
  },
];

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
  const [selectedModel, setSelectedModel] = useState<string>('wan-2.5'); // Default to Wan 2.5 (best for patient education)
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const handleBeatEdit = (beat: keyof OnScreenText, newText: string) => {
    setOst(prev => ({
      ...prev,
      [beat]: newText,
    }));
  };

  const handleGenerate = () => {
    onGenerate(result.prompt, ost, promptPart2, selectedModel);
  };

  const selectedModelInfo = VIDEO_MODELS.find(m => m.id === selectedModel) || VIDEO_MODELS[0];

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

      {/* Model Selection */}
      <div className="bg-gradient-to-r from-sinai-cyan-50 to-sinai-magenta-50 border border-sinai-cyan-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Film className="w-5 h-5 text-sinai-cyan-600" />
            Video Generation Model
          </h3>
          <span className="text-xs text-gray-500">Choose based on your needs</span>
        </div>

        {/* Model Dropdown */}
        <div className="relative mb-4">
          <button
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            className="w-full flex items-center justify-between bg-white border-2 border-sinai-cyan-300 rounded-lg px-4 py-3 hover:border-sinai-cyan-500 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{selectedModelInfo.name}</span>
                  {selectedModelInfo.badge && (
                    <span className={`text-xs px-2 py-0.5 rounded-full text-white ${selectedModelInfo.badgeColor}`}>
                      {selectedModelInfo.badge}
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-600">{selectedModelInfo.description}</span>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {showModelDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
              >
                {VIDEO_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model.id);
                      setShowModelDropdown(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                      selectedModel === model.id ? 'bg-sinai-cyan-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{model.name}</span>
                          {model.badge && (
                            <span className={`text-xs px-2 py-0.5 rounded-full text-white ${model.badgeColor}`}>
                              {model.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{model.description}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {model.features.slice(0, 3).map((feature, i) => (
                            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        <div>{model.durations}</div>
                        <div className="text-sinai-cyan-600">{model.pricing}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Selected Model Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {selectedModelInfo.features.map((feature, i) => (
            <div key={i} className="flex items-center gap-1 text-gray-700">
              <Sparkles className="w-3 h-3 text-sinai-cyan-500" />
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Metadata Display */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
