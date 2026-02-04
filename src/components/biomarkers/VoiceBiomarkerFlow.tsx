import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Brain, Activity, AlertCircle, CheckCircle, Play, Pause, RotateCcw } from 'lucide-react';

type FlowStep = {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  details: string[];
  metrics?: { label: string; value: string }[];
};

const flowSteps: FlowStep[] = [
  {
    id: 1,
    title: 'Voice Recording',
    description: 'Patient records 30-second voice sample via mobile app',
    icon: Mic,
    color: '#3b82f6',
    details: [
      'Daily automated phone call or app prompt',
      'Simple greeting recording: "Hello, how are you today?"',
      'No special equipment needed',
      'Takes less than 1 minute'
    ],
    metrics: [
      { label: 'Duration', value: '30 sec' },
      { label: 'Frequency', value: 'Daily' }
    ]
  },
  {
    id: 2,
    title: 'Feature Extraction',
    description: 'AI analyzes voice characteristics and extracts biomarkers',
    icon: Brain,
    color: '#8b5cf6',
    details: [
      'Pitch variation analysis',
      'Speech rate measurement',
      'Breathiness detection',
      'Voice tremor quantification',
      'Energy level assessment'
    ],
    metrics: [
      { label: 'Features', value: '50+' },
      { label: 'Processing', value: '<5 sec' }
    ]
  },
  {
    id: 3,
    title: 'ML Analysis',
    description: 'Machine learning model compares against baseline patterns',
    icon: Activity,
    color: '#10b981',
    details: [
      'Compare to patient baseline',
      'Identify subtle changes',
      'Account for time of day variations',
      'Filter out external factors (cold, allergies)',
      'Calculate confidence scores'
    ],
    metrics: [
      { label: 'Accuracy (AUC)', value: '0.82' },
      { label: 'False Positive', value: '15%' }
    ]
  },
  {
    id: 4,
    title: 'Risk Scoring',
    description: 'Generate heart failure exacerbation risk score',
    icon: AlertCircle,
    color: '#f59e0b',
    details: [
      'Low risk: No intervention needed',
      'Medium risk: Schedule follow-up call',
      'High risk: Alert care team immediately',
      'Trend analysis over 7-14 days',
      'Integration with other vital signs'
    ],
    metrics: [
      { label: 'Early Detection', value: '2-3 weeks' },
      { label: 'Risk Levels', value: '3' }
    ]
  },
  {
    id: 5,
    title: 'Clinical Action',
    description: 'Automated alerts and care team notifications',
    icon: CheckCircle,
    color: '#991b1b',
    details: [
      'EHR integration with risk scores',
      'Automated alerts to care coordinators',
      'Patient notification for high risk',
      'Schedule preventive interventions',
      'Track outcomes and adjust thresholds'
    ],
    metrics: [
      { label: 'Hosp. Reduction', value: '30%' },
      { label: 'Response Time', value: '<2 hours' }
    ]
  }
];

export function VoiceBiomarkerFlow() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setActiveStep((current) => {
              if (current >= flowSteps.length - 1) {
                setIsPlaying(false);
                return current;
              }
              return current + 1;
            });
            return 0;
          }
          return prev + 2;
        });
      }, 50);
    }

    return () => clearInterval(interval);
  }, [isPlaying, activeStep]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveStep(0);
    setProgress(0);
  };

  const handleStepClick = (index: number) => {
    setIsPlaying(false);
    setActiveStep(index);
    setProgress(0);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Voice Biomarker Detection Flow
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            How AI detects heart failure exacerbations 2-3 weeks before symptoms appear through voice analysis
          </p>

          {/* Controls */}
          <div className="flex justify-center items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlayPause}
              className="flex items-center space-x-2 px-6 py-3 bg-sinai-blue-600 text-white rounded-lg font-medium hover:bg-sinai-blue-700 transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>Pause Demo</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Play Demo</span>
                </>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 rounded-lg font-medium hover:border-sinai-blue-600 hover:text-sinai-blue-600 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reset</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Flow Visualization */}
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-20 left-0 right-0 h-1 bg-gray-200 hidden md:block">
            <motion.div
              className="h-full bg-gradient-to-r from-sinai-blue-500 to-sinai-maroon-500"
              style={{
                width: `${(activeStep / (flowSteps.length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-5 gap-8">
            {flowSteps.map((step, index) => (
              <StepCard
                key={step.id}
                step={step}
                index={index}
                isActive={activeStep === index}
                isCompleted={activeStep > index}
                progress={activeStep === index ? progress : 0}
                onClick={() => handleStepClick(index)}
              />
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-12 bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-start space-x-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${flowSteps[activeStep].color}20` }}
              >
                {(() => {
                  const Icon = flowSteps[activeStep].icon;
                  return <Icon className="w-8 h-8" style={{ color: flowSteps[activeStep].color }} />;
                })()}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {flowSteps[activeStep].title}
                </h3>
                <p className="text-gray-600 mb-6">{flowSteps[activeStep].description}</p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Process Details</h4>
                    <ul className="space-y-2">
                      {flowSteps[activeStep].details.map((detail, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start space-x-2 text-sm text-gray-700"
                        >
                          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: flowSteps[activeStep].color }} />
                          <span>{detail}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {flowSteps[activeStep].metrics && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Key Metrics</h4>
                      <div className="space-y-4">
                        {flowSteps[activeStep].metrics.map((metric, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center justify-between p-3 rounded-lg"
                            style={{ backgroundColor: `${flowSteps[activeStep].color}10` }}
                          >
                            <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                            <span className="text-lg font-bold" style={{ color: flowSteps[activeStep].color }}>
                              {metric.value}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Clinical Impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-r from-sinai-blue-50 to-sinai-maroon-50 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Clinical Impact</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-sinai-blue-600 mb-2">0.82</div>
              <div className="text-sm text-gray-600">AUC Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">2-3 weeks</div>
              <div className="text-sm text-gray-600">Early Detection</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">30%</div>
              <div className="text-sm text-gray-600">Hospitalization ↓</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sinai-maroon-600 mb-2">$20k+</div>
              <div className="text-sm text-gray-600">Per Avoided Admit</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface StepCardProps {
  step: FlowStep;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  progress: number;
  onClick: () => void;
}

function StepCard({ step, index, isActive, isCompleted, progress, onClick }: StepCardProps) {
  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative cursor-pointer"
      onClick={onClick}
    >
      {/* Node */}
      <motion.div
        className="relative mx-auto w-20 h-20 rounded-full border-4 border-white shadow-lg flex items-center justify-center mb-4"
        style={{
          backgroundColor: isActive || isCompleted ? step.color : '#e5e7eb',
        }}
        whileHover={{ scale: 1.1 }}
        animate={{
          scale: isActive ? [1, 1.05, 1] : 1,
        }}
        transition={{
          scale: {
            repeat: isActive ? Infinity : 0,
            duration: 2,
          },
        }}
      >
        <Icon
          className="w-8 h-8"
          style={{
            color: isActive || isCompleted ? 'white' : '#9ca3af',
          }}
        />

        {/* Progress Ring */}
        {isActive && (
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke={step.color}
              strokeWidth="4"
              fill="none"
              strokeDasharray={226}
              strokeDashoffset={226 - (226 * progress) / 100}
              opacity="0.3"
            />
          </svg>
        )}

        {/* Step Number */}
        <div
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold"
          style={{
            backgroundColor: step.color,
            color: 'white',
          }}
        >
          {step.id}
        </div>
      </motion.div>

      {/* Label */}
      <div className="text-center">
        <h4
          className={`font-semibold mb-1 transition-colors ${
            isActive ? 'text-gray-900' : 'text-gray-600'
          }`}
        >
          {step.title}
        </h4>
        <p className="text-xs text-gray-500 line-clamp-2">{step.description}</p>
      </div>
    </motion.div>
  );
}
