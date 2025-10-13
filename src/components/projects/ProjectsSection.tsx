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
              Transformative Healthcare Applications
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Five production-ready applications built in weeks by clinical specialists with AI assistance, each solving real healthcare challenges.
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
              Want to Build Healthcare Software This Fast?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Learn how clinical specialists can leverage AI to build production applications in weeks, not years.
            </p>
            <button className="px-8 py-3 bg-white text-sinai-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Download Whitepaper
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
