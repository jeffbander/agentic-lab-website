import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Save,
  FileText,
  Calendar,
  Tag,
  AlertCircle,
  CheckCircle,
  Lock,
  Unlock,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogPosts as staticBlogPosts, type BlogPost, getAllCategories } from '../data/blogPosts';

// Storage key for local posts
const STORAGE_KEY = 'blog_admin_posts';
const AUTH_KEY = 'blog_admin_auth';

// Helper functions
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Get posts from local storage merged with static posts
function getStoredPosts(): BlogPost[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const localPosts = JSON.parse(stored) as BlogPost[];
      // Merge with static posts, avoiding duplicates
      const staticIds = new Set(staticBlogPosts.map(p => p.id));
      const uniqueLocalPosts = localPosts.filter(p => !staticIds.has(p.id));
      return [...staticBlogPosts, ...uniqueLocalPosts];
    }
  } catch (e) {
    console.error('Error reading from localStorage:', e);
  }
  return [...staticBlogPosts];
}

// Save posts to local storage (only saves non-static posts)
function savePostsToStorage(posts: BlogPost[]): void {
  try {
    const staticIds = new Set(staticBlogPosts.map(p => p.id));
    const localPosts = posts.filter(p => !staticIds.has(p.id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localPosts));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
}

// Empty post template
const emptyPost: Omit<BlogPost, 'id' | 'slug' | 'readingTime' | 'publishedAt' | 'updatedAt'> = {
  title: '',
  subtitle: '',
  excerpt: '',
  content: '',
  author: {
    name: 'Jeff Bander, MD',
    role: 'Hospitalist & AI Developer',
  },
  coverImage: '',
  tags: [],
  category: 'Healthcare AI',
  status: 'draft',
  featured: false,
};

interface PostFormData extends Omit<BlogPost, 'id' | 'slug' | 'readingTime' | 'publishedAt' | 'updatedAt'> {
  tagsInput: string;
}

function PostEditor({
  post,
  onSave,
  onCancel,
}: {
  post?: BlogPost;
  onSave: (data: Partial<BlogPost>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<PostFormData>({
    ...(post || emptyPost),
    tagsInput: post?.tags.join(', ') || '',
  });

  const categories = getAllCategories();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tags = formData.tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const postData: Partial<BlogPost> = {
      title: formData.title,
      subtitle: formData.subtitle,
      excerpt: formData.excerpt,
      content: formData.content,
      author: formData.author,
      coverImage: formData.coverImage || undefined,
      tags,
      category: formData.category,
      status: formData.status,
      featured: formData.featured,
    };

    onSave(postData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sinai-cyan focus:border-transparent"
          required
        />
      </div>

      {/* Subtitle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
        <input
          type="text"
          value={formData.subtitle}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sinai-cyan focus:border-transparent"
        />
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Excerpt <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sinai-cyan focus:border-transparent"
          rows={3}
          required
        />
      </div>

      {/* Content (Markdown) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content (Markdown) <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sinai-cyan focus:border-transparent font-mono text-sm"
          rows={15}
          placeholder="Write your content in Markdown..."
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          Supports Markdown: ## headers, **bold**, *italic*, `code`, ```code blocks```, lists, and more.
        </p>
      </div>

      {/* Two column layout for metadata */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as BlogPost['category'] })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sinai-cyan focus:border-transparent"
            required
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sinai-cyan focus:border-transparent"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.tagsInput}
          onChange={(e) => setFormData({ ...formData, tagsInput: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sinai-cyan focus:border-transparent"
          placeholder="HIPAA, AI, Security (comma-separated)"
          required
        />
      </div>

      {/* Cover Image URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
        <input
          type="url"
          value={formData.coverImage}
          onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sinai-cyan focus:border-transparent"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {/* Author Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
          <input
            type="text"
            value={formData.author.name}
            onChange={(e) =>
              setFormData({ ...formData, author: { ...formData.author, name: e.target.value } })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sinai-cyan focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Author Role</label>
          <input
            type="text"
            value={formData.author.role}
            onChange={(e) =>
              setFormData({ ...formData, author: { ...formData.author, role: e.target.value } })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sinai-cyan focus:border-transparent"
          />
        </div>
      </div>

      {/* Featured Toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="featured"
          checked={formData.featured}
          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
          className="w-4 h-4 text-sinai-cyan border-gray-300 rounded focus:ring-sinai-cyan"
        />
        <label htmlFor="featured" className="text-sm font-medium text-gray-700">
          Featured post (shown prominently on blog homepage)
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-sinai-cyan hover:bg-sinai-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Post
        </button>
      </div>
    </form>
  );
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | undefined>();
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Load posts and check auth on mount
  useEffect(() => {
    setPosts(getStoredPosts());
    const savedAuth = sessionStorage.getItem(AUTH_KEY);
    if (savedAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle authentication
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple auth - in production, validate against backend
    if (adminKey.length > 0) {
      setIsAuthenticated(true);
      sessionStorage.setItem(AUTH_KEY, adminKey);
      showNotification('success', 'Authenticated successfully');
    } else {
      showNotification('error', 'Please enter an admin key');
    }
  };

  // Handle create/update post
  const handleSavePost = async (data: Partial<BlogPost>) => {
    const now = new Date().toISOString();

    if (editingPost) {
      // Update existing post
      const updatedPost: BlogPost = {
        ...editingPost,
        ...data,
        slug: data.title ? generateSlug(data.title) : editingPost.slug,
        readingTime: data.content ? calculateReadingTime(data.content) : editingPost.readingTime,
        updatedAt: now,
        publishedAt: data.status === 'published' && !editingPost.publishedAt ? now : editingPost.publishedAt,
      };

      const updatedPosts = posts.map((p) => (p.id === editingPost.id ? updatedPost : p));
      setPosts(updatedPosts);
      savePostsToStorage(updatedPosts);
      showNotification('success', 'Post updated successfully');
    } else {
      // Create new post
      const newPost: BlogPost = {
        id: generateId(),
        slug: generateSlug(data.title || ''),
        title: data.title || '',
        subtitle: data.subtitle || '',
        excerpt: data.excerpt || '',
        content: data.content || '',
        author: data.author || { name: '', role: '' },
        coverImage: data.coverImage,
        tags: data.tags || [],
        category: data.category || 'Healthcare AI',
        status: data.status || 'draft',
        publishedAt: data.status === 'published' ? now : '',
        updatedAt: now,
        readingTime: calculateReadingTime(data.content || ''),
        featured: data.featured || false,
      };

      const updatedPosts = [newPost, ...posts];
      setPosts(updatedPosts);
      savePostsToStorage(updatedPosts);

      // Also call the backend API to create the post
      try {
        const response = await fetch('/api/blog-create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem(AUTH_KEY) || 'dev-key'}`,
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          console.log('Post also saved to backend API');
        }
      } catch {
        console.log('Backend API not available, post saved locally only');
      }

      showNotification('success', 'Post created successfully');
    }

    setShowEditor(false);
    setEditingPost(undefined);
  };

  // Handle delete post
  const handleDeletePost = (id: string) => {
    const updatedPosts = posts.filter((p) => p.id !== id);
    setPosts(updatedPosts);
    savePostsToStorage(updatedPosts);
    setDeleteConfirm(null);
    showNotification('success', 'Post deleted successfully');
  };

  // Check if post is from static data (read-only)
  const isStaticPost = (id: string) => staticBlogPosts.some((p) => p.id === id);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-sinai-navy rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Blog Admin</h1>
            <p className="text-gray-600 mt-2">Enter your admin key to manage blog posts</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Key</label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sinai-cyan focus:border-transparent"
                placeholder="Enter admin key"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-sinai-cyan hover:bg-sinai-blue-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Unlock className="w-5 h-5" />
              Access Admin Panel
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            For development, enter any key. In production, set BLOG_ADMIN_KEY environment variable.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-sinai-navy">Blog Admin</h1>
              <Link
                to="/blog"
                className="text-sm text-sinai-cyan hover:text-sinai-magenta flex items-center gap-1"
              >
                <Eye className="w-4 h-4" />
                View Blog
              </Link>
            </div>
            <button
              onClick={() => {
                setEditingPost(undefined);
                setShowEditor(true);
              }}
              className="px-4 py-2 bg-sinai-cyan hover:bg-sinai-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Post
            </button>
          </div>
        </div>
      </header>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
              notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showEditor ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-sinai-cyan" />
              {editingPost ? 'Edit Post' : 'Create New Post'}
            </h2>
            <PostEditor
              post={editingPost}
              onSave={handleSavePost}
              onCancel={() => {
                setShowEditor(false);
                setEditingPost(undefined);
              }}
            />
          </motion.div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <p className="text-sm text-gray-500">Total Posts</p>
                <p className="text-3xl font-bold text-sinai-navy">{posts.length}</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <p className="text-sm text-gray-500">Published</p>
                <p className="text-3xl font-bold text-green-600">
                  {posts.filter((p) => p.status === 'published').length}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <p className="text-sm text-gray-500">Drafts</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {posts.filter((p) => p.status === 'draft').length}
                </p>
              </div>
            </div>

            {/* Posts List */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">All Posts</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {posts.length === 0 ? (
                  <div className="p-12 text-center">
                    <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No blog posts yet. Create your first post!</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <div key={post.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">{post.title}</h3>
                            <span
                              className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                post.status === 'published'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {post.status}
                            </span>
                            {post.featured && (
                              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-sinai-magenta/10 text-sinai-magenta">
                                Featured
                              </span>
                            )}
                            {isStaticPost(post.id) && (
                              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-500">
                                Static
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">{post.excerpt}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {post.publishedAt
                                ? new Date(post.publishedAt).toLocaleDateString()
                                : 'Not published'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {post.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/blog/${post.slug}`}
                            className="p-2 text-gray-400 hover:text-sinai-cyan rounded-lg hover:bg-gray-100 transition-colors"
                            title="View post"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                          {!isStaticPost(post.id) && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingPost(post);
                                  setShowEditor(true);
                                }}
                                className="p-2 text-gray-400 hover:text-sinai-cyan rounded-lg hover:bg-gray-100 transition-colors"
                                title="Edit post"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(post.id)}
                                className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors"
                                title="Delete post"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Post?</h3>
              <p className="text-gray-600 mb-6">
                This action cannot be undone. The post will be permanently deleted.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeletePost(deleteConfirm)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
