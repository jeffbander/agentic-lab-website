import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Download, RefreshCw, CheckCircle2, XCircle, AlertTriangle, Copy, Info } from 'lucide-react';
import type { OnScreenText } from '../../lib/patientEducation';
import { concatenateVideos, type VideoStitcherProgress } from '../../lib/ffmpegVideoStitcher';

interface GeneratePanelProps {
  prompt: string; // This will be promptPart1
  promptPart2?: string; // New: Part 2 prompt
  ost: OnScreenText;
  onBack: () => void;
  onReset: () => void;
}

type JobStatus = 'queued' | 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
type GenerationPhase = 'part1' | 'part2' | 'completed';

interface StatusResponse {
  id: string;
  status: JobStatus;
  generations?: Array<{ id: string; url: string }>;
  videoUrl?: string;
  error?: string;
  logs?: string;
}

interface JobState {
  id: string;
  status: JobStatus;
  videoUrl?: string;
}

const STATUS_MESSAGES: Record<JobStatus, string> = {
  queued: 'Job queued, waiting to start...',
  starting: 'Initializing Sora video generation...',
  processing: 'Generating patient education video...',
  succeeded: 'Video generated successfully!',
  failed: 'Video generation failed',
  canceled: 'Video generation canceled',
};

const PHASE_MESSAGES: Record<GenerationPhase, string> = {
  part1: 'Generating Part 1: Mount Sinai branding + Patient intro (0-12s)',
  part2: 'Generating Part 2: Medications + Treatment plan (12-24s)',
  completed: '24-second patient education video ready!',
};

const POLL_INTERVAL = 5000; // 5 seconds
const STORAGE_KEY_PREFIX = 'patient-video-job-';

// Utility functions
function saveJobToStorage(phase: string, jobId: string, status: JobStatus, videoUrl?: string) {
  try {
    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}${phase}`,
      JSON.stringify({ id: jobId, status, videoUrl, timestamp: Date.now() })
    );
  } catch (e) {
    console.warn('Failed to save job to localStorage:', e);
  }
}

function loadJobFromStorage(phase: string): JobState | null {
  try {
    const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${phase}`);
    if (data) {
      const job = JSON.parse(data);
      // Only restore if less than 24 hours old
      if (Date.now() - job.timestamp < 24 * 60 * 60 * 1000) {
        return { id: job.id, status: job.status, videoUrl: job.videoUrl };
      }
    }
  } catch (e) {
    console.warn('Failed to load job from localStorage:', e);
  }
  return null;
}

function clearJobFromStorage(phase: string) {
  try {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${phase}`);
  } catch (e) {
    console.warn('Failed to clear job from localStorage:', e);
  }
}

function requestNotificationPermission(): Promise<NotificationPermission> {
  if ('Notification' in window && Notification.permission === 'default') {
    return Notification.requestPermission();
  }
  return Promise.resolve(Notification.permission || 'denied');
}

function showBrowserNotification(title: string, body: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      tag: 'patient-video-ready',
    });
  }
}

function updateDocumentTitle(message: string) {
  document.title = message;
}

export default function GeneratePanel({ prompt, promptPart2, ost, onBack, onReset }: GeneratePanelProps) {
  // Two-part video generation state
  const [currentPhase, setCurrentPhase] = useState<GenerationPhase>('part1');
  const [part1Job, setPart1Job] = useState<JobState | null>(null);
  const [part2Job, setPart2Job] = useState<JobState | null>(null);

  // Legacy state for compatibility
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<JobStatus>('queued');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const hasCreatedJob = useRef(false);

  // UX improvements
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [canLeave, setCanLeave] = useState(false);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(null);

  // Video stitching state
  const [isStitching, setIsStitching] = useState(false);
  const [stitchProgress, setStitchProgress] = useState<VideoStitcherProgress | null>(null);
  const [stitchedVideoUrl, setStitchedVideoUrl] = useState<string | null>(null);

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission().then(setNotificationPermission);
  }, []);

  // Auto-stitch videos when both parts are ready
  useEffect(() => {
    const shouldStitch =
      promptPart2 &&
      part1Job?.status === 'succeeded' &&
      part1Job?.videoUrl &&
      part2Job?.status === 'succeeded' &&
      part2Job?.videoUrl &&
      !isStitching &&
      !stitchedVideoUrl;

    if (shouldStitch) {
      setIsStitching(true);
      setCurrentPhase('completed');

      concatenateVideos(
        part1Job!.videoUrl!,
        part2Job!.videoUrl!,
        setStitchProgress
      )
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          setStitchedVideoUrl(url);
          setVideoUrl(url);
          setStatus('succeeded');
          setIsStitching(false);

          // Show notification
          showBrowserNotification('24-Second Video Ready!', 'Your seamlessly stitched Mount Sinai video is ready');
          updateDocumentTitle('✓ Video Ready - Patient Education');

          // Clear storage after success
          clearJobFromStorage('part1');
          clearJobFromStorage('part2');
        })
        .catch((error) => {
          console.error('Video stitching failed:', error);
          setError('Failed to stitch videos together. You can still download them separately.');
          setIsStitching(false);
        });
    }
  }, [part1Job, part2Job, promptPart2, isStitching, stitchedVideoUrl]);

  // Try to restore jobs from localStorage on mount
  useEffect(() => {
    const savedPart1 = loadJobFromStorage('part1');
    const savedPart2 = loadJobFromStorage('part2');

    if (savedPart1 && savedPart1.status !== 'succeeded') {
      setPart1Job(savedPart1);
      setJobId(savedPart1.id);
      setStatus(savedPart1.status);
      setCurrentPhase('part1');
      setIsPolling(true);
      setCanLeave(true);
    } else if (savedPart2 && savedPart2.status !== 'succeeded') {
      setPart2Job(savedPart2);
      setJobId(savedPart2.id);
      setStatus(savedPart2.status);
      setCurrentPhase('part2');
      setIsPolling(true);
      setCanLeave(true);
    }
  }, []);

  // Create video generation job (Part 1 only for now, or both if promptPart2 exists)
  useEffect(() => {
    // Prevent duplicate job creation
    if (hasCreatedJob.current) {
      return;
    }

    const createPart1Job = async () => {
      try {
        // Mark that we're creating a job
        hasCreatedJob.current = true;
        setCanLeave(true); // User can leave once job is created

        const response = await fetch('/api/sora-create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            width: 1920,
            height: 1080,
            n_seconds: 12,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create video generation job');
        }

        const data = await response.json();
        const newJob: JobState = { id: data.id, status: data.status || 'queued' };

        setPart1Job(newJob);
        setJobId(data.id);
        setStatus(data.status || 'queued');
        setIsPolling(true);
        setCurrentPhase('part1');

        // Save to localStorage
        saveJobToStorage('part1', data.id, data.status || 'queued');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setStatus('failed');
      }
    };

    createPart1Job();
  }, [prompt]);

  // Poll for status updates
  useEffect(() => {
    if (!jobId || !isPolling) return;

    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/sora-status?id=${jobId}`);

        if (!response.ok) {
          throw new Error('Failed to check status');
        }

        const data: StatusResponse = await response.json();
        setStatus(data.status);
        setLogs(data.logs || null);

        // Update localStorage
        const storagePhase = currentPhase === 'part1' ? 'part1' : 'part2';
        saveJobToStorage(storagePhase, jobId, data.status, data.generations?.[0]?.url || data.videoUrl);

        if (data.status === 'succeeded') {
          const url = data.generations?.[0]?.url || data.videoUrl;

          if (currentPhase === 'part1') {
            // Part 1 complete - save and start Part 2 if it exists
            setPart1Job({ id: jobId, status: 'succeeded', videoUrl: url });

            if (promptPart2) {
              // Start Part 2
              setCurrentPhase('part2');
              setStatus('queued');
              setJobId(null);
              setIsPolling(false);
              hasCreatedJob.current = false; // Allow creating Part 2

              // Create Part 2 job
              setTimeout(() => createPart2Job(url || ''), 100);
            } else {
              // No Part 2 - we're done!
              setVideoUrl(url);
              setIsPolling(false);
              setCurrentPhase('completed');

              // Show notification
              showBrowserNotification('Video Ready!', 'Your patient education video is ready to view');
              updateDocumentTitle('✓ Video Ready - Patient Education');
            }
          } else if (currentPhase === 'part2') {
            // Part 2 complete - both videos ready!
            setPart2Job({ id: jobId, status: 'succeeded', videoUrl: url });
            setVideoUrl(url); // For now, just show Part 2 (we'll improve this later)
            setIsPolling(false);
            setCurrentPhase('completed');

            // Show notification
            showBrowserNotification('24-Second Video Ready!', 'Your complete patient education video is ready');
            updateDocumentTitle('✓ Video Ready - Patient Education');

            // Clear storage after success
            clearJobFromStorage('part1');
            clearJobFromStorage('part2');
          }
        } else if (data.status === 'failed' || data.status === 'canceled') {
          setError(data.error || `Video generation ${data.status}`);
          setIsPolling(false);

          // Show notification
          showBrowserNotification('Video Generation Failed', data.error || 'Please try again');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check status');
        setIsPolling(false);
      }
    };

    const intervalId = setInterval(pollStatus, POLL_INTERVAL);
    pollStatus(); // Initial poll

    return () => clearInterval(intervalId);
  }, [jobId, isPolling, currentPhase, promptPart2]);

  // Function to create Part 2 job
  const createPart2Job = async (part1Url: string) => {
    if (!promptPart2) return;

    try {
      const response = await fetch('/api/sora-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: promptPart2,
          width: 1920,
          height: 1080,
          n_seconds: 12,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create Part 2 video');
      }

      const data = await response.json();
      const newJob: JobState = { id: data.id, status: data.status || 'queued' };

      setPart2Job(newJob);
      setJobId(data.id);
      setStatus(data.status || 'queued');
      setIsPolling(true);

      // Save to localStorage
      saveJobToStorage('part2', data.id, data.status || 'queued');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create Part 2 video');
      setStatus('failed');
    }
  };

  const handleDownload = async () => {
    if (!videoUrl) return;

    try {
      const response = await fetch(`/api/sora-download?url=${encodeURIComponent(videoUrl)}`);
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
        <h2 className="text-2xl font-bold text-gray-900">Generate Mount Sinai Patient Education Video</h2>
        <p className="text-gray-600 mt-1">
          {promptPart2 ? 'Creating 24-second video (Part 1 + Part 2)' : 'Creating 12-second video with 4-beat storyboard'}
        </p>
        {currentPhase !== 'completed' && (
          <div className="mt-2 flex items-center gap-2 text-sm text-sinai-cyan-700">
            <Info className="w-4 h-4" />
            <span>Current: {PHASE_MESSAGES[currentPhase]}</span>
          </div>
        )}
      </div>

      {/* Safe to Leave Notice */}
      {canLeave && status !== 'succeeded' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-1">You can safely leave this page</h4>
              <p className="text-sm text-blue-700 mb-2">
                Your video is generating in the background. You can close this tab and return later.
              </p>
              {jobId && (
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-white px-2 py-1 rounded border border-blue-200 font-mono">
                    {jobId}
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(jobId)}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    Copy Job ID
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Status Display */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <AnimatePresence mode="wait">
          {/* Stitching State */}
          {isStitching && stitchProgress && (
            <motion.div
              key="stitching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <Loader2 className="w-16 h-16 text-sinai-magenta-600 animate-spin mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Stitching Videos Together...
              </h3>
              <p className="text-sm text-gray-600 text-center max-w-md mb-4">
                {stitchProgress.message}
              </p>

              {/* Stitching Progress Bar */}
              <div className="w-full max-w-md">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-sinai-magenta-600"
                    initial={{ width: '0%' }}
                    animate={{ width: `${stitchProgress.progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="text-center text-xs text-gray-500 mt-1">
                  {Math.round(stitchProgress.progress)}% complete
                </div>
              </div>

              <div className="mt-4 bg-sinai-magenta-50 rounded-lg p-4 max-w-md">
                <p className="text-sm text-sinai-magenta-900 font-medium mb-1">
                  🎬 Creating Seamless Video
                </p>
                <p className="text-sm text-sinai-magenta-700">
                  Merging both parts into one smooth 24-second video...
                </p>
              </div>
            </motion.div>
          )}

          {/* Loading States */}
          {!isStitching && (status === 'queued' || status === 'starting' || status === 'processing') && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <Loader2 className="w-16 h-16 text-sinai-cyan-600 animate-spin mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {PHASE_MESSAGES[currentPhase]}
              </h3>
              <p className="text-sm text-gray-600 text-center max-w-md mb-4">
                {STATUS_MESSAGES[status]}
              </p>

              {/* Progress Bar */}
              {promptPart2 && (
                <div className="w-full max-w-md mb-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-sinai-cyan-600"
                      initial={{ width: '0%' }}
                      animate={{ width: currentPhase === 'part1' ? '50%' : '100%' }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Part 1 {part1Job?.status === 'succeeded' ? '✓' : '...'}</span>
                    <span>Part 2 {part2Job?.status === 'succeeded' ? '✓' : '...'}</span>
                  </div>
                </div>
              )}

              {/* Educational Tips */}
              <div className="mt-4 bg-sinai-cyan-50 rounded-lg p-4 max-w-md">
                <p className="text-sm text-sinai-cyan-900 font-medium mb-1">
                  {currentPhase === 'part1' ? '💡 Did you know?' : '✨ Almost there!'}
                </p>
                <p className="text-sm text-sinai-cyan-700">
                  {currentPhase === 'part1'
                    ? 'Videos improve patient comprehension by 73% compared to text-only instructions.'
                    : 'Mount Sinai-branded videos help patients feel connected to their care team.'}
                </p>
              </div>

              <p className="text-xs text-gray-500 mt-4 text-center max-w-md">
                Estimated time: {promptPart2 ? '3-4 minutes for both parts' : '1.5-2 minutes'}
                <br />
                The page will auto-update when ready.
              </p>

              {jobId && (
                <p className="text-xs text-gray-500 mt-2 font-mono">
                  Job ID: {jobId}
                </p>
              )}
            </motion.div>
          )}

          {/* Success State */}
          {!isStitching && status === 'succeeded' && (stitchedVideoUrl || part1Job?.videoUrl || part2Job?.videoUrl || videoUrl) && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {stitchedVideoUrl ? '24-second seamless Mount Sinai video ready!' :
                   promptPart2 && part1Job && part2Job ? PHASE_MESSAGES['completed'] : STATUS_MESSAGES[status]}
                </h3>
              </div>

              {/* Stitched Video Player (Single seamless video) */}
              {stitchedVideoUrl ? (
                <div className="mb-4">
                  <div className="bg-sinai-cyan-50 border border-sinai-cyan-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-sinai-cyan-900 font-medium mb-2">
                      ✨ Seamlessly Stitched 24-Second Video
                    </p>
                    <p className="text-xs text-sinai-cyan-700">
                      Both parts have been merged into one smooth Mount Sinai-branded patient education video.
                    </p>
                  </div>

                  <div className="bg-black rounded-lg overflow-hidden mb-4">
                    <video
                      src={stitchedVideoUrl}
                      controls
                      className="w-full aspect-video"
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = stitchedVideoUrl;
                      a.download = 'mount-sinai-patient-education-24s.webm';
                      a.click();
                    }}
                    className="w-full py-3 px-6 bg-gradient-to-r from-sinai-cyan-600 to-sinai-magenta-600 text-white font-semibold rounded-lg hover:from-sinai-cyan-700 hover:to-sinai-magenta-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download 24s Stitched Video</span>
                  </button>

                  {/* Optional: Show individual parts as fallback */}
                  {part1Job?.videoUrl && part2Job?.videoUrl && (
                    <details className="mt-4">
                      <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                        View individual parts
                      </summary>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <button
                          onClick={() => window.open(part1Job.videoUrl, '_blank')}
                          className="py-2 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <Download className="w-4 h-4" />
                          Part 1 (0-12s)
                        </button>
                        <button
                          onClick={() => window.open(part2Job.videoUrl, '_blank')}
                          className="py-2 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <Download className="w-4 h-4" />
                          Part 2 (12-24s)
                        </button>
                      </div>
                    </details>
                  )}
                </div>
              ) : promptPart2 && part1Job?.videoUrl && part2Job?.videoUrl ? (
                /* Fallback: Two-Part Video Player (if stitching failed) */
                <div className="space-y-4 mb-4">
                  <div className="bg-sinai-cyan-50 border border-sinai-cyan-200 rounded-lg p-4">
                    <p className="text-sm text-sinai-cyan-900 font-medium mb-2">
                      📹 24-second Mount Sinai Patient Education Video
                    </p>
                    <p className="text-xs text-sinai-cyan-700">
                      Both parts generated successfully! Watch them in sequence for the complete patient education experience.
                    </p>
                  </div>

                  {/* Part 1 Video */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Part 1: Mount Sinai Branding + Patient Introduction (0-12s)
                    </h4>
                    <div className="bg-black rounded-lg overflow-hidden">
                      <video
                        src={part1Job.videoUrl}
                        controls
                        className="w-full aspect-video"
                        preload="metadata"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>

                  {/* Part 2 Video */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Part 2: Medications + Treatment Plan (12-24s)
                    </h4>
                    <div className="bg-black rounded-lg overflow-hidden">
                      <video
                        src={part2Job.videoUrl}
                        controls
                        className="w-full aspect-video"
                        preload="metadata"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>

                  {/* Download Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => window.open(part1Job.videoUrl, '_blank')}
                      className="py-2 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Part 1
                    </button>
                    <button
                      onClick={() => window.open(part2Job.videoUrl, '_blank')}
                      className="py-2 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Part 2
                    </button>
                  </div>
                </div>
              ) : (
                /* Single Video Player */
                <div className="mb-4">
                  <div className="bg-black rounded-lg overflow-hidden mb-4">
                    <video
                      src={part1Job?.videoUrl || videoUrl || ''}
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
                    style={{ color: '#ffffff' }}
                  >
                    <Download className="w-5 h-5" style={{ color: '#ffffff' }} />
                    <span style={{ color: '#ffffff' }}>Download Video</span>
                  </button>
                </div>
              )}
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
                style={{ color: '#ffffff' }}
              >
                <RefreshCw className="w-4 h-4" style={{ color: '#ffffff' }} />
                <span style={{ color: '#ffffff' }}>Retry Generation</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Script Preview (Read-only) */}
      <div className="bg-sinai-cyan-50 border border-sinai-cyan-200 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-sinai-cyan-900 mb-4">
          Script Preview ({ost.beat5 ? '8 Beats - 24 seconds' : '4 Beats - 12 seconds'})
        </h3>

        {/* Part 1 Beats */}
        <div className="space-y-3 mb-4">
          <div className="text-xs font-semibold text-sinai-cyan-700 mb-2">
            Part 1: Mount Sinai Branding + Patient Introduction
          </div>
          {[
            { title: 'Beat 1 (0-3s): Mount Sinai Logo', text: ost.beat1 },
            { title: 'Beat 2 (3-6s): Greeting + Conditions', text: ost.beat2 },
            { title: 'Beat 3 (6-9s): Condition Overview', text: ost.beat3 },
            { title: 'Beat 4 (9-12s): Recent Test Results', text: ost.beat4 },
          ].map((beat, index) => (
            <div key={index} className="bg-white rounded-lg p-3 border border-sinai-cyan-100">
              <div className="text-xs text-gray-600 mb-1">{beat.title}</div>
              <div className="text-sm font-medium text-gray-900">{beat.text}</div>
            </div>
          ))}
        </div>

        {/* Part 2 Beats (if available) */}
        {ost.beat5 && (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-sinai-cyan-700 mb-2">
              Part 2: Medications + Treatment Plan
            </div>
            {[
              { title: 'Beat 5 (12-15s): Current Medications', text: ost.beat5 },
              { title: 'Beat 6 (15-18s): Treatment Options', text: ost.beat6 },
              { title: 'Beat 7 (18-21s): Next Steps', text: ost.beat7 },
              { title: 'Beat 8 (21-24s): Safety + Call to Action', text: ost.beat8 },
            ].map((beat, index) => (
              <div key={index} className="bg-white rounded-lg p-3 border border-sinai-cyan-100">
                <div className="text-xs text-gray-600 mb-1">{beat.title}</div>
                <div className="text-sm font-medium text-gray-900">{beat.text}</div>
              </div>
            ))}
          </div>
        )}
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
