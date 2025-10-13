import { motion } from 'framer-motion';
import { AnimatedCounter } from './animations/AnimatedCounter';
import { ScrollReveal } from './animations/ScrollReveal';
import { Activity, Code, DollarSign, Clock } from 'lucide-react';
import { statistics } from '../data/projects';

export function Hero() {
  const stats = [
    {
      icon: Code,
      value: statistics.prAcceptance,
      suffix: '%',
      label: 'PR Acceptance Rate',
      description: 'AI-generated pull requests accepted without modification',
    },
    {
      icon: Clock,
      value: 70,
      suffix: '%',
      label: 'Time Reduction',
      description: 'Faster development vs traditional methods',
    },
    {
      icon: DollarSign,
      value: 150,
      prefix: '$',
      suffix: 'k',
      label: 'Annual Cost Savings',
      description: 'Average savings per healthcare application',
    },
    {
      icon: Activity,
      value: 2.5,
      decimals: 1,
      suffix: ' weeks',
      label: 'Early Detection',
      description: 'Heart failure detected before symptoms appear',
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-sinai-blue-50 via-white to-sinai-maroon-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-sinai-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-sinai-maroon-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-4 px-4 py-2 bg-sinai-blue-100 text-sinai-blue-700 rounded-full text-sm font-semibold"
          >
            Mount Sinai West - Agentic Laboratory
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Healthcare Specialists
            <br />
            <span className="bg-gradient-to-r from-sinai-blue-600 to-sinai-maroon-600 bg-clip-text text-transparent">
              Write Software
            </span>
            <br />
            <span className="text-4xl md:text-6xl">WITH Developer Assistance</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8">
            Revolutionary AI-driven development accelerating healthcare innovation from research to production in weeks, not years.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-sinai-blue-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:bg-sinai-blue-700 transition-colors"
            >
              Explore Our Projects
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-sinai-blue-600 border-2 border-sinai-blue-600 rounded-lg font-semibold text-lg hover:bg-sinai-blue-50 transition-colors"
            >
              View Whitepaper
            </motion.button>
          </div>
        </motion.div>

        {/* Animated Statistics */}
        <ScrollReveal delay={0.3}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-sinai-blue-100 rounded-lg">
                    <stat.icon className="w-6 h-6 text-sinai-blue-600" />
                  </div>
                </div>
                <AnimatedCounter
                  to={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  decimals={stat.decimals || 0}
                  duration={2}
                  className="text-4xl font-bold text-gray-900 mb-2"
                />
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  {stat.label}
                </h3>
                <p className="text-xs text-gray-500">
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* Value Proposition Highlights */}
        <ScrollReveal delay={0.5}>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Rapid Development</h3>
              <p className="text-gray-600">Research to production in 4-8 weeks</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">HIPAA Compliant</h3>
              <p className="text-gray-600">Security and privacy by design</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Real Clinical Impact</h3>
              <p className="text-gray-600">Lives saved, costs reduced</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
