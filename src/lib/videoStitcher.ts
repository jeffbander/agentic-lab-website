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

      video1.muted = true;
      video2.muted = true;

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

      // Try to get audio streams (videos may not have audio)
      const audioContext = new AudioContext();
      const audioDestination = audioContext.createMediaStreamDestination();

      try {
        const video1AudioSource = audioContext.createMediaElementSource(video1);
        video1AudioSource.connect(audioDestination);
      } catch (e) {
        console.warn('Video 1 has no audio or audio already connected');
      }

      try {
        const video2AudioSource = audioContext.createMediaElementSource(video2);
        video2AudioSource.connect(audioDestination);
      } catch (e) {
        console.warn('Video 2 has no audio or audio already connected');
      }

      // Add audio track to stream if available
      if (audioDestination.stream.getAudioTracks().length > 0) {
        audioDestination.stream.getAudioTracks().forEach(track => {
          stream.addTrack(track);
        });
      }

      const chunks: Blob[] = [];
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 5000000, // 5 Mbps
      });

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const finalBlob = new Blob(chunks, { type: 'video/webm' });

        // Cleanup
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
