// Healthcare Secure Agentic Coding Course Content
// Adapted from Secure Vibe Coding Masterclass with healthcare-specific additions

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  content?: string;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
  healthcareAdditions?: string[];
}

export const courseModules: Module[] = [
  {
    id: 1,
    title: 'Foundation & Setup',
    description: 'Getting started with secure healthcare agentic development',
    lessons: [
      { id: '1.1', title: 'Course Welcome & Overview', duration: '10 min' },
      { id: '1.2', title: 'What is Agentic Coding?', duration: '15 min' },
      { id: '1.3', title: 'Security-First Mindset', duration: '12 min' },
      { id: '1.4', title: 'Why Healthcare Security Matters', duration: '15 min' },
      { id: '1.5', title: 'Development Environment Setup', duration: '20 min' },
    ],
    healthcareAdditions: [
      'HIPAA Security Rule overview',
      'Healthcare breach consequences ($millions in fines)',
      'PHI vs PII distinction'
    ]
  },
  {
    id: 2,
    title: 'Healthcare Security Fundamentals',
    description: 'HIPAA, PHI, and healthcare-specific threats',
    lessons: [
      { id: '2.0', title: 'Common Web Security Threats (OWASP Top 10)', duration: '20 min' },
      { id: '2.1', title: 'HIPAA Security Rule Deep Dive', duration: '25 min' },
      { id: '2.2', title: 'Protected Health Information (PHI) Handling', duration: '20 min' },
      { id: '2.3', title: 'Healthcare Breach Case Studies', duration: '15 min' },
      { id: '2.4', title: 'Business Associate Agreements (BAA)', duration: '15 min' },
      { id: '2.5', title: 'State Healthcare Regulations', duration: '12 min' },
      { id: '2.6', title: 'International Standards (GDPR Health Data)', duration: '15 min' },
    ],
    healthcareAdditions: [
      '18 HIPAA identifiers',
      'Minimum necessary standard',
      'Patient consent requirements'
    ]
  },
  {
    id: 3,
    title: 'Secure Prompt Engineering for Healthcare',
    description: 'Building secure AI prompts for clinical applications',
    lessons: [
      { id: '3.1', title: 'Prompt Injection Fundamentals', duration: '18 min' },
      { id: '3.2', title: 'Healthcare Prompt Security Patterns', duration: '20 min' },
      { id: '3.3', title: 'PHI Leakage Prevention in Prompts', duration: '22 min' },
      { id: '3.4', title: 'Input Validation for Medical Queries', duration: '18 min' },
      { id: '3.5', title: 'Output Sanitization & De-identification', duration: '20 min' },
      { id: '3.6', title: 'Secure Prompt Templates for Clinical Use', duration: '15 min' },
    ],
    healthcareAdditions: [
      'Safe Harbor de-identification method',
      'Expert determination method',
      'Clinical context guardrails'
    ]
  },
  {
    id: 4,
    title: 'Authentication & Authorization',
    description: 'Identity management in healthcare systems',
    lessons: [
      { id: '4.1', title: 'Healthcare Authentication Requirements', duration: '20 min' },
      { id: '4.2', title: 'Role-Based Access Control (RBAC) for Clinical Data', duration: '22 min' },
      { id: '4.3', title: 'OAuth 2.0 & SMART on FHIR', duration: '25 min' },
      { id: '4.4', title: 'Session Management & Timeout Policies', duration: '18 min' },
    ],
    healthcareAdditions: [
      'Clinical role hierarchies (physician, nurse, admin)',
      'Break-the-glass procedures',
      'Automatic session timeout (HIPAA requirement)'
    ]
  },
  {
    id: 5,
    title: 'API Security & EHR Integration',
    description: 'Securing FHIR APIs and EHR connections',
    lessons: [
      { id: '5.1', title: 'FHIR API Security Fundamentals', duration: '25 min' },
      { id: '5.2', title: 'API Keys & Service Authentication', duration: '20 min' },
      { id: '5.3', title: 'API Versioning & Deprecation', duration: '15 min' },
      { id: '5.4', title: 'EHR Integration Security (Epic, Cerner)', duration: '30 min' },
      { id: '5.5', title: 'Webhook Security for Clinical Events', duration: '18 min' },
      { id: '5.6', title: 'Rate Limiting for Healthcare APIs', duration: '15 min' },
    ],
    healthcareAdditions: [
      'HL7 FHIR security profiles',
      'SMART App Launch framework',
      'Epic/Cerner OAuth patterns'
    ]
  },
  {
    id: 6,
    title: 'Database & PHI Storage Security',
    description: 'Protecting healthcare data at rest',
    lessons: [
      { id: '6.1', title: 'Convex Fundamentals & Deployment', duration: '25 min' },
      { id: '6.2', title: 'Database Security Essentials (Injection Prevention)', duration: '22 min' },
      { id: '6.3', title: 'Data Protection & Access Control', duration: '20 min' },
      { id: '6.4', title: 'HIPAA Audit Logging Requirements', duration: '20 min' },
    ],
    healthcareAdditions: [
      'PHI encryption requirements (AES-256)',
      '6-year retention requirement',
      'Audit log immutability'
    ]
  },
  {
    id: 7,
    title: 'Frontend Security for Patient Portals',
    description: 'Securing patient-facing applications',
    lessons: [
      { id: '7.1', title: 'Frontend Security Architecture', duration: '22 min' },
      { id: '7.2', title: 'XSS Prevention in Patient Portals', duration: '20 min' },
      { id: '7.3', title: 'Secure Browser Storage for Health Data', duration: '18 min' },
      { id: '7.4', title: 'Third-Party Code Security & Supply Chain', duration: '20 min' },
    ],
    healthcareAdditions: [
      'Patient portal session security',
      'PHI display masking patterns',
      'Healthcare iframe restrictions'
    ]
  },
  {
    id: 8,
    title: 'Security Testing & HIPAA Compliance',
    description: 'Validating healthcare application security',
    lessons: [
      { id: '8.1', title: 'Healthcare Security Testing Methodology', duration: '25 min' },
      { id: '8.2', title: 'Automated Security Scanning for HIPAA', duration: '20 min' },
      { id: '8.3', title: 'Penetration Testing Healthcare Apps', duration: '22 min' },
      { id: '8.4', title: 'Vulnerability Assessment', duration: '20 min' },
      { id: '8.5', title: 'Penetration Testing Basics', duration: '22 min' },
      { id: '8.6', title: 'Security Monitoring & Incident Response', duration: '25 min' },
    ],
    healthcareAdditions: [
      'HIPAA security risk assessment',
      'OCR audit preparation',
      'Breach notification requirements (60-day rule)'
    ]
  },
  {
    id: 9,
    title: 'DevSecOps for Healthcare',
    description: 'CI/CD security for compliant deployments',
    lessons: [
      { id: '9.1', title: 'Secure CI/CD Pipelines', duration: '22 min' },
      { id: '9.2', title: 'Container Security for Healthcare', duration: '20 min' },
      { id: '9.3', title: 'Infrastructure as Code Security', duration: '18 min' },
      { id: '9.4', title: 'Compliance-as-Code', duration: '20 min' },
    ],
    healthcareAdditions: [
      'HIPAA-compliant deployment patterns',
      'Healthcare-grade infrastructure (AWS GovCloud, Azure Healthcare)',
      'Compliance automation tools'
    ]
  },
  {
    id: 10,
    title: 'Building Secure Healthcare Agents',
    description: 'Capstone: End-to-end secure agentic system',
    lessons: [
      { id: '10.1', title: 'Architecture Review for Healthcare Agents', duration: '25 min' },
      { id: '10.2', title: 'Security Checklist & Go-Live', duration: '20 min' },
      { id: '10.3', title: 'Ongoing Compliance Monitoring', duration: '18 min' },
    ],
    healthcareAdditions: [
      'Healthcare agent security patterns',
      'PHI data flow mapping',
      'Continuous compliance monitoring'
    ]
  },
];

// HIPAA-specific content
export const hipaaCompliance = {
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
  },
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
  breachNotification: {
    timeline: '60 days from discovery',
    toPatients: 'Written notice without unreasonable delay',
    toHHS: 'Annual report for <500 affected, immediate for 500+',
    toMedia: 'Required if 500+ residents in state affected'
  }
};

// FHIR/EHR Integration Security
export const ehrIntegration = {
  smartOnFhir: {
    description: 'SMART on FHIR is an open standard for healthcare app authorization',
    scopes: [
      'patient/*.read - Read all patient data',
      'patient/Observation.read - Read observations only',
      'launch/patient - Launch with patient context',
      'openid fhirUser - Get user identity'
    ],
    flow: [
      '1. App registered with EHR (client_id, redirect_uri)',
      '2. App redirects to EHR authorization endpoint',
      '3. User authenticates and grants consent',
      '4. EHR redirects back with authorization code',
      '5. App exchanges code for access token',
      '6. App uses token to access FHIR resources'
    ]
  },
  epicIntegration: {
    endpoints: [
      'OAuth2: /oauth2/authorize, /oauth2/token',
      'FHIR R4: /api/FHIR/R4/{resource}',
      'Patient Access: patient-facing apps',
      'Backend Services: server-to-server'
    ],
    security: [
      'HTTPS required (TLS 1.2+)',
      'JWT bearer tokens for backend services',
      'Refresh tokens with short expiry',
      'Scope-based access control'
    ]
  },
  cernerIntegration: {
    endpoints: [
      'OAuth2: /oauth/authorize, /oauth/token',
      'FHIR R4: /fhir/r4/{resource}',
      'Bulk Data: /Bulk/$export'
    ]
  }
};

// Healthcare-specific audit logging requirements
export const auditLogging = {
  required: [
    'User ID performing action',
    'Action performed (CRUD)',
    'Resource accessed',
    'Patient ID (if applicable)',
    'Timestamp (UTC)',
    'Source IP address',
    'Success/failure status',
    'Reason for access (if break-the-glass)'
  ],
  retention: '6 years minimum (HIPAA)',
  immutability: 'Logs must be tamper-evident',
  review: 'Regular review required (recommended: weekly)',
  alerts: [
    'Unusual access patterns',
    'After-hours access',
    'Bulk data exports',
    'Failed authentication attempts',
    'Access to VIP patient records'
  ]
};
