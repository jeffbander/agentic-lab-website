export type WorkflowPhase = {
  id: number;
  title: string;
  description: string;
  duration: string;
  aiTasks: string[];
  humanTasks: string[];
  deliverables: string[];
  tools: string[];
  color: string;
  hasHITL?: boolean;
}

export const workflowPhases: WorkflowPhase[] = [
  {
    id: 1,
    title: 'Requirements & Planning',
    description: 'Agent Team analyzes clinical needs and generates technical specifications with plan feedback loop',
    duration: '2-3 days',
    aiTasks: [
      'Agent Team generates and validates technical architecture',
      'FHIR agent maps EHR integration points',
      'Security agent performs initial HIPAA compliance assessment',
      'Generate database schema proposals via Claude for Healthcare',
      'Generate test scenarios and acceptance criteria'
    ],
    humanTasks: [
      'Define clinical workflows and pain points',
      'Review AI-generated specs at HITL gate',
      'Approve architecture decisions',
      'Set compliance requirements and review gates'
    ],
    deliverables: [
      'Technical specification document',
      'Database schema',
      'API documentation',
      'Project timeline'
    ],
    tools: ['Claude Opus 4.6', 'Agent Teams', 'MCP OAuth', 'GitHub', 'Linear'],
    color: '#3b82f6',
    hasHITL: true
  },
  {
    id: 2,
    title: 'Development Setup',
    description: 'Agent Team scaffolds project structure with parallel agent execution',
    duration: '1 day',
    aiTasks: [
      'Code agent generates project boilerplate',
      'Test agent configures CI/CD pipelines',
      'Security agent sets up HIPAA compliance hooks',
      'FHIR agent configures MCP server connections',
      'Generate initial test suite'
    ],
    humanTasks: [
      'Review generated code at HITL checkpoint',
      'Configure cloud resources',
      'Set up monitoring',
      'Configure secrets management'
    ],
    deliverables: [
      'Working development environment',
      'CI/CD pipeline',
      'Docker containers',
      'Initial test suite'
    ],
    tools: ['Vite', 'Docker', 'GitHub Actions', 'Terraform', 'Ralph Loop'],
    color: '#10b981',
    hasHITL: true
  },
  {
    id: 3,
    title: 'Core Development',
    description: 'Agent Team generates and tests in parallel while clinician reviews and guides implementation',
    duration: '1-3 weeks',
    aiTasks: [
      'Agent Team generates and tests in parallel',
      'Code agent implements React components and API endpoints',
      'Test agent writes unit and integration tests concurrently',
      'Security agent performs HIPAA compliance scan',
      'FHIR agent validates EHR integrations',
      'Generate documentation via Claude for Healthcare'
    ],
    humanTasks: [
      'Review pull requests at mandatory HITL gates',
      'Test clinical workflows',
      'Provide feedback on UX',
      'Validate business logic and clinical accuracy'
    ],
    deliverables: [
      'Working application',
      'API endpoints',
      'Database with migrations',
      'Authentication system',
      'Test coverage >80%'
    ],
    tools: ['Claude Opus 4.6', 'Agent Teams', 'Ralph Loop', 'React', 'Next.js 15', 'Prisma', 'PostgreSQL'],
    color: '#8b5cf6',
    hasHITL: true
  },
  {
    id: 4,
    title: 'Integration & Testing',
    description: 'Agent Team runs comprehensive test suites with security and FHIR validation',
    duration: '1-2 weeks',
    aiTasks: [
      'Test agent generates integration and E2E tests',
      'Security agent performs penetration testing prep',
      'FHIR agent validates all EHR data flows',
      'Generate performance benchmarks',
      'Claude Analytics API monitors test metrics'
    ],
    humanTasks: [
      'Perform manual clinical workflow testing',
      'Validate FHIR resource conformance at HITL gate',
      'Security review and sign-off',
      'Performance validation'
    ],
    deliverables: [
      'Integration test suite',
      'E2E test coverage',
      'Performance benchmarks',
      'Security audit report',
      'HIPAA compliance checklist'
    ],
    tools: ['Playwright', 'Vitest', 'Lighthouse', 'OWASP ZAP', 'Claude Analytics API'],
    color: '#f59e0b',
    hasHITL: true
  },
  {
    id: 5,
    title: 'Deployment',
    description: 'Agent Team configures infrastructure with mandatory human approval gates',
    duration: '3-5 days',
    aiTasks: [
      'Code agent generates Terraform configs',
      'Security agent validates infrastructure security',
      'Create deployment scripts with rollback',
      'Configure monitoring and alerting',
      'Generate runbooks'
    ],
    humanTasks: [
      'Review infrastructure at mandatory HITL gate',
      'Validate security configurations',
      'Approve production deployment',
      'Monitor initial rollout'
    ],
    deliverables: [
      'Production infrastructure',
      'Deployment automation',
      'Monitoring dashboards',
      'Alert configurations',
      'Disaster recovery plan'
    ],
    tools: ['Terraform', 'GCP', 'Datadog', 'PagerDuty', 'Claude for Healthcare'],
    color: '#ec4899',
    hasHITL: true
  },
  {
    id: 6,
    title: 'Monitoring & Iteration',
    description: 'Agent Team analyzes usage patterns and proposes improvements with human oversight',
    duration: 'Ongoing',
    aiTasks: [
      'Analyze user behavior via Claude Analytics API',
      'Agent Team generates optimization suggestions',
      'Create bug fix PRs with automated testing',
      'Update documentation',
      'Generate release notes'
    ],
    humanTasks: [
      'Prioritize feature requests',
      'Review analytics at scheduled HITL checkpoints',
      'Approve updates and deployments',
      'Train end users'
    ],
    deliverables: [
      'Usage analytics reports',
      'Feature improvement backlog',
      'Updated documentation',
      'User training materials',
      'Performance optimizations'
    ],
    tools: ['Claude Analytics API', 'Sentry', 'Linear', 'Notion', 'Agent Teams'],
    color: '#06b6d4',
    hasHITL: true
  }
];

export const workflowStats = {
  totalPhases: 6,
  avgDevelopmentTime: '2-6 weeks',
  aiCodeGeneration: '92%+',
  timeReduction: '70-85%',
  costSavings: '$50k-300k'
};
