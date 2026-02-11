import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Calendar, Clock, Tag, ArrowLeft, Share2, Twitter, Linkedin, Copy, Check, Sparkles, List } from 'lucide-react';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { getBlogPostBySlug, getPublishedPosts, type BlogPost } from '../data/blogPosts';
import { markdownComponents } from '../components/blog/MarkdownRenderers';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function extractTocItems(content: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/\*\*/g, '').replace(/`/g, '').trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    items.push({ id, text, level });
  }
  return items;
}

function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setProgress(Math.min((scrollTop / docHeight) * 100, 100));
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <div className="reading-progress-bar" style={{ width: `${progress}%` }} />;
}

function TableOfContents({ items, activeId }: { items: TocItem[]; activeId: string }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <List className="w-5 h-5" />
        On this page
      </h3>
      <div className="space-y-0.5 border-l-2 border-gray-200 pl-3">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`toc-link ${item.level === 3 ? 'toc-link-h3' : ''} ${activeId === item.id ? 'active' : ''}`}
          >
            <span className="line-clamp-2">{item.text}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

function ShareButton({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium transition-colors"
      aria-label={label}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function RelatedPostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative h-32 overflow-hidden">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sinai-navy to-sinai-violet flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white/30" />
          </div>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs text-sinai-cyan font-medium">{post.category}</span>
        <h4 className="font-semibold text-gray-900 mt-1 line-clamp-2 group-hover:text-sinai-cyan transition-colors">
          {post.title}
        </h4>
        <p className="text-xs text-gray-500 mt-2">{post.readingTime} min read</p>
      </div>
    </Link>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [activeHeading, setActiveHeading] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  const post = slug ? getBlogPostBySlug(slug) : undefined;
  const allPosts = getPublishedPosts();

  const tocItems = useMemo(() => {
    if (!post) return [];
    return extractTocItems(post.content);
  }, [post]);

  // Get related posts (same category or shared tags, excluding current)
  const relatedPosts = allPosts
    .filter((p) => {
      if (p.slug === slug) return false;
      if (p.category === post?.category) return true;
      if (post?.tags.some((tag) => p.tags.includes(tag))) return true;
      return false;
    })
    .slice(0, 3);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Track active heading for TOC highlighting
  const handleScroll = useCallback(() => {
    if (tocItems.length === 0) return;
    const headings = tocItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    let current = '';
    for (const heading of headings) {
      const rect = heading.getBoundingClientRect();
      if (rect.top <= 120) {
        current = heading.id;
      }
    }
    setActiveHeading(current);
  }, [tocItems]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Handle copy link
  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle share
  const handleShareTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(post?.title || '');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-sinai-cyan hover:bg-sinai-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-gray-50">
      {/* Reading Progress Bar */}
      <ReadingProgressBar />

      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-sinai-navy via-sinai-dark to-sinai-violet py-16 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-48 h-48 bg-sinai-cyan rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-sinai-magenta rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Blog
            </button>
          </motion.div>

          {/* Category & Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-4 mb-4"
          >
            <span className="px-3 py-1 bg-sinai-cyan text-white text-sm font-medium rounded-full">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-gray-300 text-sm">
              <Calendar className="w-4 h-4" />
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1 text-gray-300 text-sm">
              <Clock className="w-4 h-4" />
              {post.readingTime} min read
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            {post.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-300 mb-8"
          >
            {post.subtitle}
          </motion.p>

          {/* Author */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sinai-cyan to-sinai-magenta flex items-center justify-center text-white font-bold text-lg">
              {post.author.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-white">{post.author.name}</p>
              <p className="text-sm text-gray-400">{post.author.role}</p>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <motion.img
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            src={post.coverImage}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-xl"
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-[1fr_260px] gap-12">
          {/* Main Content */}
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="blog-content prose prose-lg max-w-none prose-headings:text-sinai-navy prose-a:text-sinai-cyan prose-pre:bg-sinai-dark prose-pre:text-gray-100"
          >
            <ReactMarkdown components={markdownComponents}>
              {post.content}
            </ReactMarkdown>
          </motion.div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* Table of Contents */}
              {tocItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white rounded-xl p-5 shadow-md"
                >
                  <TableOfContents items={tocItems} activeId={activeHeading} />
                </motion.div>
              )}

              {/* Share */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-xl p-5 shadow-md"
              >
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share this article
                </h3>
                <div className="flex flex-wrap gap-2">
                  <ShareButton icon={Twitter} label="Twitter" onClick={handleShareTwitter} />
                  <ShareButton icon={Linkedin} label="LinkedIn" onClick={handleShareLinkedIn} />
                  <ShareButton
                    icon={copied ? Check : Copy}
                    label={copied ? 'Copied!' : 'Copy link'}
                    onClick={handleCopyLink}
                  />
                </div>
              </motion.div>

              {/* Tags */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white rounded-xl p-5 shadow-md"
              >
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-sinai-cyan hover:text-white text-gray-700 text-sm rounded-full transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </aside>
        </div>

        {/* Mobile share & tags (visible below content on small screens) */}
        <div className="lg:hidden mt-10 space-y-6">
          <div className="bg-white rounded-xl p-5 shadow-md">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Share this article
            </h3>
            <div className="flex flex-wrap gap-2">
              <ShareButton icon={Twitter} label="Twitter" onClick={handleShareTwitter} />
              <ShareButton icon={Linkedin} label="LinkedIn" onClick={handleShareLinkedIn} />
              <ShareButton
                icon={copied ? Check : Copy}
                label={copied ? 'Copied!' : 'Copy link'}
                onClick={handleCopyLink}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-sinai-cyan hover:text-white text-gray-700 text-sm rounded-full transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 pt-12 border-t border-gray-200"
          >
            <h2 className="text-2xl font-bold text-sinai-navy mb-8">Related Articles</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <RelatedPostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </motion.section>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-8 py-4 bg-sinai-navy hover:bg-sinai-dark text-white font-medium rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to All Articles
          </Link>
        </motion.div>
      </div>
    </article>
  );
}
