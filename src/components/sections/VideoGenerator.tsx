import { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Play, Download, Loader2, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';

interface VideoGenerationRequest {
  prompt: string;
  duration: 5 | 10;
  aspect_ratio: '16:9' | '9:16' | '1:1';
  negative_prompt?: string;
  cfg_scale?: number;
}

interface GeneratedVideo {
  id: string;
  prompt: string;
  videoUrl: string;
  timestamp: Date;
}

interface PresetPrompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
  duration: 5 | 10;
  aspect_ratio: '16:9' | '9:16' | '1:1';
}

export function VideoGenerator() {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([]);

  // Preset prompts optimized for Kling 2.5 Turbo Pro
  const presetPrompts: PresetPrompt[] = [
    {
      id: 'exterior',
      title: 'Cinematic Hospital Exterior',
      description: 'Aerial shot of Mount Sinai West Hospital with AI visualization overlays',
      prompt: 'A stunning cinematic aerial shot of Mount Sinai West Hospital at 1000 Tenth Avenue, New York City. The camera slowly descends from above, revealing the modern medical center building with the iconic Mount Sinai logo prominently displayed. Golden hour lighting bathes the building in warm tones. The Hudson River and Manhattan skyline are visible in the background. Medical professionals in scrubs walk purposefully through the main entrance. Subtle digital overlays of AI neural networks and healthcare data visualizations float ethereally around the building. Mount Sinai cyan (#06ABEB) and magenta (#DC298D) brand colors accent the scene. Cinematic 4K quality, smooth camera movement.',
      duration: 10,
      aspect_ratio: '16:9'
    },
    {
      id: 'interior',
      title: 'Interior Innovation Lab',
      description: 'Physician-developer working in the Agentic Laboratory with holographic displays',
      prompt: 'Inside the Agentic Laboratory at Mount Sinai West Hospital, a physician-developer works at a modern workstation with multiple monitors displaying code, medical charts, and AI dashboards. The room has sleek, futuristic design with Mount Sinai branding (cyan #06ABEB and magenta #DC298D accents). Holographic displays show 3D visualizations of heart biomarkers and clinical data flowing through AI neural networks. Soft, professional lighting. The doctor reviews AI-generated code while patient vital signs display nearby. Manhattan skyline visible through windows at dusk. Cinematic depth of field, smooth camera movement.',
      duration: 10,
      aspect_ratio: '16:9'
    },
    {
      id: 'patient',
      title: 'Patient-Centric Innovation',
      description: 'Elderly patient using HeartVoice Monitor with AI analysis visualization',
      prompt: 'A heartwarming scene in Mount Sinai West Hospital: An elderly patient speaks into a smartphone for the HeartVoice Monitor app. Subtle digital visualizations show the AI analyzing voice biomarkers for early heart failure detection. The patient\'s physician reviews the data on a tablet showing graphs and AI predictions. Mount Sinai cyan (#06ABEB) highlights positive health indicators. Warm, natural hospital lighting. New York City skyline visible through the window. Compassionate care enhanced by AI technology. Documentary style with cinematic polish.',
      duration: 10,
      aspect_ratio: '16:9'
    },
    {
      id: 'montage',
      title: 'Dynamic Innovation Montage',
      description: 'Fast-paced montage showcasing multiple Agentic Lab applications',
      prompt: 'A dynamic montage showcasing Mount Sinai West Hospital AI innovation: Aerial shot of the hospital at 1000 Tenth Avenue NYC, close-up of Mount Sinai logo with cyan and magenta intersecting lines, physician typing code on laptop, digital visualizations of voice biomarkers detecting heart failure, clinical team collaborating around holographic displays, patient monitoring screens with AI alerts, code deployment with green checkmarks. Smooth transitions with cyan/magenta gradient wipes. Professional healthcare commercial aesthetic, cinematic quality.',
      duration: 10,
      aspect_ratio: '16:9'
    }
  ];

  const handleGenerate = async () => {
    const preset = presetPrompts.find(p => p.id === selectedPreset);
    const promptToUse = customPrompt || preset?.prompt;

    if (!promptToUse) {
      setErrorMessage('Please select a preset or enter a custom prompt');
      setGenerationStatus('error');
      return;
    }

    setIsGenerating(true);
    setGenerationStatus('processing');
    setErrorMessage('');

    try {
      const request: VideoGenerationRequest = {
        prompt: promptToUse,
        duration: preset?.duration || 10,
        aspect_ratio: preset?.aspect_ratio || '16:9',
        negative_prompt: 'blur, distort, low quality, text overlays, watermarks',
      };

      // Step 1: Start the video generation job (Kling 2.5 API)
      const response = await fetch('/api/kling-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start video generation');
      }

      if (!data.id) {
        throw new Error('Invalid response from server');
      }

      const jobId = data.id;
      console.log('Video generation started (Kling 2.5), job ID:', jobId);

      // Step 2: Poll for completion
      const maxAttempts = 120; // 10 minutes max (5 second intervals)
      let attempts = 0;

      while (attempts < maxAttempts) {
        // Wait 5 seconds before checking
        await new Promise(resolve => setTimeout(resolve, 5000));
        attempts++;

        try {
          const statusResponse = await fetch(`/api/kling-status?id=${jobId}`);
          const statusData = await statusResponse.json();

          if (!statusResponse.ok) {
            console.error('Status check failed:', statusData.error);
            continue; // Try again
          }

          console.log(`Attempt ${attempts}/${maxAttempts}: Status = ${statusData.status}`);

          if (statusData.status === 'succeeded' && statusData.videoUrl) {
            // Success!
            const newVideo: GeneratedVideo = {
              id: jobId,
              prompt: promptToUse,
              videoUrl: statusData.videoUrl,
              timestamp: new Date(),
            };

            setGeneratedVideos(prev => [newVideo, ...prev]);
            setGenerationStatus('success');
            setCustomPrompt('');
            setSelectedPreset(null);
            setIsGenerating(false);
            return;
          }

          if (statusData.status === 'failed' || statusData.status === 'canceled') {
            throw new Error(statusData.error || `Video generation ${statusData.status}`);
          }

          // Still processing, continue polling
        } catch (pollError) {
          console.error('Polling error:', pollError);
          // Continue trying unless we've exceeded max attempts
        }
      }

      // Timeout
      throw new Error('Video generation timed out after 10 minutes. The video may still be processing on Replicate.');

    } catch (error) {
      console.error('Video generation error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
      setGenerationStatus('error');
      setIsGenerating(false);
    }
  };

  const handleDownload = async (videoUrl: string, id: string) => {
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mount-sinai-video-${id}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download video');
    }
  };

  return (
    <section id="video-generator" className="py-20 bg-gradient-to-b from-white to-gray-50 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-sinai-cyan to-sinai-magenta rounded-2xl flex items-center justify-center">
              <Video className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-sinai-navy mb-4">
            AI Video Generator
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Generate cinematic promotional videos powered by Kling 2.5 Turbo Pro
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Generator Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-sinai-navy mb-6 flex items-center">
                <Sparkles className="w-6 h-6 mr-2 text-sinai-cyan" />
                Create Your Video
              </h3>

              {/* Preset Prompts */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select a Preset Prompt
                </label>
                <div className="grid gap-3">
                  {presetPrompts.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setSelectedPreset(preset.id);
                        setCustomPrompt('');
                      }}
                      className={`text-left p-4 border-2 rounded-lg transition-all ${
                        selectedPreset === preset.id
                          ? 'border-sinai-cyan bg-sinai-cyan/5'
                          : 'border-gray-200 hover:border-sinai-cyan/50'
                      }`}
                    >
                      <div className="font-semibold text-sinai-navy mb-1">{preset.title}</div>
                      <div className="text-sm text-gray-600">{preset.description}</div>
                      <div className="text-xs text-gray-500 mt-2">
                        {preset.aspect_ratio} • {preset.duration}s • 1080p
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Custom Prompt */}
              <div className="mb-6">
                <label htmlFor="customPrompt" className="block text-sm font-semibold text-gray-700 mb-2">
                  Custom Prompt
                </label>
                <textarea
                  id="customPrompt"
                  value={customPrompt}
                  onChange={(e) => {
                    setCustomPrompt(e.target.value);
                    if (e.target.value) setSelectedPreset(null);
                  }}
                  placeholder="Describe your video... (or select a preset above)"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sinai-cyan focus:border-transparent resize-none"
                />
              </div>

              {/* Status Messages */}
              {generationStatus === 'error' && (
                <div className="mb-6 flex items-start space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              )}

              {generationStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 flex items-start space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">Video generated successfully! Check the gallery below.</p>
                </motion.div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || (!selectedPreset && !customPrompt)}
                className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-sinai-cyan to-sinai-magenta text-white rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating Video...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Generate Video</span>
                  </>
                )}
              </button>

              {isGenerating && (
                <p className="text-xs text-gray-500 text-center mt-3">
                  This typically takes 1-3 minutes with Kling 2.5. Please be patient...
                </p>
              )}
            </div>
          </motion.div>

          {/* Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* About Section */}
            <div className="bg-gradient-to-br from-sinai-cyan/10 to-sinai-magenta/10 rounded-2xl p-8 border-l-4 border-sinai-cyan">
              <h4 className="text-xl font-bold text-sinai-navy mb-4">Powered by Kling 2.5 Turbo Pro</h4>
              <p className="text-gray-700 mb-4">
                Generate professional-quality promotional videos showcasing the Agentic Laboratory's AI-powered healthcare innovation at Mount Sinai West Hospital.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-sinai-cyan mr-2">✓</span>
                  <span>1080p Full HD cinematic quality (superior to 720p)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sinai-cyan mr-2">✓</span>
                  <span>Superior motion physics and camera movement</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sinai-cyan mr-2">✓</span>
                  <span>Mount Sinai brand colors and styling</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sinai-cyan mr-2">✓</span>
                  <span>8.1/10 visual fidelity benchmark score</span>
                </li>
              </ul>
            </div>

            {/* Technical Specs */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="font-bold text-sinai-navy mb-3">Technical Specifications</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Resolution:</span>
                  <span className="font-semibold">1920x1080 (Full HD)</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-semibold">5 or 10 seconds</span>
                </div>
                <div className="flex justify-between">
                  <span>Aspect Ratios:</span>
                  <span className="font-semibold">16:9, 9:16, 1:1</span>
                </div>
                <div className="flex justify-between">
                  <span>Frame Rate:</span>
                  <span className="font-semibold">30 fps</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Time:</span>
                  <span className="font-semibold">1-3 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Model:</span>
                  <span className="font-semibold">Kling 2.5 Turbo Pro</span>
                </div>
              </div>
            </div>

            {/* Usage Tips */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="font-bold text-sinai-navy mb-3">Usage Tips</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">💡</span>
                  <span>Kling 2.5 excels at complex camera movements and dynamic scenes</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🎨</span>
                  <span>Include specific colors (like Mount Sinai cyan/magenta) for brand consistency</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">⏱️</span>
                  <span>Generation typically takes 1-3 minutes (faster than before!)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">📥</span>
                  <span>Download videos immediately - they're not stored permanently</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Video Gallery */}
        {generatedVideos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16"
          >
            <h3 className="text-3xl font-bold text-sinai-navy mb-8 text-center">Generated Videos</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedVideos.map((video) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <video
                    src={video.videoUrl}
                    controls
                    className="w-full aspect-video bg-gray-900"
                  />
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.prompt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{video.timestamp.toLocaleString()}</span>
                      <button
                        onClick={() => handleDownload(video.videoUrl, video.id)}
                        className="flex items-center space-x-1 text-sinai-cyan hover:text-sinai-magenta transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
