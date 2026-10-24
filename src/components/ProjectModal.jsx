import React, { useEffect } from 'react';
import { X, ExternalLink, Github, Layers, CheckCircle2, Terminal, Info, BarChart2, Cpu, Database } from 'lucide-react';

const ProjectModal = ({ project, isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/70 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10 backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              {project.category}
            </span>
            <span className="text-xs text-slate-400">• {project.status}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{project.title}</h2>
            <p className="text-slate-300 text-sm leading-relaxed">{project.description}</p>
          </div>

          {/* Metric Highlights */}
          {project.metricsPreview && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {project.metricsPreview.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-medium">
                    {item.label}
                  </span>
                  <span className="text-sm font-semibold text-indigo-300 mt-0.5 block">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Technology Stack */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              Technologies &amp; Libraries
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700 hover:border-indigo-500/40 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Architecture / Pipeline */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              Workflow &amp; Pipeline Architecture
            </h3>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-indigo-300 leading-relaxed overflow-x-auto">
              {project.architecture}
            </div>
          </div>

          {/* Key Methodology Highlights */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Methodology &amp; Implementation Details
            </h3>
            <ul className="space-y-2.5">
              {project.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Verification & Placeholder Notice */}
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-xs text-indigo-200/90 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-indigo-300">
              <Info className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Project Repository &amp; Live Demo Connection</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              In accordance with honest recruiter standards, external links are reserved for completed, verified repositories. 
              To attach your live GitHub repository or Streamlit link, simply update the <code className="text-indigo-300 bg-slate-900 px-1 py-0.5 rounded">githubUrl</code> or <code className="text-indigo-300 bg-slate-900 px-1 py-0.5 rounded">liveUrl</code> field for this project in <code className="text-indigo-300 bg-slate-900 px-1 py-0.5 rounded">src/data/portfolioData.js</code>.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/90 sticky bottom-0 z-10 backdrop-blur">
          <div className="flex items-center gap-2">
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>View on GitHub</span>
              </a>
            ) : (
              <button
                disabled
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 bg-slate-800/40 rounded-lg border border-slate-800 cursor-not-allowed"
                title="Add repo link in portfolioData.js"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repo (Ready to Link)</span>
              </button>
            )}

            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Live Demo</span>
              </a>
            ) : (
              <button
                disabled
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 bg-slate-800/40 rounded-lg border border-slate-800 cursor-not-allowed"
                title="Add demo link in portfolioData.js"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live Demo (Ready to Deploy)</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
