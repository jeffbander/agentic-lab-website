import { motion } from 'framer-motion';
import { DollarSign, Clock, Heart, Users, Award, Target, Zap } from 'lucide-react';

export function Impact() {
  const clinicalImpacts = [
    {
      icon: Heart,
      title: 'Lives Saved',
      value: '6-8',
      unit: 'annually',
      description: 'Heart failure patients saved through early voice biomarker detection',
      project: 'HeartVoice Monitor',
      color: 'text-red-500'
    },
    {
      icon: Clock,
      title: 'Time Saved',
      value: '60%',
      unit: 'reduction',
      description: 'IRB protocol submission time reduced from 6 months to 8 weeks',
      project: 'IRBVer2',
      color: 'text-sinai-cyan'
    },
    {
      icon: Users,
      title: 'Patient Reach',
      value: '1000+',
      unit: 'per day',
      description: 'Automated patient outreach capacity via HIPAA-compliant voice AI',
      project: 'Voice AI Agent',
      color: 'text-sinai-magenta'
    },
    {
      icon: Target,
      title: 'Enrollment Increase',
      value: '165%',
      unit: 'improvement',
      description: 'Clinical trial enrollment for PCSK9 inhibitor program',
      project: 'LEQVIO Enrollment',
      color: 'text-green-500'
    }
  ];

  const financialImpacts = [
    {
      metric: 'Total Cost Savings',
      value: '$1,000,000+',
      description: 'Cumulative savings across all 5 production applications',
      breakdown: [
        'IRBVer2: $150,000/year',
        'HeartVoice: $1,875,000 (hospitalizations prevented)',
        'LEQVIO: $936,000/year',
        'Voice Agent: 80% cost vs human callers',
        'PTO App: 10 hours/week admin time'
      ]
    },
    {
      metric: 'Development Cost Savings',
      value: '70-90%',
      description: 'Compared to traditional enterprise software procurement',
      breakdown: [
        'No vendor licensing fees ($50k-200k/year)',
        'Single physician-developer vs 5-8 person team',
        'Open source tech stack (no proprietary licenses)',
        '4-8 weeks vs 6-12 months development time',
        'In-house ownership and rapid iteration'
      ]
    },
    {
      metric: 'ROI Timeline',
      value: '3-6 months',
      description: 'Time to positive return on investment',
      breakdown: [
        'Immediate workflow efficiency gains',
        'Reduced manual data entry and processing',
        'Avoided enterprise software costs',
        'Improved clinical outcomes',
        'Scalable to other departments/hospitals'
      ]
    }
  ];

  const operationalImpacts = [
    {
      icon: Zap,
      title: 'Deployment Speed',
      before: '6-12 months',
      after: '4-8 weeks',
      improvement: '85%',
      description: 'Faster time from concept to production'
    },
    {
      icon: Users,
      title: 'Team Size',
      before: '5-8 developers',
      after: '1 physician + AI',
      improvement: '85%',
      description: 'Reduction in required personnel'
    },
    {
      icon: DollarSign,
      title: 'Project Cost',
      before: '$200k-500k',
      after: '$20k-50k',
      improvement: '90%',
      description: 'Lower development expenses'
    },
    {
      icon: Award,
      title: 'Code Quality',
      before: '60-70% test coverage',
      after: '83.8% AI acceptance',
      improvement: 'Higher',
      description: 'Production-ready on first commit'
    }
  ];

  return (
    <section id="impact" className="py-20 bg-gradient-to-b from-white to-gray-50 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-sinai-navy mb-4">
            Real-World Impact
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Measurable improvements in clinical outcomes, operational efficiency, and cost savings
          </p>
        </motion.div>

        {/* Clinical Impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-sinai-navy mb-8 text-center">Clinical Outcomes</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {clinicalImpacts.map((impact, index) => (
              <motion.div
                key={impact.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className={`w-12 h-12 ${impact.color} bg-opacity-10 rounded-full flex items-center justify-center mb-4`}>
                  <impact.icon className={`w-6 h-6 ${impact.color}`} />
                </div>
                <div className="text-3xl font-bold text-sinai-navy mb-1">{impact.value}</div>
                <div className="text-sm text-gray-500 mb-3">{impact.unit}</div>
                <h4 className="font-bold text-gray-900 mb-2">{impact.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{impact.description}</p>
                <div className="text-xs text-sinai-cyan font-semibold">{impact.project}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Financial Impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-sinai-navy mb-8 text-center">Financial Savings</h3>
          <div className="grid lg:grid-cols-3 gap-8">
            {financialImpacts.map((impact, index) => (
              <motion.div
                key={impact.metric}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-sinai-cyan/5 to-sinai-magenta/5 rounded-xl p-6 border-l-4 border-sinai-cyan"
              >
                <h4 className="font-bold text-sinai-navy mb-2">{impact.metric}</h4>
                <div className="text-4xl font-bold text-sinai-cyan mb-3">{impact.value}</div>
                <p className="text-sm text-gray-700 mb-4">{impact.description}</p>
                <div className="space-y-2">
                  {impact.breakdown.map((item, i) => (
                    <div key={i} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-sinai-magenta rounded-full mt-1.5" />
                      <span className="text-xs text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Operational Efficiency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-sinai-navy mb-8 text-center">Operational Efficiency</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {operationalImpacts.map((impact, index) => (
              <motion.div
                key={impact.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-sinai-cyan/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <impact.icon className="w-6 h-6 text-sinai-cyan" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sinai-navy mb-3">{impact.title}</h4>
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-1">Before</div>
                        <div className="text-lg font-semibold text-gray-900">{impact.before}</div>
                      </div>
                      <div className="text-2xl font-bold text-sinai-magenta">→</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-1">After</div>
                        <div className="text-lg font-semibold text-sinai-cyan">{impact.after}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-semibold">
                        {impact.improvement} improvement
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{impact.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-sinai-navy to-sinai-dark rounded-2xl p-12 text-center text-white"
        >
          <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Healthcare Operations?</h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join Mount Sinai in pioneering the future of healthcare software development
          </p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-sinai-cyan text-white rounded-lg font-semibold text-lg hover:bg-sinai-cyan/90 transition-colors shadow-lg"
          >
            Schedule a Consultation →
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
