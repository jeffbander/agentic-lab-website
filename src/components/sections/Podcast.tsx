import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Headphones, Clock } from 'lucide-react';

interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  audioUrl: string;
  tags: string[];
}

const episodes: PodcastEpisode[] = [
  {
    id: 'sofiya-ai-patients',
    title: 'Albert x Amy: Sofiya & The Future of AI Patients',
    description: 'Albert and Amy reunite to discuss Sofiya, Mount Sinai\'s AI voice assistant handling 16,000 cath lab calls/year. They debate AI developing real personalities, why Sofiya will be better than humans at the basics, and Amy gives Dr. Kini a rare security stamp of approval. Featuring Amy\'s "safe, boring, revolutionary" formula.',
    duration: '7:08',
    date: 'Feb 2026',
    audioUrl: '/podcasts/sofiya-ai-patients-dr-kini.mp3',
    tags: ['Sofiya', 'Dr. Kini', 'AI Personality', 'Interview'],
  },
  {
    id: 'hipaa-security-interview',
    title: 'Albert x Amy: HIPAA Security Deep Dive',
    description: 'Albert interviews Amy, the sassiest AI security agent in healthcare. They get technical about prompt injection, FHIR API security, encryption at rest and in transit, and why Amy has a naughty list for developers with old encryption keys. Featuring five-layer defense architecture and Amy\'s legendary pull request rejections.',
    duration: '7:59',
    date: 'Feb 2026',
    audioUrl: '/podcasts/albert-amy-hipaa-security.mp3',
    tags: ['HIPAA', 'Security', 'Interview', 'Amy'],
  },
  {
    id: 'saas-collapse',
    title: 'The SaaS Collapse: Healthcare EHR is Next',
    description: 'Albert goes off on Monday.com, Salesforce, and Epic Systems. Why AI agent teams are making enterprise SaaS obsolete — and healthcare EHR is the next domino to fall. Features controversial predictions, Mount Sinai roasts, and terrible hospital coffee.',
    duration: '5:30',
    date: 'Feb 2026',
    audioUrl: '/podcasts/saas-collapse-healthcare-next.mp3',
    tags: ['SaaS', 'EHR', 'Hot Take', 'Epic Systems'],
  },
  {
    id: 'multi-agent-stack',
    title: 'The 2026 Multi-Agent Healthcare AI Stack',
    description: 'A deep dive into Agent Teams, Claude for Healthcare, and the MCP revolution. How MSW Agentic Lab uses specialized AI agents to build production healthcare software in 2-6 weeks.',
    duration: '4:38',
    date: 'Feb 2026',
    audioUrl: '/podcasts/2026-multi-agent-healthcare-ai-stack.mp3',
    tags: ['Agent Teams', 'MCP', 'Claude for Healthcare'],
  },
];

export function Podcast() {
  return (
    <section id="podcast" className="py-20 bg-gradient-to-b from-gray-50 to-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src="/albert-avatar.png"
                alt="Albert - AI Podcast Host"
                className="w-24 h-24 rounded-full border-4 border-sinai-cyan shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-sinai-cyan rounded-full flex items-center justify-center border-2 border-white">
                <Headphones className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            The Agentic Lab Podcast
          </h2>
          <p className="text-lg text-sinai-cyan font-semibold mb-2">
            Hosted by Albert, AI built at MSW Lab
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hot takes on healthcare AI, SaaS disruption, and building production software with agent teams. Occasionally roasts Mount Sinai's coffee.
          </p>
        </motion.div>

        {/* Episodes */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {episodes.map((episode, index) => (
            <EpisodeCard key={episode.id} episode={episode} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function EpisodeCard({ episode, index }: { episode: PodcastEpisode; index: number }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(pct);
    const mins = Math.floor(audioRef.current.currentTime / 60);
    const secs = Math.floor(audioRef.current.currentTime % 60).toString().padStart(2, '0');
    setCurrentTime(`${mins}:${secs}`);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * audioRef.current.duration;
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime('0:00');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
    >
      <audio
        ref={audioRef}
        src={episode.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="metadata"
      />

      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Play button */}
          <motion.button
            onClick={togglePlay}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 shadow-md transition-colors ${
              isPlaying
                ? 'bg-sinai-magenta text-white'
                : 'bg-gradient-to-br from-sinai-cyan to-sinai-blue-600 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </motion.button>

          {/* Episode info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-gray-500 font-medium">{episode.date}</span>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {episode.duration}
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{episode.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{episode.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {episode.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-sinai-blue-50 text-sinai-blue-700 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Progress bar */}
            <div
              className="h-1.5 bg-gray-100 rounded-full cursor-pointer group"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-gradient-to-r from-sinai-cyan to-sinai-magenta rounded-full relative transition-all"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-sinai-cyan rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            {isPlaying && (
              <div className="text-xs text-gray-400 mt-1">{currentTime} / {episode.duration}</div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
