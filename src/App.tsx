import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navigation } from './components/Navigation';
import { Loading } from './components/Loading';
import { AuthProvider } from './contexts/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import './index.css';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const PatientEducation = lazy(() => import('./pages/PatientEducation'));
const SecureCodingCourse = lazy(() => import('./pages/SecureCodingCourse'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const BlogAdminPage = lazy(() => import('./pages/BlogAdminPage'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const Footer = lazy(() => import('./components/Footer').then(m => ({ default: m.Footer })));

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen">
            <a href="#main-content" className="skip-to-main">
              Skip to main content
            </a>
            <Navigation />
            <AuthModal />
            <main id="main-content">
              <Suspense fallback={<Loading message="Loading page..." />}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/patient-education" element={<PatientEducation />} />
                  <Route path="/secure-coding" element={<SecureCodingCourse />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<BlogPostPage />} />
                  <Route path="/blog-admin" element={<BlogAdminPage />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <UserDashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Suspense>
            </main>
            <Suspense fallback={<Loading />}>
              <Footer />
            </Suspense>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
