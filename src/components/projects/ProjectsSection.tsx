import { ScrollReveal } from '../animations/ScrollReveal';
import { ProjectCard } from './ProjectCard';
import { projects } from '../../data/projects';

export function ProjectsSection() {
  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Healthcare Applications
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Production software built in weeks by healthcare teams—physicians, nurses, administrators, and operations staff—with AI-assisted development.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <ScrollReveal delay={0.5}>
          <div className="mt-16 bg-gradient-to-r from-sinai-blue-600 to-sinai-maroon-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              Learn the Modern AI Coding Stack
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Skills, Harness, Ralph, and Hooks—the 2026 architecture for building secure healthcare software with AI.
            </p>
            <a
              href="/blog/modern-ai-coding-architecture-skills-harness-ralph-hooks"
              className="inline-block px-8 py-3 bg-white text-sinai-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Read the Guide
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
