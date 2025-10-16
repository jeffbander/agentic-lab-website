import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navigation } from './components/Navigation';
import { Loading } from './components/Loading';
import './index.css';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const PatientEducation = lazy(() => import('./pages/PatientEducation'));
const Footer = lazy(() => import('./components/Footer').then(m => ({ default: m.Footer })));

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen">
          <a href="#main-content" className="skip-to-main">
            Skip to main content
          </a>
          <Navigation />
          <main id="main-content">
            <Suspense fallback={<Loading message="Loading page..." />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/patient-education" element={<PatientEducation />} />
              </Routes>
            </Suspense>
          </main>
          <Suspense fallback={<Loading />}>
            <Footer />
          </Suspense>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
