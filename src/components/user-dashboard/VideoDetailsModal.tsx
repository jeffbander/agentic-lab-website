import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Clock, Calendar, Cpu, ExternalLink } from 'lucide-react';
import type { SavedVideo } from '../../lib/auth';

interface VideoDetailsModalProps {
  video: SavedVideo;
  onClose: () => void;
}

export function VideoDetailsModal({ video, onClose }: VideoDetailsModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleDownload = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.target = '_blank';
    a.click();
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-4 md:inset-10 z-50 flex items-center justify-center"
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-full overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-gray-900 truncate pr-4">
              {video.title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Video Player */}
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              {video.videoUrl ? (
                <video
                  src={video.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full"
                >
                  Your browser does not support the video tag.
                </video>
              ) : video.part1Url && video.part2Url ? (
                <div className="grid grid-cols-2 gap-2 p-2 h-full">
                  <div className="relative">
                    <p className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">Part 1</p>
                    <video src={video.part1Url} controls className="w-full h-full rounded" />
                  </div>
                  <div className="relative">
                    <p className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">Part 2</p>
                    <video src={video.part2Url} controls className="w-full h-full rounded" />
                  </div>
                </div>
              ) : video.part1Url ? (
                <video src={video.part1Url} controls autoPlay className="w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Video not available
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{formatDate(video.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{video.duration} seconds</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Cpu className="w-4 h-4 text-gray-400" />
                <span>{video.model}</span>
              </div>
            </div>

            {/* Script/OST */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Script Beats</h3>
              <div className="space-y-2">
                {Object.entries(video.ost).map(([beat, text]) => (
                  text && (
                    <div key={beat} className="flex gap-3 text-sm">
                      <span className="font-mono text-sinai-cyan-600 w-14 flex-shrink-0">
                        {beat.replace('beat', 'Beat ')}
                      </span>
                      <span className="text-gray-700">{text}</span>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Download Buttons */}
            <div className="flex flex-wrap gap-3">
              {video.videoUrl && (
                <button
                  onClick={() => handleDownload(video.videoUrl!, `${video.title}.mp4`)}
                  className="flex items-center gap-2 px-4 py-2 bg-sinai-cyan-600 hover:bg-sinai-cyan-700 text-white rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Video
                </button>
              )}
              {video.part1Url && (
                <button
                  onClick={() => handleDownload(video.part1Url!, `${video.title}-part1.mp4`)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Part 1
                </button>
              )}
              {video.part2Url && (
                <button
                  onClick={() => handleDownload(video.part2Url!, `${video.title}-part2.mp4`)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Part 2
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
