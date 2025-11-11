/**
 * Client-side video concatenation utility
 * Combines two video files into a single seamless video using Canvas API
 */

export interface VideoStitcherProgress {
  stage: 'loading' | 'processing' | 'complete';
  progress: number; // 0-100
  message: string;
}

/**
 * Concatenate two videos client-side into a single blob
 */
export async function concatenateVideos(
  video1Url: string,
  video2Url: string,
  onProgress?: (progress: VideoStitcherProgress) => void
): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    try {
      // Stage 1: Load both videos
      onProgress?.({ stage: 'loading', progress: 10, message: 'Loading video files...' });

      const [video1Blob, video2Blob] = await Promise.all([
        fetch(video1Url).then(r => r.blob()),
        fetch(video2Url).then(r => r.blob()),
      ]);

      onProgress?.({ stage: 'loading', progress: 30, message: 'Videos loaded, preparing to merge...' });

      // Create video elements
      const video1 = document.createElement('video');
      const video2 = document.createElement('video');

      video1.src = URL.createObjectURL(video1Blob);
      video2.src = URL.createObjectURL(video2Blob);

      // Don't mute - we need audio for capture
      // Set volume to 0 to avoid playing audio during processing, but keep audio tracks available
      video1.volume = 0;
      video2.volume = 0;

      // Wait for both videos to load metadata
      await Promise.all([
        new Promise((res) => { video1.onloadedmetadata = () => res(null); video1.load(); }),
        new Promise((res) => { video2.onloadedmetadata = () => res(null); video2.load(); }),
      ]);

      onProgress?.({ stage: 'processing', progress: 40, message: 'Merging videos...' });

      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = video1.videoWidth;
      canvas.height = video1.videoHeight;
      const ctx = canvas.getContext('2d')!;

      // Set up MediaRecorder
      const stream = canvas.captureStream(30); // 30 fps

      // Set up audio context for capturing audio
      const audioContext = new AudioContext();
      const audioDestination = audioContext.createMediaStreamDestination();

      // We'll connect audio sources when playing each video
      let video1AudioSource: MediaElementAudioSourceNode | null = null;
      let video2AudioSource: MediaElementAudioSourceNode | null = null;

      // Try to create audio source for video 1
      try {
        video1AudioSource = audioContext.createMediaElementSource(video1);
        video1AudioSource.connect(audioDestination);
        console.log('Video 1 audio source connected');
      } catch (e) {
        console.warn('Video 1 has no audio or audio source creation failed:', e);
      }

      // For video 2, we'll create the audio source later when it starts playing
      // to avoid conflicts with sequential playback

      // Add audio tracks to the recording stream
      const audioTracks = audioDestination.stream.getAudioTracks();
      if (audioTracks.length > 0) {
        console.log(`Adding ${audioTracks.length} audio track(s) to stream`);
        audioTracks.forEach(track => {
          stream.addTrack(track);
        });
      } else {
        console.warn('No audio tracks available - videos may not contain audio');
      }

      const chunks: Blob[] = [];

      // Configure MediaRecorder with audio and video codecs
      const recorderOptions: MediaRecorderOptions = {
        videoBitsPerSecond: 5000000, // 5 Mbps
        audioBitsPerSecond: 128000,  // 128 kbps for audio
      };

      // Try different codec combinations, preferring ones with audio support
      const mimeTypes = [
        'video/webm;codecs=vp9,opus',  // VP9 video + Opus audio (best quality)
        'video/webm;codecs=vp8,opus',  // VP8 video + Opus audio (better compatibility)
        'video/webm',                   // Fallback to default codecs
      ];

      let selectedMimeType = '';
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          console.log(`Using MediaRecorder mimeType: ${mimeType}`);
          break;
        }
      }

      if (selectedMimeType) {
        recorderOptions.mimeType = selectedMimeType;
      } else {
        console.warn('No preferred mimeType supported, using default');
      }

      const mediaRecorder = new MediaRecorder(stream, recorderOptions);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const finalBlob = new Blob(chunks, { type: 'video/webm' });

        // Cleanup
        if (video1AudioSource) {
          video1AudioSource.disconnect();
        }
        if (video2AudioSource) {
          video2AudioSource.disconnect();
        }
        URL.revokeObjectURL(video1.src);
        URL.revokeObjectURL(video2.src);
        audioContext.close();

        onProgress?.({ stage: 'complete', progress: 100, message: 'Videos merged successfully!' });
        resolve(finalBlob);
      };

      // Start recording
      mediaRecorder.start();

      // Play and record video 1
      video1.currentTime = 0;
      await video1.play();

      const renderVideo1 = () => {
        if (!video1.paused && !video1.ended) {
          ctx.drawImage(video1, 0, 0, canvas.width, canvas.height);
          requestAnimationFrame(renderVideo1);

          const progress = 40 + (video1.currentTime / video1.duration) * 30;
          onProgress?.({ stage: 'processing', progress, message: 'Recording Part 1...' });
        }
      };

      renderVideo1();

      // When video 1 ends, start video 2
      video1.onended = async () => {
        onProgress?.({ stage: 'processing', progress: 70, message: 'Recording Part 2...' });

        // Disconnect video 1 audio and connect video 2 audio
        if (video1AudioSource) {
          video1AudioSource.disconnect();
        }

        // Connect video 2 audio source
        try {
          video2AudioSource = audioContext.createMediaElementSource(video2);
          video2AudioSource.connect(audioDestination);
          console.log('Video 2 audio source connected');
        } catch (e) {
          console.warn('Video 2 has no audio or audio source creation failed:', e);
        }

        video2.currentTime = 0;
        await video2.play();

        const renderVideo2 = () => {
          if (!video2.paused && !video2.ended) {
            ctx.drawImage(video2, 0, 0, canvas.width, canvas.height);
            requestAnimationFrame(renderVideo2);

            const progress = 70 + (video2.currentTime / video2.duration) * 25;
            onProgress?.({ stage: 'processing', progress, message: 'Recording Part 2...' });
          }
        };

        renderVideo2();

        // When video 2 ends, stop recording
        video2.onended = () => {
          onProgress?.({ stage: 'processing', progress: 95, message: 'Finalizing video...' });
          mediaRecorder.stop();
        };
      };

    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Simpler approach: Create a playlist-style video that auto-plays the second video
 * This is instant and doesn't require re-encoding
 */
export function createSequentialVideoPlayer(
  video1Url: string,
  video2Url: string,
  videoElement: HTMLVideoElement
): void {
  videoElement.src = video1Url;

  const playNextVideo = () => {
    videoElement.src = video2Url;
    videoElement.currentTime = 0;
    videoElement.play();
    videoElement.removeEventListener('ended', playNextVideo);
  };

  videoElement.addEventListener('ended', playNextVideo, { once: true });
}
