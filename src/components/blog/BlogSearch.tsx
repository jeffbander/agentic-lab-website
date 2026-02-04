import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, Filter, Tag, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BlogPost } from '../../data/blogPosts';
import { getAllCategories, getAllTags } from '../../data/blogPosts';

interface BlogSearchProps {
  posts: BlogPost[];
  onResults: (filteredPosts: BlogPost[]) => void;
  className?: string;
}

interface SearchFilters {
  query: string;
  category: string | null;
  tags: string[];
  dateRange: 'all' | 'month' | 'quarter' | 'year';
}

export function BlogSearch({ posts, onResults, className = '' }: BlogSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: null,
    tags: [],
    dateRange: 'all'
  });
  
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const allCategories = getAllCategories();
  const allTags = getAllTags();

  // Filter posts based on current filters
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Text search
      const matchesQuery = !filters.query || 
        post.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(filters.query.toLowerCase()) ||
        post.content.toLowerCase().includes(filters.query.toLowerCase()) ||
        post.author.name.toLowerCase().includes(filters.query.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(filters.query.toLowerCase()));

      // Category filter
      const matchesCategory = !filters.category || post.category === filters.category;

      // Tags filter
      const matchesTags = filters.tags.length === 0 || 
        filters.tags.some(tag => post.tags.includes(tag));

      // Date range filter
      const matchesDateRange = (() => {
        if (filters.dateRange === 'all') return true;
        
        const postDate = new Date(post.publishedAt);
        const now = new Date();
        const diffTime = now.getTime() - postDate.getTime();
        const diffDays = diffTime / (1000 * 3600 * 24);

        switch (filters.dateRange) {
          case 'month': return diffDays <= 30;
          case 'quarter': return diffDays <= 90;
          case 'year': return diffDays <= 365;
          default: return true;
        }
      })();

      return matchesQuery && matchesCategory && matchesTags && matchesDateRange;
    });
  }, [posts, filters]);

  // Update results whenever filtered posts change
  useEffect(() => {
    onResults(filteredPosts);
  }, [filteredPosts, onResults]);

  const updateQuery = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
    
    // Add to search history if it's a meaningful query
    if (query.length > 2 && !searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev.slice(0, 4)]); // Keep last 5 searches
    }
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      category: null,
      tags: [],
      dateRange: 'all'
    });
    searchInputRef.current?.focus();
  };

  const hasActiveFilters = filters.query || filters.category || 
    filters.tags.length > 0 || filters.dateRange !== 'all';

  return (
    <div className={`bg-white border-b border-gray-200 sticky top-16 z-30 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search articles, authors, tags..."
            value={filters.query}
            onChange={(e) => updateQuery(e.target.value)}
            className="w-full pl-12 pr-20 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sinai-cyan focus:border-transparent text-lg"
          />
          
          {/* Clear Search */}
          {filters.query && (
            <button
              onClick={() => updateQuery('')}
              className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          
          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${
              showAdvancedFilters 
                ? 'text-sinai-cyan bg-sinai-cyan/10' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Search History */}
        {filters.query === '' && searchHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 flex items-center gap-2"
          >
            <span className="text-sm text-gray-500">Recent searches:</span>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((query, index) => (
                <button
                  key={index}
                  onClick={() => updateQuery(query)}
                  className="text-sm text-sinai-cyan hover:text-sinai-magenta transition-colors"
                >
                  {query}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Advanced Filters */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-6 p-4 bg-gray-50 rounded-lg"
            >
              <div className="grid md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Category
                  </label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      category: e.target.value || null 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sinai-cyan"
                  >
                    <option value="">All Categories</option>
                    {allCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Published
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      dateRange: e.target.value as SearchFilters['dateRange']
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sinai-cyan"
                  >
                    <option value="all">All Time</option>
                    <option value="month">Last Month</option>
                    <option value="quarter">Last 3 Months</option>
                    <option value="year">Last Year</option>
                  </select>
                </div>

                {/* Results Count */}
                <div className="flex items-end">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{filteredPosts.length}</span> articles found
                  </div>
                </div>
              </div>

              {/* Tag Filter */}
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  <Tag className="inline w-4 h-4 mr-1" />
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 text-sm rounded-full border transition-all ${
                        filters.tags.includes(tag)
                          ? 'bg-sinai-cyan text-white border-sinai-cyan'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-sinai-cyan hover:text-sinai-cyan'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters & Clear */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center justify-between"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">Active filters:</span>
              
              {filters.category && (
                <span className="px-2 py-1 bg-sinai-cyan/10 text-sinai-cyan text-sm rounded-md">
                  {filters.category}
                </span>
              )}
              
              {filters.tags.map(tag => (
                <span 
                  key={tag}
                  className="px-2 py-1 bg-sinai-magenta/10 text-sinai-magenta text-sm rounded-md"
                >
                  {tag}
                </span>
              ))}
              
              {filters.dateRange !== 'all' && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-md">
                  {filters.dateRange === 'month' ? 'Last Month' :
                   filters.dateRange === 'quarter' ? 'Last 3 Months' : 'Last Year'}
                </span>
              )}
            </div>

            <button
              onClick={clearFilters}
              className="text-sm text-sinai-magenta hover:text-sinai-maroon-700 font-medium"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}