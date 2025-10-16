import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, FileText, Eye, Video } from 'lucide-react';
import ProviderNoteForm from '../components/patient-education/ProviderNoteForm';
import PreviewCard from '../components/patient-education/PreviewCard';
import GeneratePanel from '../components/patient-education/GeneratePanel';
import type { SoraPromptResult, OnScreenText } from '../lib/patientEducation';

type Step = 'form' | 'preview' | 'generate';

export default function PatientEducation() {
  const [currentStep, setCurrentStep] = useState<Step>('form');
  const [promptResult, setPromptResult] = useState<SoraPromptResult | null>(null);
  const [finalOst, setFinalOst] = useState<OnScreenText | null>(null);

  const handlePreview = (result: SoraPromptResult) => {
    setPromptResult(result);
    setCurrentStep('preview');
  };

  const handleGenerate = (prompt: string, ost: OnScreenText) => {
    setFinalOst(ost);
    setCurrentStep('generate');
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
  };

  const handleBackToPreview = () => {
    setCurrentStep('preview');
  };

  const handleReset = () => {
    setPromptResult(null);
    setFinalOst(null);
    setCurrentStep('form');
  };

  const steps = [
    { key: 'form' as const, icon: FileText, label: 'Paste Note' },
    { key: 'preview' as const, icon: Eye, label: 'Preview Script' },
    { key: 'generate' as const, icon: Video, label: 'Generate Video' },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === currentStep);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-sinai-cyan-600 to-sinai-magenta-600 rounded-xl flex items-center justify-center">
              <Video className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Patient Education Micro-Videos
              </h1>
              <p className="text-gray-600">
                Transform provider notes into 12-second educational videos
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;

                return (
                  <React.Fragment key={step.key}>
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center transition-all
                          ${isActive ? 'bg-sinai-cyan-600 text-white scale-110' : ''}
                          ${isCompleted ? 'bg-green-500 text-white' : ''}
                          ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-400' : ''}
                        `}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`
                          font-medium transition-colors
                          ${isActive ? 'text-gray-900' : ''}
                          ${isCompleted ? 'text-green-600' : ''}
                          ${!isActive && !isCompleted ? 'text-gray-400' : ''}
                        `}
                      >
                        {step.label}
                      </span>
                    </div>

                    {index < steps.length - 1 && (
                      <div
                        className={`
                          flex-1 h-1 mx-4 rounded transition-colors
                          ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                        `}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {currentStep === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <ProviderNoteForm onPreview={handlePreview} />
            </motion.div>
          )}

          {currentStep === 'preview' && promptResult && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <PreviewCard
                result={promptResult}
                onGenerate={handleGenerate}
                onBack={handleBackToForm}
              />
            </motion.div>
          )}

          {currentStep === 'generate' && promptResult && finalOst && (
            <motion.div
              key="generate"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <GeneratePanel
                prompt={promptResult.prompt}
                ost={finalOst}
                onBack={handleBackToPreview}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center text-sm text-gray-600"
        >
          <p>
            All videos are HIPAA-compliant with automatic PHI redaction and safety disclaimers.
          </p>
          <p className="mt-1">
            Powered by OpenAI Sora 2 • Typical generation time: 1.5-2 minutes
          </p>
        </motion.div>
      </div>
    </div>
  );
}
