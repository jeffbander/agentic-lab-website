import { motion } from 'framer-motion';
import { trackCTAClick } from '../utils/analytics';

const proofStats = [
  '92% of US devs use AI daily',
  '97M+ MCP SDK downloads/mo',
  '$3.70 ROI per $1 invested',
  'Claude for Healthcare: HIPAA-ready',
];

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-sinai-blue-50 via-white to-sinai-maroon-50 overflow-hidden">
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
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-4 px-4 py-2 bg-sinai-blue-100 text-sinai-blue-700 rounded-full text-sm font-semibold"
          >
            Mount Sinai West Agentic Laboratory — Pioneering Multi-Agent Healthcare AI
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Where Clinicians Command
            <br />
            <span className="bg-gradient-to-r from-sinai-blue-600 to-sinai-maroon-600 bg-clip-text text-transparent">
              AI Agent Teams
            </span>
            <br />
            <span className="text-4xl md:text-6xl">To Ship Production Software in Weeks</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8">
            Powered by Claude Opus 4.6 Agent Teams, MCP protocol, and Claude for Healthcare — 92% AI-assisted development delivering HIPAA-compliant applications in 2-6 weeks.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.a
              href="#projects"
              onClick={() => trackCTAClick('Hero', 'See Our Projects')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-sinai-blue-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:bg-sinai-blue-700 transition-colors"
            >
              See Our Projects
            </motion.a>
            <motion.a
              href="#approach"
              onClick={() => trackCTAClick('Hero', 'See How We Build')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-sinai-blue-600 border-2 border-sinai-blue-600 rounded-lg font-semibold text-lg hover:bg-sinai-blue-50 transition-colors"
            >
              See How We Build
            </motion.a>
          </div>

          {/* Proof Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 overflow-hidden"
          >
            <div className="flex animate-scroll gap-8 whitespace-nowrap py-3 px-4 bg-white/60 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm max-w-4xl mx-auto justify-center flex-wrap sm:flex-nowrap">
              {proofStats.map((stat, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700 font-medium shrink-0">
                  <span className="w-1.5 h-1.5 bg-sinai-cyan rounded-full" />
                  {stat}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
