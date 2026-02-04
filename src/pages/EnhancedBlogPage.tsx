import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Tag, Search, ArrowRight, Sparkles, TrendingUp, BookOpen } from 'lucide-react';
import { getPublishedPosts, getFeaturedPosts, getAllCategories, getAllTags, type BlogPost } from '../data/blogPosts';
import { EnhancedBlogCard } from '../components/blog/EnhancedBlogCard';
import { BlogSearch } from '../components/blog/BlogSearch';
import { NewsletterSubscription } from '../components/newsletter/NewsletterSubscription';

function BlogStats({ posts }: { posts: BlogPost[] }) {
  const stats = useMemo(() => {
    const totalPosts = posts.length;
    const totalReadingTime = posts.reduce((acc, post) => acc + post.readingTime, 0);
    const categories = new Set(posts.map(post => post.category)).size;
    const avgReadingTime = Math.round(totalReadingTime / totalPosts);

    return { totalPosts, totalReadingTime, categories, avgReadingTime };
  }, [posts]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 bg-sinai-cyan/10 rounded-xl mb-2">
          <BookOpen className="w-6 h-6 text-sinai-cyan" />
        </div>
        <div className="text-2xl font-bold text-sinai-navy">{stats.totalPosts}</div>
        <div className="text-sm text-gray-600">Articles</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 bg-sinai-magenta/10 rounded-xl mb-2">
          <Clock className="w-6 h-6 text-sinai-magenta" />
        </div>
        <div className="text-2xl font-bold text-sinai-navy">{stats.totalReadingTime}</div>
        <div className="text-sm text-gray-600">Total Minutes</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 bg-sinai-violet/10 rounded-xl mb-2">
          <Tag className="w-6 h-6 text-sinai-violet" />
        </div>
        <div className="text-2xl font-bold text-sinai-navy">{stats.categories}</div>
        <div className="text-sm text-gray-600">Categories</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 bg-sinai-navy/10 rounded-xl mb-2">
          <TrendingUp className="w-6 h-6 text-sinai-navy" />
        </div>
        <div className="text-2xl font-bold text-sinai-navy">{stats.avgReadingTime}</div>
        <div className="text-sm text-gray-600">Avg. Reading</div>
      </motion.div>
    </div>
  );
}

function PopularTags({ tags }: { tags: string[] }) {
  // Get top 8 most used tags
  const topTags = tags.slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-gray-50 to-sinai-cyan/5 rounded-xl p-6"
    >
      <h3 className="text-lg font-bold text-sinai-navy mb-4 flex items-center gap-2">
        <Tag className="w-5 h-5" />
        Popular Topics
      </h3>
      <div className="flex flex-wrap gap-2">
        {topTags.map((tag) => (
          <Link
            key={tag}
            to={`/blog?tag=${encodeURIComponent(tag)}`}
            className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg hover:border-sinai-cyan hover:text-sinai-cyan hover:bg-sinai-cyan/5 transition-all duration-200"
          >
            {tag}
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

export default function EnhancedBlogPage() {
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [showFeatured, setShowFeatured] = useState(true);

  const allPosts = getPublishedPosts();
  const featuredPosts = getFeaturedPosts();
  const allTags = getAllTags();

  const handleSearchResults = (results: BlogPost[]) => {
    setFilteredPosts(results);
    setShowFeatured(results.length === allPosts.length); // Only show featured section when no filters
  };

  const displayPosts = filteredPosts.length > 0 ? filteredPosts : allPosts;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sinai-navy via-sinai-dark to-sinai-violet py-20 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-sinai-cyan rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-sinai-magenta rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Healthcare AI Insights
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
            >
              Exploring the intersection of healthcare and AI. In-depth articles on building
              secure clinical applications, agentic development, and cutting-edge medical technology.
            </motion.p>

            <BlogStats posts={allPosts} />
          </div>
        </div>
      </section>

      {/* Search Section */}
      <BlogSearch 
        posts={allPosts} 
        onResults={handleSearchResults}
        className="shadow-sm"
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Posts */}
            {showFeatured && featuredPosts.length > 0 && (
              <section className="mb-12">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-2xl font-bold text-sinai-navy mb-6 flex items-center gap-2"
                >
                  <Sparkles className="w-6 h-6 text-sinai-magenta" />
                  Featured Articles
                </motion.h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {featuredPosts.slice(0, 2).map((post) => (
                    <EnhancedBlogCard key={post.id} post={post} featured showAuthorBio />
                  ))}
                </div>
              </section>
            )}

            {/* All Posts */}
            <section>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-2xl font-bold text-sinai-navy mb-6 flex items-center gap-2"
              >
                <BookOpen className="w-6 h-6 text-sinai-cyan" />
                {filteredPosts.length !== allPosts.length ? 'Search Results' : 'All Articles'}
                <span className="text-base font-normal text-gray-500">
                  ({displayPosts.length} articles)
                </span>
              </motion.h2>

              {displayPosts.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-8">
                  {displayPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <EnhancedBlogCard post={post} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your search criteria or browse our featured content.
                  </p>
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 text-sinai-cyan hover:text-sinai-magenta font-medium"
                  >
                    View all articles
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Newsletter Subscription */}
            <NewsletterSubscription variant="sidebar" />

            {/* Popular Tags */}
            <PopularTags tags={allTags} />

            {/* Recent Posts Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-bold text-sinai-navy mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Latest Posts
              </h3>
              <div className="space-y-4">
                {allPosts.slice(0, 3).map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="block group"
                  >
                    <h4 className="font-medium text-gray-900 group-hover:text-sinai-cyan transition-colors mb-1 line-clamp-2">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.publishedAt).toLocaleDateString()}
                      <span>•</span>
                      <Clock className="w-3 h-3" />
                      {post.readingTime} min
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Newsletter CTA */}
      <NewsletterSubscription />
    </div>
  );
}