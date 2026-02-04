import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Clock, Users, Activity } from 'lucide-react';

const developmentTimeData = [
  { project: 'IRBVer2', traditional: 24, agentic: 8 },
  { project: 'Voice Agent', traditional: 20, agentic: 6 },
  { project: 'HeartVoice', traditional: 26, agentic: 8 },
  { project: 'PTO App', traditional: 12, agentic: 4 },
  { project: 'LEQVIO', traditional: 16, agentic: 5 },
];

const costSavingsData = [
  { month: 'Month 1', savings: 15 },
  { month: 'Month 2', savings: 32 },
  { month: 'Month 3', savings: 58 },
  { month: 'Month 4', savings: 85 },
  { month: 'Month 5', savings: 112 },
  { month: 'Month 6', savings: 150 },
];

const taskDistribution = [
  { name: 'AI Generated', value: 83.8, color: '#3b82f6' },
  { name: 'Human Review', value: 16.2, color: '#8b5cf6' },
];

const clinicalMetrics = [
  {
    label: 'Time Saved',
    value: '60-80%',
    change: '+65%',
    trend: 'up',
    icon: Clock,
    color: '#3b82f6',
    description: 'Compared to traditional development',
  },
  {
    label: 'Cost Reduction',
    value: '$150k',
    change: '+$50k',
    trend: 'up',
    icon: DollarSign,
    color: '#10b981',
    description: 'Annual savings per project',
  },
  {
    label: 'Patients Impacted',
    value: '10,000+',
    change: '+2,500',
    trend: 'up',
    icon: Users,
    color: '#8b5cf6',
    description: 'Across all 5 projects',
  },
  {
    label: 'Hospital Admits',
    value: '30%',
    change: '-15%',
    trend: 'down',
    icon: Activity,
    color: '#991b1b',
    description: 'Reduction via early detection',
  },
];

export function ClinicalImpactDashboard() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Clinical Impact Dashboard</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-world outcomes from agentic development in healthcare
          </p>
        </motion.div>

        {/* Metric Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {clinicalMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${metric.color}20` }}
                >
                  <metric.icon className="w-6 h-6" style={{ color: metric.color }} />
                </div>
                <div
                  className={`flex items-center space-x-1 text-sm font-semibold ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{metric.change}</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
              <div className="text-sm text-gray-600 mb-2">{metric.label}</div>
              <div className="text-xs text-gray-500">{metric.description}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Development Time Comparison */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Development Time: Traditional vs Agentic
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={developmentTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="project" tick={{ fontSize: 12 }} />
                <YAxis label={{ value: 'Weeks', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="traditional" fill="#9ca3af" name="Traditional" radius={[8, 8, 0, 0]} />
                <Bar dataKey="agentic" fill="#3b82f6" name="Agentic" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-4 text-center">
              Average <span className="font-semibold text-sinai-blue-600">70% faster</span> with
              agentic development
            </p>
          </motion.div>

          {/* Cumulative Cost Savings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Cumulative Cost Savings</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={costSavingsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis label={{ value: 'Savings ($k)', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="savings"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-4 text-center">
              Projected <span className="font-semibold text-green-600">$150k annual savings</span>{' '}
              per project
            </p>
          </motion.div>

          {/* Task Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">AI vs Human Task Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-4 text-center">
              AI handles <span className="font-semibold text-sinai-blue-600">83.8% of coding tasks</span>,
              humans focus on review and strategy
            </p>
          </motion.div>

          {/* Key Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-sinai-blue-50 to-sinai-maroon-50 rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Key Insights</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">
                    Production Ready in Weeks
                  </div>
                  <div className="text-sm text-gray-600">
                    All 5 projects reached production in 4-8 weeks vs traditional 12-26 weeks
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Users className="w-5 h-5 text-sinai-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Single Developer Teams</div>
                  <div className="text-sm text-gray-600">
                    Each project built by 1 clinician + AI vs traditional 5-10 person teams
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Real Patient Impact</div>
                  <div className="text-sm text-gray-600">
                    10,000+ patients benefiting from faster innovation and improved care
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <DollarSign className="w-5 h-5 text-sinai-maroon-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Enterprise Cost Avoidance</div>
                  <div className="text-sm text-gray-600">
                    Replaced $50k-200k/year enterprise software with custom solutions
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
