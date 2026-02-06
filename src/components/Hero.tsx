import { motion } from 'framer-motion';
import { trackCTAClick } from '../utils/analytics';

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
            Mount Sinai West - Agentic Laboratory
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Healthcare Teams Building
            <br />
            <span className="bg-gradient-to-r from-sinai-blue-600 to-sinai-maroon-600 bg-clip-text text-transparent">
              Production Software
            </span>
            <br />
            <span className="text-4xl md:text-6xl">In Weeks, Not Years</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8">
            Clinicians, nurses, administrators, and operations teams transforming domain expertise into HIPAA-compliant applications with AI-assisted development.
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
              href="#contact"
              onClick={() => trackCTAClick('Hero', 'Schedule a Demo')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-sinai-blue-600 border-2 border-sinai-blue-600 rounded-lg font-semibold text-lg hover:bg-sinai-blue-50 transition-colors"
            >
              Schedule a Demo
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
