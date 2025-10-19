import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { MountSinaiLogo } from './MountSinaiLogo';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Overview', href: '#overview', isHash: true },
    { name: 'Projects', href: '#projects', isHash: true },
    { name: 'Approach', href: '#approach', isHash: true },
    { name: 'Impact', href: '#impact', isHash: true },
    { name: 'Video Generator', href: '#video-generator', isHash: true },
    { name: 'Patient Education', href: '/patient-education', isHash: false },
    { name: 'Contact', href: '#contact', isHash: true },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
              aria-label="Mount Sinai Agentic Laboratory home"
            >
              <img
                src="/mount-sinai-logo-production.png"
                alt="Mount Sinai Health System"
                className="h-10 w-auto"
              />
              <div>
                <div className="text-sm font-bold text-sinai-navy">Agentic Laboratory</div>
                <div className="text-xs text-gray-600">Mount Sinai West</div>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => {
              if (link.isHash) {
                const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                  // If we're not on the home page, navigate there first
                  if (location.pathname !== '/') {
                    e.preventDefault();
                    window.location.href = '/' + link.href;
                  }
                };

                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={handleHashClick}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-gray-700 hover:text-sinai-blue-600 font-medium transition-colors relative group"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sinai-blue-600 group-hover:w-full transition-all duration-300" />
                  </motion.a>
                );
              } else {
                return (
                  <Link key={link.name} to={link.href}>
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-gray-700 hover:text-sinai-blue-600 font-medium transition-colors relative group"
                    >
                      {link.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sinai-blue-600 group-hover:w-full transition-all duration-300" />
                    </motion.div>
                  </Link>
                );
              }
            })}
            <motion.a
              href="https://github.com/jeffbander"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              className="p-2 text-gray-700 hover:text-sinai-blue-600 transition-colors"
            >
              <Github className="w-5 h-5" />
            </motion.a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-700 hover:text-sinai-blue-600 transition-colors"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
            role="menu"
            aria-label="Mobile navigation menu"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => {
                if (link.isHash) {
                  const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                    setIsOpen(false);
                    // If we're not on the home page, navigate there first
                    if (location.pathname !== '/') {
                      e.preventDefault();
                      window.location.href = '/' + link.href;
                    }
                  };

                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={handleHashClick}
                      className="block py-2 text-gray-700 hover:text-sinai-blue-600 font-medium transition-colors"
                    >
                      {link.name}
                    </a>
                  );
                } else {
                  return (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block py-2 text-gray-700 hover:text-sinai-blue-600 font-medium transition-colors"
                    >
                      {link.name}
                    </Link>
                  );
                }
              })}
              <a
                href="https://github.com/jeffbander"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 py-2 text-gray-700 hover:text-sinai-blue-600 font-medium transition-colors"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
