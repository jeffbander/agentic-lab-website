import { motion } from 'framer-motion';
import { Brain, Users, Rocket, Target, GitBranch, TestTube, Lock, RefreshCw } from 'lucide-react';

export function Approach() {
  const methodology = [
    {
      phase: '1',
      title: 'Clinical Discovery',
      icon: Users,
      duration: '1-2 days',
      description: 'Physician-developers work directly with clinical teams to identify pain points, workflow inefficiencies, and unmet needs.',
      activities: [
        'Shadow clinical workflows',
        'Interview end users',
        'Document requirements',
        'Prioritize features by impact'
      ],
      color: 'from-sinai-cyan to-blue-400'
    },
    {
      phase: '2',
      title: 'AI-Assisted Design',
      icon: Brain,
      duration: '2-3 days',
      description: 'Leverage AI to rapidly prototype interfaces, data models, and system architecture with clinical context.',
      activities: [
        'Generate UI mockups with Claude',
        'Design database schemas',
        'Plan API architecture',
        'Create technical specifications'
      ],
      color: 'from-sinai-magenta to-purple-400'
    },
    {
      phase: '3',
      title: 'Rapid Development',
      icon: Rocket,
      duration: '2-4 weeks',
      description: 'Write production code with 80%+ AI assistance, focusing physician time on clinical logic and validation.',
      activities: [
        'AI generates boilerplate code',
        'Physician reviews and refines',
        'Integrate with EHR/FHIR APIs',
        'Implement security controls'
      ],
      color: 'from-sinai-violet to-indigo-400'
    },
    {
      phase: '4',
      title: 'Clinical Validation',
      icon: TestTube,
      duration: '1-2 weeks',
      description: 'Test with real clinical users in sandbox environment, iterate based on feedback.',
      activities: [
        'User acceptance testing',
        'Workflow integration testing',
        'Load and performance testing',
        'Security penetration testing'
      ],
      color: 'from-green-500 to-emerald-400'
    },
    {
      phase: '5',
      title: 'Secure Deployment',
      icon: Lock,
      duration: '3-5 days',
      description: 'Deploy to production with HIPAA-compliant infrastructure, monitoring, and backup systems.',
      activities: [
        'Deploy to GCP/AWS',
        'Configure monitoring alerts',
        'Set up automated backups',
        'Enable audit logging'
      ],
      color: 'from-orange-500 to-amber-400'
    },
    {
      phase: '6',
      title: 'Continuous Improvement',
      icon: RefreshCw,
      duration: 'Ongoing',
      description: 'Monitor usage, gather feedback, and rapidly deploy updates—often within days of feature requests.',
      activities: [
        'Monitor error rates',
        'Analyze usage patterns',
        'Collect user feedback',
        'Deploy feature updates'
      ],
      color: 'from-sinai-cyan to-sinai-magenta'
    }
  ];

  const principles = [
    {
      icon: Target,
      title: 'Clinical-First Design',
      description: 'Every feature must solve a real clinical problem. No feature bloat, no unnecessary complexity.'
    },
    {
      icon: GitBranch,
      title: 'Agile & Iterative',
      description: 'Ship MVP in weeks, then iterate based on real clinical usage and feedback.'
    },
    {
      icon: Brain,
      title: 'AI-Augmented, Not Replaced',
      description: 'AI generates code, physicians provide domain expertise and clinical validation.'
    },
    {
      icon: Lock,
      title: 'Security by Design',
      description: 'HIPAA compliance, encryption, audit logs, and access controls from day one.'
    }
  ];

  return (
    <section id="approach" className="py-20 bg-gradient-to-b from-gray-50 to-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-sinai-navy mb-4">
            Our Approach
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            A systematic methodology that combines clinical expertise, AI-powered development, and healthcare best practices
          </p>
        </motion.div>

        {/* Core Principles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-sinai-navy mb-8 text-center">Guiding Principles</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg text-center"
              >
                <div className="w-12 h-12 bg-sinai-cyan/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <principle.icon className="w-6 h-6 text-sinai-cyan" />
                </div>
                <h4 className="font-bold text-sinai-navy mb-2">{principle.title}</h4>
                <p className="text-sm text-gray-600">{principle.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 6-Phase Methodology */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-sinai-navy mb-8 text-center">6-Phase Development Process</h3>
          <div className="space-y-6">
            {methodology.map((phase, index) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Left: Phase number and icon */}
                  <div className={`lg:w-48 bg-gradient-to-br ${phase.color} p-8 flex flex-col items-center justify-center text-white`}>
                    <div className="text-5xl font-bold mb-4">0{phase.phase}</div>
                    <phase.icon className="w-12 h-12 mb-2" />
                    <div className="text-sm font-semibold">{phase.duration}</div>
                  </div>

                  {/* Right: Content */}
                  <div className="flex-1 p-8">
                    <h4 className="text-2xl font-bold text-sinai-navy mb-3">{phase.title}</h4>
                    <p className="text-gray-700 mb-4">{phase.description}</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      {phase.activities.map((activity, i) => (
                        <div key={i} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-sinai-cyan rounded-full mt-2" />
                          <span className="text-sm text-gray-600">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-bold text-sinai-navy mb-6 text-center">Modern Tech Stack</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-sinai-cyan mb-3">Frontend</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• React 19 + TypeScript</li>
                <li>• Next.js 14 for SSR</li>
                <li>• Tailwind CSS v3</li>
                <li>• Framer Motion</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sinai-magenta mb-3">Backend</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Node.js / Python</li>
                <li>• Prisma ORM</li>
                <li>• PostgreSQL / MongoDB</li>
                <li>• REST / GraphQL APIs</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sinai-violet mb-3">Infrastructure</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Google Cloud Platform</li>
                <li>• Docker + Kubernetes</li>
                <li>• Terraform IaC</li>
                <li>• GitHub Actions CI/CD</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
