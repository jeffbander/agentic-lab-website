import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Download, RefreshCw, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import type { OnScreenText } from '../../lib/patientEducation';

interface GeneratePanelProps {
  prompt: string;
  ost: OnScreenText;
  onBack: () => void;
  onReset: () => void;
}

type JobStatus = 'queued' | 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';

interface StatusResponse {
  id: string;
  status: JobStatus;
  generations?: Array<{ id: string; url: string }>;
  videoUrl?: string;
  error?: string;
  logs?: string;
}

const STATUS_MESSAGES: Record<JobStatus, string> = {
  queued: 'Job queued, waiting to start...',
  starting: 'Initializing Sora video generation...',
  processing: 'Generating 20-second patient education video...',
  succeeded: 'Video generated successfully!',
  failed: 'Video generation failed',
  canceled: 'Video generation canceled',
};

const POLL_INTERVAL = 5000; // 5 seconds

export default function GeneratePanel({ prompt, ost, onBack, onReset }: GeneratePanelProps) {
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<JobStatus>('queued');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  // Create video generation job
  useEffect(() => {
    const createJob = async () => {
      try {
        const response = await fetch('/api/sora/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            width: 1920,
            height: 1080,
            n_seconds: 20,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create video generation job');
        }

        const data = await response.json();
        setJobId(data.id);
        setStatus(data.status || 'queued');
        setIsPolling(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setStatus('failed');
      }
    };

    createJob();
  }, [prompt]);

  // Poll for status updates
  useEffect(() => {
    if (!jobId || !isPolling) return;

    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/sora/status?id=${jobId}`);

        if (!response.ok) {
          throw new Error('Failed to check status');
        }

        const data: StatusResponse = await response.json();
        setStatus(data.status);
        setLogs(data.logs || null);

        if (data.status === 'succeeded') {
          const url = data.generations?.[0]?.url || data.videoUrl;
          if (url) {
            setVideoUrl(url);
          }
          setIsPolling(false);
        } else if (data.status === 'failed' || data.status === 'canceled') {
          setError(data.error || `Video generation ${data.status}`);
          setIsPolling(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check status');
        setIsPolling(false);
      }
    };

    const intervalId = setInterval(pollStatus, POLL_INTERVAL);
    pollStatus(); // Initial poll

    return () => clearInterval(intervalId);
  }, [jobId, isPolling]);

  const handleDownload = async () => {
    if (!videoUrl) return;

    try {
      const response = await fetch(`/api/sora/download?url=${encodeURIComponent(videoUrl)}`);
      if (response.redirected) {
        window.open(response.url, '_blank');
      }
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleRetry = () => {
    setJobId(null);
    setStatus('queued');
    setVideoUrl(null);
    setError(null);
    setLogs(null);
    setIsPolling(false);

    // Trigger recreation by changing a state value
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Generate Patient Education Video</h2>
        <p className="text-gray-600 mt-1">
          Creating 20-second video with 4-beat storyboard
        </p>
      </div>

      {/* Status Display */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <AnimatePresence mode="wait">
          {/* Loading States */}
          {(status === 'queued' || status === 'starting' || status === 'processing') && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <Loader2 className="w-16 h-16 text-sinai-cyan-600 animate-spin mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {STATUS_MESSAGES[status]}
              </h3>
              <p className="text-sm text-gray-600 text-center max-w-md">
                This typically takes 1.5-2 minutes. The page will auto-update when ready.
              </p>
              {jobId && (
                <p className="text-xs text-gray-500 mt-4 font-mono">
                  Job ID: {jobId}
                </p>
              )}
            </motion.div>
          )}

          {/* Success State */}
          {status === 'succeeded' && videoUrl && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {STATUS_MESSAGES[status]}
                </h3>
              </div>

              {/* Video Player */}
              <div className="bg-black rounded-lg overflow-hidden mb-4">
                <video
                  src={videoUrl}
                  controls
                  className="w-full aspect-video"
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                className="w-full py-3 px-6 bg-sinai-cyan-600 text-white font-semibold rounded-lg hover:bg-sinai-cyan-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Video
              </button>
            </motion.div>
          )}

          {/* Error State */}
          {(status === 'failed' || status === 'canceled') && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <XCircle className="w-16 h-16 text-red-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {STATUS_MESSAGES[status]}
              </h3>
              {error && (
                <p className="text-sm text-red-600 text-center max-w-md mb-4">
                  {error}
                </p>
              )}
              <button
                onClick={handleRetry}
                className="py-2 px-6 bg-sinai-cyan-600 text-white font-semibold rounded-lg hover:bg-sinai-cyan-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Retry Generation
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Script Preview (Read-only) */}
      <div className="bg-sinai-cyan-50 border border-sinai-cyan-200 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-sinai-cyan-900 mb-4">Script Preview (4 Beats)</h3>
        <div className="space-y-3">
          {[
            { title: 'Beat 1 (0-5s): Greeting + Condition', text: ost.beat1 },
            { title: 'Beat 2 (5-10s): Key Takeaway', text: ost.beat2 },
            { title: 'Beat 3 (10-15s): How Treatment Helps', text: ost.beat3 },
            { title: 'Beat 4 (15-20s): Next Step + Safety', text: ost.beat4 },
          ].map((beat, index) => (
            <div key={index} className="bg-white rounded-lg p-3 border border-sinai-cyan-100">
              <div className="text-xs text-gray-600 mb-1">{beat.title}</div>
              <div className="text-sm font-medium text-gray-900">{beat.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Logs (if available) */}
      {logs && (
        <details className="bg-gray-50 rounded-lg p-4 mb-6">
          <summary className="cursor-pointer text-sm font-medium text-gray-700">
            View Generation Logs
          </summary>
          <pre className="mt-3 text-xs text-gray-600 whitespace-pre-wrap font-mono bg-white p-3 rounded border border-gray-200 max-h-48 overflow-y-auto">
            {logs}
          </pre>
        </details>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          ← Back to Preview
        </button>
        <button
          onClick={onReset}
          className="flex-1 py-3 px-6 border-2 border-sinai-cyan-600 text-sinai-cyan-700 font-semibold rounded-lg hover:bg-sinai-cyan-50 transition-colors"
        >
          Start New Video
        </button>
      </div>
    </motion.div>
  );
}
