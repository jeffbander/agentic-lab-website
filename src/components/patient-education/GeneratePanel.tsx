import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Download, RefreshCw, CheckCircle2, XCircle, Copy, Info, Zap, BookmarkPlus, Check, LogIn } from 'lucide-react';
import type { OnScreenText } from '../../lib/patientEducation';
import { concatenateVideos, preloadFFmpeg, type VideoStitcherProgress } from '../../lib/ffmpegVideoStitcher';
import { useAuth } from '../../contexts/AuthContext';
import { saveUserVideo } from '../../lib/auth';

interface GeneratePanelProps {
  prompt: string; // This will be promptPart1
  promptPart2?: string; // New: Part 2 prompt
  ost: OnScreenText;
  model?: string; // Video model: 'sora-2' or 'sora-2-pro'
  onBack: () => void;
  onReset: () => void;
}

type JobStatus = 'queued' | 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
type GenerationPhase = 'parallel' | 'single' | 'stitching' | 'completed';

// Model display names for UI
const MODEL_DISPLAY_NAMES: Record<string, string> = {
  'sora-2': 'Sora 2',
  'sora-2-pro': 'Sora 2 Pro',
  'wan-2.5': 'Wan 2.5',
  'hailuo-2.3': 'Hailuo 2.3',
  'kling-2.5': 'Kling 2.5',
};

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
  error?: string;
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
  parallel: 'Generating both parts in parallel for faster results!',
  single: 'Generating 12-second patient education video',
  stitching: 'Merging videos into seamless 24-second video...',
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

function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  // Check if Notification API is supported (not available on iOS Safari)
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return Promise.resolve('unsupported' as const);
  }
  if (Notification.permission === 'default') {
    return Notification.requestPermission();
  }
  return Promise.resolve(Notification.permission);
}

function showBrowserNotification(title: string, body: string) {
  // Check if Notification API is supported (not available on iOS Safari)
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }
  if (Notification.permission === 'granted') {
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

export default function GeneratePanel({ prompt, promptPart2, ost, model = 'wan-2.5', onBack, onReset }: GeneratePanelProps) {
  const modelDisplayName = MODEL_DISPLAY_NAMES[model] || model;
  const { user, isAuthenticated, showAuthModal } = useAuth();

  // Parallel video generation state
  const [currentPhase, setCurrentPhase] = useState<GenerationPhase>(promptPart2 ? 'parallel' : 'single');
  const [part1Job, setPart1Job] = useState<JobState | null>(null);
  const [part2Job, setPart2Job] = useState<JobState | null>(null);

  // General state
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string | null>(null);
  const hasCreatedJobs = useRef(false);

  // Save to library state
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // UX improvements
  const [, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [canLeave, setCanLeave] = useState(false);

  // Video stitching state
  const [isStitching, setIsStitching] = useState(false);
  const [stitchProgress, setStitchProgress] = useState<VideoStitcherProgress | null>(null);
  const [stitchedVideoUrl, setStitchedVideoUrl] = useState<string | null>(null);

  // FFmpeg preload started flag
  const ffmpegPreloadStarted = useRef(false);

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission().then(setNotificationPermission);
  }, []);

  // Preload FFmpeg early for 24s videos (while generation is in progress)
  useEffect(() => {
    if (promptPart2 && !ffmpegPreloadStarted.current) {
      ffmpegPreloadStarted.current = true;
      console.log('[GeneratePanel] Preloading FFmpeg for faster stitching...');
      preloadFFmpeg();
    }
  }, [promptPart2]);

  // Create video job helper function
  const createVideoJob = useCallback(async (
    jobPrompt: string,
    phase: 'part1' | 'part2'
  ): Promise<JobState> => {
    const response = await fetch('/api/sora-create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: jobPrompt,
        width: 1920,
        height: 1080,
        n_seconds: 12,
        model: model,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to create ${phase} video job`);
    }

    const data = await response.json();
    const job: JobState = { id: data.id, status: data.status || 'queued' };
    saveJobToStorage(phase, data.id, data.status || 'queued');
    return job;
  }, [model]);

  // Poll job status helper function
  const pollJobStatus = useCallback(async (jobId: string): Promise<StatusResponse> => {
    const response = await fetch(`/api/sora-status?id=${jobId}`);
    if (!response.ok) {
      throw new Error('Failed to check status');
    }
    return response.json();
  }, []);

  // Create jobs on mount - PARALLEL for 24s videos (with stagger to avoid rate limits)
  useEffect(() => {
    if (hasCreatedJobs.current) return;
    hasCreatedJobs.current = true;

    const createJobs = async () => {
      try {
        setCanLeave(true);

        if (promptPart2) {
          // PARALLEL with slight stagger: Create both jobs with 2s delay to avoid rate limits
          // The backend also has retry logic for 429 errors
          console.log('[GeneratePanel] Creating Part 1 and Part 2 jobs in PARALLEL (staggered)');

          // Start Part 1 immediately
          const job1Promise = createVideoJob(prompt, 'part1');

          // Start Part 2 after 2 second delay to avoid rate limiting
          const job2Promise = new Promise<JobState>((resolve, reject) => {
            setTimeout(() => {
              createVideoJob(promptPart2, 'part2')
                .then(resolve)
                .catch(reject);
            }, 2000); // 2 second stagger
          });

          // Wait for both to complete (they run in parallel after the stagger)
          const [job1, job2] = await Promise.all([job1Promise, job2Promise]);

          setPart1Job(job1);
          setPart2Job(job2);
          setCurrentPhase('parallel');
        } else {
          // Single video - just create Part 1
          const job1 = await createVideoJob(prompt, 'part1');
          setPart1Job(job1);
          setCurrentPhase('single');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create video jobs');
      }
    };

    // Try to restore from localStorage first
    const savedPart1 = loadJobFromStorage('part1');
    const savedPart2 = loadJobFromStorage('part2');

    if (savedPart1 || savedPart2) {
      if (savedPart1) setPart1Job(savedPart1);
      if (savedPart2) setPart2Job(savedPart2);
      setCanLeave(true);
      setCurrentPhase(promptPart2 ? 'parallel' : 'single');
    } else {
      createJobs();
    }
  }, [prompt, promptPart2, createVideoJob]);

  // Poll for status updates - handles both jobs in parallel
  useEffect(() => {
    const jobsToPolling: { job: JobState; phase: 'part1' | 'part2'; setJob: React.Dispatch<React.SetStateAction<JobState | null>> }[] = [];

    if (part1Job && part1Job.status !== 'succeeded' && part1Job.status !== 'failed' && part1Job.status !== 'canceled') {
      jobsToPolling.push({ job: part1Job, phase: 'part1', setJob: setPart1Job });
    }
    if (part2Job && part2Job.status !== 'succeeded' && part2Job.status !== 'failed' && part2Job.status !== 'canceled') {
      jobsToPolling.push({ job: part2Job, phase: 'part2', setJob: setPart2Job });
    }

    if (jobsToPolling.length === 0) return;

    const pollAllJobs = async () => {
      await Promise.all(
        jobsToPolling.map(async ({ job, phase, setJob }) => {
          try {
            const data = await pollJobStatus(job.id);

            // Update job state
            const videoUrl = data.generations?.[0]?.url || data.videoUrl;
            const updatedJob: JobState = {
              id: job.id,
              status: data.status,
              videoUrl: data.status === 'succeeded' ? videoUrl : undefined,
              error: data.error,
            };

            setJob(updatedJob);
            saveJobToStorage(phase, job.id, data.status, videoUrl);

            if (data.logs) setLogs(data.logs);
          } catch (err) {
            console.error(`Failed to poll ${phase}:`, err);
            // Don't stop polling on transient errors - just log and continue
          }
        })
      );
    };

    const intervalId = setInterval(pollAllJobs, POLL_INTERVAL);
    pollAllJobs(); // Initial poll

    return () => clearInterval(intervalId);
  }, [part1Job, part2Job, pollJobStatus]);

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
      setCurrentPhase('stitching');

      concatenateVideos(
        part1Job!.videoUrl!,
        part2Job!.videoUrl!,
        setStitchProgress
      )
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          setStitchedVideoUrl(url);
          setCurrentPhase('completed');
          setIsStitching(false);

          // Show notification
          showBrowserNotification('24-Second Video Ready!', 'Your seamlessly stitched Mount Sinai video is ready');
          updateDocumentTitle('✓ Video Ready - Patient Education');

          // Clear storage after success
          clearJobFromStorage('part1');
          clearJobFromStorage('part2');
        })
        .catch((stitchError) => {
          console.error('Video stitching failed:', stitchError);
          setError('Failed to stitch videos together. You can still download them separately.');
          setCurrentPhase('completed'); // Still show videos
          setIsStitching(false);
        });
    }
  }, [part1Job, part2Job, promptPart2, isStitching, stitchedVideoUrl]);

  // Handle single video completion
  useEffect(() => {
    if (!promptPart2 && part1Job?.status === 'succeeded' && part1Job?.videoUrl) {
      setCurrentPhase('completed');
      showBrowserNotification('Video Ready!', 'Your patient education video is ready to view');
      updateDocumentTitle('✓ Video Ready - Patient Education');
      clearJobFromStorage('part1');
    }
  }, [part1Job, promptPart2]);

  // Check for failures
  useEffect(() => {
    if (part1Job?.status === 'failed') {
      setError(part1Job.error || 'Part 1 video generation failed');
    }
    if (part2Job?.status === 'failed' && part1Job?.status === 'succeeded') {
      setError('Part 2 failed, but Part 1 is available for download');
    } else if (part2Job?.status === 'failed') {
      setError(part2Job.error || 'Part 2 video generation failed');
    }
  }, [part1Job, part2Job]);

  // Compute overall status for display
  const overallStatus = (): JobStatus => {
    if (part1Job?.status === 'failed' || part2Job?.status === 'failed') return 'failed';
    if (part1Job?.status === 'succeeded' && (!promptPart2 || part2Job?.status === 'succeeded')) return 'succeeded';
    if (part1Job?.status === 'processing' || part2Job?.status === 'processing') return 'processing';
    if (part1Job?.status === 'starting' || part2Job?.status === 'starting') return 'starting';
    return 'queued';
  };

  const status = overallStatus();

  const handleDownload = async (url: string) => {
    if (!url) return;

    try {
      const response = await fetch(`/api/sora-download?url=${encodeURIComponent(url)}`);
      if (response.redirected) {
        window.open(response.url, '_blank');
      }
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleRetry = () => {
    // Clear all state and storage
    clearJobFromStorage('part1');
    clearJobFromStorage('part2');
    setPart1Job(null);
    setPart2Job(null);
    setError(null);
    setLogs(null);
    setStitchedVideoUrl(null);
    setIsStitching(false);
    hasCreatedJobs.current = false;
    ffmpegPreloadStarted.current = false;

    // Reload to restart fresh
    window.location.reload();
  };

  const handleSaveToLibrary = () => {
    if (!user || !isAuthenticated) {
      showAuthModal('login');
      return;
    }

    setIsSaving(true);

    try {
      // Create a title from the OST
      const title = ost.beat2?.slice(0, 50) || 'Patient Education Video';

      // Generate unique ID for the video
      const videoId = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);

      saveUserVideo({
        id: videoId,
        userId: user.userId,
        createdAt: new Date().toISOString(),
        title,
        jobId: part1Job?.id || '',
        jobId2: part2Job?.id,
        status: 'completed',
        videoUrl: stitchedVideoUrl || undefined,
        part1Url: part1Job?.videoUrl,
        part2Url: part2Job?.videoUrl,
        prompt,
        promptPart2,
        ost,
        model,
        duration: promptPart2 ? 24 : 12,
      });

      setIsSaved(true);
    } catch (err) {
      console.error('Failed to save video:', err);
      setError('Failed to save video to library');
    } finally {
      setIsSaving(false);
    }
  };

  // Get the current job ID for display
  const currentJobId = part1Job?.id || part2Job?.id;

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
          <span className="ml-2 text-sinai-cyan-600 font-medium">using {modelDisplayName}</span>
        </p>
        {currentPhase === 'parallel' && (
          <div className="mt-2 flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-1.5 rounded-full w-fit">
            <Zap className="w-4 h-4" />
            <span className="font-medium">Parallel Generation - 2x Faster!</span>
          </div>
        )}
        {currentPhase !== 'completed' && currentPhase !== 'parallel' && (
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
                {promptPart2
                  ? 'Both video parts are generating in parallel. You can close this tab and return later.'
                  : 'Your video is generating in the background. You can close this tab and return later.'}
              </p>
              {currentJobId && (
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-white px-2 py-1 rounded border border-blue-200 font-mono">
                    {part1Job?.id && part2Job?.id ? `Part 1: ${part1Job.id.slice(0,8)}... Part 2: ${part2Job.id.slice(0,8)}...` : currentJobId}
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(currentJobId)}
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
                {promptPart2 && currentPhase === 'parallel'
                  ? 'Both video parts are being generated simultaneously'
                  : STATUS_MESSAGES[status]}
              </p>

              {/* Parallel Progress Bars - Show both parts side by side */}
              {promptPart2 && (
                <div className="w-full max-w-md mb-4 space-y-3">
                  {/* Part 1 Progress */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span className="font-medium">Part 1: Branding + Intro</span>
                      <span className={part1Job?.status === 'succeeded' ? 'text-green-600' : ''}>
                        {part1Job?.status === 'succeeded' ? '✓ Complete' :
                         part1Job?.status === 'processing' ? 'Processing...' :
                         part1Job?.status === 'starting' ? 'Starting...' : 'Queued'}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${part1Job?.status === 'succeeded' ? 'bg-green-500' : 'bg-sinai-cyan-600'}`}
                        initial={{ width: '0%' }}
                        animate={{
                          width: part1Job?.status === 'succeeded' ? '100%' :
                                 part1Job?.status === 'processing' ? '66%' :
                                 part1Job?.status === 'starting' ? '33%' : '10%'
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Part 2 Progress */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span className="font-medium">Part 2: Medications + Plan</span>
                      <span className={part2Job?.status === 'succeeded' ? 'text-green-600' : ''}>
                        {part2Job?.status === 'succeeded' ? '✓ Complete' :
                         part2Job?.status === 'processing' ? 'Processing...' :
                         part2Job?.status === 'starting' ? 'Starting...' : 'Queued'}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${part2Job?.status === 'succeeded' ? 'bg-green-500' : 'bg-sinai-magenta-600'}`}
                        initial={{ width: '0%' }}
                        animate={{
                          width: part2Job?.status === 'succeeded' ? '100%' :
                                 part2Job?.status === 'processing' ? '66%' :
                                 part2Job?.status === 'starting' ? '33%' : '10%'
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Educational Tips */}
              <div className="mt-4 bg-sinai-cyan-50 rounded-lg p-4 max-w-md">
                <p className="text-sm text-sinai-cyan-900 font-medium mb-1">
                  {promptPart2 ? '⚡ Parallel Processing' : '💡 Did you know?'}
                </p>
                <p className="text-sm text-sinai-cyan-700">
                  {promptPart2
                    ? 'Both video parts generate at the same time, cutting wait time in half!'
                    : 'Videos improve patient comprehension by 73% compared to text-only instructions.'}
                </p>
              </div>

              <p className="text-xs text-gray-500 mt-4 text-center max-w-md">
                Estimated time: {promptPart2 ? '1.5-2 minutes (parallel)' : '1.5-2 minutes'}
                <br />
                The page will auto-update when ready.
              </p>

              {currentJobId && (
                <p className="text-xs text-gray-500 mt-2 font-mono">
                  Job IDs: {part1Job?.id?.slice(0,8)}... {part2Job?.id ? `/ ${part2Job.id.slice(0,8)}...` : ''}
                </p>
              )}
            </motion.div>
          )}

          {/* Success State */}
          {!isStitching && status === 'succeeded' && (stitchedVideoUrl || part1Job?.videoUrl || part2Job?.videoUrl) && (
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

                  {/* Download and Save Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        const a = document.createElement('a');
                        a.href = stitchedVideoUrl;
                        a.download = 'mount-sinai-patient-education-24s.webm';
                        a.click();
                      }}
                      className="flex-1 py-3 px-6 bg-gradient-to-r from-sinai-cyan-600 to-sinai-magenta-600 text-white font-semibold rounded-lg hover:from-sinai-cyan-700 hover:to-sinai-magenta-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download 24s Video</span>
                    </button>

                    {/* Save to Library Button */}
                    {isSaved ? (
                      <button
                        disabled
                        className="py-3 px-6 bg-green-100 text-green-700 font-semibold rounded-lg flex items-center justify-center gap-2"
                      >
                        <Check className="w-5 h-5" />
                        Saved!
                      </button>
                    ) : isAuthenticated ? (
                      <button
                        onClick={handleSaveToLibrary}
                        disabled={isSaving}
                        className="py-3 px-6 bg-sinai-navy hover:bg-sinai-navy/90 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isSaving ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <BookmarkPlus className="w-5 h-5" />
                        )}
                        <span>{isSaving ? 'Saving...' : 'Save to Library'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => showAuthModal('login')}
                        className="py-3 px-6 border-2 border-sinai-cyan-600 text-sinai-cyan-700 font-semibold rounded-lg hover:bg-sinai-cyan-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <LogIn className="w-5 h-5" />
                        <span>Sign In to Save</span>
                      </button>
                    )}
                  </div>

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
                      src={part1Job?.videoUrl || ''}
                      controls
                      className="w-full aspect-video"
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>

                  {/* Download and Save Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => part1Job?.videoUrl && handleDownload(part1Job.videoUrl)}
                      className="flex-1 py-3 px-6 bg-sinai-cyan-600 text-white font-semibold rounded-lg hover:bg-sinai-cyan-700 transition-colors flex items-center justify-center gap-2"
                      style={{ color: '#ffffff' }}
                    >
                      <Download className="w-5 h-5" style={{ color: '#ffffff' }} />
                      <span style={{ color: '#ffffff' }}>Download Video</span>
                    </button>

                    {/* Save to Library Button */}
                    {isSaved ? (
                      <button
                        disabled
                        className="py-3 px-6 bg-green-100 text-green-700 font-semibold rounded-lg flex items-center justify-center gap-2"
                      >
                        <Check className="w-5 h-5" />
                        Saved!
                      </button>
                    ) : isAuthenticated ? (
                      <button
                        onClick={handleSaveToLibrary}
                        disabled={isSaving}
                        className="py-3 px-6 bg-sinai-navy hover:bg-sinai-navy/90 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isSaving ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <BookmarkPlus className="w-5 h-5" />
                        )}
                        <span>{isSaving ? 'Saving...' : 'Save to Library'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => showAuthModal('login')}
                        className="py-3 px-6 border-2 border-sinai-cyan-600 text-sinai-cyan-700 font-semibold rounded-lg hover:bg-sinai-cyan-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <LogIn className="w-5 h-5" />
                        <span>Sign In to Save</span>
                      </button>
                    )}
                  </div>
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

              {/* Partial success - show Part 1 if available */}
              {part1Job?.status === 'succeeded' && part1Job?.videoUrl && part2Job?.status === 'failed' && (
                <div className="mb-4 w-full max-w-md">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-yellow-900 font-medium mb-2">
                      Part 1 is ready!
                    </p>
                    <p className="text-xs text-yellow-700">
                      Part 2 failed, but you can still download the 12-second Part 1 video.
                    </p>
                  </div>
                  <div className="bg-black rounded-lg overflow-hidden mb-3">
                    <video
                      src={part1Job.videoUrl}
                      controls
                      className="w-full aspect-video"
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <button
                    onClick={() => handleDownload(part1Job.videoUrl!)}
                    className="w-full py-2 px-4 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Part 1 (12s)
                  </button>
                </div>
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
