export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string; // Markdown content
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  coverImage?: string;
  tags: string[];
  category: 'Healthcare AI' | 'Security' | 'Development' | 'Case Study' | 'Tutorial' | 'News';
  status: 'draft' | 'published';
  publishedAt: string; // ISO date string
  updatedAt: string; // ISO date string
  readingTime: number; // minutes
  featured: boolean;
};

// Initial blog posts data - can be extended via API
export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'building-hipaa-compliant-ai-agents',
    title: 'Building HIPAA-Compliant AI Agents for Healthcare',
    subtitle: 'A comprehensive guide to developing secure AI solutions in clinical settings',
    excerpt: 'Learn how to build AI agents that meet HIPAA requirements while delivering powerful clinical capabilities. This guide covers security architecture, data handling, and compliance best practices.',
    content: `## Introduction

Building AI agents for healthcare requires a unique blend of technical expertise and regulatory knowledge. HIPAA compliance isn't just a checkbox—it's a fundamental design principle that must be woven into every aspect of your application.

## Key Security Considerations

### 1. Data Encryption
All Protected Health Information (PHI) must be encrypted both at rest and in transit. This includes:
- Database encryption using AES-256
- TLS 1.3 for all network communications
- Encrypted backups with separate key management

### 2. Access Controls
Implement role-based access control (RBAC) with the principle of least privilege:
- Define clear user roles (clinician, admin, patient)
- Audit all data access
- Implement automatic session timeouts

### 3. Audit Logging
Maintain comprehensive audit logs that capture:
- Who accessed what data
- When the access occurred
- What actions were taken

## Architecture Best Practices

When building healthcare AI agents, consider a layered security architecture:

\`\`\`
┌─────────────────────────────────────┐
│         Application Layer           │
├─────────────────────────────────────┤
│         Security Middleware         │
├─────────────────────────────────────┤
│         Data Access Layer           │
├─────────────────────────────────────┤
│         Encrypted Storage           │
└─────────────────────────────────────┘
\`\`\`

## Conclusion

Building HIPAA-compliant AI agents is challenging but achievable with the right architecture and mindset. Focus on security from day one, and you'll create solutions that are both powerful and trustworthy.`,
    author: {
      name: 'Jeff Bander, MD',
      role: 'Hospitalist & AI Developer',
    },
    coverImage: '/images/blog/hipaa-ai-agents.jpg',
    tags: ['HIPAA', 'AI', 'Security', 'Healthcare', 'Compliance'],
    category: 'Healthcare AI',
    status: 'published',
    publishedAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-01T10:00:00Z',
    readingTime: 8,
    featured: true,
  },
  {
    id: '2',
    slug: 'voice-biomarkers-heart-failure-detection',
    title: 'Voice Biomarkers: The Future of Heart Failure Detection',
    subtitle: 'How AI-powered voice analysis can detect heart failure weeks before symptoms',
    excerpt: 'Explore how subtle changes in voice patterns can predict heart failure exacerbations 2-3 weeks before traditional symptoms appear, enabling proactive intervention.',
    content: `## The Science Behind Voice Biomarkers

Voice is more than just a communication tool—it's a window into our physiological state. When heart failure progresses, fluid accumulation affects the larynx and respiratory system, creating measurable changes in voice characteristics.

## Key Voice Parameters

Our AI system analyzes multiple voice parameters:

- **Pitch variations**: Changes in fundamental frequency
- **Jitter**: Cycle-to-cycle frequency variations
- **Shimmer**: Amplitude variations
- **Breathiness**: Air flow during phonation
- **Speech rate**: Words per minute changes

## Clinical Validation

In our validation study:
- **AUC of 0.82** for predicting exacerbations
- **2-3 week early warning** before symptom onset
- **30% reduction** in hospitalizations with early intervention

## Implementation Architecture

The HeartVoice Monitor uses a simple daily check-in:

1. Patient speaks a standard phrase
2. Audio is processed locally for privacy
3. Features are extracted and compared to baseline
4. Risk score is calculated and trends monitored
5. Alerts are sent to clinicians when thresholds are exceeded

## Future Directions

We're expanding voice biomarker analysis to other conditions:
- COPD exacerbations
- Parkinson's disease progression
- Depression screening
- Medication adherence monitoring`,
    author: {
      name: 'Jeff Bander, MD',
      role: 'Hospitalist & AI Developer',
    },
    coverImage: '/images/blog/voice-biomarkers.jpg',
    tags: ['Voice AI', 'Heart Failure', 'Biomarkers', 'Early Detection', 'Clinical AI'],
    category: 'Case Study',
    status: 'published',
    publishedAt: '2024-11-15T10:00:00Z',
    updatedAt: '2024-11-20T14:30:00Z',
    readingTime: 6,
    featured: true,
  },
  {
    id: '3',
    slug: 'rapid-healthcare-app-development-with-ai',
    title: 'From Idea to Production in 8 Weeks: AI-Assisted Healthcare Development',
    subtitle: 'How a hospitalist built enterprise-grade software using AI coding assistants',
    excerpt: 'Learn the methodology behind building production-ready healthcare applications in record time using AI-assisted development, without compromising on quality or security.',
    content: `## The Challenge

Traditional healthcare software development takes 12-24 months and costs hundreds of thousands of dollars. But with AI coding assistants, a physician with coding knowledge can build enterprise-grade applications in weeks.

## The IRBVer2 Case Study

### Week 1-2: Architecture & Foundation
- Set up Next.js 14 with TypeScript
- Configured PostgreSQL with Prisma ORM
- Implemented authentication with Auth.js
- Deployed to Google Cloud Run

### Week 3-4: Core Features
- Built protocol submission workflow
- Created document management system
- Implemented role-based access control
- Added real-time notifications

### Week 5-6: AI Integration
- Integrated Mistral Vision for document OCR
- Built automated compliance checking
- Created smart form pre-filling
- Added natural language search

### Week 7-8: Polish & Security
- Security audit and penetration testing
- Performance optimization
- User acceptance testing
- Production deployment

## Key Success Factors

1. **Clear requirements**: Know exactly what you're building
2. **Proven patterns**: Use established architectures
3. **AI assistance**: Let AI handle boilerplate
4. **Iterative testing**: Test early and often
5. **Security first**: Build compliance in from day one

## Results

- **Development time**: 8 weeks (vs. 12-24 months traditional)
- **Cost savings**: $50k-200k annually vs. enterprise solutions
- **Time savings**: 60% reduction in submission time
- **PR acceptance rate**: 83.8% with AI-generated code`,
    author: {
      name: 'Jeff Bander, MD',
      role: 'Hospitalist & AI Developer',
    },
    tags: ['AI Development', 'Healthcare', 'Rapid Prototyping', 'Case Study'],
    category: 'Development',
    status: 'published',
    publishedAt: '2024-10-20T10:00:00Z',
    updatedAt: '2024-10-20T10:00:00Z',
    readingTime: 7,
    featured: false,
  },
];

// Helper functions
export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getPublishedPosts(): BlogPost[] {
  return blogPosts
    .filter(post => post.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getFeaturedPosts(): BlogPost[] {
  return getPublishedPosts().filter(post => post.featured);
}

export function getPostsByCategory(category: BlogPost['category']): BlogPost[] {
  return getPublishedPosts().filter(post => post.category === category);
}

export function getPostsByTag(tag: string): BlogPost[] {
  return getPublishedPosts().filter(post =>
    post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  blogPosts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
  return Array.from(tags).sort();
}

export function getAllCategories(): BlogPost['category'][] {
  return ['Healthcare AI', 'Security', 'Development', 'Case Study', 'Tutorial', 'News'];
}
