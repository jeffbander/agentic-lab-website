import { Handler, HandlerEvent } from '@netlify/functions';

export type AppType = 'Clinical' | 'Healthcare Management';

export interface GitHubRepo {
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  language: string | null;
  updatedAt: string;
  pushedAt: string;
  topics: string[];
  stargazersCount: number;
  forksCount: number;
  isArchived: boolean;
  // Computed fields
  category?: string;
  displayName?: string;
  summary?: string;
  appType?: AppType;
  techStack?: string[];
  keyFeatures?: string[];
}

// GitHub topic used to control which repos appear on the website.
// To show a repo: add this topic on GitHub. To hide it: remove it.
const FEATURED_TOPIC = 'mswlab';

interface RepoMetadataEntry {
  category: string;
  displayName: string;
  summary: string;
  appType: AppType;
  techStack: string[];
  keyFeatures: string[];
}

// Map repository names to categories, display names, and technical details
const repoMetadata: Record<string, RepoMetadataEntry> = {
  'Albert-CareSync-AI': {
    category: 'Patient Communication',
    displayName: 'CareSync AI',
    summary: 'AI-powered WhatsApp patient assistant with medical-grade reasoning, symptom assessment, red flag detection, and per-patient semantic memory.',
    appType: 'Clinical',
    techStack: ['Node.js', 'OpenAI GPT-4o', 'Turso (libSQL)', 'WhatsApp Cloud API', 'Mem0', 'Vercel'],
    keyFeatures: [
      'Medical-grade AI symptom assessment with red flag detection',
      'WhatsApp-based patient messaging via Meta Cloud API',
      'Per-patient semantic memory with Mem0 personalization',
      'Automatic alert creation for concerning symptoms',
      'HIPAA-ready audit logging and crisis detection'
    ]
  },
  'Albert': {
    category: 'Patient Communication',
    displayName: 'Albert Echo',
    summary: 'Patient communication and engagement platform for continuous care between appointments with automated follow-up and health tracking.',
    appType: 'Clinical',
    techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Twilio', 'Claude AI'],
    keyFeatures: [
      'Automated patient follow-up messaging',
      'Health status tracking between visits',
      'Care plan adherence monitoring',
      'Clinician notification system',
      'Patient engagement analytics'
    ]
  },
  'aigents-voice-agent': {
    category: 'Voice AI',
    displayName: 'AIGENTS Voice Agent',
    summary: 'Voice AI for heart failure patient outreach using OpenAI Realtime API over Twilio with vocal biomarker analysis via Python sidecar and HMAC-secured webhooks.',
    appType: 'Clinical',
    techStack: ['Node.js/TypeScript', 'OpenAI Realtime API', 'Twilio', 'Python', 'librosa', 'Neon Postgres', 'Drizzle ORM', 'Docker', 'GCP'],
    keyFeatures: [
      'Real-time vocal biomarker extraction (eGeMAPS + drift analysis)',
      'Heart failure symptom assessment via natural voice conversations',
      'Python sidecar microservice for audio biomarker processing',
      'HIPAA-compliant with HMAC signature verification',
      'AIGENTS control plane integration with webhook callbacks'
    ]
  },
  'healthcare-ai-voice': {
    category: 'Voice AI',
    displayName: 'Healthcare Voice AI',
    summary: 'HIPAA-compliant AI-powered healthcare voice communication platform with real-time monitoring and automated patient outreach.',
    appType: 'Clinical',
    techStack: ['Python', 'Twilio', 'OpenAI', 'FHIR MCP', 'PostgreSQL', 'Redis', 'Docker'],
    keyFeatures: [
      'HIPAA-compliant voice calls',
      'Medication reminder automation',
      'Appointment scheduling via voice',
      'Real-time call monitoring dashboard',
      'Call transcription & sentiment analysis'
    ]
  },
  'CCU-app': {
    category: 'Clinical Operations',
    displayName: 'CCU Census App',
    summary: 'Cardiac Care Unit census and patient tracking application with AI-powered analysis, data import/export, and real-time care coordination.',
    appType: 'Clinical',
    techStack: ['Next.js 16', 'React 19', 'TypeScript', 'Convex', 'Anthropic Claude', 'Clerk Auth', 'Tailwind CSS'],
    keyFeatures: [
      'Real-time CCU patient census tracking',
      'AI-powered clinical analysis via Claude',
      'CSV/Excel data import and export',
      'Clerk-based authenticated access',
      'Convex real-time backend sync'
    ]
  },
  'inpatient-app': {
    category: 'Clinical Operations',
    displayName: 'NoteForge',
    summary: 'AI-powered clinical documentation tool — paste patient data, select note type, and generate structured clinical notes with Anthropic Claude.',
    appType: 'Clinical',
    techStack: ['Next.js 14', 'TypeScript', 'Convex', 'Anthropic Claude API', 'Clerk Auth', 'Tailwind CSS'],
    keyFeatures: [
      'AI-powered clinical note generation via Claude',
      'Multiple note type templates',
      'Paste-and-generate workflow for patient data',
      'Clerk-based user authentication',
      'Convex real-time backend database'
    ]
  },
  'PTO-App': {
    category: 'Scheduling',
    displayName: 'PTO Manager',
    summary: 'Multi-role PTO management for Mount Sinai West Cardiovascular Institute with automatic balance calculation, approval workflows, and email notifications.',
    appType: 'Healthcare Management',
    techStack: ['Python', 'Flask', 'SQLAlchemy', 'SQLite', 'Jinja2', 'Bootstrap', 'Playwright'],
    keyFeatures: [
      'Multi-role PTO management (Admin, Clinical, MOA Supervisor, Echo Tech)',
      'Automatic PTO balance calculation (7.5-hour workday)',
      'Role-based approval workflows with dashboards',
      'Calendar view for approved time off',
      'Email notifications for all status changes'
    ]
  },
  'htn-prevention-app': {
    category: 'Preventive Care',
    displayName: 'HTN Prevention Program',
    summary: 'Hypertension prevention platform for first responders with AHA-guideline BP classification, ASCVD risk assessment, and union-based analytics.',
    appType: 'Clinical',
    techStack: ['React 18', 'TypeScript', 'Vite', 'Express.js', 'SQLite', 'Drizzle ORM', 'Shadcn/ui', 'Recharts'],
    keyFeatures: [
      'AHA-guideline HTN classification (Normal through Crisis)',
      'Blood pressure monitoring with trend tracking',
      'First responder health screening (Fire, Police, EMS)',
      'Union-based enrollment metrics and activity analytics',
      'Communication/encounter tracking with follow-up compliance'
    ]
  },
  'mindminders-mvp': {
    category: 'Wellness',
    displayName: 'MindMinders',
    summary: '30-day brain health fitness program across 7 evidence-based pillars with validated cognitive tasks, age-normalized scoring, and reward system.',
    appType: 'Clinical',
    techStack: ['React 18', 'TypeScript', 'Vite', 'Firebase', 'Zustand', 'SendGrid', 'Tremendous API', 'Playwright'],
    keyFeatures: [
      '7 evidence-based pillars (nutrition, exercise, sleep, mental fitness, social, cognitive, brain stimulation)',
      'Validated cognitive tasks (Word Recall, Symbol Substitution, 2-back Visual, Trail-Making)',
      'Rewards system ($2/module, $3 completion bonus)',
      'SLA monitoring with coach/IMRO escalation tiers',
      'Program phases: Onboarding, Auto-extend, Sustain with personalized task selection'
    ]
  },
  'epic-medical-consultation': {
    category: 'EHR Integration',
    displayName: 'Epic AI Consultation',
    summary: 'AI-powered multi-agent medical consultation system that interfaces with Epic EMR for clinical decision support and specialist recommendations.',
    appType: 'Clinical',
    techStack: ['TypeScript', 'React', 'Python', 'Epic FHIR API', 'Claude AI', 'MCP', 'PostgreSQL'],
    keyFeatures: [
      'Multi-agent AI clinical reasoning',
      'Epic EMR bidirectional integration',
      'Specialist consultation routing',
      'Evidence-based treatment suggestions',
      'Clinical decision audit trail'
    ]
  },
  'leqvio-patient-management': {
    category: 'Clinical Trials',
    displayName: 'LEQVIO Patient Manager',
    summary: 'Patient enrollment and tracking system for LEQVIO (inclisiran) with e-signature forms, OCR document processing, and automated PDF generation.',
    appType: 'Healthcare Management',
    techStack: ['React', 'TypeScript', 'Express.js', 'PostgreSQL', 'Drizzle ORM', 'OpenAI OCR', 'SendGrid', 'GCS', 'Tailwind CSS'],
    keyFeatures: [
      'E-signature digital enrollment forms with signature capture',
      'OCR document processing (insurance cards, Epic screenshots)',
      'Automated LEQVIO PDF form generation',
      'Multi-organization support with clinical documentation',
      'AIGENTS webhook integration for workflow automation'
    ]
  },
  'IRBVer2': {
    category: 'Research',
    displayName: 'IRB Protocol System',
    summary: 'Research study management system with participant enrollment, electronic consent, version-controlled documents, and HIPAA-compliant audit trail.',
    appType: 'Healthcare Management',
    techStack: ['Node.js 18', 'TypeScript', 'PostgreSQL', 'Redis', 'Jest', 'Docker', 'Zod', 'Winston', 'Swagger'],
    keyFeatures: [
      'Clinical research study management with IRB submission tracking',
      'Participant enrollment with electronic consent',
      'Version-controlled protocol document management',
      'Team management with role-based assignments and effort tracking',
      'HIPAA-compliant audit trail with budget tracking'
    ]
  },
  'strike-prep-v2.3': {
    category: 'Operations',
    displayName: 'Strike Prep',
    summary: 'Strike preparation and contingency planning system for healthcare operations continuity with staffing models and coverage tracking.',
    appType: 'Healthcare Management',
    techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
    keyFeatures: [
      'Emergency staffing contingency plans',
      'Coverage gap identification',
      'Staff deployment tracking',
      'Department continuity checklists',
      'Real-time status dashboard'
    ]
  },
  'MSW-Heart---SZ': {
    category: 'Cardiology',
    displayName: 'Cardiology Scheduler',
    summary: 'Drag-and-drop provider scheduling system for MSW cardiology services with PTO management, availability rules, and sandbox testing environment.',
    appType: 'Healthcare Management',
    techStack: ['Next.js 16', 'React 19', 'TypeScript', 'Supabase', '@dnd-kit', 'Clerk Auth', 'Shadcn/ui', 'XLSX'],
    keyFeatures: [
      'Drag-and-drop scheduling across cardiology services (Echo, Stress, Nuclear, Consults)',
      'PTO management with approval workflows and conflict detection',
      'Per-provider availability rules with hard/warn enforcement',
      'Echo/Testing Lab scheduling with room allocation and capacity',
      'Sandbox environment for testing schedule changes before publishing'
    ]
  },
  'PROTOCOL-EXTRACTOR': {
    category: 'Research',
    displayName: 'Protocol Extractor',
    summary: 'AI-powered clinical trial protocol PDF extraction using Claude 3.5 Sonnet — reduces 4-8 hours of manual work to under 10 minutes.',
    appType: 'Healthcare Management',
    techStack: ['Next.js 14', 'React 18', 'TypeScript', 'Supabase', 'Claude 3.5 Sonnet', 'Tailwind CSS', 'Playwright'],
    keyFeatures: [
      'AI-powered clinical trial protocol PDF extraction',
      'Role-based access for PIs, Coordinators, and Admins',
      'Team management with member assignment to studies',
      'Patient enrollment tracking against targets',
      'OCR support for scanned documents'
    ]
  },
  'htn3.0': {
    category: 'Patient Communication',
    displayName: 'CareSync AI v3',
    summary: 'WhatsApp-based AI patient assistant with OpenAI GPT-4o clinical reasoning, Turso database, and Mem0 semantic memory for personalized care.',
    appType: 'Clinical',
    techStack: ['Node.js', 'OpenAI GPT-4o', 'Turso (libSQL)', 'WhatsApp Cloud API', 'Mem0', 'Vercel'],
    keyFeatures: [
      'Medical-grade AI with clinical reasoning and red flag detection',
      'WhatsApp patient communication via Meta Cloud API',
      'Per-patient AI personalization with semantic memory',
      'Crisis detection (suicidal ideation, emergency symptoms)',
      'Automatic alerts for concerning symptoms to care team'
    ]
  },
  'MCG-study': {
    category: 'Research',
    displayName: 'MCG Study',
    summary: 'Research study application for clinical data collection, patient enrollment tracking, and study analytics with IRB-compliant data handling.',
    appType: 'Healthcare Management',
    techStack: ['HTML', 'JavaScript', 'Node.js', 'PostgreSQL'],
    keyFeatures: [
      'Patient enrollment tracking',
      'Clinical data collection forms',
      'Study progress analytics',
      'IRB-compliant data storage',
      'Export for statistical analysis'
    ]
  },
  'magic-protocol': {
    category: 'Research',
    displayName: 'Protocol Extractor v2',
    summary: 'AI-powered clinical trial protocol PDF extraction using Claude AI with magic link auth, Supabase Row Level Security, and role-based study management.',
    appType: 'Healthcare Management',
    techStack: ['Next.js 14', 'React 19', 'TypeScript', 'Supabase', 'Claude 3.5 Sonnet', 'Tailwind CSS'],
    keyFeatures: [
      'AI-powered protocol PDF extraction via Claude AI',
      'Magic link passwordless authentication',
      'Role-based access (PI, Research Coordinator, Admin)',
      'Study management with team collaboration',
      'Patient enrollment tracking with progress monitoring'
    ]
  },
  'Billing-A28': {
    category: 'Revenue Cycle',
    displayName: 'Provider Reimbursement Tool',
    summary: 'Provider reimbursement tracking and management application with tRPC type-safe APIs, AI-powered features, and data visualization.',
    appType: 'Healthcare Management',
    techStack: ['React 19', 'TypeScript', 'Vite 7', 'Express.js', 'tRPC', 'MySQL', 'Drizzle ORM', 'Clerk Auth', 'AWS S3', 'OpenAI'],
    keyFeatures: [
      'Provider reimbursement tracking and management',
      'tRPC type-safe API communication',
      'AI-powered features via OpenAI integration',
      'Data visualization with Recharts',
      'File storage and upload via AWS S3'
    ]
  },
  'Voice2.0': {
    category: 'Voice AI',
    displayName: 'Voice 2.0',
    summary: 'AI-powered outbound calling system for healthcare wellness checks using Fastify, OpenAI Realtime API, and Twilio with E2E testing.',
    appType: 'Clinical',
    techStack: ['Node.js', 'Fastify 5', 'OpenAI Realtime API', 'Twilio', 'WebSocket', 'Pino', 'Tailwind CSS', 'Playwright'],
    keyFeatures: [
      'AI-powered outbound wellness check calls',
      'Real-time voice AI conversation via OpenAI',
      'Twilio telephony integration for PSTN calls',
      'Structured logging with Pino',
      'End-to-end tested with Playwright'
    ]
  },
  'agentic-lab-website': {
    category: 'Website',
    displayName: 'Agentic Lab Website',
    summary: 'Mount Sinai Agentic Laboratory showcase website with interactive demos and documentation.',
    appType: 'Healthcare Management',
    techStack: ['TypeScript', 'React', 'Vite', 'Tailwind CSS', 'Netlify Functions'],
    keyFeatures: [
      'Interactive project showcase',
      'AI video generation demos',
      'Real-time GitHub integration',
      'Patient education tools',
      'ROI calculator'
    ]
  },
  'auth-app': {
    category: 'EHR Integration',
    displayName: 'Echo Qualification System',
    summary: 'Intelligent NLP analysis of clinical notes to determine echocardiogram qualification, with specialist credibility hierarchy and insurance authorization letter generation.',
    appType: 'Clinical',
    techStack: ['Next.js 14', 'TypeScript', 'Convex', 'Clerk Auth', 'Custom NLP Engine', 'XLSX', 'Heroicons'],
    keyFeatures: [
      'NLP analysis of clinical notes for cardiac symptom detection',
      'Specialist credibility hierarchy (Cardiology > ED > IM > PCP)',
      'Automated echocardiogram qualification determination',
      'Insurance authorization letter generation (print-ready)',
      'CSV/Excel export with clinical citations'
    ]
  },
  'WQ-APP': {
    category: 'Clinical Operations',
    displayName: 'Work Queue App',
    summary: 'Clinical work queue management system for tracking and prioritizing patient tasks, orders, and follow-ups across care teams.',
    appType: 'Clinical',
    techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
    keyFeatures: [
      'Priority-based task queue management',
      'Patient task assignment & tracking',
      'Order follow-up automation',
      'Team workload balancing',
      'Completion analytics dashboard'
    ]
  },
  'hipaa-dev-team': {
    category: 'Infrastructure',
    displayName: 'HIPAA Dev Framework',
    summary: 'HIPAA-compliant development framework and tools for building secure healthcare applications with built-in compliance guardrails.',
    appType: 'Healthcare Management',
    techStack: ['JavaScript', 'Node.js', 'Docker', 'AWS', 'Terraform'],
    keyFeatures: [
      'HIPAA compliance templates',
      'Secure development guidelines',
      'Automated security scanning',
      'PHI data handling utilities',
      'Deployment compliance checks'
    ]
  },
  'HTN-APP-': {
    category: 'Preventive Care',
    displayName: 'HTN Mobile App',
    summary: 'Cross-platform mobile hypertension management app built with Flutter for patient BP self-monitoring and medication tracking.',
    appType: 'Clinical',
    techStack: ['Dart', 'Flutter', 'Firebase', 'FHIR'],
    keyFeatures: [
      'Mobile BP self-monitoring',
      'Medication reminder system',
      'BP trend visualization',
      'Provider data sharing',
      'Cross-platform (iOS & Android)'
    ]
  },
  'CHF-working': {
    category: 'Cardiology',
    displayName: 'CHF Management',
    summary: 'Congestive heart failure patient management system with weight tracking, symptom monitoring, and automated clinical alerts.',
    appType: 'Clinical',
    techStack: ['Batchfile', 'Python', 'Node.js', 'PostgreSQL'],
    keyFeatures: [
      'Daily weight trend monitoring',
      'Symptom severity tracking',
      'Automated fluid retention alerts',
      'Medication adjustment tracking',
      'Readmission risk scoring'
    ]
  },
  'authappBETA': {
    category: 'Infrastructure',
    displayName: 'Auth App Beta',
    summary: 'Beta authentication platform with enhanced security features for healthcare app ecosystem single sign-on.',
    appType: 'Healthcare Management',
    techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'JWT'],
    keyFeatures: [
      'Enhanced SSO for app ecosystem',
      'Token-based authentication',
      'Session management',
      'Security audit logging',
      'Role-based permissions'
    ]
  },
  'msw-strike-coverage': {
    category: 'Operations',
    displayName: 'Strike Coverage Platform',
    summary: 'Emergency cardiology fellows shift signup system for Mount Sinai strike coverage with real-time availability tracking.',
    appType: 'Healthcare Management',
    techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
    keyFeatures: [
      'Emergency shift signup system',
      'Real-time availability tracking',
      'Coverage gap alerts',
      'Fellow scheduling management',
      'Shift confirmation notifications'
    ]
  },
  'clinicalrounds': {
    category: 'Clinical Operations',
    displayName: 'Clinical Rounds',
    summary: 'AI-powered multidisciplinary clinical case review tool for structured rounding with real-time collaboration and documentation.',
    appType: 'Clinical',
    techStack: ['TypeScript', 'React', 'Claude AI', 'Node.js', 'PostgreSQL'],
    keyFeatures: [
      'AI-assisted case presentation',
      'Multidisciplinary team coordination',
      'Structured rounding templates',
      'Real-time collaborative notes',
      'Action item tracking & follow-up'
    ]
  },
  'HCM-Registry': {
    category: 'Cardiology',
    displayName: 'HCM Registry',
    summary: 'Hypertrophic cardiomyopathy patient registry for tracking disease progression, genetic testing results, and treatment outcomes.',
    appType: 'Clinical',
    techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'FHIR'],
    keyFeatures: [
      'HCM patient registry management',
      'Genetic testing result tracking',
      'Disease progression monitoring',
      'Treatment outcome analytics',
      'Family screening coordination'
    ]
  }
};

// Categories to highlight (in order)
const featuredCategories = [
  'Patient Communication',
  'Voice AI',
  'Clinical Operations',
  'EHR Integration',
  'Clinical Trials',
  'Cardiology',
  'Preventive Care',
  'Wellness',
  'Research',
  'Revenue Cycle',
  'Scheduling',
  'Operations',
  'Infrastructure'
];

// Simple in-memory cache
let cache: { data: GitHubRepo[]; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  // Check cache
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return cache.data;
  }

  const response = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Agentic-Lab-Website',
        // Add GitHub token if available for higher rate limits
        ...(process.env.GITHUB_TOKEN && {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`
        })
      }
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const repos = await response.json();

  const mappedRepos: GitHubRepo[] = repos
    .filter((repo: Record<string, unknown>) => !repo.archived && !repo.fork)
    .map((repo: Record<string, unknown>) => {
      const metadata = repoMetadata[repo.name as string];
      return {
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        htmlUrl: repo.html_url,
        homepage: repo.homepage,
        language: repo.language,
        updatedAt: repo.updated_at,
        pushedAt: repo.pushed_at,
        topics: repo.topics || [],
        stargazersCount: repo.stargazers_count,
        forksCount: repo.forks_count,
        isArchived: repo.archived,
        category: metadata?.category || 'Other',
        displayName: metadata?.displayName || repo.name,
        summary: metadata?.summary || repo.description || 'Healthcare application built with AI-assisted development.',
        appType: metadata?.appType || 'Healthcare Management',
        techStack: metadata?.techStack || [repo.language as string].filter(Boolean),
        keyFeatures: metadata?.keyFeatures || []
      };
    });

  // Sort by category importance, then by update date
  mappedRepos.sort((a, b) => {
    const catIndexA = featuredCategories.indexOf(a.category || 'Other');
    const catIndexB = featuredCategories.indexOf(b.category || 'Other');

    if (catIndexA !== catIndexB) {
      if (catIndexA === -1) return 1;
      if (catIndexB === -1) return -1;
      return catIndexA - catIndexB;
    }

    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  // Update cache
  cache = { data: mappedRepos, timestamp: Date.now() };

  return mappedRepos;
}

export const handler: Handler = async (event: HandlerEvent) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' // Short browser cache; server-side cache handles the rest
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const params = event.queryStringParameters || {};
    const category = params.category;
    const limit = params.limit ? parseInt(params.limit, 10) : undefined;
    const featured = params.featured === 'true';
    const appType = params.appType as AppType | undefined;

    let repos = await fetchGitHubRepos('jeffbander');

    // Filter by category if specified
    if (category) {
      repos = repos.filter(repo => repo.category === category);
    }

    // Filter by app type if specified
    if (appType) {
      repos = repos.filter(repo => repo.appType === appType);
    }

    // Filter to only repos tagged with the featured topic on GitHub
    if (featured) {
      repos = repos.filter(repo => repo.topics.includes(FEATURED_TOPIC));
      // Strip the gate topic from displayed topics
      repos = repos.map(repo => ({
        ...repo,
        topics: repo.topics.filter(t => t !== FEATURED_TOPIC)
      }));
    }

    // Apply limit
    if (limit) {
      repos = repos.slice(0, limit);
    }

    // Get unique categories
    const categories = [...new Set(repos.map(r => r.category).filter(Boolean))];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        repos,
        total: repos.length,
        categories,
        lastUpdated: cache?.timestamp ? new Date(cache.timestamp).toISOString() : new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('[GitHub Repos] Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to fetch repositories'
      })
    };
  }
};
