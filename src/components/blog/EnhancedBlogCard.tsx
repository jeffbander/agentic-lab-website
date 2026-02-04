import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag, ArrowRight, Sparkles, User, ExternalLink } from 'lucide-react';
import type { BlogPost } from '../../data/blogPosts';

interface EnhancedBlogCardProps {
  post: BlogPost;
  featured?: boolean;
  showAuthorBio?: boolean;
}

export function EnhancedBlogCard({ post, featured = false, showAuthorBio = false }: EnhancedBlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
        featured ? 'md:col-span-2 md:grid md:grid-cols-2' : ''
      }`}
    >
      {/* Cover Image */}
      <div className={`relative overflow-hidden ${featured ? 'h-64 md:h-full' : 'h-48'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-sinai-cyan/20 to-sinai-magenta/20" />
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sinai-navy to-sinai-violet flex items-center justify-center">
            <Sparkles className="w-16 h-16 text-white/30" />
          </div>
        )}
        
        {/* Category Badge */}
        <span className="absolute top-4 left-4 px-3 py-1 bg-sinai-cyan text-white text-sm font-medium rounded-full">
          {post.category}
        </span>
        
        {/* Featured Badge */}
        {featured && (
          <span className="absolute top-4 right-4 px-3 py-1 bg-sinai-magenta text-white text-sm font-medium rounded-full">
            Featured
          </span>
        )}

        {/* Reading Time Overlay */}
        <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/50 text-white text-xs rounded-md backdrop-blur-sm">
          {post.readingTime} min read
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {post.readingTime} min read
          </span>
        </div>

        {/* Title */}
        <h2 className={`font-bold text-sinai-navy mb-2 group-hover:text-sinai-cyan transition-colors ${
          featured ? 'text-2xl' : 'text-xl'
        }`}>
          <Link to={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h2>

        {/* Subtitle */}
        {post.subtitle && (
          <h3 className="text-lg text-gray-600 mb-2 font-medium">
            {post.subtitle}
          </h3>
        )}

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, featured ? 4 : 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 hover:bg-sinai-cyan/10 text-gray-600 text-xs rounded-md flex items-center gap-1 transition-colors cursor-pointer"
              title={`View posts tagged with ${tag}`}
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
          {post.tags.length > (featured ? 4 : 3) && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
              +{post.tags.length - (featured ? 4 : 3)} more
            </span>
          )}
        </div>

        {/* Author & CTA */}
        <div className={`flex items-center justify-between pt-4 border-t border-gray-100 ${
          showAuthorBio ? 'flex-col items-start gap-4' : ''
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sinai-cyan to-sinai-magenta flex items-center justify-center text-white font-bold">
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                post.author.name.charAt(0)
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
              <p className="text-xs text-gray-500">{post.author.role}</p>
              {showAuthorBio && post.author.bio && (
                <p className="text-xs text-gray-600 mt-1 max-w-sm">{post.author.bio}</p>
              )}
            </div>
          </div>

          {/* Social Links */}
          {post.author.social && (
            <div className="flex items-center gap-2">
              {post.author.social.github && (
                <a
                  href={post.author.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-sinai-cyan transition-colors"
                  title="GitHub"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {post.author.social.linkedin && (
                <a
                  href={post.author.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-sinai-cyan transition-colors"
                  title="LinkedIn"
                >
                  <User className="w-4 h-4" />
                </a>
              )}
            </div>
          )}

          {/* CTA */}
          <Link
            to={`/blog/${post.slug}`}
            className={`flex items-center gap-1 text-sinai-cyan font-medium text-sm hover:text-sinai-magenta transition-colors ${
              showAuthorBio ? 'mt-3 self-end' : ''
            }`}
          >
            Read more
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

// Add SEO metadata helper
export function generateBlogPostMeta(post: BlogPost) {
  return {
    title: `${post.title} | MSW Agentic Lab`,
    description: post.metaDescription || post.excerpt,
    keywords: post.keywords?.join(', ') || post.tags.join(', '),
    ogImage: post.ogImage || post.coverImage,
    twitterCard: post.twitterCard || 'summary_large_image',
    canonicalUrl: post.canonicalUrl || `https://mswagenticlab.netlify.app/blog/${post.slug}`,
    author: post.author.name,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
  };
}