/**
 * FFmpeg.wasm-based video concatenation utility
 * Properly combines two video files with audio using FFmpeg
 */

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export interface VideoStitcherProgress {
  stage: 'loading' | 'processing' | 'complete';
  progress: number; // 0-100
  message: string;
}

let ffmpegInstance: FFmpeg | null = null;
let ffmpegLoaded = false;
let ffmpegLoadingPromise: Promise<FFmpeg> | null = null;

/**
 * Preload FFmpeg.wasm in the background (call early to reduce wait time)
 * Returns a promise that resolves when FFmpeg is ready
 */
export async function preloadFFmpeg(): Promise<void> {
  if (ffmpegLoaded) return;

  try {
    await initFFmpeg();
    console.log('[FFmpeg] Preloaded successfully');
  } catch (error) {
    console.warn('[FFmpeg] Preload failed, will retry on demand:', error);
  }
}

/**
 * Initialize FFmpeg.wasm (lazy loading with singleton pattern)
 * Uses a shared promise to prevent multiple simultaneous loads
 */
async function initFFmpeg(onProgress?: (progress: VideoStitcherProgress) => void): Promise<FFmpeg> {
  // Already loaded - return immediately
  if (ffmpegInstance && ffmpegLoaded) {
    onProgress?.({ stage: 'loading', progress: 10, message: 'FFmpeg ready (cached)' });
    return ffmpegInstance;
  }

  // Loading in progress - wait for it
  if (ffmpegLoadingPromise) {
    onProgress?.({ stage: 'loading', progress: 5, message: 'Waiting for FFmpeg to load...' });
    return ffmpegLoadingPromise;
  }

  // Start loading
  onProgress?.({ stage: 'loading', progress: 5, message: 'Loading FFmpeg...' });

  ffmpegLoadingPromise = (async () => {
    ffmpegInstance = new FFmpeg();

    // Set up logging
    ffmpegInstance.on('log', ({ message }) => {
      console.log('[FFmpeg]', message);
    });

    // Set up progress tracking
    ffmpegInstance.on('progress', ({ progress }) => {
      const progressPercent = Math.min(progress * 100, 99);
      onProgress?.({
        stage: 'processing',
        progress: 40 + progressPercent * 0.5,
        message: `Processing video... ${Math.round(progressPercent)}%`,
      });
    });

    try {
      // Load FFmpeg core with fallback CDNs
      const cdnUrls = [
        'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm',
        'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm',
      ];

      let lastError: Error | null = null;

      for (const baseURL of cdnUrls) {
        try {
          await ffmpegInstance.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
          });

          ffmpegLoaded = true;
          onProgress?.({ stage: 'loading', progress: 10, message: 'FFmpeg loaded successfully' });
          return ffmpegInstance;
        } catch (error) {
          console.warn(`[FFmpeg] Failed to load from ${baseURL}:`, error);
          lastError = error instanceof Error ? error : new Error(String(error));
        }
      }

      throw lastError || new Error('All CDN sources failed');
    } catch (error) {
      ffmpegLoadingPromise = null; // Allow retry on failure
      console.error('Failed to load FFmpeg:', error);
      throw new Error('Failed to initialize FFmpeg. Please refresh and try again.');
    }
  })();

  return ffmpegLoadingPromise;
}

/**
 * Concatenate two videos using FFmpeg with proper audio handling
 */
export async function concatenateVideosWithFFmpeg(
  video1Url: string,
  video2Url: string,
  onProgress?: (progress: VideoStitcherProgress) => void
): Promise<Blob> {
  try {
    // Stage 1: Initialize FFmpeg
    const ffmpeg = await initFFmpeg(onProgress);

    // Stage 2: Download video files
    onProgress?.({ stage: 'loading', progress: 15, message: 'Downloading video files...' });

    const [video1Data, video2Data] = await Promise.all([
      fetchFile(video1Url),
      fetchFile(video2Url),
    ]);

    onProgress?.({ stage: 'loading', progress: 30, message: 'Videos downloaded, preparing to merge...' });

    // Stage 3: Write files to FFmpeg's virtual filesystem
    await ffmpeg.writeFile('video1.mp4', video1Data);
    await ffmpeg.writeFile('video2.mp4', video2Data);

    onProgress?.({ stage: 'processing', progress: 40, message: 'Merging videos with audio...' });

    // Stage 4: Create concat list file
    const concatList = 'file video1.mp4\nfile video2.mp4\n';
    await ffmpeg.writeFile('concat_list.txt', concatList);

    // Stage 5: Run FFmpeg concat command
    // Using concat demuxer for lossless concatenation with audio
    // -c copy means no re-encoding (fast and lossless)
    await ffmpeg.exec([
      '-f', 'concat',
      '-safe', '0',
      '-i', 'concat_list.txt',
      '-c', 'copy',
      'output.mp4'
    ]);

    onProgress?.({ stage: 'processing', progress: 90, message: 'Reading merged video...' });

    // Stage 6: Read the output file
    const data = await ffmpeg.readFile('output.mp4');

    // Stage 7: Clean up virtual filesystem
    try {
      await ffmpeg.deleteFile('video1.mp4');
      await ffmpeg.deleteFile('video2.mp4');
      await ffmpeg.deleteFile('concat_list.txt');
      await ffmpeg.deleteFile('output.mp4');
    } catch (cleanupError) {
      console.warn('Cleanup warning:', cleanupError);
    }

    onProgress?.({ stage: 'complete', progress: 100, message: 'Videos merged successfully!' });

    // Convert to Blob - handle FFmpeg FileData type (Uint8Array or string)
    // Use slice() to create a new ArrayBuffer owned by the Uint8Array
    const blobData = typeof data === 'string'
      ? new TextEncoder().encode(data)
      : data.slice();
    const blob = new Blob([blobData as BlobPart], { type: 'video/mp4' });
    return blob;

  } catch (error) {
    console.error('FFmpeg concatenation error:', error);
    throw new Error(
      error instanceof Error
        ? `Video merge failed: ${error.message}`
        : 'Video merge failed. Please try again.'
    );
  }
}

/**
 * Alternative: Re-encode videos for better compatibility
 * Use this if the concat demuxer fails due to incompatible formats
 */
export async function concatenateVideosWithReencode(
  video1Url: string,
  video2Url: string,
  onProgress?: (progress: VideoStitcherProgress) => void
): Promise<Blob> {
  try {
    const ffmpeg = await initFFmpeg(onProgress);

    onProgress?.({ stage: 'loading', progress: 15, message: 'Downloading video files...' });

    const [video1Data, video2Data] = await Promise.all([
      fetchFile(video1Url),
      fetchFile(video2Url),
    ]);

    onProgress?.({ stage: 'loading', progress: 30, message: 'Videos downloaded, preparing to merge...' });

    await ffmpeg.writeFile('video1.mp4', video1Data);
    await ffmpeg.writeFile('video2.mp4', video2Data);

    onProgress?.({ stage: 'processing', progress: 40, message: 'Re-encoding and merging videos...' });

    // Create concat list
    const concatList = 'file video1.mp4\nfile video2.mp4\n';
    await ffmpeg.writeFile('concat_list.txt', concatList);

    // Re-encode with H.264 video and AAC audio for maximum compatibility
    await ffmpeg.exec([
      '-f', 'concat',
      '-safe', '0',
      '-i', 'concat_list.txt',
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-crf', '23',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart',
      'output.mp4'
    ]);

    onProgress?.({ stage: 'processing', progress: 90, message: 'Reading merged video...' });

    const data = await ffmpeg.readFile('output.mp4');

    // Cleanup
    try {
      await ffmpeg.deleteFile('video1.mp4');
      await ffmpeg.deleteFile('video2.mp4');
      await ffmpeg.deleteFile('concat_list.txt');
      await ffmpeg.deleteFile('output.mp4');
    } catch (cleanupError) {
      console.warn('Cleanup warning:', cleanupError);
    }

    onProgress?.({ stage: 'complete', progress: 100, message: 'Videos merged successfully!' });

    // Convert to Blob - handle FFmpeg FileData type (Uint8Array or string)
    // Use slice() to create a new ArrayBuffer owned by the Uint8Array
    const blobData = typeof data === 'string'
      ? new TextEncoder().encode(data)
      : data.slice();
    const blob = new Blob([blobData as BlobPart], { type: 'video/mp4' });
    return blob;

  } catch (error) {
    console.error('FFmpeg re-encode error:', error);
    throw new Error(
      error instanceof Error
        ? `Video merge failed: ${error.message}`
        : 'Video merge failed. Please try again.'
    );
  }
}

/**
 * Main concatenation function with automatic fallback
 * Tries fast concat first, falls back to re-encode if needed
 */
export async function concatenateVideos(
  video1Url: string,
  video2Url: string,
  onProgress?: (progress: VideoStitcherProgress) => void
): Promise<Blob> {
  try {
    // Try fast lossless concat first
    return await concatenateVideosWithFFmpeg(video1Url, video2Url, onProgress);
  } catch (error) {
    console.warn('Fast concat failed, falling back to re-encode:', error);
    onProgress?.({ stage: 'processing', progress: 35, message: 'Retrying with re-encoding...' });

    // Fall back to re-encode
    return await concatenateVideosWithReencode(video1Url, video2Url, onProgress);
  }
}
