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
    id: '5',
    slug: 'vibe-ai-healthcare-coding-class-launches',
    title: 'Introducing the Vibe AI Healthcare Coding Class: Training the Next Generation of Clinician-Developers',
    subtitle: 'A hands-on program teaching physicians and healthcare professionals to build secure AI applications',
    excerpt: 'The MSW Agentic Lab launches its inaugural Vibe AI Healthcare Coding Class—an intensive program designed to empower clinicians with the skills to build production-ready, HIPAA-compliant AI applications using modern agentic development techniques.',
    content: `## A New Era of Clinician-Led Innovation

The future of healthcare software belongs to those who understand both medicine and technology. That's why the Mount Sinai West Agentic Coding Laboratory is proud to announce the launch of our **Vibe AI Healthcare Coding Class**—a comprehensive training program designed specifically for healthcare professionals who want to build the tools they've always wished existed.

## Why This Program Exists

Every day, clinicians encounter workflow inefficiencies, documentation burdens, and communication gaps that slow down patient care. Traditional software development cycles take years and often miss the mark because developers don't fully understand clinical workflows.

**What if clinicians could build their own solutions?**

That's exactly what this program enables. By combining AI-assisted development techniques with healthcare-specific security and compliance training, we're creating a new breed of clinician-developers who can:

- Identify clinical pain points with domain expertise
- Prototype solutions in days, not months
- Build HIPAA-compliant applications from day one
- Deploy and iterate based on real-world feedback

## Program Curriculum

### Module 1: Foundations of Agentic Development (Week 1-2)

Participants learn the fundamentals of AI-augmented coding:

- **Understanding AI coding assistants**: How to effectively prompt and collaborate with AI
- **Development environment setup**: VS Code, Claude Code, GitHub Copilot integration
- **Version control basics**: Git workflows for healthcare projects
- **TypeScript & React fundamentals**: Building modern web interfaces

### Module 2: Healthcare-Specific Security (Week 3-4)

Security isn't optional in healthcare—it's foundational:

- **HIPAA technical safeguards**: Encryption, access controls, audit logging
- **Secure architecture patterns**: Designing systems that protect PHI by default
- **Authentication & authorization**: Implementing RBAC for clinical applications
- **Compliance documentation**: Creating audit-ready security documentation

### Module 3: Building Clinical Applications (Week 5-6)

Hands-on development of real healthcare tools:

- **EHR integration patterns**: Working with FHIR and clinical data standards
- **Clinical decision support**: Building AI-powered recommendation systems
- **Voice AI for healthcare**: Creating HIPAA-compliant voice interfaces
- **Workflow automation**: Streamlining administrative tasks

### Module 4: Deployment & Operations (Week 7-8)

Taking applications from prototype to production:

- **Cloud deployment**: Netlify, Google Cloud, AWS for healthcare
- **Monitoring & observability**: Tracking application health and usage
- **Incident response**: Handling security events and outages
- **Continuous improvement**: Iterating based on user feedback

## Who Should Apply

This program is designed for:

- **Physicians and residents** interested in health tech innovation
- **Nurses and clinical staff** who want to automate workflows
- **Healthcare administrators** seeking to build operational tools
- **Clinical informaticists** looking to expand their technical skills
- **Medical students** preparing for a technology-enabled future

No prior coding experience is required—just curiosity, clinical expertise, and a willingness to learn.

## What Graduates Will Build

By the end of the program, each participant will have:

1. **A production-ready application** solving a real clinical problem
2. **A portfolio of projects** demonstrating healthcare AI competency
3. **Certification** in HIPAA-compliant AI development
4. **Access to the MSW Agentic Lab community** for ongoing collaboration

### Example Graduate Projects

- **Smart Handoff Tool**: AI-powered patient handoff documentation
- **Prior Auth Assistant**: Automated insurance authorization workflows
- **Clinical Trial Matcher**: Patient-trial eligibility screening
- **Discharge Planning Bot**: Coordinated care transition management

## The Agentic Advantage

What makes this program different from traditional coding bootcamps?

**1. Healthcare-First Curriculum**
Every example, exercise, and project is grounded in clinical reality. No generic todo apps here—you'll build tools that actually matter for patient care.

**2. AI-Augmented Learning**
We don't just teach you to code—we teach you to collaborate with AI. This multiplies your productivity and lets you focus on clinical logic rather than syntax.

**3. Security by Design**
HIPAA compliance isn't an afterthought. From day one, you'll learn to build systems that protect patient data by default.

**4. Clinician Instructors**
Our instructors are practicing physicians who've built production healthcare software. They understand your challenges because they've lived them.

## Program Details

- **Format**: Hybrid (in-person sessions at Mount Sinai West + virtual components)
- **Duration**: 8 weeks, part-time (10-15 hours/week)
- **Cohort Size**: Limited to 20 participants for personalized instruction
- **Prerequisites**: Active healthcare role or enrollment in health professions program

## Join the Movement

The gap between clinical needs and technical solutions has never been wider—but it doesn't have to stay that way. With the right training, clinicians can become the builders of tomorrow's healthcare technology.

**The best healthcare software will be built by those who understand healthcare best.**

Ready to transform your clinical insights into working applications? The next cohort of the Vibe AI Healthcare Coding Class is forming now.

---

*Interested in learning more? Contact the MSW Agentic Lab team or visit our website for application details.*

**Build the tools you've always wanted. Join the Vibe AI Healthcare Coding Class.**`,
    author: {
      name: 'Jeff Bander, MD',
      role: 'Hospitalist & AI Developer',
    },
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=630&fit=crop',
    tags: ['Education', 'Healthcare AI', 'Coding Class', 'Clinician-Developer', 'Training', 'HIPAA'],
    category: 'News',
    status: 'published',
    publishedAt: '2025-11-18T10:00:00Z',
    updatedAt: '2025-11-18T10:00:00Z',
    readingTime: 9,
    featured: true,
  },
  {
    id: '4',
    slug: 'beyond-vibe-coding-agentic-clinician-led-ai',
    title: "Beyond 'Vibe Coding': Why Agentic, Clinician-Led AI Is the Future of Secure Healthcare Software",
    subtitle: 'Why Agentic, Clinician-Led AI Is the Future of Secure Healthcare Software',
    excerpt: 'In healthcare, software is never just software. Every line of code has the potential to influence a clinical decision. Learn why "vibe coding" is dangerous in healthcare and how the MSW Agentic Lab is building a safer alternative.',
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

Consider a hypothetical example:
An AI is prompted to "build a sepsis prediction tool using EHR data." If the underlying references are outdated, or if the data schema does not distinguish between preliminary and finalized labs, the resulting system may appear functional while silently introducing clinical risk.

This is not malicious behavior—it is **unconstrained automation**.

In clinical environments, we do not tolerate this from humans. We should not tolerate it from machines.

## The Agentic Alternative: Planning Before Coding

At MSW Agentic Lab, we start from a different assumption: **AI should never be the first or final decision-maker in healthcare software development.**

Instead, we use agentic AI systems—collections of specialized AI agents that operate within a defined workflow, each with a narrow, auditable responsibility. Before any code is written, these agents enter a structured planning phase, guided by clinician-developers.

During planning, agents:

- Review clinical guidelines and identify authoritative sources
- Analyze EHR schemas and data provenance
- Surface ambiguity, missing inputs, and assumptions
- Generate explicit technical and clinical specifications

Only once this plan is reviewed and validated by a clinician does implementation begin.

This mirrors clinical practice itself: **assess, plan, act, monitor.**

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
    coverImage: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=1200&h=630&fit=crop',
    tags: ['Agentic AI', 'Healthcare', 'Vibe Coding', 'Clinical AI', 'Security', 'HIPAA', 'Software Development'],
    category: 'Healthcare AI',
    status: 'published',
    publishedAt: '2025-12-10T10:00:00Z',
    updatedAt: '2025-12-10T10:00:00Z',
    readingTime: 10,
    featured: true,
  },
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
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=630&fit=crop',
    tags: ['HIPAA', 'AI', 'Security', 'Healthcare', 'Compliance'],
    category: 'Healthcare AI',
    status: 'published',
    publishedAt: '2025-10-15T10:00:00Z',
    updatedAt: '2025-10-15T10:00:00Z',
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
    coverImage: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&h=630&fit=crop',
    tags: ['Voice AI', 'Heart Failure', 'Biomarkers', 'Early Detection', 'Clinical AI'],
    category: 'Case Study',
    status: 'published',
    publishedAt: '2025-09-20T10:00:00Z',
    updatedAt: '2025-09-25T14:30:00Z',
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
    coverImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=630&fit=crop',
    tags: ['AI Development', 'Healthcare', 'Rapid Prototyping', 'Case Study'],
    category: 'Development',
    status: 'published',
    publishedAt: '2025-08-12T10:00:00Z',
    updatedAt: '2025-08-12T10:00:00Z',
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
