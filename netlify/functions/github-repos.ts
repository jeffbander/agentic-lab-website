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
    summary: 'AI-powered WhatsApp patient assistant with medical-grade reasoning, symptom assessment, red flag detection, and HIPAA-ready audit logging.',
    appType: 'Clinical',
    techStack: ['TypeScript', 'Node.js', 'WhatsApp API', 'OpenAI', 'Claude AI', 'FHIR', 'PostgreSQL'],
    keyFeatures: [
      'Medical-grade AI symptom assessment',
      'Red flag detection with clinician escalation',
      'WhatsApp-based patient messaging',
      'HIPAA-compliant audit logging',
      'Multi-language patient support'
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
    summary: 'Voice AI for heart failure patient outreach using OpenAI Realtime API over Twilio with vocal biomarker analysis and early deterioration detection.',
    appType: 'Clinical',
    techStack: ['Python', 'OpenAI Realtime API', 'Twilio', 'TensorFlow', 'Web Audio API', 'PostgreSQL', 'FHIR MCP'],
    keyFeatures: [
      'Real-time vocal biomarker extraction',
      'Heart failure early warning (2-3 weeks ahead)',
      'Natural language patient conversations',
      'Automated call transcription & analytics',
      'EHR integration via FHIR'
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
    displayName: 'CCU Application',
    summary: 'Cardiac Care Unit management application for real-time patient monitoring, bed management, and care team coordination.',
    appType: 'Clinical',
    techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'WebSocket', 'FHIR'],
    keyFeatures: [
      'Real-time patient vitals monitoring',
      'CCU bed management & tracking',
      'Care team coordination tools',
      'Critical alert escalation system',
      'Shift handoff documentation'
    ]
  },
  'inpatient-app': {
    category: 'Clinical Operations',
    displayName: 'Inpatient Manager',
    summary: 'Inpatient care management and tracking system for hospital units with census management and discharge planning.',
    appType: 'Clinical',
    techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'FHIR'],
    keyFeatures: [
      'Real-time unit census tracking',
      'Patient rounding checklists',
      'Discharge planning workflow',
      'Length-of-stay analytics',
      'Care team assignment management'
    ]
  },
  'PTO-App': {
    category: 'Scheduling',
    displayName: 'PTO Manager',
    summary: 'Clinical staff PTO request and approval system with automated coverage checking, conflict resolution, and calendar integration.',
    appType: 'Healthcare Management',
    techStack: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'PostgreSQL', 'SendGrid'],
    keyFeatures: [
      'One-click PTO request submission',
      'Automated coverage gap detection',
      'Manager approval workflows',
      'Calendar sync integration',
      'Staffing analytics dashboard'
    ]
  },
  'htn-prevention-app': {
    category: 'Preventive Care',
    displayName: 'HTN Prevention Program',
    summary: 'Hypertension prevention platform for first responders with blood pressure monitoring, ASCVD risk assessment, and union-based analytics.',
    appType: 'Clinical',
    techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Chart.js', 'FHIR'],
    keyFeatures: [
      'Blood pressure trend tracking',
      'ASCVD risk score calculation',
      'First responder health screening',
      'Union-based aggregate analytics',
      'Automated risk stratification alerts'
    ]
  },
  'mindminders-mvp': {
    category: 'Wellness',
    displayName: 'MindMinders',
    summary: '30-day brain health fitness program focusing on nutrition, exercise, sleep, and cognitive stimulation with personalized daily plans.',
    appType: 'Clinical',
    techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Claude AI'],
    keyFeatures: [
      'Personalized 30-day brain health plan',
      'Daily cognitive exercises & tracking',
      'Sleep quality monitoring',
      'Nutrition & exercise recommendations',
      'Progress analytics dashboard'
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
    summary: 'Patient enrollment and tracking system for LEQVIO (inclisiran) medication program with automated EHR eligibility checking and follow-up scheduling.',
    appType: 'Clinical',
    techStack: ['TypeScript', 'React', 'FHIR MCP', 'PostgreSQL', 'Twilio', 'Claude AI'],
    keyFeatures: [
      'Automated patient eligibility screening',
      'EHR integration via FHIR for lab data',
      'Injection scheduling & reminders',
      'LDL cholesterol trend tracking',
      'Enrollment & compliance analytics'
    ]
  },
  'IRBVer2': {
    category: 'Research',
    displayName: 'IRB Protocol System',
    summary: 'AI-powered IRB protocol submission and review system built in 8 weeks, replacing $50k-200k enterprise software with automated compliance checking.',
    appType: 'Healthcare Management',
    techStack: ['HTML', 'JavaScript', 'Next.js', 'Prisma', 'PostgreSQL', 'GCP', 'Terraform', 'Claude AI', 'MCP'],
    keyFeatures: [
      'AI-powered protocol compliance checking',
      'Document OCR with Mistral Vision',
      'Real-time multi-user collaboration',
      'Automated submission workflow',
      'Integrated audit logging system'
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
    displayName: 'MSW Heart Program',
    summary: 'Mount Sinai West Heart program application for cardiology patient management, structural heart zone tracking, and clinical workflow automation.',
    appType: 'Clinical',
    techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'FHIR'],
    keyFeatures: [
      'Structural heart zone patient tracking',
      'Cardiology procedure scheduling',
      'Post-procedure follow-up management',
      'Clinical outcome tracking',
      'Referral management workflow'
    ]
  },
  'PROTOCOL-EXTRACTOR': {
    category: 'Research',
    displayName: 'Protocol Extractor',
    summary: 'AI-powered clinical protocol extraction and parsing tool that converts research documents into structured, queryable data.',
    appType: 'Healthcare Management',
    techStack: ['TypeScript', 'React', 'Claude AI', 'PDF.js', 'Node.js'],
    keyFeatures: [
      'PDF protocol document parsing',
      'AI-powered data extraction',
      'Structured protocol output format',
      'Batch document processing',
      'Protocol comparison tools'
    ]
  },
  'htn3.0': {
    category: 'Preventive Care',
    displayName: 'HTN 3.0',
    summary: 'Next-generation hypertension management platform with comprehensive BP tracking, medication management, and population health analytics.',
    appType: 'Clinical',
    techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Chart.js', 'FHIR'],
    keyFeatures: [
      'Advanced BP trend visualization',
      'Medication titration tracking',
      'Population health dashboards',
      'Automated screening workflows',
      'Risk-stratified patient panels'
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
    displayName: 'Magic Protocol',
    summary: 'Protocol automation and management system for clinical research workflows with AI-assisted protocol generation and review.',
    appType: 'Healthcare Management',
    techStack: ['TypeScript', 'React', 'Claude AI', 'Node.js', 'PostgreSQL'],
    keyFeatures: [
      'AI-assisted protocol generation',
      'Protocol version control',
      'Collaborative review workflow',
      'Regulatory checklist automation',
      'Study timeline management'
    ]
  },
  'Billing-A28': {
    category: 'Revenue Cycle',
    displayName: 'Billing A28',
    summary: 'Healthcare billing and revenue cycle management application with charge capture, coding assistance, and denial management.',
    appType: 'Healthcare Management',
    techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
    keyFeatures: [
      'Automated charge capture',
      'CPT/ICD coding assistance',
      'Denial management workflow',
      'Revenue analytics dashboard',
      'Payer reconciliation tools'
    ]
  },
  'Voice2.0': {
    category: 'Voice AI',
    displayName: 'Voice 2.0',
    summary: 'Next-generation voice AI platform for healthcare communication with advanced NLP, multi-turn conversations, and clinical workflow integration.',
    appType: 'Clinical',
    techStack: ['Python', 'OpenAI Realtime API', 'Twilio', 'FastAPI', 'PostgreSQL', 'Redis'],
    keyFeatures: [
      'Multi-turn clinical conversations',
      'Advanced NLP intent recognition',
      'Clinical workflow triggers',
      'Voice-to-EHR documentation',
      'Real-time conversation analytics'
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
    category: 'Infrastructure',
    displayName: 'Auth App',
    summary: 'Authentication and authorization service for healthcare applications with role-based access control and SSO integration.',
    appType: 'Healthcare Management',
    techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'JWT', 'OAuth 2.0'],
    keyFeatures: [
      'Role-based access control (RBAC)',
      'Single sign-on integration',
      'Session management',
      'Audit logging',
      'Multi-factor authentication'
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
