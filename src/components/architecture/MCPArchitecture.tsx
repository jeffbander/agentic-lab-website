import { useCallback, useMemo } from 'react';
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
import { motion } from 'framer-motion';
import { Server, Brain, Database, Lock, Activity } from 'lucide-react';

const initialNodes: Node[] = [
  {
    id: 'ai-agent',
    type: 'custom',
    position: { x: 100, y: 200 },
    data: {
      label: 'AI Agent',
      subtitle: 'Claude Code',
      icon: Brain,
      color: '#3b82f6',
      description: 'Intelligent code generation and analysis'
    },
  },
  {
    id: 'mcp-server',
    type: 'custom',
    position: { x: 400, y: 200 },
    data: {
      label: 'MCP Server',
      subtitle: 'FHIR Bridge',
      icon: Server,
      color: '#8b5cf6',
      description: 'Standardized healthcare data access'
    },
  },
  {
    id: 'ehr-system',
    type: 'custom',
    position: { x: 700, y: 200 },
    data: {
      label: 'EHR System',
      subtitle: 'Epic/Cerner',
      icon: Database,
      color: '#10b981',
      description: 'Patient health records'
    },
  },
  {
    id: 'security',
    type: 'custom',
    position: { x: 400, y: 50 },
    data: {
      label: 'Security Layer',
      subtitle: 'HIPAA Compliance',
      icon: Lock,
      color: '#991b1b',
      description: 'Encryption & access control'
    },
  },
  {
    id: 'monitoring',
    type: 'custom',
    position: { x: 400, y: 350 },
    data: {
      label: 'Monitoring',
      subtitle: 'Real-time Analytics',
      icon: Activity,
      color: '#f59e0b',
      description: 'Performance & audit logging'
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'ai-to-mcp',
    source: 'ai-agent',
    target: 'mcp-server',
    animated: true,
    label: 'API Request',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#3b82f6', strokeWidth: 2 },
  },
  {
    id: 'mcp-to-ehr',
    source: 'mcp-server',
    target: 'ehr-system',
    animated: true,
    label: 'FHIR Query',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#8b5cf6', strokeWidth: 2 },
  },
  {
    id: 'ehr-to-mcp',
    source: 'ehr-system',
    target: 'mcp-server',
    animated: true,
    label: 'Patient Data',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#10b981', strokeWidth: 2 },
  },
  {
    id: 'mcp-to-ai',
    source: 'mcp-server',
    target: 'ai-agent',
    animated: true,
    label: 'Structured Data',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#8b5cf6', strokeWidth: 2 },
  },
  {
    id: 'security-to-mcp',
    source: 'security',
    target: 'mcp-server',
    animated: false,
    label: 'Encrypt/Decrypt',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#991b1b', strokeWidth: 2, strokeDasharray: '5,5' },
  },
  {
    id: 'mcp-to-monitoring',
    source: 'mcp-server',
    target: 'monitoring',
    animated: false,
    label: 'Audit Log',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '5,5' },
  },
];

export function MCPArchitecture() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  const onInit = useCallback(() => {
    console.log('MCP Architecture diagram initialized');
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
            MCP Architecture
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Model Context Protocol (MCP) enables secure, standardized communication between AI agents and healthcare systems
          </p>
        </motion.div>

        {/* Flow Diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          style={{ height: '600px' }}
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

        {/* Key Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-sinai-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">HIPAA Compliant</h3>
            <p className="text-gray-600 text-sm">
              End-to-end encryption and access controls ensure patient data privacy
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Server className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">FHIR Standard</h3>
            <p className="text-gray-600 text-sm">
              Uses HL7 FHIR for interoperability across healthcare systems
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Monitoring</h3>
            <p className="text-gray-600 text-sm">
              Comprehensive audit logging and performance tracking
            </p>
          </div>
        </motion.div>

        {/* Code Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-gray-900 rounded-2xl shadow-xl p-8 overflow-x-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Example MCP Query</h3>
            <span className="text-xs text-gray-400">TypeScript</span>
          </div>
          <pre className="text-sm text-gray-300 overflow-x-auto">
            <code>{`// AI Agent queries patient data via MCP
const patient = await mcpClient.request({
  resource: 'Patient',
  operation: 'read',
  id: 'patient-123',
  params: {
    include: ['medications', 'conditions', 'vitals']
  }
});

// MCP translates to FHIR and returns structured data
const riskScore = await aiAgent.analyze({
  demographics: patient.demographics,
  medications: patient.medications,
  recentVitals: patient.vitals.filter(v =>
    v.date > Date.now() - 30 * 24 * 60 * 60 * 1000
  )
});`}</code>
          </pre>
        </motion.div>
      </div>
    </section>
  );
}

function CustomNode({ data }: { data: any }) {
  const Icon = data.icon;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className="px-6 py-4 rounded-xl shadow-lg border-2 bg-white min-w-[200px]"
      style={{ borderColor: data.color }}
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />

      <div className="flex items-center space-x-3 mb-2">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${data.color}20` }}
        >
          <Icon className="w-6 h-6" style={{ color: data.color }} />
        </div>
        <div>
          <div className="font-bold text-gray-900">{data.label}</div>
          <div className="text-xs text-gray-600">{data.subtitle}</div>
        </div>
      </div>
      <div className="text-xs text-gray-600 mt-2">{data.description}</div>
    </motion.div>
  );
}
