import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Terminal,
  CheckCircle2,
  Circle,
  Loader2,
  Users,
  Code2,
  TestTube2,
  Shield,
  HeartPulse,
} from 'lucide-react';

// ─── Agent Definitions ───────────────────────────────────────────────

type AgentId = 'orchestrator' | 'code' | 'test' | 'security' | 'fhir';

interface Agent {
  id: AgentId;
  name: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  label: string;
}

const AGENTS: Agent[] = [
  { id: 'orchestrator', name: 'Orchestrator', icon: Users, color: '#06ABEB', label: 'Ralph Loop' },
  { id: 'code', name: 'Code Agent', icon: Code2, color: '#10b981', label: 'Opus 4.6' },
  { id: 'test', name: 'Test Agent', icon: TestTube2, color: '#8b5cf6', label: 'Coverage' },
  { id: 'security', name: 'Security Agent', icon: Shield, color: '#f59e0b', label: 'HIPAA' },
  { id: 'fhir', name: 'FHIR Agent', icon: HeartPulse, color: '#DC298D', label: 'HL7/FHIR' },
];

// ─── Terminal Line Types ─────────────────────────────────────────────

type LineType = 'agent' | 'code' | 'output' | 'success' | 'info' | 'divider' | 'task';

interface TerminalLine {
  type: LineType;
  agent?: AgentId;
  text: string;
  indent?: number;
}

// ─── Task Definitions ────────────────────────────────────────────────

interface DemoTask {
  id: number;
  title: string;
  lines: TerminalLine[];
}

const DEMO_TASKS: DemoTask[] = [
  {
    id: 1,
    title: 'Planning Patient Intake API',
    lines: [
      { type: 'task', text: 'Task 1/5: Build FHIR-compliant Patient Intake API' },
      { type: 'divider', text: '' },
      { type: 'agent', agent: 'orchestrator', text: 'Analyzing requirements... patient intake form with FHIR R4 compliance' },
      { type: 'agent', agent: 'orchestrator', text: 'Decomposing into subtasks → assigning to agent team' },
      { type: 'info', text: '  Subtask 1: Schema + types  →  Code Agent' },
      { type: 'info', text: '  Subtask 2: FHIR mapping    →  FHIR Agent' },
      { type: 'info', text: '  Subtask 3: Validation      →  Security Agent' },
      { type: 'divider', text: '' },
      { type: 'agent', agent: 'code', text: 'Generating TypeScript interfaces...' },
      { type: 'code', text: 'export interface PatientIntake {', indent: 1 },
      { type: 'code', text: '  mrn: string;', indent: 1 },
      { type: 'code', text: '  demographics: Demographics;', indent: 1 },
      { type: 'code', text: '  insurance: InsuranceInfo;', indent: 1 },
      { type: 'code', text: '  consent: ConsentRecord;', indent: 1 },
      { type: 'code', text: '}', indent: 1 },
      { type: 'success', text: '✓ Created src/types/patient-intake.ts (6 interfaces)' },
    ],
  },
  {
    id: 2,
    title: 'Building FHIR Resources',
    lines: [
      { type: 'agent', agent: 'fhir', text: 'Mapping to FHIR R4 Patient resource...' },
      { type: 'code', text: 'function toFHIRPatient(intake: PatientIntake): fhir4.Patient {', indent: 1 },
      { type: 'code', text: '  return {', indent: 1 },
      { type: 'code', text: '    resourceType: "Patient",', indent: 1 },
      { type: 'code', text: '    identifier: [{ system: "urn:oid:msw", value: intake.mrn }],', indent: 1 },
      { type: 'code', text: '    name: [{ family: intake.demographics.lastName,', indent: 1 },
      { type: 'code', text: '             given: [intake.demographics.firstName] }],', indent: 1 },
      { type: 'code', text: '  };', indent: 1 },
      { type: 'code', text: '}', indent: 1 },
      { type: 'success', text: '✓ FHIR R4 Patient mapping validated against HL7 spec' },
      { type: 'agent', agent: 'fhir', text: 'Generating Coverage resource for insurance...' },
      { type: 'success', text: '✓ Created src/fhir/patient-mapper.ts (3 resource mappers)' },
    ],
  },
  {
    id: 3,
    title: 'Security & HIPAA Validation',
    lines: [
      { type: 'agent', agent: 'security', text: 'Running HIPAA compliance scan on patient-intake module...' },
      { type: 'output', text: '  Scanning for PHI exposure...                    PASS' },
      { type: 'output', text: '  Checking encryption at rest (AES-256)...         PASS' },
      { type: 'output', text: '  Validating audit logging...                      PASS' },
      { type: 'output', text: '  Checking access control (RBAC)...                PASS' },
      { type: 'output', text: '  Verifying data minimization...                   WARN' },
      { type: 'agent', agent: 'security', text: 'Warning: SSN field should use masked display. Patching...' },
      { type: 'code', text: 'const maskSSN = (ssn: string) => `***-**-${ssn.slice(-4)}`;', indent: 1 },
      { type: 'success', text: '✓ HIPAA compliance: 18/18 controls satisfied' },
      { type: 'success', text: '✓ Security scan complete — 0 critical, 0 high, 1 resolved' },
    ],
  },
  {
    id: 4,
    title: 'Writing & Running Tests',
    lines: [
      { type: 'agent', agent: 'test', text: 'Generating test suite for patient-intake module...' },
      { type: 'code', text: 'describe("PatientIntake API", () => {', indent: 1 },
      { type: 'code', text: '  it("creates FHIR Patient from intake form", async () => {', indent: 1 },
      { type: 'code', text: '    const result = await createPatient(mockIntake);', indent: 1 },
      { type: 'code', text: '    expect(result.resourceType).toBe("Patient");', indent: 1 },
      { type: 'code', text: '  });', indent: 1 },
      { type: 'code', text: '});', indent: 1 },
      { type: 'agent', agent: 'test', text: 'Running test suite...' },
      { type: 'output', text: '  PASS  src/__tests__/patient-intake.test.ts' },
      { type: 'output', text: '  PASS  src/__tests__/fhir-mapper.test.ts' },
      { type: 'output', text: '  PASS  src/__tests__/hipaa-validation.test.ts' },
      { type: 'info', text: '  Tests:  14 passed, 0 failed  |  Coverage: 94.2%' },
      { type: 'success', text: '✓ All tests passing — coverage threshold met' },
    ],
  },
  {
    id: 5,
    title: 'Final Integration & Delivery',
    lines: [
      { type: 'agent', agent: 'orchestrator', text: 'All subtasks complete. Running integration checks...' },
      { type: 'output', text: '  TypeScript compilation...                        PASS' },
      { type: 'output', text: '  FHIR validation suite...                         PASS' },
      { type: 'output', text: '  HIPAA compliance gate...                         PASS' },
      { type: 'output', text: '  Test coverage (94.2% > 90% threshold)...         PASS' },
      { type: 'output', text: '  Bundle size delta (+12.3kB gzipped)...           PASS' },
      { type: 'divider', text: '' },
      { type: 'agent', agent: 'orchestrator', text: 'Preparing pull request for human review...' },
      { type: 'info', text: '  PR #247: "feat: FHIR-compliant patient intake API"' },
      { type: 'info', text: '  Files changed: 12  |  +847 / -23 lines' },
      { type: 'info', text: '  Reviewers: @dr-chen, @clinical-informatics' },
      { type: 'divider', text: '' },
      { type: 'success', text: '✓ Task complete — awaiting HITL clinical review gate' },
    ],
  },
];

// ─── Component ───────────────────────────────────────────────────────

const LINE_INTERVAL = 90; // ms between each line appearing
const TASK_PAUSE = 800; // ms pause between tasks

export function AgentTeamsDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTaskIdx, setCurrentTaskIdx] = useState(0);
  const [visibleLines, setVisibleLines] = useState<TerminalLine[]>([]);
  const [lineIndex, setLineIndex] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
  const [activeAgent, setActiveAgent] = useState<AgentId | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // All lines flattened for total progress
  const allLines = DEMO_TASKS.flatMap((t) => t.lines);
  const totalLines = allLines.length;

  // Lines shown up to current position across all tasks
  const getLinesUpToTask = useCallback(
    (taskIdx: number, lineIdx: number) => {
      const lines: TerminalLine[] = [];
      for (let t = 0; t < taskIdx; t++) {
        lines.push(...DEMO_TASKS[t].lines);
      }
      lines.push(...DEMO_TASKS[taskIdx].lines.slice(0, lineIdx));
      return lines;
    },
    []
  );

  // Count total lines shown
  const totalVisibleCount = visibleLines.length;
  const progressPct = Math.round((totalVisibleCount / totalLines) * 100);

  // Auto-scroll terminal
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleLines]);

  // Main playback loop
  useEffect(() => {
    if (!isPlaying) return;

    const currentTask = DEMO_TASKS[currentTaskIdx];
    if (!currentTask) {
      setIsPlaying(false);
      return;
    }

    if (lineIndex >= currentTask.lines.length) {
      // Task complete — pause then advance
      setCompletedTasks((prev) => new Set(prev).add(currentTaskIdx));
      if (currentTaskIdx >= DEMO_TASKS.length - 1) {
        setIsPlaying(false);
        return;
      }
      timerRef.current = setTimeout(() => {
        setCurrentTaskIdx((prev) => prev + 1);
        setLineIndex(0);
      }, TASK_PAUSE);
      return;
    }

    const nextLine = currentTask.lines[lineIndex];
    if (nextLine.agent) {
      setActiveAgent(nextLine.agent);
    }

    timerRef.current = setTimeout(() => {
      setVisibleLines(getLinesUpToTask(currentTaskIdx, lineIndex + 1));
      setLineIndex((prev) => prev + 1);
    }, nextLine.type === 'code' ? LINE_INTERVAL * 0.7 : LINE_INTERVAL);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentTaskIdx, lineIndex, getLinesUpToTask]);

  const handlePlayPause = () => setIsPlaying((p) => !p);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTaskIdx(0);
    setLineIndex(0);
    setVisibleLines([]);
    setCompletedTasks(new Set());
    setActiveAgent(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // Jump to a specific task
  const handleTaskClick = (taskIdx: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
    setCurrentTaskIdx(taskIdx);
    setLineIndex(DEMO_TASKS[taskIdx].lines.length);
    const lines = getLinesUpToTask(taskIdx, DEMO_TASKS[taskIdx].lines.length);
    setVisibleLines(lines);
    const done = new Set<number>();
    for (let i = 0; i <= taskIdx; i++) done.add(i);
    setCompletedTasks(done);
  };

  return (
    <section id="agent-demo" className="py-20 bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-sinai-blue-500/10 border border-sinai-blue-500/20 rounded-full text-sinai-blue-400 text-sm font-semibold">
            <Terminal className="w-4 h-4" />
            Live Demo
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Agent Teams in Action
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
            Watch how Opus 4.6 agent teams autonomously plan, code, test, and secure a
            FHIR-compliant healthcare feature — with human-in-the-loop review gates.
          </p>

          {/* Controls */}
          <div className="flex justify-center items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlayPause}
              className="flex items-center gap-2 px-6 py-3 bg-sinai-blue-600 text-white rounded-lg font-medium hover:bg-sinai-blue-700 transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>{totalVisibleCount > 0 ? 'Resume' : 'Play Demo'}</span>
                </>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg font-medium hover:border-sinai-blue-500 hover:text-sinai-blue-400 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reset</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Main Layout: Agent sidebar + Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid lg:grid-cols-[260px_1fr] gap-6"
        >
          {/* Left Sidebar — Agent Team & Tasks */}
          <div className="space-y-6">
            {/* Agent Roster */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Agent Team
              </h3>
              <div className="space-y-2">
                {AGENTS.map((agent) => {
                  const Icon = agent.icon;
                  const isActive = activeAgent === agent.id;
                  return (
                    <div
                      key={agent.id}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-gray-700/80'
                          : 'bg-gray-800/30'
                      }`}
                      style={isActive ? { boxShadow: `0 0 0 1px ${agent.color}` } : undefined}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${agent.color}20` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: agent.color }} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-white truncate">
                          {agent.name}
                        </div>
                        <div className="text-xs text-gray-500">{agent.label}</div>
                      </div>
                      {isActive && (
                        <motion.div
                          layoutId="active-indicator"
                          className="ml-auto w-2 h-2 rounded-full"
                          style={{ backgroundColor: agent.color }}
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Task List */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Tasks
              </h3>
              <div className="space-y-1.5">
                {DEMO_TASKS.map((task, idx) => {
                  const isDone = completedTasks.has(idx);
                  const isCurrent = currentTaskIdx === idx && !isDone;
                  return (
                    <button
                      key={task.id}
                      onClick={() => handleTaskClick(idx)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors text-sm ${
                        isCurrent
                          ? 'bg-sinai-blue-600/20 text-sinai-blue-400'
                          : isDone
                          ? 'text-green-400/80 hover:bg-gray-700/30'
                          : 'text-gray-500 hover:bg-gray-700/30 hover:text-gray-400'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-green-500" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 flex-shrink-0 text-sinai-blue-400 animate-spin" />
                      ) : (
                        <Circle className="w-4 h-4 flex-shrink-0" />
                      )}
                      <span className="truncate">{task.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Progress Bar */}
              <div className="mt-4 pt-3 border-t border-gray-700/50">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                  <span>Progress</span>
                  <span>{progressPct}%</span>
                </div>
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-sinai-blue-500 to-green-500 rounded-full"
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Terminal Window */}
          <div className="bg-gray-950 border border-gray-700/50 rounded-xl overflow-hidden shadow-2xl">
            {/* Title Bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/80 border-b border-gray-700/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs text-gray-500 font-mono">
                  claude-agent-teams — patient-intake-api
                </span>
              </div>
              <div className="text-xs text-gray-600 font-mono">
                opus 4.6
              </div>
            </div>

            {/* Terminal Content */}
            <div
              ref={scrollRef}
              className="h-[420px] overflow-y-auto p-4 font-mono text-sm leading-relaxed custom-terminal-scroll"
            >
              {visibleLines.length === 0 && !isPlaying && (
                <div className="flex items-center justify-center h-full text-gray-600">
                  <div className="text-center">
                    <Terminal className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Press Play to start the agent teams demo</p>
                  </div>
                </div>
              )}

              <AnimatePresence>
                {visibleLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <TerminalLineComponent line={line} />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Blinking cursor */}
              {isPlaying && (
                <motion.span
                  className="inline-block w-2 h-4 bg-sinai-blue-400 ml-1"
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                />
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Agents Working', value: '5', sub: 'parallel' },
            { label: 'Code Generated', value: '847', sub: 'lines' },
            { label: 'Test Coverage', value: '94.2%', sub: 'automated' },
            { label: 'HIPAA Controls', value: '18/18', sub: 'satisfied' },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-gray-800/30 border border-gray-700/30 rounded-xl p-4 text-center"
            >
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
              <div className="text-xs text-gray-600">{stat.sub}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Terminal Line Renderer ──────────────────────────────────────────

function TerminalLineComponent({ line }: { line: TerminalLine }) {
  const agent = line.agent ? AGENTS.find((a) => a.id === line.agent) : null;

  switch (line.type) {
    case 'divider':
      return <div className="h-2" />;

    case 'task':
      return (
        <div className="py-1.5 mb-1 text-sinai-blue-400 font-semibold border-b border-gray-800">
          {line.text}
        </div>
      );

    case 'agent':
      return (
        <div className="py-0.5 flex items-start gap-2">
          <span
            className="font-semibold whitespace-nowrap"
            style={{ color: agent?.color ?? '#9ca3af' }}
          >
            [{agent?.name ?? 'Agent'}]
          </span>
          <span className="text-gray-300">{line.text}</span>
        </div>
      );

    case 'code':
      return (
        <div className="py-0.5 text-green-400/90" style={{ paddingLeft: `${(line.indent ?? 0) * 16 + 24}px` }}>
          {line.text}
        </div>
      );

    case 'output':
      return (
        <div className="py-0.5 text-gray-400">
          {line.text}
        </div>
      );

    case 'success':
      return (
        <div className="py-0.5 text-green-400 font-medium">
          {line.text}
        </div>
      );

    case 'info':
      return (
        <div className="py-0.5 text-gray-500">
          {line.text}
        </div>
      );

    default:
      return <div className="py-0.5 text-gray-400">{line.text}</div>;
  }
}
