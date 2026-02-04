import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Plus, Search, Filter, Loader2, Trash2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserVideos, deleteUserVideo, type SavedVideo } from '../lib/auth';
import { VideoCard } from '../components/user-dashboard/VideoCard';
import { VideoDetailsModal } from '../components/user-dashboard/VideoDetailsModal';

type FilterStatus = 'all' | 'completed' | 'processing' | 'failed';

export default function UserDashboard() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<SavedVideo[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<SavedVideo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedVideo, setSelectedVideo] = useState<SavedVideo | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load videos
  useEffect(() => {
    if (user) {
      const userVideos = getUserVideos(user.userId);
      setVideos(userVideos);
      setIsLoading(false);
    }
  }, [user]);

  // Filter and search videos
  useEffect(() => {
    let result = videos;

    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter((v) => v.status === filterStatus);
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(query) ||
          v.prompt.toLowerCase().includes(query) ||
          v.model.toLowerCase().includes(query)
      );
    }

    setFilteredVideos(result);
  }, [videos, filterStatus, searchQuery]);

  const handleDelete = (videoId: string) => {
    if (user) {
      deleteUserVideo(user.userId, videoId);
      setVideos(videos.filter((v) => v.id !== videoId));
      setDeleteConfirm(null);
    }
  };

  const stats = {
    total: videos.length,
    completed: videos.filter((v) => v.status === 'completed').length,
    processing: videos.filter((v) => v.status === 'processing').length,
    failed: videos.filter((v) => v.status === 'failed').length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sinai-cyan-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {user?.displayName}!
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your patient education videos
              </p>
            </div>
            <Link
              to="/patient-education"
              className="inline-flex items-center gap-2 px-4 py-2 bg-sinai-cyan-600 hover:bg-sinai-cyan-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create New Video
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Total Videos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600">Completed</p>
              <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-yellow-600">Processing</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.processing}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-red-600">Failed</p>
              <p className="text-2xl font-bold text-red-700">{stats.failed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {videos.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-sinai-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Video className="w-10 h-10 text-sinai-cyan-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No videos yet
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create your first patient education video to get started. Videos you save will appear here.
            </p>
            <Link
              to="/patient-education"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sinai-cyan-600 hover:bg-sinai-cyan-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Your First Video
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sinai-cyan-500 focus:border-sinai-cyan-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sinai-cyan-500 focus:border-sinai-cyan-500"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="processing">Processing</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            {/* Video Grid */}
            {filteredVideos.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No videos match your search</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredVideos.map((video, index) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    index={index}
                    onView={() => setSelectedVideo(video)}
                    onDelete={() => setDeleteConfirm(video.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Video Details Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <VideoDetailsModal
            video={selectedVideo}
            onClose={() => setSelectedVideo(null)}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm(null)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                  Delete Video?
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  This action cannot be undone. The video will be permanently removed from your library.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
