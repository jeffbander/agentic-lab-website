import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, DollarSign, Clock, Users, CheckCircle } from 'lucide-react';
import { trackROICalculation, trackCTAClick } from '../../utils/analytics';

type ProjectSize = 'small' | 'medium' | 'large' | 'enterprise';

const projectSizeData: Record<
  ProjectSize,
  {
    label: string;
    traditionalWeeks: number;
    traditionalTeamSize: number;
    avgHourlyRate: number;
    enterpriseSoftwareCost: number;
  }
> = {
  small: {
    label: 'Small Project (PTO App)',
    traditionalWeeks: 12,
    traditionalTeamSize: 3,
    avgHourlyRate: 100,
    enterpriseSoftwareCost: 10000,
  },
  medium: {
    label: 'Medium Project (Voice Agent)',
    traditionalWeeks: 20,
    traditionalTeamSize: 5,
    avgHourlyRate: 100,
    enterpriseSoftwareCost: 50000,
  },
  large: {
    label: 'Large Project (IRBVer2)',
    traditionalWeeks: 24,
    traditionalTeamSize: 8,
    avgHourlyRate: 100,
    enterpriseSoftwareCost: 150000,
  },
  enterprise: {
    label: 'Enterprise Project',
    traditionalWeeks: 52,
    traditionalTeamSize: 12,
    avgHourlyRate: 125,
    enterpriseSoftwareCost: 200000,
  },
};

export function ROICalculator() {
  const [projectSize, setProjectSize] = useState<ProjectSize>('medium');
  const [aiEfficiency, setAiEfficiency] = useState(70); // percentage

  const data = projectSizeData[projectSize];
  const traditionalCost =
    data.traditionalWeeks * data.traditionalTeamSize * 40 * data.avgHourlyRate +
    data.enterpriseSoftwareCost;
  const agenticWeeks = data.traditionalWeeks * ((100 - aiEfficiency) / 100);
  const agenticTeamSize = 1; // Single developer + AI
  const agenticCost = agenticWeeks * agenticTeamSize * 40 * data.avgHourlyRate;
  const totalSavings = traditionalCost - agenticCost;
  const timeSaved = data.traditionalWeeks - agenticWeeks;
  const percentSavings = ((totalSavings / traditionalCost) * 100).toFixed(1);
  const roi = ((totalSavings / agenticCost) * 100).toFixed(0);

  // Track ROI calculations
  useEffect(() => {
    trackROICalculation(projectSize, aiEfficiency, totalSavings);
  }, [projectSize, aiEfficiency, totalSavings]);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Calculator className="w-10 h-10 text-sinai-blue-600" />
            <h2 className="text-4xl font-bold text-gray-900">ROI Calculator</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate potential savings from agentic development for your healthcare project
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Project Parameters</h3>

            {/* Project Size Selector */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Project Size
              </label>
              <div className="space-y-3">
                {(Object.keys(projectSizeData) as ProjectSize[]).map((size) => (
                  <motion.button
                    key={size}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setProjectSize(size)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      projectSize === size
                        ? 'border-sinai-blue-600 bg-sinai-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        {projectSizeData[size].label}
                      </span>
                      {projectSize === size && (
                        <CheckCircle className="w-5 h-5 text-sinai-blue-600" />
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Traditional: {projectSizeData[size].traditionalWeeks} weeks,{' '}
                      {projectSizeData[size].traditionalTeamSize} developers
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* AI Efficiency Slider */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-gray-700">
                  AI Efficiency
                </label>
                <span className="text-2xl font-bold text-sinai-blue-600">{aiEfficiency}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                value={aiEfficiency}
                onChange={(e) => setAiEfficiency(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sinai-blue-600"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${aiEfficiency}%, #e5e7eb ${aiEfficiency}%, #e5e7eb 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>50%</span>
                <span>90%</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Based on real projects: IRBVer2 achieved 83.8% AI code generation
              </p>
            </div>

            {/* Assumptions */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Assumptions</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="text-sinai-blue-600 mt-0.5">•</span>
                  <span>Traditional: {data.traditionalTeamSize} developers @ ${data.avgHourlyRate}/hr</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-sinai-blue-600 mt-0.5">•</span>
                  <span>Agentic: 1 developer + AI @ ${data.avgHourlyRate}/hr</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-sinai-blue-600 mt-0.5">•</span>
                  <span>Enterprise software cost: ${data.enterpriseSoftwareCost.toLocaleString()}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-sinai-blue-600 mt-0.5">•</span>
                  <span>40-hour work weeks</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Summary Card */}
            <div className="bg-gradient-to-br from-sinai-blue-600 to-sinai-maroon-600 rounded-2xl shadow-xl p-8 text-white">
              <div className="flex items-center space-x-3 mb-6">
                <TrendingUp className="w-8 h-8" />
                <h3 className="text-2xl font-bold">Total Savings</h3>
              </div>
              <div className="text-5xl font-bold mb-2">
                ${totalSavings.toLocaleString()}
              </div>
              <div className="text-xl opacity-90">{percentSavings}% cost reduction</div>
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="text-lg font-semibold mb-2">Return on Investment</div>
                <div className="text-3xl font-bold">{roi}%</div>
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-sinai-blue-600" />
                  </div>
                  <div className="text-sm font-semibold text-gray-700">Time Saved</div>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {timeSaved.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">weeks faster</div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-sm font-semibold text-gray-700">Team Size</div>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {data.traditionalTeamSize}→1
                </div>
                <div className="text-sm text-gray-600">developers</div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-sm font-semibold text-gray-700">Labor Cost</div>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  ${(traditionalCost - data.enterpriseSoftwareCost).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">vs ${agenticCost.toLocaleString()}</div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-sm font-semibold text-gray-700">Development</div>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {agenticWeeks.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">weeks total</div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Cost Breakdown</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Traditional Development</span>
                  <span className="font-semibold text-gray-900">
                    ${(traditionalCost - data.enterpriseSoftwareCost).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Enterprise Software</span>
                  <span className="font-semibold text-gray-900">
                    ${data.enterpriseSoftwareCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm font-semibold text-gray-700">Traditional Total</span>
                  <span className="font-bold text-gray-900">
                    ${traditionalCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Agentic Development</span>
                  <span className="font-semibold text-gray-900">
                    ${agenticCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-bold text-green-600">Total Savings</span>
                  <span className="font-bold text-green-600 text-xl">
                    ${totalSavings.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-lg font-semibold text-gray-900 mb-2">
            Save ${totalSavings.toLocaleString()} on Your Next Healthcare Project
          </p>
          <p className="text-gray-600 mb-6">
            Get a custom implementation plan and cost analysis for your organization
          </p>
          <motion.a
            href="#contact"
            onClick={() => trackCTAClick('ROI Calculator', 'Get Your Custom ROI Analysis')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-sinai-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-sinai-blue-700 transition-colors shadow-lg"
          >
            Get Your Custom ROI Analysis →
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
