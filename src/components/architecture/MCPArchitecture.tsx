import { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
} from 'reactflow';
import type { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Brain, Database, Lock, Activity, Layers, Zap, Shield, GitBranch, Code2, RefreshCw } from 'lucide-react';

const initialNodes: Node[] = [
  {
    id: 'skills',
    type: 'custom',
    position: { x: 50, y: 50 },
    data: {
      label: 'Agent Skills',
      subtitle: 'FHIR, Clinical, PDF',
      icon: Layers,
      color: '#8b5cf6',
      description: 'Reusable capabilities loaded on-demand'
    },
  },
  {
    id: 'ralph',
    type: 'custom',
    position: { x: 300, y: 50 },
    data: {
      label: 'Ralph Loop',
      subtitle: 'Autonomous Dev',
      icon: RefreshCw,
      color: '#06b6d4',
      description: 'Iterative development with exit detection'
    },
  },
  {
    id: 'hooks',
    type: 'custom',
    position: { x: 550, y: 50 },
    data: {
      label: 'Lifecycle Hooks',
      subtitle: '8 Control Points',
      icon: Zap,
      color: '#f59e0b',
      description: 'Deterministic control over AI behavior'
    },
  },
  {
    id: 'harness',
    type: 'custom',
    position: { x: 300, y: 200 },
    data: {
      label: 'AI Harness',
      subtitle: 'Claude Code',
      icon: Brain,
      color: '#3b82f6',
      description: 'Tool mgmt, context, safety rails'
    },
  },
  {
    id: 'mcp',
    type: 'custom',
    position: { x: 100, y: 350 },
    data: {
      label: 'MCP Server',
      subtitle: 'FHIR Bridge',
      icon: Server,
      color: '#10b981',
      description: 'Standardized healthcare data access'
    },
  },
  {
    id: 'ehr',
    type: 'custom',
    position: { x: 500, y: 350 },
    data: {
      label: 'EHR System',
      subtitle: 'Epic/Cerner',
      icon: Database,
      color: '#6366f1',
      description: 'Patient health records'
    },
  },
  {
    id: 'security',
    type: 'custom',
    position: { x: 300, y: 500 },
    data: {
      label: 'Security Layer',
      subtitle: 'HIPAA + Zero Trust',
      icon: Shield,
      color: '#dc2626',
      description: 'Audit logs, encryption, access control'
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'skills-to-harness',
    source: 'skills',
    target: 'harness',
    animated: true,
    label: 'Load on demand',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#8b5cf6', strokeWidth: 2 },
  },
  {
    id: 'ralph-to-harness',
    source: 'ralph',
    target: 'harness',
    animated: true,
    label: 'Orchestrate',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#06b6d4', strokeWidth: 2 },
  },
  {
    id: 'hooks-to-harness',
    source: 'hooks',
    target: 'harness',
    animated: true,
    label: 'Intercept',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#f59e0b', strokeWidth: 2 },
  },
  {
    id: 'harness-to-mcp',
    source: 'harness',
    target: 'mcp',
    animated: true,
    label: 'API Request',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#3b82f6', strokeWidth: 2 },
  },
  {
    id: 'mcp-to-ehr',
    source: 'mcp',
    target: 'ehr',
    animated: true,
    label: 'FHIR Query',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#10b981', strokeWidth: 2 },
  },
  {
    id: 'ehr-to-mcp',
    source: 'ehr',
    target: 'mcp',
    animated: true,
    label: 'Patient Data',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#6366f1', strokeWidth: 2 },
  },
  {
    id: 'mcp-to-harness',
    source: 'mcp',
    target: 'harness',
    animated: true,
    label: 'Structured Data',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#10b981', strokeWidth: 2 },
  },
  {
    id: 'security-to-mcp',
    source: 'security',
    target: 'mcp',
    animated: false,
    label: 'Encrypt',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#dc2626', strokeWidth: 2, strokeDasharray: '5,5' },
  },
  {
    id: 'security-to-harness',
    source: 'security',
    target: 'harness',
    animated: false,
    label: 'Audit',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#dc2626', strokeWidth: 2, strokeDasharray: '5,5' },
  },
];

type TabType = 'skills' | 'harness' | 'hooks' | 'ralph';

const tabContent: Record<TabType, { title: string; code: string }> = {
  skills: {
    title: 'SKILL.md Example',
    code: `---
name: fhir-patient-query
description: Query FHIR patient resources
tools: [read_file, execute_command]
---

# FHIR Patient Query Skill

## When to Use
- Query patient demographics
- Validate LOINC/ICD-10 codes
- Generate FHIR-compliant resources

## Workflow
1. Authenticate via SMART on FHIR
2. Construct validated query
3. Return with audit logging`,
  },
  harness: {
    title: 'Healthcare Harness Config',
    code: `interface HealthcareHarness {
  // Security
  phiAccessControl: RBACConfig;
  auditLogger: HIPAACompliantLogger;

  // Safety Rails
  codeReviewRequired: boolean;
  maxAutonomousChanges: number;
  bannedOperations: ['DELETE FROM'];

  // Compliance
  baaSigned: boolean;
  dataResidency: 'hipaa-region';
}`,
  },
  hooks: {
    title: 'Lifecycle Hooks Config',
    code: `// .claude/settings.json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "command": "./validate-no-phi.sh"
    }],
    "PostToolUse": [{
      "matcher": "*",
      "command": "./hipaa-audit-log.sh"
    }],
    "Stop": [{
      "command": "./security-scan.sh"
    }]
  }
}`,
  },
  ralph: {
    title: 'Ralph Autonomous Loop',
    code: `# Install Ralph
git clone https://github.com/frankbria/ralph-claude-code
./install.sh

# Run autonomous development
ralph --spec prior-auth-prd.md \\
      --tests "HIPAA logging enabled" \\
      --exit-on "100% coverage"

# Exit conditions:
# MAX_CONSECUTIVE_TEST_LOOPS=3
# MAX_CONSECUTIVE_DONE_SIGNALS=2`,
  },
};

export function MCPArchitecture() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [activeTab, setActiveTab] = useState<TabType>('skills');

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  const onInit = useCallback(() => {
    console.log('Agentic Architecture diagram initialized');
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Agentic Coding Architecture
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The modern stack for building secure healthcare AI: Skills, Harness, Hooks, and MCP working together
          </p>
        </motion.div>

        {/* Flow Diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          style={{ height: '650px' }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onInit={onInit}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
          >
            <Background color="#e5e7eb" gap={16} />
            <Controls />
          </ReactFlow>
        </motion.div>

        {/* Key Components Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid md:grid-cols-4 gap-4"
        >
          <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-purple-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Layers className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Agent Skills</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Reusable capabilities for FHIR, PDFs, clinical protocols. Model-invoked and token-efficient.
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-blue-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">AI Harness</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Infrastructure wrapping Claude: tool management, context, safety rails, sub-agents.
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-cyan-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Ralph Loop</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Autonomous development with intelligent exit detection. $49K+ savings per project.
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-orange-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Lifecycle Hooks</h3>
            </div>
            <p className="text-gray-600 text-sm">
              8 control points for deterministic behavior: PreToolUse, PostToolUse, Stop, and more.
            </p>
          </div>
        </motion.div>

        {/* Code Examples with Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-gray-900 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700">
            {(['skills', 'harness', 'hooks', 'ralph'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-white bg-gray-800 border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                }`}
              >
                {tab === 'skills' && 'Skills'}
                {tab === 'harness' && 'Harness'}
                {tab === 'hooks' && 'Hooks'}
                {tab === 'ralph' && 'Ralph'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{tabContent[activeTab].title}</h3>
                  <span className="text-xs text-gray-400">
                    {activeTab === 'skills' ? 'Markdown' : activeTab === 'ralph' ? 'Bash' : 'TypeScript/JSON'}
                  </span>
                </div>
                <pre className="text-sm text-gray-300 overflow-x-auto">
                  <code>{tabContent[activeTab].code}</code>
                </pre>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Security & Compliance Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2026 Security Standards</h3>
              <p className="text-gray-600 text-sm mb-3">
                Following HSCC AI Cybersecurity Guidance, NIST AI RMF, and Zero Trust principles for healthcare AI.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">HIPAA</span>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Zero Trust</span>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">HSCC 2026</span>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">NIST AI RMF</span>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">ISO 42001</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface CustomNodeData {
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  description: string;
}

function CustomNode({ data }: { data: CustomNodeData }) {
  const Icon = data.icon;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className="px-4 py-3 rounded-xl shadow-lg border-2 bg-white min-w-[180px]"
      style={{ borderColor: data.color }}
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />

      <div className="flex items-center space-x-2 mb-1">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${data.color}20` }}
        >
          <Icon className="w-4 h-4" style={{ color: data.color }} />
        </div>
        <div>
          <div className="font-bold text-gray-900 text-sm">{data.label}</div>
          <div className="text-xs text-gray-500">{data.subtitle}</div>
        </div>
      </div>
      <div className="text-xs text-gray-600 mt-1">{data.description}</div>
    </motion.div>
  );
}
