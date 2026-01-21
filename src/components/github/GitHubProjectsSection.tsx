import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Clock, RefreshCw, Filter, Globe } from 'lucide-react';

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
  'Administrative': '📊',
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

export function GitHubProjectsSection() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
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

  const filteredRepos = selectedCategory === 'all'
    ? repos
    : repos.filter(repo => repo.category === selectedCategory);

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
            All ({repos.length})
          </button>
          {categories.map(category => (
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
                ({repos.filter(r => r.category === category).length})
              </span>
            </button>
          ))}
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

        {/* Projects Grid */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredRepos.map((repo, index) => (
              <motion.div
                key={repo.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Category Header */}
                <div className="h-1.5 bg-gradient-to-r from-sinai-blue-500 to-sinai-maroon-500" />

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
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {repo.summary}
                  </p>

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
            ))}
          </motion.div>
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
              <div className="text-3xl font-bold text-sinai-blue-600">{categories.length}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sinai-blue-600">
                {repos.filter(r => r.language === 'TypeScript').length}
              </div>
              <div className="text-sm text-gray-600">TypeScript Apps</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sinai-blue-600">
                {repos.filter(r => ['Patient Communication', 'Voice AI', 'Clinical Operations'].includes(r.category || '')).length}
              </div>
              <div className="text-sm text-gray-600">Clinical Tools</div>
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
