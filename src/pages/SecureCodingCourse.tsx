import { useState } from 'react';
import { ScrollReveal } from '../components/animations/ScrollReveal';
import { courseModules, type Module, type Lesson } from '../data/courseContent';
import ReactMarkdown from 'react-markdown';

function LessonContent({ lesson, onClose }: { lesson: Lesson; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div>
            <span className="text-sm font-medium text-blue-600">{lesson.id}</span>
            <h2 className="text-xl font-bold text-gray-900">{lesson.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close lesson"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {lesson.content ? (
            <div className="prose prose-blue max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100">
              <ReactMarkdown>{lesson.content}</ReactMarkdown>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-gray-600">This lesson content is being developed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ModuleCard({ module, isExpanded, onToggle, onSelectLesson }: {
  module: Module;
  isExpanded: boolean;
  onToggle: () => void;
  onSelectLesson: (lesson: Lesson) => void;
}) {
  const completedLessons = module.lessons.filter(l => l.content).length;
  const totalLessons = module.lessons.length;
  const progress = Math.round((completedLessons / totalLessons) * 100);

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
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="text-sm text-gray-500">{module.lessons.length} lessons</span>
            {progress > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-green-600">{progress}%</span>
              </div>
            )}
          </div>
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
            {module.lessons.map((lesson) => (
              <li key={lesson.id}>
                <button
                  onClick={() => onSelectLesson(lesson)}
                  className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                      lesson.content
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {lesson.content ? '✓' : lesson.id.split('.')[1]}
                    </span>
                    <span className="text-gray-700 group-hover:text-blue-700">{lesson.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{lesson.duration}</span>
                    {lesson.content && (
                      <svg className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function SecureCodingCourse() {
  const [expandedModules, setExpandedModules] = useState<number[]>([1]); // Start with first module expanded
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const totalLessons = courseModules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = courseModules.reduce(
    (acc, m) => acc + m.lessons.filter(l => l.content).length,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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
                  <span>{totalLessons} Lessons</span>
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

              {/* Progress indicator */}
              <div className="mt-8 max-w-md mx-auto">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Course Progress</span>
                  <span>{completedLessons}/{totalLessons} lessons</span>
                </div>
                <div className="w-full h-2 bg-blue-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-400 rounded-full transition-all"
                    style={{ width: `${(completedLessons / totalLessons) * 100}%` }}
                  />
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
                Comprehensive training from security fundamentals to production-ready healthcare agents
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
              href="#contact"
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

      {/* Lesson Modal */}
      {selectedLesson && (
        <LessonContent
          lesson={selectedLesson}
          onClose={() => setSelectedLesson(null)}
        />
      )}
    </div>
  );
}
