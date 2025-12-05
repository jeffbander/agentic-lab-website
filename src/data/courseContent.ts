// Healthcare Secure Agentic Coding Course Content
// Comprehensive training for building HIPAA-compliant AI healthcare applications

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  content: string;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

export const courseModules: Module[] = [
  {
    id: 1,
    title: 'Foundation & Setup',
    description: 'Getting started with secure healthcare agentic development',
    lessons: [
      {
        id: '1.1',
        title: 'Course Welcome & Overview',
        duration: '10 min',
        content: `# Welcome to Secure Agentic Coding for Healthcare

## Course Overview

This course teaches you how to build **secure, HIPAA-compliant AI agents** for healthcare applications. You'll learn to harness the power of Large Language Models (LLMs) while protecting patient data and meeting regulatory requirements.

## What You'll Build

By the end of this course, you'll be able to:
- Design secure AI agent architectures for clinical workflows
- Implement HIPAA-compliant data handling patterns
- Integrate safely with EHR systems (Epic, Cerner)
- Deploy production healthcare AI applications

## Prerequisites

- Basic programming knowledge (JavaScript/TypeScript preferred)
- Familiarity with web development concepts
- No prior healthcare IT experience required

## Course Structure

- **10 Modules** covering security fundamentals to production deployment
- **Hands-on labs** with real healthcare scenarios
- **Code examples** you can adapt for your projects
- **Security checklists** for compliance validation

Let's build healthcare AI that patients and providers can trust.`
      },
      {
        id: '1.2',
        title: 'What is Agentic Coding?',
        duration: '15 min',
        content: `# What is Agentic Coding?

## Definition

**Agentic coding** is developing with AI assistants (like Claude, GPT, Copilot) that can:
- Write and modify code autonomously
- Execute commands and run tests
- Make decisions about implementation
- Interact with external systems

## The Agentic Development Workflow

\`\`\`
Human Intent → AI Agent → Code Generation → Execution → Feedback Loop
\`\`\`

### Key Characteristics

1. **Autonomy**: Agent makes implementation decisions
2. **Tool Use**: Agent can run commands, read files, call APIs
3. **Iteration**: Agent refines based on errors/feedback
4. **Context Awareness**: Agent understands project structure

## Healthcare-Specific Considerations

In healthcare, agentic coding requires extra vigilance:

| Concern | Why It Matters |
|---------|---------------|
| PHI in prompts | AI might learn/leak patient data |
| Code execution | Agents could access production databases |
| API calls | Agents might call external services with PHI |
| Logging | AI interactions might be logged with sensitive data |

## Safe Agentic Patterns for Healthcare

\`\`\`typescript
// UNSAFE: Passing PHI directly to AI
const response = await ai.complete(\`
  Patient John Smith, DOB 1985-03-15, has diabetes...
\`);

// SAFE: De-identified prompt
const response = await ai.complete(\`
  A patient with Type 2 diabetes requires medication review...
\`);
\`\`\`

## Key Takeaway

Agentic coding amplifies developer productivity but also amplifies security risks. In healthcare, we must constrain agent capabilities to protect patient safety.`
      },
      {
        id: '1.3',
        title: 'Security-First Mindset',
        duration: '12 min',
        content: `# Security-First Mindset

## The Healthcare Security Imperative

Healthcare data breaches cost an average of **$10.93 million** per incident (IBM 2023)—the highest of any industry. A security-first mindset isn't optional; it's survival.

## Core Principles

### 1. Defense in Depth

Never rely on a single security control:

\`\`\`
[User] → [Auth] → [Authorization] → [Input Validation] → [Encryption] → [Data]
         ↓           ↓                ↓                    ↓
      [Logging]  [Rate Limit]    [Sanitization]      [Audit Trail]
\`\`\`

### 2. Least Privilege

Grant only the minimum access needed:

\`\`\`typescript
// BAD: Overly permissive
const user = { role: 'admin', access: 'all' };

// GOOD: Granular permissions
const user = {
  role: 'nurse',
  access: {
    patients: ['read', 'update-vitals'],
    medications: ['read'],
    billing: [] // No access
  }
};
\`\`\`

### 3. Secure by Default

Systems should be secure out of the box:

\`\`\`typescript
// Default to most restrictive settings
const sessionConfig = {
  timeout: 15 * 60 * 1000,  // 15 minutes (HIPAA requirement)
  secure: true,              // HTTPS only
  httpOnly: true,            // No JS access
  sameSite: 'strict'         // No CSRF
};
\`\`\`

### 4. Fail Securely

When errors occur, fail closed:

\`\`\`typescript
async function getPatientData(patientId: string) {
  try {
    return await database.query(patientId);
  } catch (error) {
    // DON'T: Return partial data or helpful error messages
    // DO: Log internally, return generic error
    logger.error('Database error', { patientId, error });
    throw new Error('Unable to retrieve data');
  }
}
\`\`\`

## Security Mindset Checklist

Before writing any code, ask:
- [ ] What data am I handling? Is it PHI?
- [ ] Who should have access to this?
- [ ] What happens if this fails?
- [ ] Am I logging anything sensitive?
- [ ] Could this be exploited by a malicious user?`
      },
      {
        id: '1.4',
        title: 'Why Healthcare Security Matters',
        duration: '15 min',
        content: `# Why Healthcare Security Matters

## The Stakes Are Real

Healthcare security isn't abstract—it affects real people:

### Patient Harm
- **Medical identity theft**: Fraudulent prescriptions, incorrect medical records
- **Delayed care**: System outages during ransomware attacks
- **Loss of trust**: Patients may avoid seeking care

### Organizational Impact
- **HIPAA fines**: Up to $1.5 million per violation category per year
- **Lawsuits**: Class action suits from affected patients
- **Reputation damage**: Lost patient trust, difficulty recruiting

## Healthcare Breach Statistics (2024)

| Metric | Value |
|--------|-------|
| Average breach cost | $10.93 million |
| Records exposed yearly | 50+ million |
| Most common vector | Phishing (>60%) |
| Average detection time | 280 days |

## Real-World Case Studies

### Case 1: Anthem (2015)
- **Impact**: 78.8 million records stolen
- **Cause**: Phishing email to employee
- **Cost**: $115 million settlement
- **Lesson**: Training and email security critical

### Case 2: Change Healthcare (2024)
- **Impact**: Nationwide pharmacy disruption
- **Cause**: Ransomware attack
- **Cost**: $22 million ransom + billions in damages
- **Lesson**: Supply chain security, backup systems

### Case 3: AI Chatbot Leak (2023)
- **Impact**: Patient conversations exposed
- **Cause**: LLM training on PHI, prompt injection
- **Lesson**: AI requires special security controls

## The Developer's Responsibility

As a healthcare developer, you are a **custodian of patient trust**. Every line of code either strengthens or weakens the security posture.

\`\`\`typescript
// This seemingly simple function has security implications
function formatPatientName(first: string, last: string): string {
  // Are we logging this? (PHI exposure)
  // Is this displayed to unauthorized users? (access control)
  // Is this input sanitized? (injection)
  return \`\${last}, \${first}\`;
}
\`\`\`

## Key Takeaway

Healthcare security isn't a feature—it's a foundation. Build it into every decision from day one.`
      },
      {
        id: '1.5',
        title: 'Development Environment Setup',
        duration: '20 min',
        content: `# Development Environment Setup

## Secure Development Environment

Setting up a healthcare development environment requires additional security considerations.

## Essential Tools

### 1. IDE with Security Extensions

\`\`\`bash
# VS Code recommended extensions
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension streetsidesoftware.code-spell-checker
code --install-extension dbaeumer.vscode-eslint
code --install-extension snyk.snyk-vulnerability-scanner
\`\`\`

### 2. Git Configuration

\`\`\`bash
# Prevent accidental commits of secrets
git config --global core.hooksPath ~/.git-hooks

# Create pre-commit hook for secret scanning
cat > ~/.git-hooks/pre-commit << 'EOF'
#!/bin/bash
# Scan for potential secrets
if git diff --cached | grep -iE "(api_key|password|secret|token|ssn|dob)" > /dev/null; then
  echo "WARNING: Potential sensitive data detected!"
  echo "Review your changes before committing."
  exit 1
fi
EOF
chmod +x ~/.git-hooks/pre-commit
\`\`\`

### 3. Environment Variables

\`\`\`bash
# .env.example (commit this)
DATABASE_URL=postgresql://localhost/dev
OPENAI_API_KEY=your-key-here
FHIR_SERVER_URL=http://localhost:8080/fhir

# .env (NEVER commit - add to .gitignore)
DATABASE_URL=postgresql://user:pass@prod-server/db
OPENAI_API_KEY=sk-actual-key-here
\`\`\`

### 4. .gitignore for Healthcare Projects

\`\`\`gitignore
# Environment and secrets
.env
.env.local
*.pem
*.key
credentials.json

# PHI and test data
/test-data/phi/
*.csv
*.xlsx
patient-*.json

# Logs (may contain PHI)
logs/
*.log

# IDE
.vscode/settings.json
.idea/
\`\`\`

## Project Structure

\`\`\`
healthcare-agent/
├── src/
│   ├── auth/           # Authentication/authorization
│   ├── api/            # API endpoints
│   ├── agents/         # AI agent implementations
│   ├── security/       # Security utilities
│   │   ├── encryption.ts
│   │   ├── sanitization.ts
│   │   └── audit.ts
│   └── utils/
├── tests/
│   ├── security/       # Security-specific tests
│   └── integration/
├── .env.example
├── .gitignore
└── SECURITY.md         # Security documentation
\`\`\`

## TypeScript Configuration

\`\`\`json
{
  "compilerOptions": {
    "strict": true,              // Catch type errors
    "noImplicitAny": true,       // Explicit types required
    "strictNullChecks": true,    // Null safety
    "noUnusedLocals": true,      // Clean code
    "noUnusedParameters": true
  }
}
\`\`\`

## Verification

Run these checks before starting development:

\`\`\`bash
# Verify no secrets in git history
git log --all --full-history -- "*.env" "*.pem" "*.key"

# Verify .gitignore is working
git status --ignored

# Run security audit on dependencies
npm audit
\`\`\`

You're now ready to build secure healthcare applications!`
      }
    ]
  },
  {
    id: 2,
    title: 'Healthcare Security Fundamentals',
    description: 'HIPAA, PHI, and healthcare-specific threats',
    lessons: [
      { id: '2.0', title: 'Common Web Security Threats (OWASP Top 10)', duration: '20 min', content: '' },
      { id: '2.1', title: 'HIPAA Security Rule Deep Dive', duration: '25 min', content: '' },
      { id: '2.2', title: 'Protected Health Information (PHI) Handling', duration: '20 min', content: '' },
      { id: '2.3', title: 'Healthcare Breach Case Studies', duration: '15 min', content: '' },
      { id: '2.4', title: 'Business Associate Agreements (BAA)', duration: '15 min', content: '' },
      { id: '2.5', title: 'State Healthcare Regulations', duration: '12 min', content: '' },
      { id: '2.6', title: 'International Standards (GDPR Health Data)', duration: '15 min', content: '' },
    ]
  },
  {
    id: 3,
    title: 'Secure Prompt Engineering for Healthcare',
    description: 'Building secure AI prompts for clinical applications',
    lessons: [
      { id: '3.1', title: 'Prompt Injection Fundamentals', duration: '18 min', content: '' },
      { id: '3.2', title: 'Healthcare Prompt Security Patterns', duration: '20 min', content: '' },
      { id: '3.3', title: 'PHI Leakage Prevention in Prompts', duration: '22 min', content: '' },
      { id: '3.4', title: 'Input Validation for Medical Queries', duration: '18 min', content: '' },
      { id: '3.5', title: 'Output Sanitization & De-identification', duration: '20 min', content: '' },
      { id: '3.6', title: 'Secure Prompt Templates for Clinical Use', duration: '15 min', content: '' },
    ]
  },
  {
    id: 4,
    title: 'Authentication & Authorization',
    description: 'Identity management in healthcare systems',
    lessons: [
      { id: '4.1', title: 'Healthcare Authentication Requirements', duration: '20 min', content: '' },
      { id: '4.2', title: 'Role-Based Access Control (RBAC) for Clinical Data', duration: '22 min', content: '' },
      { id: '4.3', title: 'OAuth 2.0 & SMART on FHIR', duration: '25 min', content: '' },
      { id: '4.4', title: 'Session Management & Timeout Policies', duration: '18 min', content: '' },
    ]
  },
  {
    id: 5,
    title: 'API Security & EHR Integration',
    description: 'Securing FHIR APIs and EHR connections',
    lessons: [
      { id: '5.1', title: 'FHIR API Security Fundamentals', duration: '25 min', content: '' },
      { id: '5.2', title: 'API Keys & Service Authentication', duration: '20 min', content: '' },
      { id: '5.3', title: 'API Versioning & Deprecation', duration: '15 min', content: '' },
      { id: '5.4', title: 'EHR Integration Security (Epic, Cerner)', duration: '30 min', content: '' },
      { id: '5.5', title: 'Webhook Security for Clinical Events', duration: '18 min', content: '' },
      { id: '5.6', title: 'Rate Limiting for Healthcare APIs', duration: '15 min', content: '' },
    ]
  },
  {
    id: 6,
    title: 'Database & PHI Storage Security',
    description: 'Protecting healthcare data at rest',
    lessons: [
      { id: '6.1', title: 'Healthcare Database Security Principles', duration: '20 min', content: '' },
      { id: '6.2', title: 'PHI Encryption at Rest', duration: '22 min', content: '' },
      { id: '6.3', title: 'SQL Injection Prevention in Clinical Apps', duration: '18 min', content: '' },
      { id: '6.4', title: 'HIPAA Audit Logging Requirements', duration: '20 min', content: '' },
    ]
  },
  {
    id: 7,
    title: 'Frontend Security for Patient Portals',
    description: 'Securing patient-facing applications',
    lessons: [
      { id: '7.1', title: 'Frontend Security Architecture', duration: '22 min', content: '' },
      { id: '7.2', title: 'XSS Prevention in Patient Portals', duration: '20 min', content: '' },
      { id: '7.3', title: 'Secure Browser Storage for Health Data', duration: '18 min', content: '' },
      { id: '7.4', title: 'Third-Party Code Security & Supply Chain', duration: '20 min', content: '' },
    ]
  },
  {
    id: 8,
    title: 'Security Testing & HIPAA Compliance',
    description: 'Validating healthcare application security',
    lessons: [
      { id: '8.1', title: 'Healthcare Security Testing Methodology', duration: '25 min', content: '' },
      { id: '8.2', title: 'Automated Security Scanning for HIPAA', duration: '20 min', content: '' },
      { id: '8.3', title: 'Penetration Testing Healthcare Apps', duration: '22 min', content: '' },
      { id: '8.4', title: 'Security Monitoring & Incident Response', duration: '25 min', content: '' },
    ]
  },
  {
    id: 9,
    title: 'DevSecOps for Healthcare',
    description: 'CI/CD security for compliant deployments',
    lessons: [
      { id: '9.1', title: 'Secure CI/CD Pipelines', duration: '22 min', content: '' },
      { id: '9.2', title: 'Container Security for Healthcare', duration: '20 min', content: '' },
      { id: '9.3', title: 'Infrastructure as Code Security', duration: '18 min', content: '' },
      { id: '9.4', title: 'Compliance-as-Code', duration: '20 min', content: '' },
    ]
  },
  {
    id: 10,
    title: 'Building Secure Healthcare Agents',
    description: 'Capstone: End-to-end secure agentic system',
    lessons: [
      { id: '10.1', title: 'Architecture Review for Healthcare Agents', duration: '25 min', content: '' },
      { id: '10.2', title: 'Security Checklist & Go-Live', duration: '20 min', content: '' },
      { id: '10.3', title: 'Ongoing Compliance Monitoring', duration: '18 min', content: '' },
    ]
  },
];

// HIPAA Reference Data
export const hipaaCompliance = {
  phiIdentifiers: [
    'Names',
    'Geographic data (smaller than state)',
    'Dates (except year) related to individual',
    'Phone numbers',
    'Fax numbers',
    'Email addresses',
    'Social Security numbers',
    'Medical record numbers',
    'Health plan beneficiary numbers',
    'Account numbers',
    'Certificate/license numbers',
    'Vehicle identifiers and serial numbers',
    'Device identifiers and serial numbers',
    'Web URLs',
    'IP addresses',
    'Biometric identifiers',
    'Full-face photographs',
    'Any other unique identifying number'
  ],
  securityRule: {
    administrative: [
      'Security management process',
      'Assigned security responsibility',
      'Workforce security',
      'Information access management',
      'Security awareness training',
      'Security incident procedures',
      'Contingency plan',
      'Evaluation',
      'Business associate contracts'
    ],
    physical: [
      'Facility access controls',
      'Workstation use policies',
      'Workstation security',
      'Device and media controls'
    ],
    technical: [
      'Access control',
      'Audit controls',
      'Integrity controls',
      'Person or entity authentication',
      'Transmission security'
    ]
  }
};
