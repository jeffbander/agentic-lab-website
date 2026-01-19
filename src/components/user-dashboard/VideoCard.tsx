import { motion } from 'framer-motion';
import { Play, Trash2, Clock, Calendar, Film, Loader2 } from 'lucide-react';
import type { SavedVideo } from '../../lib/auth';

interface VideoCardProps {
  video: SavedVideo;
  index: number;
  onView: () => void;
  onDelete: () => void;
}

export function VideoCard({ video, index, onView, onDelete }: VideoCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isProcessing = video.status === 'processing';
  const isFailed = video.status === 'failed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Video Thumbnail / Preview */}
      <div
        className={`relative aspect-video bg-gradient-to-br ${
          isProcessing
            ? 'from-yellow-100 to-yellow-50'
            : isFailed
            ? 'from-red-100 to-red-50'
            : 'from-sinai-cyan-100 to-sinai-magenta-100'
        } flex items-center justify-center cursor-pointer group`}
        onClick={!isProcessing && !isFailed ? onView : undefined}
      >
        {isProcessing ? (
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-yellow-600 animate-spin mx-auto mb-2" />
            <p className="text-sm text-yellow-700 font-medium">Processing...</p>
          </div>
        ) : isFailed ? (
          <div className="text-center">
            <Film className="w-10 h-10 text-red-400 mx-auto mb-2" />
            <p className="text-sm text-red-600 font-medium">Generation Failed</p>
          </div>
        ) : (
          <>
            <Film className="w-12 h-12 text-sinai-cyan-600 group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                  <Play className="w-7 h-7 text-sinai-cyan-600 ml-1" />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Duration Badge */}
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded-md flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {video.duration}s
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate mb-1">
          {video.title}
        </h3>

        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(video.createdAt)}
          </span>
          <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
            {video.model}
          </span>
        </div>

        {/* First line of prompt */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {video.ost.beat2 || video.prompt.slice(0, 100)}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!isProcessing && !isFailed && (
            <button
              onClick={onView}
              className="flex-1 py-2 px-3 bg-sinai-cyan-600 hover:bg-sinai-cyan-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <Play className="w-4 h-4" />
              Play
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete video"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
