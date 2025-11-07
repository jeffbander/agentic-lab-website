import { lazy, Suspense } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Hero } from '../components/Hero';
import { Loading } from '../components/Loading';

// Lazy load heavy components for better initial load performance
const Overview = lazy(() => import('../components/sections/Overview').then(m => ({ default: m.Overview })));
const LeqvioSection = lazy(() => import('../components/sections/LeqvioSection'));
const ProjectsSection = lazy(() => import('../components/projects/ProjectsSection').then(m => ({ default: m.ProjectsSection })));
const Approach = lazy(() => import('../components/sections/Approach').then(m => ({ default: m.Approach })));
const WorkflowDiagram = lazy(() => import('../components/diagrams/WorkflowDiagram').then(m => ({ default: m.WorkflowDiagram })));
const MCPArchitecture = lazy(() => import('../components/architecture/MCPArchitecture').then(m => ({ default: m.MCPArchitecture })));
const VoiceBiomarkerFlow = lazy(() => import('../components/biomarkers/VoiceBiomarkerFlow').then(m => ({ default: m.VoiceBiomarkerFlow })));
const ClinicalImpactDashboard = lazy(() => import('../components/charts/ClinicalImpactDashboard').then(m => ({ default: m.ClinicalImpactDashboard })));
const ROICalculator = lazy(() => import('../components/calculator/ROICalculator').then(m => ({ default: m.ROICalculator })));
const VideoGenerator = lazy(() => import('../components/sections/VideoGenerator').then(m => ({ default: m.VideoGenerator })));
const Contact = lazy(() => import('../components/sections/Contact').then(m => ({ default: m.Contact })));

function SectionErrorFallback({ section }: { section: string }) {
  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-600">
          Unable to load {section} section. Please refresh the page.
        </p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <>
      <ErrorBoundary fallback={<SectionErrorFallback section="Hero" />}>
        <Hero />
      </ErrorBoundary>
      <Suspense fallback={<Loading message="Loading overview..." />}>
        <ErrorBoundary fallback={<SectionErrorFallback section="Overview" />}>
          <Overview />
        </ErrorBoundary>
      </Suspense>
      <Suspense fallback={<Loading message="Loading LEQVIO AI..." />}>
        <ErrorBoundary fallback={<SectionErrorFallback section="LEQVIO AI" />}>
          <LeqvioSection />
        </ErrorBoundary>
      </Suspense>
      <Suspense fallback={<Loading message="Loading projects..." />}>
        <ErrorBoundary fallback={<SectionErrorFallback section="Projects" />}>
          <ProjectsSection />
        </ErrorBoundary>
      </Suspense>
      <Suspense fallback={<Loading message="Loading approach..." />}>
        <ErrorBoundary fallback={<SectionErrorFallback section="Approach" />}>
          <Approach />
        </ErrorBoundary>
      </Suspense>
      <Suspense fallback={<Loading message="Loading workflow diagram..." />}>
        <ErrorBoundary fallback={<SectionErrorFallback section="Workflow Diagram" />}>
          <WorkflowDiagram />
        </ErrorBoundary>
      </Suspense>
      <Suspense fallback={<Loading message="Loading architecture..." />}>
        <ErrorBoundary fallback={<SectionErrorFallback section="Architecture" />}>
          <MCPArchitecture />
        </ErrorBoundary>
      </Suspense>
      <Suspense fallback={<Loading message="Loading voice biomarkers..." />}>
        <ErrorBoundary fallback={<SectionErrorFallback section="Voice Biomarkers" />}>
          <VoiceBiomarkerFlow />
        </ErrorBoundary>
      </Suspense>
      <Suspense fallback={<Loading message="Loading clinical impact dashboard..." />}>
        <ErrorBoundary fallback={<SectionErrorFallback section="Clinical Impact" />}>
          <ClinicalImpactDashboard />
        </ErrorBoundary>
      </Suspense>
      <Suspense fallback={<Loading message="Loading ROI calculator..." />}>
        <ErrorBoundary fallback={<SectionErrorFallback section="ROI Calculator" />}>
          <ROICalculator />
        </ErrorBoundary>
      </Suspense>
      <Suspense fallback={<Loading message="Loading video generator..." />}>
        <ErrorBoundary fallback={<SectionErrorFallback section="Video Generator" />}>
          <VideoGenerator />
        </ErrorBoundary>
      </Suspense>
      <Suspense fallback={<Loading message="Loading contact form..." />}>
        <ErrorBoundary fallback={<SectionErrorFallback section="Contact" />}>
          <Contact />
        </ErrorBoundary>
      </Suspense>
    </>
  );
}
