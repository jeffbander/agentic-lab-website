import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Video, Play, Download, Loader2, AlertCircle, CheckCircle, Sparkles, Upload, X, Image as ImageIcon } from 'lucide-react';

interface VideoGenerationRequest {
  prompt: string;
  duration: number;
  aspect_ratio: '16:9' | '9:16';
  resolution: '720p' | '1080p';
  reference_images?: string[];
  generate_audio?: boolean;
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
  duration: number;
}

interface ReferenceImage {
  id: string;
  file: File;
  preview: string;
  base64: string;
}

export function VideoGenerator() {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([]);
  const [referenceImages, setReferenceImages] = useState<ReferenceImage[]>([]);
  const [duration, setDuration] = useState<4 | 6 | 8>(8);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [generateAudio, setGenerateAudio] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preset prompts optimized for Veo 3.1
  const presetPrompts: PresetPrompt[] = [
    {
      id: 'exterior',
      title: 'Cinematic Hospital Exterior',
      description: 'Aerial shot of Mount Sinai West Hospital with AI visualization overlays',
      prompt: 'A stunning cinematic aerial shot of Mount Sinai West Hospital at 1000 Tenth Avenue, New York City. The camera slowly descends from above, revealing the modern medical center building with the iconic Mount Sinai logo prominently displayed. Golden hour lighting bathes the building in warm tones. The Hudson River and Manhattan skyline are visible in the background. Medical professionals in scrubs walk purposefully through the main entrance. Subtle digital overlays of AI neural networks and healthcare data visualizations float ethereally around the building. High-end commercial production quality, cinematic color grading.',
      duration: 8,
    },
    {
      id: 'interior',
      title: 'Interior Innovation Lab',
      description: 'Physician-developer working in the Agentic Laboratory with holographic displays',
      prompt: 'Inside the Agentic Laboratory at Mount Sinai West Hospital, a physician-developer works at a modern workstation with multiple monitors displaying code, medical charts, and AI dashboards. The room has sleek, futuristic design with cyan and magenta accents. Holographic displays show 3D visualizations of heart biomarkers and clinical data flowing through AI neural networks. Soft, professional lighting. The doctor reviews AI-generated code on one screen while a patient\'s vital signs display on another. Through large windows, the Manhattan skyline is visible at dusk. Cinematic depth of field, smooth camera movement.',
      duration: 8,
    },
    {
      id: 'patient',
      title: 'Patient-Centric Innovation',
      description: 'Elderly patient using HeartVoice Monitor with AI analysis visualization',
      prompt: 'A heartwarming scene in Mount Sinai West Hospital: An elderly patient speaks into a smartphone for the HeartVoice Monitor app. Subtle digital visualizations show the AI analyzing voice biomarkers for early heart failure detection. The patient\'s physician reviews the data on a tablet showing graphs and AI predictions. Cyan highlights positive health indicators. Warm, natural hospital lighting. Through the window, you can see the New York City skyline. The scene emphasizes compassionate care enhanced by AI technology. Shot in documentary style with cinematic polish.',
      duration: 8,
    },
    {
      id: 'montage',
      title: 'Dynamic Innovation Montage',
      description: 'Fast-paced montage showcasing multiple Agentic Lab applications',
      prompt: 'A dynamic montage showcasing Mount Sinai West Hospital\'s AI innovation: Aerial establishing shot of the hospital building, close-up of logo with cyan and magenta intersecting lines, physician typing code on laptop in modern lab setting, digital visualizations of voice biomarkers detecting heart failure, interactive ROI calculator dashboard, clinical team collaborating around holographic medical displays, patient monitoring screens with AI-powered alerts, code deployment sequence with green checkmarks. Each scene transitions smoothly. Professional healthcare commercial aesthetic, 4K cinematic quality.',
      duration: 8,
    }
  ];

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const remainingSlots = 3 - referenceImages.length;
    const filesToAdd = Array.from(files).slice(0, remainingSlots);

    for (const file of filesToAdd) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please upload only image files');
        setGenerationStatus('error');
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('Image size must be less than 10MB');
        setGenerationStatus('error');
        continue;
      }

      try {
        const base64 = await convertToBase64(file);
        const newImage: ReferenceImage = {
          id: Math.random().toString(36).substring(7),
          file,
          preview: URL.createObjectURL(file),
          base64,
        };
        setReferenceImages(prev => [...prev, newImage]);
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (id: string) => {
    setReferenceImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

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
        duration: referenceImages.length > 0 ? 8 : duration, // Force 8s for reference images
        aspect_ratio: referenceImages.length > 0 ? '16:9' : aspectRatio, // Force 16:9 for reference images
        resolution: '1080p',
        generate_audio: generateAudio,
      };

      // Add reference images if any
      if (referenceImages.length > 0) {
        request.reference_images = referenceImages.map(img => img.base64);
      }

      // Step 1: Start the video generation job
      const response = await fetch('/api/generate-video', {
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

      if (!data.success || !data.jobId) {
        throw new Error('Invalid response from server');
      }

      const jobId = data.jobId;
      console.log('Video generation started with Veo 3.1, job ID:', jobId);

      // Step 2: Poll for completion
      const maxAttempts = 120; // 10 minutes max (5 second intervals)
      let attempts = 0;

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        attempts++;

        try {
          const statusResponse = await fetch(`/api/check-video-status?id=${jobId}`);
          const statusData = await statusResponse.json();

          if (!statusResponse.ok) {
            console.error('Status check failed:', statusData.error);
            continue;
          }

          console.log(`Attempt ${attempts}/${maxAttempts}: Status = ${statusData.status}`);

          if (statusData.status === 'succeeded' && statusData.videoUrl) {
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
            setReferenceImages([]);
            setIsGenerating(false);
            return;
          }

          if (statusData.status === 'failed' || statusData.status === 'canceled') {
            throw new Error(statusData.error || `Video generation ${statusData.status}`);
          }
        } catch (pollError) {
          console.error('Polling error:', pollError);
        }
      }

      throw new Error('Video generation timed out after 10 minutes.');

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
            Generate cinematic promotional videos powered by Google Veo 3.1
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

              {/* Reference Images Upload */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Reference Images (Optional)
                  <span className="font-normal text-gray-500 ml-2">Up to 3 images for character/style consistency</span>
                </label>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-sinai-cyan transition-colors">
                  {referenceImages.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-4">
                      {referenceImages.map((img) => (
                        <div key={img.id} className="relative group">
                          <img
                            src={img.preview}
                            alt="Reference"
                            className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            onClick={() => removeImage(img.id)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {referenceImages.length < 3 && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex flex-col items-center justify-center py-4 text-gray-500 hover:text-sinai-cyan transition-colors"
                    >
                      <Upload className="w-8 h-8 mb-2" />
                      <span className="text-sm font-medium">
                        {referenceImages.length === 0 ? 'Upload reference images' : `Add more (${3 - referenceImages.length} remaining)`}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</span>
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {referenceImages.length > 0 && (
                  <p className="text-xs text-amber-600 mt-2 flex items-center">
                    <ImageIcon className="w-3 h-3 mr-1" />
                    Reference images require 16:9 aspect ratio and 8s duration
                  </p>
                )}
              </div>

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
                        1080p • {preset.duration}s
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

              {/* Video Settings */}
              {referenceImages.length === 0 && (
                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Duration
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value) as 4 | 6 | 8)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sinai-cyan focus:border-transparent"
                    >
                      <option value={4}>4 seconds</option>
                      <option value={6}>6 seconds</option>
                      <option value={8}>8 seconds</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Aspect Ratio
                    </label>
                    <select
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value as '16:9' | '9:16')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sinai-cyan focus:border-transparent"
                    >
                      <option value="16:9">16:9 (Landscape)</option>
                      <option value="9:16">9:16 (Portrait)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Audio Toggle */}
              <div className="mb-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={generateAudio}
                    onChange={(e) => setGenerateAudio(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-10 h-6 rounded-full transition-colors ${generateAudio ? 'bg-sinai-cyan' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform mt-1 ${generateAudio ? 'translate-x-5' : 'translate-x-1'}`} />
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700">Generate audio</span>
                </label>
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
                  This may take 2-5 minutes. Please be patient...
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
              <h4 className="text-xl font-bold text-sinai-navy mb-4">Powered by Google Veo 3.1</h4>
              <p className="text-gray-700 mb-4">
                Generate professional-quality promotional videos with Google's latest AI video model. Now with reference image support for consistent characters and styles.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-sinai-cyan mr-2">✓</span>
                  <span>1080p cinematic quality video generation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sinai-cyan mr-2">✓</span>
                  <span>Reference images for character consistency</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sinai-cyan mr-2">✓</span>
                  <span>AI-generated audio included</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sinai-cyan mr-2">✓</span>
                  <span>Professional commercial production quality</span>
                </li>
              </ul>
            </div>

            {/* Technical Specs */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="font-bold text-sinai-navy mb-3">Technical Specifications</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Resolution:</span>
                  <span className="font-semibold">720p / 1080p</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-semibold">4, 6, or 8 seconds</span>
                </div>
                <div className="flex justify-between">
                  <span>Aspect Ratio:</span>
                  <span className="font-semibold">16:9 or 9:16</span>
                </div>
                <div className="flex justify-between">
                  <span>Frame Rate:</span>
                  <span className="font-semibold">24 fps</span>
                </div>
                <div className="flex justify-between">
                  <span>Reference Images:</span>
                  <span className="font-semibold">Up to 3</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Time:</span>
                  <span className="font-semibold">2-5 minutes</span>
                </div>
              </div>
            </div>

            {/* Usage Tips */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="font-bold text-sinai-navy mb-3">Reference Image Tips</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">📸</span>
                  <span>Use 2-3 high-quality images of the same subject</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">💡</span>
                  <span>Well-lit images with neutral backgrounds work best</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">👔</span>
                  <span>Keep consistent outfits across reference images</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🎯</span>
                  <span>Describe the subject in your prompt for best results</span>
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
