export type Project = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  technicalDetails: string;
  clinicalImpact: string;
  developmentTime: string;
  costSavings: string;
  techStack: string[];
  status: 'Production' | 'Development' | 'Testing';
  githubUrl?: string;
  metrics: {
    label: string;
    value: string;
  }[];
  features: string[];
}

export const projects: Project[] = [
  {
    id: 'irbver2',
    title: 'IRBVer2',
    subtitle: 'AI-Powered IRB Protocol Management',
    description: 'Revolutionary IRB protocol submission and review system built in 8 weeks by a hospitalist with AI assistance. Replaces $50k-200k annual enterprise software costs.',
    technicalDetails: 'Built with Next.js 14, React 19, Prisma ORM, PostgreSQL, deployed on Google Cloud Run with Terraform IaC. Features real-time collaboration, document OCR with Mistral Vision, automated compliance checking, and integrated webhook system.',
    clinicalImpact: 'Streamlines IRB workflows for clinical research, reducing submission time by 60%. Enables hospitals to conduct more research studies with existing staff.',
    developmentTime: '8 weeks',
    costSavings: '$50k-200k annually',
    techStack: ['Next.js 14', 'React 19', 'TypeScript', 'Prisma', 'PostgreSQL', 'GCP', 'Terraform', 'Claude Opus 4.6', 'MCP'],
    status: 'Production',
    githubUrl: 'https://github.com/jeffbander/irbver2',
    metrics: [
      { label: 'Development Time', value: '8 weeks' },
      { label: 'Time Savings', value: '60%' },
      { label: 'Annual Cost Savings', value: '$50k-200k' },
      { label: 'PR Acceptance Rate', value: '83.8%' }
    ],
    features: [
      'Automated protocol submission workflow',
      'AI-powered document OCR and parsing',
      'Real-time collaboration tools',
      'HIPAA-compliant security',
      'Automated compliance checking',
      'Integrated audit logging'
    ]
  },
  {
    id: 'voice-agent',
    title: 'HIPAA-Compliant Voice AI Agent',
    subtitle: 'Intelligent Patient Communication System',
    description: 'Voice AI agent for patient outreach, medication reminders, and appointment scheduling with full HIPAA compliance and EHR integration.',
    technicalDetails: 'Python-based system with Twilio integration, OpenAI Realtime API, FHIR-compliant MCP server for EHR data access. Features natural conversation flow, context awareness, and automated call transcription.',
    clinicalImpact: 'Improves medication adherence, reduces no-show rates, and frees clinical staff for higher-value activities. Enables scalable patient outreach.',
    developmentTime: '6 weeks',
    costSavings: '80% reduction vs human callers',
    techStack: ['Python', 'Twilio', 'OpenAI', 'FHIR MCP', 'PostgreSQL', 'Claude Opus 4.6', 'MCP'],
    status: 'Testing',
    githubUrl: 'https://github.com/jeffbander/voice-agent',
    metrics: [
      { label: 'Development Time', value: '6 weeks' },
      { label: 'Cost Reduction', value: '80%' },
      { label: 'Call Capacity', value: '1000+/day' }
    ],
    features: [
      'Natural language conversation',
      'FHIR EHR integration',
      'Automated appointment scheduling',
      'Medication reminders',
      'Call transcription & analytics',
      'HIPAA-compliant security'
    ]
  },
  {
    id: 'heartvoice',
    title: 'HeartVoice Monitor',
    subtitle: 'Voice-Based Heart Failure Detection',
    description: 'Groundbreaking AI system that detects heart failure exacerbations 2-3 weeks before symptoms through voice biomarker analysis. AUC 0.82 accuracy.',
    technicalDetails: 'React dashboard with real-time audio processing, ML model for voice biomarker extraction (pitch, tone, breathiness), risk scoring algorithm, and automated alert system integrated with EHR.',
    clinicalImpact: 'Early detection enables preventive intervention, reducing hospitalizations by up to 30%. Potential to save thousands of lives annually.',
    developmentTime: '8 weeks',
    costSavings: 'Prevents $20k+ per avoided hospitalization',
    techStack: ['React', 'Python', 'TensorFlow', 'Web Audio API', 'FHIR MCP', 'Claude Opus 4.6'],
    status: 'Testing',
    githubUrl: 'https://github.com/jeffbander/heartvoice-monitor',
    metrics: [
      { label: 'Development Time', value: '8 weeks' },
      { label: 'Detection Accuracy (AUC)', value: '0.82' },
      { label: 'Early Warning', value: '2-3 weeks' },
      { label: 'Hospitalization Reduction', value: '30%' }
    ],
    features: [
      'Voice biomarker extraction',
      'Real-time risk scoring',
      'Automated clinician alerts',
      'Patient monitoring dashboard',
      'EHR integration',
      'Historical trend analysis'
    ]
  },
  {
    id: 'pto-app',
    title: 'Clinical Staff PTO Management',
    subtitle: 'Intelligent Scheduling System',
    description: 'Smart PTO request and approval system for clinical staff with automated coverage checking, conflict resolution, and calendar integration.',
    technicalDetails: 'Next.js application with calendar logic, staffing algorithms, email notifications, and administrative dashboard. Integrates with existing HR systems.',
    clinicalImpact: 'Ensures adequate clinical coverage while improving staff satisfaction. Reduces administrative burden by 70%.',
    developmentTime: '4 weeks',
    costSavings: '10 hours/week admin time saved',
    techStack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'SendGrid', 'Claude Opus 4.6'],
    status: 'Production',
    githubUrl: 'https://github.com/jeffbander/pto-app',
    metrics: [
      { label: 'Development Time', value: '4 weeks' },
      { label: 'Admin Time Saved', value: '70%' },
      { label: 'Staff Satisfaction', value: '+40%' }
    ],
    features: [
      'One-click PTO requests',
      'Automated coverage checking',
      'Conflict resolution',
      'Manager approval workflows',
      'Calendar integration',
      'Mobile-responsive design'
    ]
  },
  {
    id: 'leqvio',
    title: 'LEQVIO Patient Enrollment',
    subtitle: 'Streamlined Clinical Trial Management',
    description: 'Patient enrollment and tracking system for LEQVIO medication program, integrating with EHR for automated eligibility checking and follow-up scheduling.',
    technicalDetails: 'React application with FHIR MCP integration for EHR data access, automated eligibility algorithms, patient tracking dashboard, and reminder system.',
    clinicalImpact: 'Increases clinical trial enrollment by 50%, improves follow-up compliance, and reduces missed appointments.',
    developmentTime: '5 weeks',
    costSavings: 'Doubles enrollment capacity',
    techStack: ['React', 'TypeScript', 'FHIR MCP', 'PostgreSQL', 'Twilio', 'Claude Opus 4.6', 'MCP'],
    status: 'Production',
    githubUrl: 'https://github.com/jeffbander/leqvio-enrollment',
    metrics: [
      { label: 'Development Time', value: '5 weeks' },
      { label: 'Enrollment Increase', value: '50%' },
      { label: 'Follow-up Compliance', value: '+35%' }
    ],
    features: [
      'Automated eligibility checking',
      'EHR integration via FHIR',
      'Patient tracking dashboard',
      'Automated reminders',
      'Appointment scheduling',
      'Reporting and analytics'
    ]
  }
];

export const statistics = {
  prAcceptance: 92,
  timeReduction: '70-85%',
  costSavings: '$50k-300k',
  earlyDetection: '2-3 weeks',
  projectCount: 5,
  developmentSpeed: '2-6 weeks'
};
