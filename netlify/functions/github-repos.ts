import { Handler, HandlerEvent } from '@netlify/functions';

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
}

// Map repository names to categories and display names
const repoMetadata: Record<string, { category: string; displayName: string; summary: string }> = {
  'Albert-CareSync-AI': {
    category: 'Patient Communication',
    displayName: 'CareSync AI',
    summary: 'AI-powered WhatsApp patient assistant with medical-grade reasoning, symptom assessment, red flag detection, and HIPAA-ready audit logging.'
  },
  'Albert': {
    category: 'Patient Communication',
    displayName: 'Albert Echo',
    summary: 'Patient communication and engagement platform for continuous care between appointments.'
  },
  'aigents-voice-agent': {
    category: 'Voice AI',
    displayName: 'AIGENTS Voice Agent',
    summary: 'Voice AI for heart failure patient outreach using OpenAI Realtime API over Twilio with vocal biomarker analysis.'
  },
  'healthcare-ai-voice': {
    category: 'Voice AI',
    displayName: 'Healthcare Voice AI',
    summary: 'HIPAA-compliant AI-powered healthcare voice communication platform with real-time monitoring.'
  },
  'CCU-app': {
    category: 'Clinical Operations',
    displayName: 'CCU Application',
    summary: 'Cardiac Care Unit management application for patient monitoring and care coordination.'
  },
  'inpatient-app': {
    category: 'Clinical Operations',
    displayName: 'Inpatient Manager',
    summary: 'Inpatient care management and tracking system for hospital units.'
  },
  'PTO-App': {
    category: 'Administrative',
    displayName: 'PTO Manager',
    summary: 'Clinical staff PTO request and approval system with automated coverage checking and calendar integration.'
  },
  'htn-prevention-app': {
    category: 'Preventive Care',
    displayName: 'HTN Prevention Program',
    summary: 'Hypertension prevention for first responders with BP monitoring, risk assessment, and union-based analytics.'
  },
  'mindminders-mvp': {
    category: 'Wellness',
    displayName: 'MindMinders',
    summary: '30-day brain health fitness program focusing on nutrition, exercise, sleep, and cognitive stimulation.'
  },
  'epic-medical-consultation': {
    category: 'EHR Integration',
    displayName: 'Epic AI Consultation',
    summary: 'AI-powered multi-agent medical consultation system that interfaces with Epic EMR.'
  },
  'leqvio-patient-management': {
    category: 'Clinical Trials',
    displayName: 'LEQVIO Patient Manager',
    summary: 'Patient enrollment and tracking system for LEQVIO medication program with EHR integration.'
  },
  'IRBVer2': {
    category: 'Research',
    displayName: 'IRB Protocol System',
    summary: 'AI-powered IRB protocol submission and review system built in 8 weeks, replacing enterprise software.'
  },
  'strike-prep-v2.3': {
    category: 'Operations',
    displayName: 'Strike Prep',
    summary: 'Strike preparation and contingency planning system for healthcare operations continuity.'
  },
  'MSW-Heart---SZ': {
    category: 'Cardiology',
    displayName: 'MSW Heart Program',
    summary: 'Mount Sinai West Heart program application for cardiology patient management.'
  },
  'PROTOCOL-EXTRACTOR': {
    category: 'Research',
    displayName: 'Protocol Extractor',
    summary: 'Clinical protocol extraction and parsing tool for research documentation.'
  },
  'htn3.0': {
    category: 'Preventive Care',
    displayName: 'HTN 3.0',
    summary: 'Next-generation hypertension management and monitoring platform.'
  },
  'MCG-study': {
    category: 'Research',
    displayName: 'MCG Study',
    summary: 'Research study application for clinical data collection and analysis.'
  },
  'magic-protocol': {
    category: 'Research',
    displayName: 'Magic Protocol',
    summary: 'Protocol automation and management for clinical research workflows.'
  },
  'Billing-A28': {
    category: 'Administrative',
    displayName: 'Billing A28',
    summary: 'Healthcare billing and revenue cycle management application.'
  },
  'Voice2.0': {
    category: 'Voice AI',
    displayName: 'Voice 2.0',
    summary: 'Next-generation voice AI platform for healthcare communication.'
  },
  'agentic-lab-website': {
    category: 'Website',
    displayName: 'Agentic Lab Website',
    summary: 'Mount Sinai Agentic Laboratory showcase website with interactive demos and documentation.'
  },
  'auth-app': {
    category: 'Infrastructure',
    displayName: 'Auth App',
    summary: 'Authentication and authorization service for healthcare applications.'
  }
};

// Categories to highlight (in order)
const featuredCategories = [
  'Patient Communication',
  'Voice AI',
  'Clinical Operations',
  'EHR Integration',
  'Clinical Trials',
  'Research',
  'Preventive Care',
  'Cardiology',
  'Wellness',
  'Administrative',
  'Operations'
];

// Simple in-memory cache
let cache: { data: GitHubRepo[]; timestamp: number } | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

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
    .filter((repo: any) => !repo.archived && !repo.fork)
    .map((repo: any) => {
      const metadata = repoMetadata[repo.name];
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
        summary: metadata?.summary || repo.description || 'Healthcare application built with AI-assisted development.'
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
    'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
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

    let repos = await fetchGitHubRepos('jeffbander');

    // Filter by category if specified
    if (category) {
      repos = repos.filter(repo => repo.category === category);
    }

    // Filter to only featured (those with metadata) if specified
    if (featured) {
      repos = repos.filter(repo => repoMetadata[repo.name]);
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
