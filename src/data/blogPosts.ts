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
    id: '4',
    slug: 'beyond-vibe-coding-agentic-clinician-led-ai',
    title: "Beyond 'Vibe Coding': Why Agentic, Clinician-Led AI Is the Future of Secure Healthcare Software",
    subtitle: 'Why Agentic, Clinician-Led AI Is the Future of Secure Healthcare Software',
    excerpt: 'In healthcare, software is never just software. Every line of code can influence a clinical decision. Learn why "vibe coding" is dangerous and how the MSW Agentic Lab builds safer, clinician-led AI.',
    content: `In healthcare, software is never just software.

Every line of code has the potential to influence a clinical decision, shape a workflow, or affect a patient's outcome. As artificial intelligence becomes increasingly embedded in how healthcare tools are built, the methods we use to create those tools matter more than ever.

Recently, a trend sometimes referred to as "vibe coding" has gained attention in the broader tech community. The idea is simple: provide an AI system with a high-level prompt, let it generate code end-to-end, and trust that it will work itself out. In consumer or experimental settings, this may feel fast, creative, and even magical.

**In healthcare, it is dangerous.**

At the Mount Sinai West (MSW) Agentic Coding Laboratory, part of the Mount Sinai Health System, we are building a different future—one grounded in clinical accountability, security, and structured intelligence. We call this approach **agentic, AI-augmented coding**: a clinician-led model that pairs medical expertise with carefully orchestrated AI agents to produce secure, production-grade healthcare software.

This is not about replacing clinicians or engineers. It is about building systems where AI works under supervision, within guardrails, and in service of patient care.

## Why "Vibe Coding" Fails in Healthcare

"Vibe coding" captures a real temptation: delegate complexity to AI and move fast. But healthcare is not a sandbox.

AI systems do not inherently understand:

- Which clinical guidelines are authoritative
- Which data fields are incomplete, unreliable, or delayed
- Where regulatory boundaries lie
- When uncertainty should halt execution rather than be smoothed over

A large language model will confidently proceed even when inputs are flawed. It does not pause to question whether a guideline is outdated, whether a lab value is missing due to hemolysis, or whether an edge case could cause harm. In healthcare, this behavior is unacceptable.

Consider a hypothetical example: An AI is prompted to "build a sepsis prediction tool using EHR data." If the underlying references are outdated, or if the data schema does not distinguish between preliminary and finalized labs, the resulting system may appear functional while silently introducing clinical risk.

This is not malicious behavior—it is **unconstrained automation**. In clinical environments, we do not tolerate this from humans. We should not tolerate it from machines.

## The Agentic Alternative: Planning Before Coding

At MSW Agentic Lab, we start from a different assumption: **AI should never be the first or final decision-maker in healthcare software development.**

Instead, we use agentic AI systems—collections of specialized AI agents that operate within a defined workflow, each with a narrow, auditable responsibility. Before any code is written, these agents enter a structured planning phase, guided by clinician-developers.

During planning, agents:

- Review clinical guidelines and identify authoritative sources
- Analyze EHR schemas and data provenance
- Surface ambiguity, missing inputs, and assumptions
- Generate explicit technical and clinical specifications

Only once this plan is reviewed and validated by a clinician does implementation begin. This mirrors clinical practice itself: **assess, plan, act, monitor.**

## Our Six-Phase Agentic Development Model

The MSW Agentic Lab follows a repeatable, healthcare-specific development lifecycle designed to balance speed with safety:

### 1. Requirements & Clinical Planning (2–3 days)
AI agents translate clinical needs into technical specifications while explicitly documenting assumptions, risks, and exclusions.

### 2. Secure Development Setup (1 day)
Project scaffolding is generated with security, access controls, and auditability built in from the start.

### 3. Core Development (3–4 weeks)
AI agents generate features incrementally while physician-developers review logic, validate outputs, and adjust clinical reasoning.

### 4. Integration & Testing (1–2 weeks)
Agents generate unit tests, integration tests, and failure scenarios—including missing data and edge cases common in real EHRs.

### 5. Deployment & Compliance (3–5 days)
Infrastructure is configured with HIPAA-aligned logging, encryption, and role-based access.

### 6. Monitoring & Iteration (Ongoing)
Post-deployment, agents analyze usage patterns and surface safety, bias, or workflow concerns for clinician review.

This model has delivered:

- **~84% AI-generated code**
- **~58% reduction in development time**
- **Six-figure annual cost savings per application**

More importantly, it produces systems clinicians trust.

## What We've Built at the MSW Agentic Lab

This methodology is not theoretical. It is already producing real tools inside healthcare.

### HeartVoice Monitor
An AI system that analyzes subtle changes in patient voice patterns to detect heart failure exacerbations weeks before symptoms appear—allowing earlier intervention and fewer hospitalizations.

### IRBVer2
A clinician-built, AI-powered IRB management system developed in eight weeks, replacing expensive enterprise tools and accelerating clinical research workflows.

### HIPAA-Compliant Voice AI Agents
Secure voice systems for patient interaction that respect privacy, log access, and integrate safely with clinical systems.

### Automated Clinical Trial Enrollment
Agentic workflows that screen patients for eligibility while documenting rationale and exclusions—critical for ethical research oversight.

Each of these tools was built with clinicians in the loop, security by design, and AI as an assistant—not an authority.

## Security and Trust: The Role of Model Context Protocols

Healthcare software cannot rely on informal data access or opaque prompts.

At MSW Agentic Lab, we use **Model Context Protocols (MCPs)** to define how AI agents interact with sensitive data. MCPs ensure:

- Explicit scoping of accessible data
- Encrypted, auditable access paths
- Reproducible decision contexts
- Clear separation between reasoning and execution

These protocols function like clinical checklists for AI—preventing silent overreach and ensuring accountability.

## The Future: Clinicians as Builders, AI as Infrastructure

The most important shift we are seeing is cultural.

Clinicians are no longer passive recipients of software built elsewhere. With agentic, AI-augmented coding, they become active architects of the tools they use, while AI handles the mechanical complexity.

This does not lower standards—it raises them.

The future of healthcare innovation is not fast prompts and blind trust. It is **structured intelligence, clinician oversight, and secure systems** designed for real patients in real hospitals.

At the MSW Agentic Coding Lab, we are building that future—one carefully planned line of code at a time.

---

Learn more about our work: [MSW Agentic Lab](https://mswagenticlab.netlify.app)

**The future of healthcare software isn't a vibe. It's a plan.**`,
    author: {
      name: 'Jeff Bander, MD',
      role: 'Hospitalist & AI Developer',
    },
    coverImage: '/images/blog/beyond-vibe-coding.svg',
    tags: ['Agentic AI', 'Healthcare', 'Vibe Coding', 'Clinical AI', 'Security', 'HIPAA', 'Software Development'],
    category: 'Healthcare AI',
    status: 'published',
    publishedAt: '2024-12-14T10:00:00Z',
    updatedAt: '2024-12-14T10:00:00Z',
    readingTime: 10,
    featured: true,
  },
  {
    id: '1',
    slug: 'building-hipaa-compliant-ai-agents',
    title: 'Building HIPAA-Compliant AI Agents for Healthcare',
    subtitle: 'A comprehensive guide to developing secure AI solutions in clinical settings',
    excerpt: 'Build AI agents that are HIPAA-ready from day one. This guide covers encryption, access controls, auditability, and architecture patterns that keep PHI safe without slowing teams down.',
    content: `## Introduction

Building AI agents for healthcare requires a unique blend of technical expertise and regulatory knowledge. HIPAA compliance isn't just a checkbox—it's a fundamental design principle that must be woven into every aspect of your application.

The most resilient teams treat compliance like a product feature: well-documented, testable, and observable. That mindset keeps clinicians confident and security teams aligned.

## Key Security Considerations

### 1) Data Encryption
All Protected Health Information (PHI) must be encrypted both at rest and in transit. This includes:
- Database encryption using AES-256 or better
- TLS 1.3 for every network hop, including internal service-to-service calls
- Encrypted backups with separate key management and rotation policies

### 2) Access Controls
Implement role-based access control (RBAC) with the principle of least privilege:
- Define clear user roles (clinician, admin, patient, service agent)
- Use short-lived tokens and enforced session timeouts
- Require MFA for privileged actions and administrative changes

### 3) Audit Logging
Maintain comprehensive audit logs that capture:
- Who accessed which record
- What action was taken and why
- When the access occurred and from where
- Whether PHI left a controlled boundary

Store logs in a tamper-evident destination and surface dashboards so clinicians can see how data is used.

## Architecture Best Practices

When building healthcare AI agents, consider a layered security architecture:

```
[ Application & Agent Layer ]
[ Security Middleware (RBAC, DLP) ]
[ Data Access + Context Isolation ]
[ Encrypted Storage + Key Management ]
```

Pair this stack with **model context protocols (MCPs)** to tightly scope what an agent can see. MCPs give you:

- A predictable interface for PHI access
- Context-aware redaction and masking
- Reusable audit hooks for every call

## Operational Checklist

- Run static analysis and dependency checks before each deploy
- Require infrastructure-as-code so security baselines are versioned
- Create tabletop exercises for incident response that include your AI agents
- Provide clinicians with a clear "why was this decision made" trace linked to audit events

## Conclusion

Building HIPAA-compliant AI agents is challenging but achievable with the right architecture and mindset. Focus on security from day one, and you'll create solutions that are both powerful and trustworthy.`,
    author: {
      name: 'Jeff Bander, MD',
      role: 'Hospitalist & AI Developer',
    },
    coverImage: '/images/blog/hipaa-ai-agents.svg',
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
    excerpt: 'Subtle shifts in pitch, shimmer, and speech rate can flag heart failure risk weeks before symptoms. See how clinician-led voice analytics deliver privacy-first monitoring and meaningful alerts.',
    content: `## The Science Behind Voice Biomarkers

Voice is more than just a communication tool—it's a window into our physiological state. When heart failure progresses, fluid accumulation affects the larynx and respiratory system, creating measurable changes in voice characteristics.

## Key Voice Parameters

Our AI system analyzes multiple voice parameters:

- **Pitch variations**: Changes in fundamental frequency
- **Jitter**: Cycle-to-cycle frequency variations
- **Shimmer**: Amplitude variations
- **Breathiness**: Air flow during phonation
- **Speech rate**: Words per minute changes

These signals are compared against a personal baseline, not a generic average. That makes the alerts patient-specific and clinically defensible.

## Clinical Validation

In our validation study:
- **AUC of 0.82** for predicting exacerbations
- **2–3 week early warning** before symptom onset
- **30% reduction** in hospitalizations with early intervention

## Implementation Architecture

The HeartVoice Monitor uses a simple daily check-in:

1. Patient speaks a standard phrase
2. Audio is processed locally for privacy
3. Features are extracted and compared to baseline
4. Risk score is calculated and trends monitored
5. Alerts are sent to clinicians when thresholds are exceeded

We log every decision so clinicians can review which features drove the alert and how the trend evolved over time.

## Future Directions

We're expanding voice biomarker analysis to other conditions:
- COPD exacerbations
- Parkinson's disease progression
- Depression screening
- Medication adherence monitoring

The goal is simple: proactive, privacy-preserving monitoring that keeps clinicians in control.`,
    author: {
      name: 'Jeff Bander, MD',
      role: 'Hospitalist & AI Developer',
    },
    coverImage: '/images/blog/voice-biomarkers.svg',
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
    excerpt: 'Learn the exact cadence we used to build IRBVer2 in eight weeks—from secure scaffolding to AI-assisted workflows—while keeping clinicians in the loop.',
    content: `## The Challenge

Traditional healthcare software development takes 12–24 months and costs hundreds of thousands of dollars. But with AI coding assistants, a physician with coding knowledge can build enterprise-grade applications in weeks.

## The IRBVer2 Case Study

### Week 1–2: Architecture & Foundation
- Set up Next.js 14 with TypeScript and hardened defaults
- Configured PostgreSQL with Prisma ORM and row-level security
- Implemented authentication with Auth.js plus audit trails
- Deployed a minimal slice to Google Cloud Run for early feedback

### Week 3–4: Core Features
- Built protocol submission workflow with reviewer queues
- Created document management with checksum validation
- Implemented role-based access control and granular permissions
- Added real-time notifications with structured event logs

### Week 5–6: AI Integration
- Integrated Mistral Vision for document OCR and redaction checks
- Built automated compliance checking with clinician-tuned rules
- Created smart form pre-filling tied to MCP-scoped data access
- Added natural language search with guardrails on PHI exposure

### Week 7–8: Polish & Security
- Security audit, penetration testing, and dependency review
- Performance optimization with caching and query plans
- User acceptance testing with clinical reviewers
- Production deployment, runbooks, and on-call playbooks

## Key Success Factors

1. **Clear requirements**: Know exactly what you're building and who it serves
2. **Proven patterns**: Use established architectures and code generation only where safe
3. **AI assistance**: Let AI handle boilerplate while humans own clinical logic
4. **Iterative testing**: Test early, test edge cases, and automate regression checks
5. **Security first**: Build compliance in from day one, not as a retrofit

## Results

- **Development time**: 8 weeks (vs. 12–24 months traditional)
- **Cost savings**: $50k–$200k annually vs. enterprise solutions
- **Time savings**: 60% reduction in submission time
- **PR acceptance rate**: 83.8% with AI-generated code

Fast delivery is only valuable when the result is trustworthy. Agentic workflows made it possible to move quickly without losing clinical rigor.`,
    coverImage: '/images/blog/rapid-agentic-delivery.svg',
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
