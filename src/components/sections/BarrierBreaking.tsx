import { motion } from 'framer-motion';
import { ArrowRight, Zap, Users, Code, Heart, Clock, DollarSign } from 'lucide-react';

export function BarrierBreaking() {
  const barrierExamples = [
    {
      icon: Heart,
      title: 'Cardiologists Building Heart Monitoring Software',
      description: 'Dr. Jeff Bander, cardiologist, built voice-based heart failure detection without a CS degree. Direct clinical expertise becomes production AI.',
      barrier: 'Technical Barrier',
      solution: 'Demolished'
    },
    {
      icon: Clock,
      title: '8-Week Development Where Industry Standard is 8 Months',
      description: 'IRBVer2: Complete IRB protocol management system built in 8 weeks. Clinical insight to software reality, no translation phase.',
      barrier: 'Time Barrier',
      solution: 'Eliminated'
    },
    {
      icon: DollarSign,
      title: '$50K Solutions Replacing $200K Enterprise Software',
      description: 'Custom clinical workflow tools that perfectly match hospital needs, built for fraction of enterprise software cost.',
      barrier: 'Cost Barrier',
      solution: 'Shattered'
    }
  ];

  return (
    <section id="barrier-breaking" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Software Agents as 
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              {' '}Barrier-Breakers
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-8">
            The walls between clinical insight and software implementation? <strong>Demolished.</strong><br/>
            The translation tax between medical language and technical specifications? <strong>Eliminated.</strong><br/>
            The gatekeeping that keeps clinicians from building solutions? <strong>Dissolved.</strong>
          </p>
        </motion.div>

        {/* Visual Barrier Breaking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-12 items-center mb-20"
        >
          <div>
            <div className="rounded-2xl shadow-2xl bg-gradient-to-br from-blue-100 to-red-100 p-12 text-center">
              <div className="text-6xl mb-4">🚧💥</div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Barrier-Breaking Visualization</h4>
              <p className="text-gray-600">AI agents demolishing traditional development barriers</p>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              The Age of Barriers is Over
            </h3>
            <p className="text-lg text-gray-700 mb-6">
              Software agents with coding ability don't make development easier—they make barriers invisible. 
              When agents give clinicians coding capability, every traditional limitation becomes breakable.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <Zap className="w-6 h-6 text-orange-500 mr-3" />
                <span className="text-gray-900 font-semibold">Innovation accelerates exponentially</span>
              </div>
              <div className="flex items-center">
                <Users className="w-6 h-6 text-blue-500 mr-3" />
                <span className="text-gray-900 font-semibold">Clinicians stay deeply engaged</span>
              </div>
              <div className="flex items-center">
                <Code className="w-6 h-6 text-green-500 mr-3" />
                <span className="text-gray-900 font-semibold">Feedback loops compress to minutes</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Barrier-Breaking Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Barrier-Breaking in Action
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {barrierExamples.map((example, index) => (
              <motion.div
                key={example.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center mb-6">
                  <example.icon className="w-6 h-6 text-white" />
                </div>
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold mb-2">
                    {example.barrier}
                  </span>
                  <ArrowRight className="inline-block mx-2 w-4 h-4 text-gray-400" />
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    {example.solution}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">{example.title}</h4>
                <p className="text-gray-700">{example.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Clinicians Coding Visual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-12 items-center mb-16"
        >
          <div className="order-2 lg:order-1">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              When Clinical Expertise Directly Becomes Software Reality
            </h3>
            <p className="text-lg text-gray-700 mb-6">
              The future of healthcare software isn't built by programmers for doctors—it's built by doctors with AI agents. 
              Every traditional barrier between medical insight and technical execution crumbles when software agents amplify human expertise with coding capability.
            </p>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
              <p className="text-lg font-semibold mb-2">
                "The question is no longer 'Can we build it?' but 'What should we build next?'"
              </p>
              <p className="text-sm opacity-90">
                - Mount Sinai West Agentic Laboratory
              </p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="rounded-2xl shadow-2xl bg-gradient-to-br from-green-100 to-blue-100 p-12 text-center">
              <div className="text-6xl mb-4">👩‍⚕️💻</div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Clinicians Coding</h4>
              <p className="text-gray-600">Healthcare professionals empowered with AI coding abilities</p>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-12 text-white"
        >
          <h3 className="text-3xl font-bold mb-4">
            Ready to Break Down Your Development Barriers?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Discover how Agentic Laboratory's AI coding agents can transform your clinical insights into software solutions—today.
          </p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-4 bg-white text-red-600 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            Break Down Barriers Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}