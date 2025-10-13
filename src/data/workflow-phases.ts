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
}

export const workflowPhases: WorkflowPhase[] = [
  {
    id: 1,
    title: 'Requirements & Planning',
    description: 'AI analyzes clinical needs and generates technical specifications',
    duration: '2-3 days',
    aiTasks: [
      'Analyze similar healthcare applications',
      'Generate technical architecture',
      'Create database schema proposals',
      'Draft API specifications',
      'Generate test scenarios'
    ],
    humanTasks: [
      'Define clinical workflows',
      'Review AI-generated specs',
      'Approve architecture decisions',
      'Set compliance requirements'
    ],
    deliverables: [
      'Technical specification document',
      'Database schema',
      'API documentation',
      'Project timeline'
    ],
    tools: ['Claude Code', 'GitHub', 'Figma', 'Linear'],
    color: '#3b82f6'
  },
  {
    id: 2,
    title: 'Development Setup',
    description: 'AI scaffolds project structure and configures development environment',
    duration: '1 day',
    aiTasks: [
      'Generate project boilerplate',
      'Configure build tools',
      'Set up CI/CD pipelines',
      'Create Docker configurations',
      'Generate initial tests'
    ],
    humanTasks: [
      'Review generated code',
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
    tools: ['Vite', 'Docker', 'GitHub Actions', 'Terraform'],
    color: '#10b981'
  },
  {
    id: 3,
    title: 'Core Development',
    description: 'AI generates features while human reviews and guides implementation',
    duration: '3-4 weeks',
    aiTasks: [
      'Generate React components',
      'Write API endpoints',
      'Create database migrations',
      'Implement authentication',
      'Write unit tests',
      'Generate documentation'
    ],
    humanTasks: [
      'Review pull requests',
      'Test clinical workflows',
      'Provide feedback on UX',
      'Validate business logic'
    ],
    deliverables: [
      'Working application',
      'API endpoints',
      'Database with migrations',
      'Authentication system',
      'Test coverage >80%'
    ],
    tools: ['Claude Code', 'React', 'Next.js', 'Prisma', 'PostgreSQL'],
    color: '#8b5cf6'
  },
  {
    id: 4,
    title: 'Integration & Testing',
    description: 'AI generates comprehensive tests and integration scenarios',
    duration: '1-2 weeks',
    aiTasks: [
      'Generate integration tests',
      'Create E2E test scenarios',
      'Generate test data',
      'Write performance tests',
      'Create accessibility tests'
    ],
    humanTasks: [
      'Perform manual testing',
      'Validate clinical workflows',
      'Security review',
      'Performance testing'
    ],
    deliverables: [
      'Integration test suite',
      'E2E test coverage',
      'Performance benchmarks',
      'Security audit report',
      'HIPAA compliance checklist'
    ],
    tools: ['Playwright', 'Vitest', 'Lighthouse', 'OWASP ZAP'],
    color: '#f59e0b'
  },
  {
    id: 5,
    title: 'Deployment',
    description: 'AI configures infrastructure and automates deployment process',
    duration: '3-5 days',
    aiTasks: [
      'Generate Terraform configs',
      'Create deployment scripts',
      'Configure monitoring',
      'Set up alerting rules',
      'Generate runbooks'
    ],
    humanTasks: [
      'Review infrastructure setup',
      'Validate security configs',
      'Approve production deploy',
      'Monitor initial rollout'
    ],
    deliverables: [
      'Production infrastructure',
      'Deployment automation',
      'Monitoring dashboards',
      'Alert configurations',
      'Disaster recovery plan'
    ],
    tools: ['Terraform', 'GCP', 'Datadog', 'PagerDuty'],
    color: '#ec4899'
  },
  {
    id: 6,
    title: 'Monitoring & Iteration',
    description: 'AI analyzes usage patterns and suggests improvements',
    duration: 'Ongoing',
    aiTasks: [
      'Analyze user behavior',
      'Generate optimization suggestions',
      'Create bug fix PRs',
      'Update documentation',
      'Generate release notes'
    ],
    humanTasks: [
      'Prioritize feature requests',
      'Review analytics',
      'Approve updates',
      'Train end users'
    ],
    deliverables: [
      'Usage analytics reports',
      'Feature improvement backlog',
      'Updated documentation',
      'User training materials',
      'Performance optimizations'
    ],
    tools: ['Google Analytics', 'Sentry', 'Linear', 'Notion'],
    color: '#06b6d4'
  }
];

export const workflowStats = {
  totalPhases: 6,
  avgDevelopmentTime: '4-8 weeks',
  aiCodeGeneration: '83.8%',
  timeReduction: '60-80%',
  costSavings: '$50k-200k'
};
