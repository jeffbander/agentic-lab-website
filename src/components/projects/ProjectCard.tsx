import { motion } from 'framer-motion';
import { ExternalLink, Github, Clock, DollarSign } from 'lucide-react';
import type { Project } from '../../data/projects';
import { trackCTAClick, trackGitHubClick } from '../../utils/analytics';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
    >
      {/* Status Badge */}
      <div className="relative">
        <div className="absolute top-4 right-4 z-10">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              project.status === 'Production'
                ? 'bg-green-100 text-green-700'
                : project.status === 'Testing'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {project.status}
          </span>
        </div>

        {/* Header gradient */}
        <div className="h-2 bg-gradient-to-r from-sinai-blue-500 to-sinai-maroon-500" />

        <div className="p-6">
          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-sinai-blue-600 transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-gray-600 font-medium mb-4">{project.subtitle}</p>

          {/* Description */}
          <p className="text-gray-700 mb-6 line-clamp-3">{project.description}</p>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="w-4 h-4 text-sinai-blue-600" />
              <div>
                <div className="text-xs text-gray-500">Development</div>
                <div className="font-semibold text-gray-900">{project.developmentTime}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <DollarSign className="w-4 h-4 text-green-600" />
              <div>
                <div className="text-xs text-gray-500">Savings</div>
                <div className="font-semibold text-gray-900">{project.costSavings}</div>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-6">
            <div className="text-xs text-gray-500 mb-2">Tech Stack</div>
            <div className="flex flex-wrap gap-2">
              {project.techStack.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 4 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                  +{project.techStack.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <motion.a
              href="#contact"
              onClick={() => trackCTAClick('Project Card', `Request Details - ${project.title}`)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-sinai-blue-600 text-white rounded-lg font-medium hover:bg-sinai-blue-700 transition-colors"
            >
              <span>Request Implementation Details →</span>
              <ExternalLink className="w-4 h-4" />
            </motion.a>
            {project.githubUrl && (
              <motion.a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackGitHubClick(project.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 border-2 border-gray-300 rounded-lg hover:border-sinai-blue-600 hover:text-sinai-blue-600 transition-colors"
                aria-label="View source code on GitHub"
              >
                <Github className="w-5 h-5" />
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
