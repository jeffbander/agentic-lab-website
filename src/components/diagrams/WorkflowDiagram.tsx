import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Clock, CheckCircle, Code, User, Package, Wrench } from 'lucide-react';
import { workflowPhases, workflowStats } from '../../data/workflow-phases';
import type { WorkflowPhase } from '../../data/workflow-phases';

export function WorkflowDiagram() {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set([1]));

  const togglePhase = (phaseId: number) => {
    const newExpanded = new Set(expandedPhases);
    if (newExpanded.has(phaseId)) {
      newExpanded.delete(phaseId);
    } else {
      newExpanded.add(phaseId);
    }
    setExpandedPhases(newExpanded);
  };

  const selectPhase = (phaseId: number) => {
    setSelectedPhase(phaseId === selectedPhase ? null : phaseId);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            The Agentic Development Workflow
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            How AI and human expertise collaborate to build production-ready healthcare applications in weeks, not months
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-sinai-blue-600">{workflowStats.totalPhases}</div>
              <div className="text-sm text-gray-600">Phases</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sinai-blue-600">{workflowStats.avgDevelopmentTime}</div>
              <div className="text-sm text-gray-600">Dev Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{workflowStats.aiCodeGeneration}</div>
              <div className="text-sm text-gray-600">AI Code Gen</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{workflowStats.timeReduction}</div>
              <div className="text-sm text-gray-600">Time Saved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sinai-maroon-600">{workflowStats.costSavings}</div>
              <div className="text-sm text-gray-600">Cost Savings</div>
            </div>
          </div>
        </motion.div>

        {/* Workflow Timeline */}
        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-sinai-blue-500 via-purple-500 to-sinai-maroon-500 hidden md:block" />

          {/* Phases */}
          <div className="space-y-8">
            {workflowPhases.map((phase, index) => (
              <PhaseCard
                key={phase.id}
                phase={phase}
                index={index}
                isExpanded={expandedPhases.has(phase.id)}
                isSelected={selectedPhase === phase.id}
                onToggle={() => togglePhase(phase.id)}
                onSelect={() => selectPhase(phase.id)}
              />
            ))}
          </div>
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-600"
        >
          <div className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-sinai-blue-600" />
            <span>AI Tasks</span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-purple-600" />
            <span>Human Tasks</span>
          </div>
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-green-600" />
            <span>Deliverables</span>
          </div>
          <div className="flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-orange-600" />
            <span>Tools</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface PhaseCardProps {
  phase: WorkflowPhase;
  index: number;
  isExpanded: boolean;
  isSelected: boolean;
  onToggle: () => void;
  onSelect: () => void;
}

function PhaseCard({ phase, index, isExpanded, isSelected, onToggle, onSelect }: PhaseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      {/* Timeline Node */}
      <div className="absolute left-8 top-6 w-1 h-full bg-gray-200 -z-10 hidden md:block" />
      <motion.div
        className="absolute left-5 top-6 w-7 h-7 rounded-full border-4 border-white shadow-lg hidden md:block"
        style={{ backgroundColor: phase.color }}
        whileHover={{ scale: 1.2 }}
        onClick={onSelect}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-xs font-bold">{phase.id}</span>
        </div>
      </motion.div>

      {/* Card */}
      <motion.div
        className={`md:ml-20 rounded-2xl shadow-lg transition-all duration-300 cursor-pointer ${
          isSelected
            ? 'ring-4 ring-opacity-50 shadow-2xl'
            : 'hover:shadow-xl'
        }`}
        style={{
          backgroundColor: 'white',
          ringColor: isSelected ? phase.color : 'transparent'
        }}
        onClick={onSelect}
      >
        {/* Header */}
        <div
          className="p-6 rounded-t-2xl"
          style={{
            background: `linear-gradient(135deg, ${phase.color}15 0%, ${phase.color}05 100%)`
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: phase.color }}
                >
                  Phase {phase.id}
                </span>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  {phase.duration}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{phase.title}</h3>
              <p className="text-gray-600">{phase.description}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="ml-4 p-2 rounded-lg hover:bg-white/50 transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-6 h-6 text-gray-600" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-6 space-y-6">
                {/* AI Tasks */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Code className="w-5 h-5 text-sinai-blue-600" />
                    <h4 className="font-semibold text-gray-900">AI Tasks</h4>
                  </div>
                  <ul className="space-y-2">
                    {phase.aiTasks.map((task, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start space-x-2 text-sm text-gray-700"
                      >
                        <CheckCircle className="w-4 h-4 text-sinai-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{task}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Human Tasks */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <User className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">Human Tasks</h4>
                  </div>
                  <ul className="space-y-2">
                    {phase.humanTasks.map((task, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start space-x-2 text-sm text-gray-700"
                      >
                        <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>{task}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Deliverables */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Package className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-gray-900">Deliverables</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {phase.deliverables.map((deliverable, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium"
                      >
                        {deliverable}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Tools */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Wrench className="w-5 h-5 text-orange-600" />
                    <h4 className="font-semibold text-gray-900">Tools & Technologies</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {phase.tools.map((tool, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium"
                      >
                        {tool}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
