import React, { useState } from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  Github, 
  Layers, 
  Terminal, 
  CheckCircle2, 
  ArrowRight,
  Code2,
  Cloud
} from 'lucide-react';
import { projects } from '../data/portfolioData';
import { 
  RagChatbotPreview, 
  BankingSystemPreview, 
  RbiDashboardPreview, 
  FaceDetectionPreview, 
  SalaryPredictionPreview, 
  TextSummarizerPreview 
} from './ProjectPreviews';

const previewComponents = {
  'rag-chatbot': <RagChatbotPreview />,
  'banking-system': <BankingSystemPreview />,
  'rbi-dashboard': <RbiDashboardPreview />,
  'face-detection': <FaceDetectionPreview />,
  'salary-prediction': <SalaryPredictionPreview />,
  'text-summarizer': <TextSummarizerPreview />
};

const Projects = ({ onSelectProject }) => {
  const [filter, setFilter] = useState('All');

  const categories = [
    'All', 
    'AI, LLMs & NLP', 
    'Machine Learning', 
    'Data Analytics & BI', 
    'Computer Vision', 
    'Python & SQL'
  ];

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-20 md:py-28 relative">
      
      {/* Background Glow */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Case Studies &amp; Implementations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">Projects</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Practical AI/ML implementations built with LLMs, RAG, Transformers, Scikit-learn, OpenCV, Power BI, Python &amp; SQL deployed with Streamlit and Render.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                filter === cat
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-105'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 backdrop-blur-sm relative overflow-hidden"
            >
              <div>
                {/* Visual Preview Header */}
                <div className="mb-4 cursor-pointer" onClick={() => onSelectProject(project)}>
                  {previewComponents[project.previewType] || <RagChatbotPreview />}
                </div>

                {/* Badges */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                    {project.category}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/30 flex items-center gap-1">
                    <Cloud className="w-3 h-3" />
                    {project.deploymentType || project.status}
                  </span>
                </div>

                {/* Project Title */}
                <h3 
                  className="text-base sm:text-lg font-bold text-white group-hover:text-sky-300 transition-colors mb-2 cursor-pointer leading-snug"
                  onClick={() => onSelectProject(project)}
                >
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800/70 text-slate-300 border border-slate-700/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons & Links */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2.5">
                <div className="flex items-center gap-2 w-full">
                  {/* GitHub Repo Button */}
                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => onSelectProject(project)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/70 hover:bg-slate-800 hover:text-white rounded-lg border border-slate-700/80 transition-colors"
                      title="Click to view details"
                    >
                      <Github className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Code Repo</span>
                    </button>
                  )}

                  {/* Live Demo Button */}
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => onSelectProject(project)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/70 hover:bg-slate-800 hover:text-white rounded-lg border border-slate-700/80 transition-colors"
                      title="Click to view details"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                      <span>Demo Preview</span>
                    </button>
                  )}
                </div>

                {/* Case Study Details Trigger */}
                <button
                  onClick={() => onSelectProject(project)}
                  className="w-full inline-flex items-center justify-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors py-0.5"
                >
                  <span>Architecture &amp; Methodology</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Projects;
