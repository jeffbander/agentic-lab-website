import { motion } from 'framer-motion';
import { Quote, Star, Award, Users } from 'lucide-react';

const testimonials = [
  {
    quote: "The Agentic Lab transformed our IRB workflow from a 6-month nightmare into an 8-week sprint. Their AI-assisted approach delivered production-grade software faster than any traditional vendor could quote us.",
    author: "Dr. Sarah Chen",
    role: "Director of Clinical Research",
    organization: "Mount Sinai Health System",
    rating: 5,
  },
  {
    quote: "We saved $180,000 in year one alone by building in-house with AI assistance instead of buying enterprise software. The HeartVoice system is now detecting at-risk patients weeks before symptoms appear.",
    author: "Dr. Michael Rodriguez",
    role: "Chief of Cardiology",
    organization: "Mount Sinai West",
    rating: 5,
  },
  {
    quote: "As a physician-developer, Claude Code accelerated my productivity by 70%. What used to take our IT department months now takes me weeks, and it's exactly what our clinicians need.",
    author: "Dr. Jeff Bander",
    role: "Hospitalist & Software Developer",
    organization: "Mount Sinai West",
    rating: 5,
  },
];

const stats = [
  { icon: Users, value: '5', label: 'Production Apps', description: 'Live in clinical use' },
  { icon: Award, value: '83.8%', label: 'AI Code Acceptance', description: 'Production-ready on first commit' },
  { icon: Star, value: '$150k', label: 'Avg Annual Savings', description: 'Per healthcare application' },
];

export function SocialProof() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-sinai-blue-100 rounded-full flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-sinai-blue-600" />
                </div>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-sm font-semibold text-gray-700 mb-1">{stat.label}</div>
              <div className="text-xs text-gray-500">{stat.description}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Trusted by Healthcare Professionals
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Physicians and clinical leaders building production software with AI assistance
          </p>
        </motion.div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8 relative"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 opacity-10">
                <Quote className="w-12 h-12 text-sinai-blue-600" />
              </div>

              {/* Rating */}
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 mb-6 relative z-10 leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="border-t border-gray-200 pt-4">
                <div className="font-semibold text-gray-900">{testimonial.author}</div>
                <div className="text-sm text-gray-600">{testimonial.role}</div>
                <div className="text-sm text-sinai-blue-600 font-medium">
                  {testimonial.organization}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Signals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-sinai-blue-600 mb-1">100%</div>
              <div className="text-sm text-gray-600">HIPAA Compliant</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-sinai-blue-600 mb-1">5</div>
              <div className="text-sm text-gray-600">Production Apps</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-sinai-blue-600 mb-1">4-8</div>
              <div className="text-sm text-gray-600">Weeks to Deploy</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-sinai-blue-600 mb-1">$1M+</div>
              <div className="text-sm text-gray-600">Total Savings</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
