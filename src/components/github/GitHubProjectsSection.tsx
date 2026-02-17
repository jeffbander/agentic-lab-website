import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Clock, RefreshCw, Filter, Globe, ChevronDown, ChevronUp, Stethoscope, Building2, Code2, Layers } from 'lucide-react';

type AppType = 'Clinical' | 'Healthcare Management';

interface GitHubRepo {
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  language: string | null;
  updatedAt: string;
  pushedAt: string;
  topics: string[];
  stargazersCount: number;
  forksCount: number;
  isArchived: boolean;
  category?: string;
  displayName?: string;
  summary?: string;
  appType?: AppType;
  techStack?: string[];
  keyFeatures?: string[];
}

interface GitHubResponse {
  repos: GitHubRepo[];
  total: number;
  categories: string[];
  lastUpdated: string;
}

const languageColors: Record<string, string> = {
  TypeScript: 'bg-blue-500',
  JavaScript: 'bg-yellow-400',
  Python: 'bg-green-500',
  HTML: 'bg-orange-500',
  CSS: 'bg-purple-500',
  Go: 'bg-cyan-500',
  Rust: 'bg-red-600',
  Java: 'bg-red-500',
  Dart: 'bg-sky-400',
  Batchfile: 'bg-gray-500',
};

const categoryIcons: Record<string, string> = {
  'Patient Communication': '💬',
  'Voice AI': '🎙️',
  'Clinical Operations': '🏥',
  'EHR Integration': '🔗',
  'Clinical Trials': '📋',
  'Research': '🔬',
  'Preventive Care': '❤️',
  'Cardiology': '💓',
  'Wellness': '🧠',
  'Revenue Cycle': '💰',
  'Scheduling': '📅',
  'Operations': '⚙️',
  'Infrastructure': '🔧',
  'Website': '🌐',
  'Other': '📁',
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

function ProjectCard({ repo }: { repo: GitHubRepo }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      {/* Category Header Gradient */}
      <div className={`h-1.5 ${
        repo.appType === 'Clinical'
          ? 'bg-gradient-to-r from-sinai-blue-500 to-emerald-500'
          : 'bg-gradient-to-r from-sinai-maroon-500 to-amber-500'
      }`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-lg">{categoryIcons[repo.category || 'Other']}</span>
              <span className="text-xs font-medium text-sinai-blue-600 bg-sinai-blue-50 px-2 py-0.5 rounded">
                {repo.category}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-sinai-blue-600 transition-colors">
              {repo.displayName}
            </h3>
          </div>
          {repo.language && (
            <div className="flex items-center space-x-1.5">
              <span className={`w-3 h-3 rounded-full ${languageColors[repo.language] || 'bg-gray-400'}`} />
              <span className="text-xs text-gray-500">{repo.language}</span>
            </div>
          )}
        </div>

        {/* Summary */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {repo.summary}
        </p>

        {/* Tech Stack */}
        {repo.techStack && repo.techStack.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center space-x-1 mb-1.5">
              <Code2 className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tech Stack</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {repo.techStack.slice(0, 5).map(tech => (
                <span
                  key={tech}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                >
                  {tech}
                </span>
              ))}
              {repo.techStack.length > 5 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-50 text-gray-400">
                  +{repo.techStack.length - 5}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Topics/Tags */}
        {repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {repo.topics.slice(0, 4).map(topic => (
              <span
                key={topic}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
              >
                {topic}
              </span>
            ))}
            {repo.topics.length > 4 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-400">
                +{repo.topics.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Expandable Key Features */}
        {repo.keyFeatures && repo.keyFeatures.length > 0 && (
          <div className="mb-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center space-x-1 text-xs font-semibold text-sinai-blue-600 hover:text-sinai-blue-700 transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Key Features ({repo.keyFeatures.length})</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <AnimatePresence>
              {expanded && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2 space-y-1 overflow-hidden"
                >
                  {repo.keyFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start space-x-2 text-xs text-gray-600">
                      <span className="text-sinai-blue-500 mt-0.5 flex-shrink-0">&#8226;</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Updated {formatTimeAgo(repo.updatedAt)}</span>
          </div>
          {repo.stargazersCount > 0 && (
            <div className="flex items-center space-x-1">
              <span>⭐</span>
              <span>{repo.stargazersCount}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <motion.a
            href={repo.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>View Code</span>
          </motion.a>
          {repo.homepage && (
            <motion.a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center space-x-2 px-3 py-2 border-2 border-sinai-blue-600 text-sinai-blue-600 rounded-lg text-sm font-medium hover:bg-sinai-blue-50 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>Demo</span>
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function GitHubProjectsSection() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAppType, setSelectedAppType] = useState<AppType | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchRepos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/github-repos?featured=true');
      if (!response.ok) throw new Error('Failed to fetch repositories');
      const data: GitHubResponse = await response.json();
      setRepos(data.repos);
      setCategories(data.categories);
      setLastUpdated(data.lastUpdated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const filteredRepos = repos.filter(repo => {
    const matchesCategory = selectedCategory === 'all' || repo.category === selectedCategory;
    const matchesAppType = selectedAppType === 'all' || repo.appType === selectedAppType;
    return matchesCategory && matchesAppType;
  });

  const clinicalRepos = filteredRepos.filter(r => r.appType === 'Clinical');
  const managementRepos = filteredRepos.filter(r => r.appType === 'Healthcare Management');

  // Get categories relevant to the selected app type
  const visibleCategories = selectedAppType === 'all'
    ? categories
    : categories.filter(cat =>
        repos.some(r => r.category === cat && r.appType === selectedAppType)
      );

  const clinicalCount = repos.filter(r => r.appType === 'Clinical').length;
  const managementCount = repos.filter(r => r.appType === 'Healthcare Management').length;

  return (
    <section id="projects" className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Github className="w-8 h-8 text-gray-900" />
            <h2 className="text-4xl font-bold text-gray-900">Live GitHub Projects</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time view of our healthcare AI projects. These applications are actively developed
            using agentic coding techniques at the Mount Sinai West Agentic Laboratory.
          </p>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-2 flex items-center justify-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Last synced: {new Date(lastUpdated).toLocaleString()}</span>
              <button
                onClick={fetchRepos}
                className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </p>
          )}
        </motion.div>

        {/* App Type Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <button
            onClick={() => { setSelectedAppType('all'); setSelectedCategory('all'); }}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              selectedAppType === 'all'
                ? 'bg-gray-900 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
            }`}
          >
            <span>All Projects ({repos.length})</span>
          </button>
          <button
            onClick={() => { setSelectedAppType('Clinical'); setSelectedCategory('all'); }}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              selectedAppType === 'Clinical'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-emerald-50 shadow-sm'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Clinical Apps ({clinicalCount})</span>
          </button>
          <button
            onClick={() => { setSelectedAppType('Healthcare Management'); setSelectedCategory('all'); }}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              selectedAppType === 'Healthcare Management'
                ? 'bg-amber-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-amber-50 shadow-sm'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Healthcare Management ({managementCount})</span>
          </button>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-8"
        >
          <Filter className="w-5 h-5 text-gray-500 mr-2" />
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-sinai-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Categories ({filteredRepos.length})
          </button>
          {visibleCategories.map(category => {
            const categoryCount = repos.filter(r => r.category === category && (selectedAppType === 'all' || r.appType === selectedAppType)).length;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center space-x-1 ${
                  selectedCategory === category
                    ? 'bg-sinai-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{categoryIcons[category] || '📁'}</span>
                <span>{category}</span>
                <span className="text-xs opacity-75">
                  ({categoryCount})
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-sinai-blue-600 animate-spin" />
            <span className="ml-3 text-gray-600">Loading projects from GitHub...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchRepos}
              className="px-4 py-2 bg-sinai-blue-600 text-white rounded-lg hover:bg-sinai-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Projects Display */}
        {!loading && !error && (
          <>
            {/* When showing "All" - display in two sections */}
            {selectedAppType === 'all' ? (
              <>
                {/* Clinical Apps Section */}
                {clinicalRepos.length > 0 && (
                  <div className="mb-12">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="flex items-center space-x-3 mb-6"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100">
                        <Stethoscope className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Clinical Applications</h3>
                        <p className="text-sm text-gray-500">
                          Patient care, clinical decision support, diagnostics & monitoring
                        </p>
                      </div>
                      <span className="ml-auto bg-emerald-100 text-emerald-700 text-sm font-semibold px-3 py-1 rounded-full">
                        {clinicalRepos.length} apps
                      </span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {clinicalRepos.map((repo) => (
                        <ProjectCard key={repo.name} repo={repo} />
                      ))}
                    </motion.div>
                  </div>
                )}

                {/* Healthcare Management Section */}
                {managementRepos.length > 0 && (
                  <div className="mb-12">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="flex items-center space-x-3 mb-6"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100">
                        <Building2 className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Healthcare Management</h3>
                        <p className="text-sm text-gray-500">
                          Operations, research, billing, scheduling & infrastructure
                        </p>
                      </div>
                      <span className="ml-auto bg-amber-100 text-amber-700 text-sm font-semibold px-3 py-1 rounded-full">
                        {managementRepos.length} apps
                      </span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {managementRepos.map((repo) => (
                        <ProjectCard key={repo.name} repo={repo} />
                      ))}
                    </motion.div>
                  </div>
                )}
              </>
            ) : (
              /* When filtered by app type - show as flat grid */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredRepos.map((repo) => (
                  <ProjectCard key={repo.name} repo={repo} />
                ))}
              </motion.div>
            )}
          </>
        )}

        {/* Stats */}
        {!loading && !error && repos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-sinai-blue-600">{repos.length}</div>
              <div className="text-sm text-gray-600">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">{clinicalCount}</div>
              <div className="text-sm text-gray-600">Clinical Apps</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">{managementCount}</div>
              <div className="text-sm text-gray-600">Management Apps</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sinai-blue-600">{categories.length}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sinai-blue-600">
                {repos.filter(r => r.language === 'TypeScript').length}
              </div>
              <div className="text-sm text-gray-600">TypeScript Apps</div>
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <a
            href="https://github.com/jeffbander"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            <Github className="w-5 h-5" />
            <span>View All Repositories on GitHub</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
