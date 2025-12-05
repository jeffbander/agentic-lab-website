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
      {
        id: '2.0',
        title: 'Common Web Security Threats (OWASP Top 10)',
        duration: '20 min',
        content: `# Common Web Security Threats (OWASP Top 10)

## Introduction

Before diving into healthcare-specific security, you need to understand the foundational web security threats. The OWASP Top 10 represents the most critical security risks to web applications.

## OWASP Top 10 (2021)

### 1. Broken Access Control (A01)

Users acting outside their intended permissions.

\`\`\`typescript
// VULNERABLE: No authorization check
app.get('/api/patient/:id', async (req, res) => {
  const patient = await db.getPatient(req.params.id);
  res.json(patient); // Any user can access any patient!
});

// SECURE: Verify access rights
app.get('/api/patient/:id', async (req, res) => {
  const patient = await db.getPatient(req.params.id);
  if (!canUserAccessPatient(req.user, patient)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  res.json(patient);
});
\`\`\`

### 2. Cryptographic Failures (A02)

Exposing sensitive data due to weak or missing encryption.

\`\`\`typescript
// VULNERABLE: Storing passwords in plaintext
await db.createUser({ email, password: rawPassword });

// SECURE: Hash passwords with bcrypt
import bcrypt from 'bcrypt';
const hashedPassword = await bcrypt.hash(rawPassword, 12);
await db.createUser({ email, password: hashedPassword });
\`\`\`

### 3. Injection (A03)

Untrusted data sent to an interpreter as part of a command.

\`\`\`typescript
// VULNERABLE: SQL Injection
const query = \`SELECT * FROM patients WHERE name = '\${userInput}'\`;

// SECURE: Parameterized queries
const query = 'SELECT * FROM patients WHERE name = $1';
await db.query(query, [userInput]);
\`\`\`

### 4. Insecure Design (A04)

Missing or ineffective security controls in the design phase.

**Healthcare Example**: Designing a patient portal without considering:
- Session timeout requirements
- Break-the-glass audit procedures
- Minimum necessary access principle

### 5. Security Misconfiguration (A05)

\`\`\`typescript
// VULNERABLE: Debug mode in production
app.use(express.errorHandler({ dumpExceptions: true }));

// SECURE: Generic errors in production
if (process.env.NODE_ENV === 'production') {
  app.use((err, req, res, next) => {
    logger.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });
}
\`\`\`

### 6. Vulnerable Components (A06)

Using libraries with known vulnerabilities.

\`\`\`bash
# Check for vulnerabilities regularly
npm audit
npm audit fix

# Use automated scanning in CI/CD
npx snyk test
\`\`\`

### 7. Authentication Failures (A07)

\`\`\`typescript
// SECURE: Implement proper authentication
const authConfig = {
  passwordMinLength: 12,
  requireMFA: true,
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  sessionTimeout: 15 * 60 * 1000   // HIPAA requirement
};
\`\`\`

### 8. Software & Data Integrity Failures (A08)

\`\`\`typescript
// SECURE: Verify integrity of external resources
<script
  src="https://cdn.example.com/lib.js"
  integrity="sha384-abc123..."
  crossorigin="anonymous"
></script>
\`\`\`

### 9. Security Logging & Monitoring Failures (A09)

\`\`\`typescript
// SECURE: Log security-relevant events
logger.audit({
  event: 'PATIENT_RECORD_ACCESS',
  userId: req.user.id,
  patientId: patient.id,
  timestamp: new Date().toISOString(),
  ip: req.ip,
  success: true
});
\`\`\`

### 10. Server-Side Request Forgery (A10)

\`\`\`typescript
// VULNERABLE: User controls URL
const response = await fetch(userProvidedUrl);

// SECURE: Allowlist valid URLs
const ALLOWED_HOSTS = ['api.trusted-service.com'];
const url = new URL(userProvidedUrl);
if (!ALLOWED_HOSTS.includes(url.host)) {
  throw new Error('Invalid URL');
}
\`\`\`

## Healthcare Impact

Each OWASP vulnerability has amplified consequences in healthcare:

| Vulnerability | Healthcare Impact |
|--------------|-------------------|
| Broken Access Control | Unauthorized PHI access |
| Cryptographic Failures | PHI exposure, HIPAA violation |
| Injection | Database compromise, data theft |
| Insecure Design | Systemic compliance failures |

## Key Takeaway

Master these fundamentals before tackling healthcare-specific security. Every healthcare breach starts with a basic security failure.`
      },
      {
        id: '2.1',
        title: 'HIPAA Security Rule Deep Dive',
        duration: '25 min',
        content: `# HIPAA Security Rule Deep Dive

## What is HIPAA?

The **Health Insurance Portability and Accountability Act (1996)** establishes national standards for protecting sensitive patient health information.

## The Three HIPAA Rules

1. **Privacy Rule**: Who can access PHI and for what purposes
2. **Security Rule**: Technical safeguards for electronic PHI (ePHI)
3. **Breach Notification Rule**: Requirements when breaches occur

## Security Rule Safeguards

### Administrative Safeguards (§164.308)

| Requirement | Developer Responsibility |
|------------|-------------------------|
| Security Management Process | Implement security controls, conduct risk assessments |
| Workforce Security | Role-based access control (RBAC) |
| Information Access Management | Minimum necessary access |
| Security Awareness Training | Build secure code, document security features |
| Security Incident Procedures | Implement logging, alerting |
| Contingency Plan | Backup systems, disaster recovery |

### Physical Safeguards (§164.310)

| Requirement | Developer Responsibility |
|------------|-------------------------|
| Facility Access Controls | Secure server rooms, cloud security |
| Workstation Security | Session timeouts, screen locks |
| Device and Media Controls | Secure data disposal, encryption |

### Technical Safeguards (§164.312)

| Requirement | Implementation |
|------------|---------------|
| Access Control | Unique user IDs, automatic logoff, encryption |
| Audit Controls | Comprehensive logging of all PHI access |
| Integrity | Hash verification, checksums |
| Authentication | MFA, strong passwords |
| Transmission Security | TLS 1.2+, encrypted APIs |

## Required vs Addressable

HIPAA distinguishes between:

- **Required (R)**: Must be implemented
- **Addressable (A)**: Implement if reasonable; document if not

\`\`\`typescript
// REQUIRED: Unique user identification
const user = {
  id: 'usr_unique_id_12345',
  email: 'doctor@hospital.com'
};

// REQUIRED: Automatic logoff
const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes

// ADDRESSABLE: Encryption (but you should always do it)
const encryptedPHI = encrypt(patientData, AES_256_KEY);
\`\`\`

## Audit Control Requirements

\`\`\`typescript
interface HIPAAAuditLog {
  // WHO
  userId: string;
  userRole: string;

  // WHAT
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
  resourceType: 'Patient' | 'Observation' | 'Medication';
  resourceId: string;

  // WHEN
  timestamp: string; // ISO 8601

  // WHERE
  ipAddress: string;
  userAgent: string;

  // WHY (if applicable)
  reason?: string; // For break-the-glass access

  // OUTCOME
  success: boolean;
  errorCode?: string;
}

// Log every PHI access
async function logAccess(log: HIPAAAuditLog) {
  // Logs must be immutable and retained 6 years
  await auditDatabase.insert(log);
}
\`\`\`

## Session Timeout Implementation

\`\`\`typescript
// HIPAA requires automatic logoff after inactivity
const sessionConfig = {
  cookie: {
    maxAge: 15 * 60 * 1000,  // 15-minute session
    secure: true,            // HTTPS only
    httpOnly: true,          // No JavaScript access
    sameSite: 'strict'       // CSRF protection
  }
};

// Client-side warning before logout
let inactivityTimer: NodeJS.Timeout;

function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    showWarning('Session expiring in 2 minutes');
    setTimeout(logout, 2 * 60 * 1000);
  }, 13 * 60 * 1000); // Warn at 13 minutes
}
\`\`\`

## Penalty Tiers

| Tier | Violation Type | Penalty per Violation |
|------|---------------|----------------------|
| 1 | Unknowing | $100 - $50,000 |
| 2 | Reasonable Cause | $1,000 - $50,000 |
| 3 | Willful Neglect (Corrected) | $10,000 - $50,000 |
| 4 | Willful Neglect (Not Corrected) | $50,000+ |

**Annual cap**: $1.5 million per violation category

## Key Takeaway

HIPAA isn't just about avoiding fines—it's about protecting patients. Design your systems with HIPAA requirements from day one, not as an afterthought.`
      },
      {
        id: '2.2',
        title: 'Protected Health Information (PHI) Handling',
        duration: '20 min',
        content: `# Protected Health Information (PHI) Handling

## What is PHI?

**Protected Health Information (PHI)** is any health information that:
1. Is created or received by a covered entity
2. Relates to health condition, treatment, or payment
3. Identifies (or could identify) an individual

## The 18 HIPAA Identifiers

Any of these combined with health information creates PHI:

| # | Identifier | Example |
|---|-----------|---------|
| 1 | Names | John Smith |
| 2 | Geographic data < state | 123 Main St, NYC 10001 |
| 3 | Dates (except year) | DOB: March 15 |
| 4 | Phone numbers | 555-123-4567 |
| 5 | Fax numbers | 555-123-4568 |
| 6 | Email addresses | john@email.com |
| 7 | SSN | 123-45-6789 |
| 8 | Medical record numbers | MRN-001234 |
| 9 | Health plan IDs | BCBS-9876543 |
| 10 | Account numbers | ACC-11111 |
| 11 | Certificate/license numbers | MD-12345 |
| 12 | Vehicle identifiers | VIN, plates |
| 13 | Device identifiers | Pacemaker serial |
| 14 | Web URLs | patient-portal.com/john |
| 15 | IP addresses | 192.168.1.100 |
| 16 | Biometric IDs | Fingerprints, retina |
| 17 | Full-face photos | Profile pictures |
| 18 | Any unique identifier | Custom patient IDs |

## PHI Detection in Code

\`\`\`typescript
// Patterns to detect potential PHI
const PHI_PATTERNS = {
  ssn: /\\b\\d{3}-\\d{2}-\\d{4}\\b/,
  phone: /\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b/,
  email: /\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b/,
  dob: /\\b(0[1-9]|1[0-2])\\/(0[1-9]|[12]\\d|3[01])\\/(19|20)\\d{2}\\b/,
  mrn: /\\bMRN[-:]?\\s*\\d+\\b/i,
  zipCode: /\\b\\d{5}(-\\d{4})?\\b/
};

function containsPHI(text: string): boolean {
  return Object.values(PHI_PATTERNS).some(pattern => pattern.test(text));
}

// Use before logging or sending to external services
function sanitizeForLogging(data: any): any {
  const stringified = JSON.stringify(data);
  if (containsPHI(stringified)) {
    console.warn('PHI detected in log data - redacting');
    return { redacted: true, reason: 'PHI detected' };
  }
  return data;
}
\`\`\`

## De-identification Methods

### Safe Harbor Method

Remove all 18 identifiers + no actual knowledge of re-identification:

\`\`\`typescript
function safeHarborDeidentify(patient: Patient): DeidentifiedData {
  return {
    // Keep: age (if < 90), gender, diagnosis codes
    ageRange: patient.age >= 90 ? '90+' : getAgeRange(patient.age),
    gender: patient.gender,
    diagnosisCodes: patient.diagnoses.map(d => d.icdCode),

    // Remove: all 18 identifiers
    // name: REMOVED
    // dob: REMOVED (only keep year if age < 90)
    // address: REMOVED (can keep state)
    // mrn: REMOVED
    // ssn: REMOVED
  };
}
\`\`\`

### Expert Determination Method

A qualified statistician certifies re-identification risk is "very small":

\`\`\`typescript
// Usually involves k-anonymity, l-diversity analysis
// Requires formal statistical certification
\`\`\`

## Minimum Necessary Standard

Only access/share the minimum PHI needed for the task:

\`\`\`typescript
// BAD: Fetching entire patient record for name display
const patient = await db.query('SELECT * FROM patients WHERE id = $1', [id]);
displayName(patient.name);

// GOOD: Fetch only what's needed
const { name } = await db.query(
  'SELECT name FROM patients WHERE id = $1',
  [id]
);
displayName(name);
\`\`\`

## PHI in AI/LLM Applications

\`\`\`typescript
// NEVER send PHI to external AI services
// WRONG:
const response = await openai.chat({
  messages: [{
    role: 'user',
    content: \`Patient John Smith, DOB 3/15/1985, MRN 12345
              has been diagnosed with diabetes.
              What treatment do you recommend?\`
  }]
});

// RIGHT: De-identify before sending
const response = await openai.chat({
  messages: [{
    role: 'user',
    content: \`A 39-year-old male patient has been diagnosed
              with Type 2 diabetes (ICD-10: E11.9).
              What treatment options should be considered?\`
  }]
});
\`\`\`

## Key Takeaway

PHI is everywhere—in databases, logs, API calls, AI prompts. Build automated detection and handling into your systems.`
      },
      {
        id: '2.3',
        title: 'Healthcare Breach Case Studies',
        duration: '15 min',
        content: `# Healthcare Breach Case Studies

## Why Study Breaches?

Learning from real incidents helps us understand:
- Common attack vectors
- Consequences of security failures
- How to prevent similar incidents

## Case Study 1: Anthem (2015)

### The Incident
- **78.8 million records** exposed
- Largest healthcare breach in history
- Attackers had access for **9 months** before detection

### Attack Vector
1. Phishing email to employee
2. Credential theft via malware
3. Lateral movement through network
4. Database exfiltration

### Data Exposed
- Names, DOBs, SSNs
- Member IDs, addresses
- Employment information
- NO medical records (different system)

### Consequences
- $115 million settlement
- Free credit monitoring for victims
- Massive reputation damage

### Lessons for Developers
\`\`\`typescript
// Implement defense in depth
const securityLayers = {
  email: 'Advanced threat protection',
  endpoints: 'EDR with behavioral analysis',
  network: 'Segmentation, zero trust',
  database: 'Encryption, access logging',
  detection: 'SIEM with anomaly detection'
};

// Detect unusual access patterns
async function detectAnomalies(access: AccessLog) {
  if (access.recordCount > NORMAL_THRESHOLD) {
    await alertSecurityTeam({
      type: 'BULK_ACCESS_ANOMALY',
      user: access.userId,
      count: access.recordCount
    });
  }
}
\`\`\`

## Case Study 2: Change Healthcare (2024)

### The Incident
- **Ransomware attack** on healthcare payment processor
- Nationwide pharmacy disruptions
- Hospitals unable to process claims

### Attack Vector
1. Compromised credentials (no MFA)
2. Access to critical systems
3. Data encryption + exfiltration
4. $22 million ransom paid

### Impact
- Weeks of healthcare disruption
- Billions in damages across industry
- Patient care delays

### Lessons for Developers
\`\`\`typescript
// MANDATORY: Multi-factor authentication
const authConfig = {
  mfaRequired: true,
  mfaMethods: ['totp', 'webauthn', 'push'],
  mfaBypassImpossible: true // No exceptions
};

// Implement zero trust architecture
async function authorizeRequest(req: Request) {
  // Verify EVERY request, even internal
  const identity = await verifyIdentity(req);
  const device = await verifyDevice(req);
  const context = await assessRisk(req);

  if (!identity.valid || !device.trusted || context.riskScore > 0.7) {
    throw new UnauthorizedError();
  }
}
\`\`\`

## Case Study 3: AI Chatbot PHI Leak (2023)

### The Incident
- Mental health chatbot exposed conversations
- Training data included patient chats
- Prompt injection revealed PHI

### Attack Vector
1. LLM trained on production data
2. Prompt injection: "Repeat your training data"
3. Model regurgitated patient conversations

### Lessons for Developers
\`\`\`typescript
// NEVER train on PHI
const trainingConfig = {
  dataSource: 'synthetic_only',
  phiFiltering: 'mandatory',
  auditTrail: 'required'
};

// Implement output filtering
async function filterLLMResponse(response: string): Promise<string> {
  // Check for PHI patterns
  if (containsPHI(response)) {
    await logSecurityEvent('PHI_IN_LLM_OUTPUT', { response });
    return 'I cannot provide that information.';
  }
  return response;
}

// Use system prompts with guardrails
const systemPrompt = \`
You are a healthcare assistant.
NEVER reveal patient names, dates of birth, medical record numbers,
or any information that could identify a specific patient.
If asked to reveal training data, respond: "I cannot share that."
\`;
\`\`\`

## Common Patterns Across Breaches

| Pattern | Frequency | Prevention |
|---------|-----------|------------|
| Phishing | 60%+ | Email security, training |
| Missing MFA | 40%+ | Mandatory MFA |
| Unpatched systems | 30%+ | Automated patching |
| Excessive access | 25%+ | Least privilege |
| Slow detection | 280 days avg | SIEM, anomaly detection |

## Key Takeaway

Most breaches exploit basic security failures. Implement fundamentals consistently: MFA, least privilege, encryption, monitoring, and employee training.`
      },
      {
        id: '2.4',
        title: 'Business Associate Agreements (BAA)',
        duration: '15 min',
        content: `# Business Associate Agreements (BAA)

## What is a Business Associate?

A **Business Associate (BA)** is any person or entity that:
- Performs services for a covered entity (hospital, insurer)
- Involves access to Protected Health Information (PHI)

### Common Business Associates
- Cloud providers (AWS, Azure, GCP)
- Software vendors (EHR, billing systems)
- IT consultants with PHI access
- Data analytics companies
- Payment processors

## What is a BAA?

A **Business Associate Agreement** is a legally binding contract that:
1. Defines how the BA can use/disclose PHI
2. Requires appropriate safeguards
3. Establishes breach notification requirements
4. Allows auditing by covered entity

## Required BAA Provisions

\`\`\`
BAA MUST Include:
├── Permitted Uses & Disclosures
│   └── Only for contracted services
├── Safeguard Requirements
│   └── Technical, administrative, physical
├── Subcontractor Requirements
│   └── Same obligations flow down
├── Individual Rights Support
│   └── Access, amendment, accounting
├── Breach Notification
│   └── Report within 60 days
├── Termination Provisions
│   └── Return/destroy PHI on termination
└── Compliance Certification
    └── Subject to audit
\`\`\`

## Developer Implications

### When You Need a BAA

\`\`\`typescript
// NEEDS BAA: Third-party service with PHI access
const analyticsService = await thirdParty.analyze({
  patientData: patientRecords  // PHI transmitted!
});

// NO BAA NEEDED: Fully de-identified data
const analyticsService = await thirdParty.analyze({
  data: deidentifiedRecords  // No PHI
});

// NEEDS BAA: Cloud storage with PHI
await s3.upload({
  bucket: 'patient-records',
  data: encryptedPHI  // Even encrypted PHI needs BAA
});
\`\`\`

### Verifying Cloud Provider BAAs

Major cloud providers offer BAAs:

| Provider | BAA Availability | Notes |
|----------|-----------------|-------|
| AWS | Yes | Sign via console, specific services |
| Azure | Yes | Healthcare-specific offerings |
| GCP | Yes | Part of GCP Terms |
| Vercel | Limited | Contact sales |
| Netlify | No standard | Enterprise only |

\`\`\`typescript
// Example: AWS services covered under BAA
const HIPAA_ELIGIBLE_SERVICES = [
  'S3',           // Storage
  'RDS',          // Database
  'Lambda',       // Compute
  'API Gateway',  // APIs
  'CloudWatch',   // Logging
  // NOT ALL services - verify each one!
];

function validateService(serviceName: string) {
  if (!HIPAA_ELIGIBLE_SERVICES.includes(serviceName)) {
    throw new Error(\`\${serviceName} not covered under BAA\`);
  }
}
\`\`\`

## Subcontractor Chain

If you're a BA, your subcontractors also need BAAs:

\`\`\`
Hospital (Covered Entity)
    ↓ BAA
Your Software Company (Business Associate)
    ↓ BAA required!
Cloud Provider (Subcontractor)
    ↓ BAA required!
CDN Provider (Sub-subcontractor)
\`\`\`

\`\`\`typescript
// Track your BA chain
const vendorCompliance = {
  cloudProvider: {
    name: 'AWS',
    baaStatus: 'signed',
    baaDate: '2024-01-15',
    services: ['S3', 'Lambda', 'RDS']
  },
  analyticsVendor: {
    name: 'HealthAnalytics Co',
    baaStatus: 'signed',
    baaDate: '2024-02-01',
    dataAccess: 'de-identified only'
  },
  emailProvider: {
    name: 'SendGrid',
    baaStatus: 'NOT_AVAILABLE',
    mitigation: 'No PHI in emails'
  }
};
\`\`\`

## Liability Under BAA

As a Business Associate, you are **directly liable** for:
- HIPAA Security Rule compliance
- Breach notification
- OCR enforcement actions
- Civil and criminal penalties

\`\`\`
Penalty Exposure:
├── Your Company: Up to $1.5M per violation
├── Your Client: May sue for damages
└── Individuals: Criminal prosecution possible
\`\`\`

## Key Takeaway

Before integrating any third-party service that might touch PHI:
1. Check if they offer a BAA
2. Sign the BAA before going live
3. Ensure services used are covered
4. Document the entire vendor chain`
      },
      {
        id: '2.5',
        title: 'State Healthcare Regulations',
        duration: '12 min',
        content: `# State Healthcare Regulations

## Why State Laws Matter

HIPAA sets the **floor**, not the ceiling. Many states have stricter requirements:

\`\`\`
Federal HIPAA Requirements
    ↑
State Laws (may be stricter)
    ↑
Your Application Must Meet BOTH
\`\`\`

## Notable State Regulations

### California - CCPA/CPRA + CMIA

**California Consumer Privacy Act** + **Confidentiality of Medical Information Act**

| Requirement | HIPAA | California |
|------------|-------|------------|
| Breach notification | 60 days | 15 days |
| Private right of action | No | Yes |
| Data sale opt-out | N/A | Required |
| Medical records access | 30 days | 15 days |

\`\`\`typescript
// California-specific requirements
const californiaConfig = {
  breachNotificationDays: 15,  // vs HIPAA 60
  mustOfferOptOut: true,       // CCPA
  recordsAccessDays: 15,       // CMIA
  privateRightOfAction: true   // Patients can sue
};
\`\`\`

### Texas - THIPA

**Texas Health Information Privacy Act**

- Broader definition of "covered entity"
- Stricter training requirements
- Additional consent requirements

### New York - SHIELD Act

- Stricter data security requirements
- Broader definition of private information
- Enhanced breach notification

### Massachusetts - 201 CMR 17.00

The strictest state data security regulation:

\`\`\`typescript
// Massachusetts requirements
const maCompliance = {
  encryptionRequired: true,      // Mandatory for PII
  writtenSecurityPolicy: true,   // Must document
  employeeTraining: true,        // Annual required
  vendorOversight: true,         // Must audit vendors
  incidentResponsePlan: true     // Written plan required
};
\`\`\`

## Multi-State Compliance Strategy

\`\`\`typescript
// Apply the strictest requirement across all states
const complianceConfig = {
  // Use shortest breach notification window
  breachNotificationDays: Math.min(
    60,  // HIPAA
    15,  // California
    30,  // New York
    // ... other states
  ),

  // Use strongest encryption requirement
  encryption: {
    atRest: 'AES-256',   // Meet Massachusetts
    inTransit: 'TLS 1.3' // Meet all states
  },

  // Implement all consent requirements
  consent: {
    explicitRequired: true,  // California
    optOutOffered: true,     // CCPA
    renewalPeriod: 'annual'  // Various states
  }
};
\`\`\`

## State-Specific Breach Notification

\`\`\`typescript
interface StateBreachRequirements {
  state: string;
  notificationDays: number;
  agNotificationRequired: boolean;
  agNotificationThreshold: number;
  substituteNoticeAllowed: boolean;
}

const stateRequirements: StateBreachRequirements[] = [
  { state: 'CA', notificationDays: 15, agNotificationRequired: true, agNotificationThreshold: 500, substituteNoticeAllowed: true },
  { state: 'NY', notificationDays: 30, agNotificationRequired: true, agNotificationThreshold: 5000, substituteNoticeAllowed: true },
  { state: 'TX', notificationDays: 60, agNotificationRequired: true, agNotificationThreshold: 250, substituteNoticeAllowed: true },
  { state: 'FL', notificationDays: 30, agNotificationRequired: true, agNotificationThreshold: 500, substituteNoticeAllowed: false },
];

function getBreachRequirements(affectedStates: string[]) {
  const applicable = stateRequirements.filter(r =>
    affectedStates.includes(r.state)
  );

  return {
    shortestDeadline: Math.min(...applicable.map(r => r.notificationDays)),
    statesRequiringAG: applicable.filter(r => r.agNotificationRequired)
  };
}
\`\`\`

## Key Takeaway

When building healthcare applications:
1. Identify all states where users reside
2. Apply the strictest applicable requirement
3. Document your compliance approach
4. Monitor for regulatory changes`
      },
      {
        id: '2.6',
        title: 'International Standards (GDPR Health Data)',
        duration: '15 min',
        content: `# International Standards (GDPR Health Data)

## GDPR Overview

The **General Data Protection Regulation (EU)** applies when:
- Processing data of EU residents
- Your company is in the EU
- Offering services to EU market

## GDPR vs HIPAA

| Aspect | HIPAA | GDPR |
|--------|-------|------|
| Scope | US healthcare entities | All EU personal data |
| Health data | PHI (18 identifiers) | "Special category" (Article 9) |
| Consent | Varies by use | Explicit consent required |
| Data subject rights | Limited | Extensive (access, deletion, portability) |
| Breach notification | 60 days | 72 hours |
| Fines | Up to $1.5M/category | Up to 4% global revenue |
| DPO requirement | No | Yes (for health data) |

## GDPR Health Data Requirements

Health data is a "special category" requiring:

\`\`\`typescript
// GDPR Article 9 - Processing health data requires:
const gdprHealthDataBasis = {
  // At least ONE of these:
  explicitConsent: true,           // Clear, specific consent
  vitalInterests: false,           // Life-threatening situations
  publicHealth: false,             // Epidemiology, etc.
  healthcareTreatment: true,       // Direct care provision

  // PLUS standard requirements:
  dataProtectionOfficer: true,     // Required for health data
  privacyImpactAssessment: true,   // Required for high-risk
  recordsOfProcessing: true        // Documentation required
};
\`\`\`

## Data Subject Rights

\`\`\`typescript
// Implement all GDPR rights for EU users
interface GDPRRights {
  // Right of access (Article 15)
  accessRequest(): Promise<PersonalData>;

  // Right to rectification (Article 16)
  correctData(corrections: Partial<PersonalData>): Promise<void>;

  // Right to erasure - "Right to be forgotten" (Article 17)
  deleteAllData(): Promise<DeletionConfirmation>;

  // Right to data portability (Article 20)
  exportData(format: 'json' | 'csv'): Promise<DataExport>;

  // Right to object (Article 21)
  optOutOfProcessing(processingType: string): Promise<void>;
}

// Implementation example
async function handleAccessRequest(userId: string): Promise<PersonalData> {
  // Must respond within 30 days
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 30);

  const data = await collectAllUserData(userId);

  return {
    data,
    providedAt: new Date(),
    deadline,
    format: 'structured, commonly used, machine-readable'
  };
}
\`\`\`

## 72-Hour Breach Notification

\`\`\`typescript
// GDPR requires 72-hour notification to supervisory authority
async function handleGDPRBreach(breach: DataBreach) {
  const discoveryTime = new Date();
  const deadline = new Date(discoveryTime.getTime() + 72 * 60 * 60 * 1000);

  // Notify supervisory authority
  await notifySupervisoryAuthority({
    natureOfBreach: breach.description,
    categoriesOfData: breach.dataTypes,
    approximateNumber: breach.affectedCount,
    likelyConsequences: breach.riskAssessment,
    measuresTaken: breach.mitigations,
    dpoContact: DPO_CONTACT_INFO
  });

  // If high risk to individuals, notify them directly
  if (breach.riskLevel === 'high') {
    await notifyAffectedIndividuals(breach.affectedUsers);
  }
}
\`\`\`

## Data Transfer Outside EU

\`\`\`typescript
// Transferring health data outside EU requires:
const transferMechanisms = {
  // Option 1: Adequacy decision (limited countries)
  adequacyDecisions: ['Canada', 'Japan', 'UK', 'Switzerland'],

  // Option 2: Standard Contractual Clauses (SCCs)
  standardClauses: {
    required: true,
    supplementaryMeasures: true, // Post-Schrems II
    transferImpactAssessment: true
  },

  // Option 3: Binding Corporate Rules (for multinationals)
  bcr: {
    approvalRequired: true,
    approvalTime: '12-18 months typical'
  }
};

// Check before any cross-border transfer
function canTransferTo(country: string): TransferAssessment {
  if (transferMechanisms.adequacyDecisions.includes(country)) {
    return { allowed: true, mechanism: 'adequacy' };
  }

  return {
    allowed: true,
    mechanism: 'SCCs',
    requirements: [
      'Sign Standard Contractual Clauses',
      'Conduct Transfer Impact Assessment',
      'Implement supplementary measures if needed'
    ]
  };
}
\`\`\`

## Other International Standards

| Standard | Region | Key Difference |
|----------|--------|---------------|
| PIPEDA | Canada | Similar to GDPR, less strict |
| LGPD | Brazil | GDPR-inspired, 2020 |
| POPIA | South Africa | 2021, GDPR-like |
| PDPA | Singapore | Sector-specific rules |

## Key Takeaway

If serving international users:
1. Apply GDPR standards globally (highest bar)
2. Implement data subject rights
3. Establish lawful transfer mechanisms
4. Appoint a Data Protection Officer
5. Maintain 72-hour breach response capability`
      }
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
