import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, User, LogOut, Video, ChevronDown, ExternalLink } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { user, isAuthenticated, logout, showAuthModal } = useAuth();

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary links shown directly in header
  const primaryLinks = [
    { name: 'Projects', href: '#projects', isHash: true, isExternal: false },
    { name: 'Secure Coding', href: '/secure-coding', isHash: false, isExternal: false },
    { name: 'Contact', href: '#contact', isHash: true, isExternal: false },
    { name: 'About Us', href: 'https://the-agentic-laboratory-474mign.gamma.site/', isHash: false, isExternal: true },
  ];

  // Secondary links in the hamburger/more menu
  const moreLinks = [
    { name: 'Overview', href: '#overview', isHash: true, isExternal: false },
    { name: 'Approach', href: '#approach', isHash: true, isExternal: false },
    { name: 'Podcast', href: '#podcast', isHash: true, isExternal: false },
    { name: 'Video Generator', href: '#video-generator', isHash: true, isExternal: false },
    { name: 'Patient Education', href: '/patient-education', isHash: false, isExternal: false },
    { name: 'Blog', href: '/blog', isHash: false, isExternal: false },
  ];

  // All links combined for mobile menu
  const allLinks = [...primaryLinks, ...moreLinks];

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
          <div className="hidden md:flex items-center space-x-6">
            {/* Primary Links */}
            {primaryLinks.map((link, index) => {
              if (link.isExternal) {
                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-gray-700 hover:text-sinai-blue-600 font-medium transition-colors relative group flex items-center gap-1"
                  >
                    {link.name}
                    <ExternalLink className="w-3 h-3" />
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sinai-blue-600 group-hover:w-full transition-all duration-300" />
                  </motion.a>
                );
              } else if (link.isHash) {
                const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
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

            {/* More Menu (hamburger dropdown for remaining links) */}
            <div className="relative" ref={moreMenuRef}>
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className="flex items-center gap-1 text-gray-700 hover:text-sinai-blue-600 font-medium transition-colors p-2 rounded-lg hover:bg-gray-100"
                aria-label="More links"
                aria-expanded={moreMenuOpen}
              >
                <Menu className="w-5 h-5" />
                <ChevronDown className={`w-3 h-3 transition-transform ${moreMenuOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {moreMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-50"
                  >
                    {moreLinks.map((link) => {
                      if (link.isHash) {
                        const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                          setMoreMenuOpen(false);
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
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-sinai-blue-600 transition-colors"
                          >
                            {link.name}
                          </a>
                        );
                      } else {
                        return (
                          <Link
                            key={link.name}
                            to={link.href}
                            onClick={() => setMoreMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-sinai-blue-600 transition-colors"
                          >
                            {link.name}
                          </Link>
                        );
                      }
                    })}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <a
                        href="https://github.com/jeffbander"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMoreMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-sinai-blue-600 transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        GitHub
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu / Sign In */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-sinai-cyan-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-sinai-cyan-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {user?.displayName}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50"
                    >
                      <Link
                        to="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Video className="w-4 h-4" />
                        My Videos
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => showAuthModal('login')}
                className="px-4 py-2 bg-sinai-cyan-600 hover:bg-sinai-cyan-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Sign In
              </motion.button>
            )}
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
              {allLinks.map((link) => {
                if (link.isExternal) {
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-1 py-2 text-gray-700 hover:text-sinai-blue-600 font-medium transition-colors"
                    >
                      {link.name}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  );
                } else if (link.isHash) {
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

              {/* Mobile User Menu / Sign In */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 py-2 text-gray-900 font-medium">
                      <div className="w-8 h-8 bg-sinai-cyan-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-sinai-cyan-600" />
                      </div>
                      <span>{user?.displayName}</span>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 py-2 text-gray-700 hover:text-sinai-blue-600 font-medium transition-colors"
                    >
                      <Video className="w-5 h-5" />
                      <span>My Videos</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-2 py-2 text-gray-700 hover:text-red-600 font-medium transition-colors w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      showAuthModal('login');
                      setIsOpen(false);
                    }}
                    className="w-full py-2 bg-sinai-cyan-600 hover:bg-sinai-cyan-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
