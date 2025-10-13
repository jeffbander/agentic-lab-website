import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { ProjectsSection } from './components/projects/ProjectsSection';
import { WorkflowDiagram } from './components/diagrams/WorkflowDiagram';
import { MCPArchitecture } from './components/architecture/MCPArchitecture';
import { VoiceBiomarkerFlow } from './components/biomarkers/VoiceBiomarkerFlow';
import { ClinicalImpactDashboard } from './components/charts/ClinicalImpactDashboard';
import { ROICalculator } from './components/calculator/ROICalculator';
import { Footer } from './components/Footer';
import './index.css';

function App() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <ProjectsSection />
        <WorkflowDiagram />
        <MCPArchitecture />
        <VoiceBiomarkerFlow />
        <ClinicalImpactDashboard />
        <ROICalculator />
      </main>
      <Footer />
    </div>
  );
}

export default App;
