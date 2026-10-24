import React from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  Briefcase,
  Terminal,
  ArrowUpRight
} from 'lucide-react';
import { personalInfo, resumeDetails } from '../data/portfolioData';

const ResumeSection = ({ onOpenResume, onDownloadResume }) => {
  return (
    <section id="resume" className="py-20 md:py-28 relative">
      
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <FileText className="w-3.5 h-3.5" />
            <span>Curriculum Vitae</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">Resume</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Comprehensive overview of technical competencies, verified internships, and production projects in Data Science, Machine Learning, and AI.
          </p>
        </div>

        {/* Resume Card */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-slate-900/80 border border-slate-800 p-8 sm:p-12 backdrop-blur-md relative overflow-hidden shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span className="text-xs font-mono font-medium text-emerald-400 uppercase tracking-wider">
                    Recruiter Ready • 2026 Edition
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {personalInfo.name}
                </h3>
                <p className="text-indigo-300 font-medium text-sm mt-1">
                  {personalInfo.headline}
                </p>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                {resumeDetails.summary}
              </p>

              {/* Highlights Snapshot */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Key Resume Highlights
                </h4>
                <div className="space-y-2">
                  {resumeDetails.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <button
                  onClick={onOpenResume}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all shadow-md focus:ring-2 focus:ring-indigo-500"
                >
                  <Eye className="w-4 h-4 text-indigo-400" />
                  <span>View Resume</span>
                </button>

                <button
                  onClick={onDownloadResume}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:opacity-95 shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] focus:ring-2 focus:ring-indigo-500"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume</span>
                </button>
              </div>

            </div>

            {/* Right Visual / Document Mockup */}
            <div className="lg:col-span-4">
              <div 
                onClick={onOpenResume}
                className="cursor-pointer group relative rounded-2xl bg-slate-950 p-5 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                {/* Paper sheet preview effect */}
                <div className="space-y-3 font-mono text-[10px] text-slate-400 select-none">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-white text-xs">RESUME</span>
                    <span className="text-indigo-400">PDF / Preview</span>
                  </div>
                  
                  <div className="space-y-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <div className="h-2 w-24 bg-indigo-500/40 rounded"></div>
                    <div className="h-1.5 w-full bg-slate-800 rounded"></div>
                    <div className="h-1.5 w-4/5 bg-slate-800 rounded"></div>
                    
                    <div className="pt-2">
                      <div className="h-2 w-16 bg-purple-500/40 rounded mb-1"></div>
                      <div className="h-1.5 w-full bg-slate-800 rounded"></div>
                      <div className="h-1.5 w-3/4 bg-slate-800 rounded"></div>
                    </div>

                    <div className="pt-2">
                      <div className="h-2 w-20 bg-sky-500/40 rounded mb-1"></div>
                      <div className="h-1.5 w-full bg-slate-800 rounded"></div>
                      <div className="h-1.5 w-2/3 bg-slate-800 rounded"></div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-center text-xs font-semibold text-indigo-400 group-hover:text-sky-300 transition-colors">
                    <span>Click to Open Full Document</span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Connection note */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between flex-wrap gap-2">
            <span>File Target: <code className="text-indigo-300 font-mono">public/{personalInfo.resumeFileName}</code></span>
            <span className="text-slate-400">Ready for instant download &amp; in-browser print</span>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ResumeSection;
