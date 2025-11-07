import { motion } from 'framer-motion';
import {
  ClipboardCheck,
  Calendar,
  MessageCircle,
  Shield,
  RefreshCw,
  BarChart3,
  DollarSign,
  Clock,
  TrendingUp
} from 'lucide-react';

const metrics = [
  { value: '95%', label: 'Authorization Accuracy' },
  { value: '40%', label: 'Time Savings' },
  { value: '85%', label: 'Patient Satisfaction' },
  { value: '10:1', label: 'ROI' }
];

const features = [
  {
    icon: ClipboardCheck,
    title: 'AI-Powered Prior Authorization',
    description: 'Automated form completion with 95% accuracy. Reduces authorization time from 7-14 days to 24-48 hours.',
    highlights: [
      'Intelligent form field mapping',
      'Real-time status tracking',
      'Automated appeals generation'
    ]
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Intelligent appointment optimization reduces no-shows by 30% and saves 40% of scheduling time.',
    highlights: [
      'Automated reminders (SMS, email, voice)',
      'Dosing interval tracking',
      'Resource optimization'
    ]
  },
  {
    icon: MessageCircle,
    title: 'Patient Engagement',
    description: 'AI voice agents and automated outreach achieve 85% patient satisfaction and improve adherence.',
    highlights: [
      'Automated wellness checks',
      'Educational content delivery',
      'Side effect monitoring'
    ]
  },
  {
    icon: Shield,
    title: 'HIPAA Compliance',
    description: 'Enterprise-grade security with full audit trails and encrypted data handling.',
    highlights: [
      'End-to-end encryption',
      'Role-based access control',
      'Complete audit logging'
    ]
  },
  {
    icon: RefreshCw,
    title: 'EHR Integration',
    description: 'Seamless integration with Epic, Cerner, and other major EHR systems via FHIR APIs.',
    highlights: [
      'Bi-directional data sync',
      'Real-time patient data access',
      'Automated documentation'
    ]
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    description: 'Comprehensive dashboards and reporting for program optimization and ROI tracking.',
    highlights: [
      'Real-time program metrics',
      'Financial impact analysis',
      'Patient outcome tracking'
    ]
  }
];

const roiMetrics = [
  {
    icon: DollarSign,
    value: '$150K+',
    label: 'Annual Savings',
    color: 'from-green-500 to-emerald-600'
  },
  {
    icon: Clock,
    value: '500+',
    label: 'Hours Saved/Month',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    icon: TrendingUp,
    value: '40%',
    label: 'Revenue Increase',
    color: 'from-purple-500 to-violet-600'
  }
];

export default function LeqvioSection() {
  return (
    <section id="leqvio" className="py-20 bg-gradient-to-b from-white via-gray-50 to-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-sinai-cyan to-sinai-magenta text-white text-sm font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              Our First Commercial Product
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-sinai-navy mb-6">
            LEQVIO AI
          </h2>
          <p className="text-xl text-gray-700 mb-4 max-w-3xl mx-auto">
            Complete Injectable Medication Lifecycle Management
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Transform your injectable medication program with AI-powered automation.
            Streamline prior authorization, scheduling, and patient engagement with proven results.
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sinai-cyan to-sinai-magenta bg-clip-text text-transparent mb-2">
                {metric.value}
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-sinai-navy text-center mb-12">
            Complete Medication Lifecycle Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all hover:scale-105"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-sinai-cyan to-sinai-magenta flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-sinai-navy">
                      {feature.title}
                    </h4>
                  </div>
                  <p className="text-gray-700 mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-sinai-cyan mt-0.5">✓</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ROI Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-sinai-navy to-sinai-violet rounded-3xl p-8 md:p-12 mb-12"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-8">
            Proven Return on Investment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {roiMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${metric.color} mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {metric.value}
                  </div>
                  <div className="text-lg text-gray-300">
                    {metric.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
          <p className="text-center text-gray-200 text-lg">
            Healthcare organizations see an average <span className="font-bold text-white">10:1 ROI</span> within the first year of implementation
          </p>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <h3 className="text-3xl font-bold text-sinai-navy mb-6">
            Ready to Transform Your Injectable Program?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join leading healthcare organizations using LEQVIO AI to streamline operations and improve patient outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://grand-snickerdoodle-4e7462.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sinai-cyan to-sinai-magenta text-white font-semibold rounded-xl hover:shadow-xl transition-all hover:scale-105"
            >
              Try Interactive Demo
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-sinai-navy font-semibold rounded-xl border-2 border-sinai-navy hover:bg-sinai-navy hover:text-white transition-all"
            >
              Schedule a Demo
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            No installation required • Explore at your own pace
          </p>
        </motion.div>
      </div>
    </section>
  );
}
