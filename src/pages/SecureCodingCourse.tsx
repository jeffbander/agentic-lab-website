import { useState } from 'react';
import { ScrollReveal } from '../components/animations/ScrollReveal';
import { getLessonContent, getAvailableLessons } from '../data/lessonContent';
import ReactMarkdown from 'react-markdown';

// Course module data structure
const courseModules = [
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
    ]
  },
  {
    id: 2,
    title: 'Healthcare Security Fundamentals',
    description: 'HIPAA, PHI, and healthcare-specific threats',
    lessons: [
      { id: '2.0', title: 'Common Web Security Threats (OWASP Top 10)', duration: '20 min' },
      { id: '2.1', title: 'HIPAA Security Rule Overview', duration: '25 min' },
      { id: '2.2', title: 'Protected Health Information (PHI) Handling', duration: '20 min' },
      { id: '2.3', title: 'Healthcare Breach Case Studies', duration: '15 min' },
      { id: '2.4', title: 'BAA Requirements for Cloud Services', duration: '15 min' },
      { id: '2.5', title: 'State-Specific Healthcare Regulations', duration: '12 min' },
      { id: '2.6', title: 'International Healthcare Standards (GDPR Health)', duration: '15 min' },
    ]
  },
  {
    id: 3,
    title: 'Secure Prompt Engineering',
    description: 'Building secure AI prompts for healthcare applications',
    lessons: [
      { id: '3.1', title: 'Prompt Injection Fundamentals', duration: '18 min' },
      { id: '3.2', title: 'Healthcare Prompt Security Patterns', duration: '20 min' },
      { id: '3.3', title: 'PHI Leakage Prevention in Prompts', duration: '22 min' },
      { id: '3.4', title: 'Input Validation for Medical Queries', duration: '18 min' },
      { id: '3.5', title: 'Output Sanitization & De-identification', duration: '20 min' },
      { id: '3.6', title: 'Secure Prompt Templates for Clinical Use', duration: '15 min' },
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
    ]
  },
  {
    id: 6,
    title: 'Database & PHI Storage Security',
    description: 'Protecting healthcare data at rest',
    lessons: [
      { id: '6.1', title: 'Healthcare Database Security Principles', duration: '20 min' },
      { id: '6.2', title: 'PHI Encryption at Rest', duration: '22 min' },
      { id: '6.3', title: 'SQL Injection Prevention in Clinical Apps', duration: '18 min' },
      { id: '6.4', title: 'Audit Logging Requirements (HIPAA)', duration: '20 min' },
    ]
  },
  {
    id: 7,
    title: 'Frontend Security for Healthcare',
    description: 'Securing patient-facing applications',
    lessons: [
      { id: '7.1', title: 'Frontend Security Architecture', duration: '22 min' },
      { id: '7.2', title: 'XSS Prevention in Patient Portals', duration: '20 min' },
      { id: '7.3', title: 'Secure Browser Storage for Health Data', duration: '18 min' },
      { id: '7.4', title: 'Third-Party Code Security & Supply Chain', duration: '20 min' },
    ]
  },
  {
    id: 8,
    title: 'Security Testing & Compliance',
    description: 'Validating healthcare application security',
    lessons: [
      { id: '8.1', title: 'Healthcare Security Testing Methodology', duration: '25 min' },
      { id: '8.2', title: 'Automated Security Scanning for HIPAA', duration: '20 min' },
      { id: '8.3', title: 'Penetration Testing Healthcare Apps', duration: '22 min' },
      { id: '8.4', title: 'Security Monitoring & Incident Response', duration: '25 min' },
      { id: '8.5', title: 'Penetration Testing Basics', duration: '22 min' },
      { id: '8.6', title: 'Incident Response Procedures', duration: '25 min' },
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
    ]
  },
];

// Check if a lesson has content
const availableLessons = new Set(getAvailableLessons());

function LessonViewer({ lessonId, onClose }: { lessonId: string; onClose: () => void }) {
  const content = getLessonContent(lessonId);

  if (!content) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold">Lesson {lessonId}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6 text-center text-gray-500">
            <p>This lesson content is coming soon.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center shrink-0">
          <div>
            <span className="text-sm text-blue-600 font-medium">Lesson {content.id}</span>
            <h2 className="text-xl font-bold text-gray-900">{content.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto prose prose-blue max-w-none">
          <ReactMarkdown
            components={{
              h2: ({ children }) => <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-4">{children}</h2>,
              h3: ({ children }) => <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-3">{children}</h3>,
              h4: ({ children }) => <h4 className="text-lg font-semibold text-gray-700 mt-4 mb-2">{children}</h4>,
              p: ({ children }) => <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
              li: ({ children }) => <li className="text-gray-700">{children}</li>,
              code: ({ className, children }) => {
                const isBlock = className?.includes('language-');
                if (isBlock) {
                  return (
                    <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-4">
                      <code className="text-sm font-mono">{children}</code>
                    </pre>
                  );
                }
                return <code className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>;
              },
              pre: ({ children }) => <>{children}</>,
              table: ({ children }) => (
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">{children}</table>
                </div>
              ),
              thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
              tbody: ({ children }) => <tbody className="divide-y divide-gray-200">{children}</tbody>,
              tr: ({ children }) => <tr>{children}</tr>,
              th: ({ children }) => <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">{children}</th>,
              td: ({ children }) => <td className="px-4 py-3 text-sm text-gray-700">{children}</td>,
              strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4">{children}</blockquote>
              ),
            }}
          >
            {content.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

function ModuleCard({ module, isExpanded, onToggle, onSelectLesson }: {
  module: typeof courseModules[0];
  isExpanded: boolean;
  onToggle: () => void;
  onSelectLesson: (lessonId: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg">
            {module.id}
          </span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
            <p className="text-sm text-gray-600">{module.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{module.lessons.length} lessons</span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="px-6 pb-5 border-t border-gray-100">
          <ul className="mt-4 space-y-2">
            {module.lessons.map((lesson) => {
              const hasContent = availableLessons.has(lesson.id);
              return (
                <li key={lesson.id}>
                  <button
                    onClick={() => onSelectLesson(lesson.id)}
                    className={`w-full flex items-center justify-between py-2 px-3 rounded-lg transition-colors text-left ${
                      hasContent
                        ? 'hover:bg-blue-50 cursor-pointer'
                        : 'hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-medium ${hasContent ? 'text-blue-600' : 'text-gray-400'}`}>
                        {lesson.id}
                      </span>
                      <span className={hasContent ? 'text-gray-700' : 'text-gray-500'}>
                        {lesson.title}
                      </span>
                      {hasContent && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Available
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{lesson.duration}</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function SecureCodingCourse() {
  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const totalLessons = courseModules.reduce((acc, m) => acc + m.lessons.length, 0);
  const availableCount = availableLessons.size;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Lesson Viewer Modal */}
      {selectedLesson && (
        <LessonViewer lessonId={selectedLesson} onClose={() => setSelectedLesson(null)} />
      )}

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-900 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal>
            <div className="text-center">
              <span className="inline-block px-4 py-1 bg-blue-800 rounded-full text-sm font-medium mb-4">
                Healthcare Security Training
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Secure Agentic Coding for Healthcare
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
                Master HIPAA-compliant AI development. Build secure healthcare agents
                that protect patient data while delivering powerful clinical capabilities.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{courseModules.length} Modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{availableCount} of {totalLessons} Lessons Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>HIPAA Focused</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>FHIR/EHR Integration</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Key Topics */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
              What You'll Learn
            </h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🔒',
                title: 'HIPAA Compliance',
                description: 'Build applications that meet healthcare regulatory requirements'
              },
              {
                icon: '🤖',
                title: 'Secure AI Agents',
                description: 'Prevent prompt injection and PHI leakage in LLM applications'
              },
              {
                icon: '🏥',
                title: 'EHR Integration',
                description: 'Secure FHIR APIs and EHR system connections'
              },
              {
                icon: '📋',
                title: 'Audit & Monitoring',
                description: 'Implement compliant logging and incident response'
              },
            ].map((topic, index) => (
              <ScrollReveal key={index}>
                <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                  <span className="text-4xl mb-4 block">{topic.icon}</span>
                  <h3 className="font-semibold text-gray-900 mb-2">{topic.title}</h3>
                  <p className="text-sm text-gray-600">{topic.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Course Modules */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Course Curriculum</h2>
              <p className="text-gray-600">
                Click any lesson to view the full content. Lessons marked "Available" have complete content ready.
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-4">
            {courseModules.map((module) => (
              <ScrollReveal key={module.id}>
                <ModuleCard
                  module={module}
                  isExpanded={expandedModules.includes(module.id)}
                  onToggle={() => toggleModule(module.id)}
                  onSelectLesson={setSelectedLesson}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold mb-4">Ready to Build Secure Healthcare AI?</h2>
            <p className="text-blue-100 mb-8 text-lg">
              Join healthcare developers learning to build HIPAA-compliant agentic systems.
            </p>
            <a
              href="/#contact"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Get Started
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
