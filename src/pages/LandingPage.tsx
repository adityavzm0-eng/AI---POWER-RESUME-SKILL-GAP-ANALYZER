import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  FileSearch, 
  Radar, 
  Milestone, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  BarChart3, 
  CheckCircle2,
  FileCheck2,
  Layers,
  Terminal
} from 'lucide-react';

interface LandingPageProps {
  onStartAnalysis: () => void;
  onLoadPreset: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartAnalysis, onLoadPreset }) => {
  return (
    <div className="space-y-16 py-6 pb-20 max-w-6xl mx-auto px-4">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-12 left-1/3 -translate-x-1/2 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-cyan-400 shadow-md">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
          <span>Next-Generation Resume Intelligence & Skill Gap Analytics</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white font-sans max-w-4xl mx-auto leading-tight">
          Turn Resume Rejections into{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
            Career Breakthroughs
          </span>
        </h1>

        <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          SkillSync AI inspects your resume against any job description using real NLP, identifies critical skill gaps, computes explainable compatibility scores, and constructs a personalized 4-week roadmap to land the role.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onStartAnalysis}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-semibold text-sm shadow-xl shadow-cyan-500/20 transition-all hover:scale-[1.02]"
          >
            <FileSearch className="w-4 h-4" />
            <span>Launch Resume Analyzer</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={onLoadPreset}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all hover:border-cyan-500/50"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Try 1-Click Demo Profiles</span>
          </button>
        </div>

        {/* Feature Micro-Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>PyMuPDF Text Engine</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>TF-IDF Semantic Matching</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Transparent 0-100 Scoring</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Client-Side Privacy</span>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Full-Stack Career Intelligence Suite</h2>
          <p className="text-sm text-slate-400">Everything needed to audit resumes, bridge technical deficiencies, and pass automated ATS filters.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all hover:-translate-y-1 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
              <Radar className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Deep Skill Gap Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Discovers matched, transferable partial, and missing skills with exact snippet citations from both candidate resumes and target job postings.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all hover:-translate-y-1 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <Milestone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Personalized 4-Week Roadmap</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates week-by-week actionable upskilling tracks, hands-on mini-projects, and measurable learning outcomes tailored to your exact gaps.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all hover:-translate-y-1 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-4">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">ATS Improvement Studio</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Audits formatting compliance, surfaces missing high-impact keywords, and provides side-by-side Google XYZ achievement rewrites.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Pipeline */}
      <section className="p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 shadow-2xl space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Processing Architecture</span>
          <h2 className="text-2xl font-bold text-white">How SkillSync AI Evaluates Profiles</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="text-xs font-mono font-bold text-cyan-400">Step 01</div>
            <h4 className="text-sm font-semibold text-white">PDF Parsing & Ingestion</h4>
            <p className="text-xs text-slate-400">PyMuPDF extracts clean text layers, detects scanned anomalies, and separates section headers.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="text-xs font-mono font-bold text-blue-400">Step 02</div>
            <h4 className="text-sm font-semibold text-white">Taxonomy & Entity Mining</h4>
            <p className="text-xs text-slate-400">Maps 200+ technical frameworks, programming languages, and aliases via normalized boundary matching.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="text-xs font-mono font-bold text-violet-400">Step 03</div>
            <h4 className="text-sm font-semibold text-white">Semantic Similarity</h4>
            <p className="text-xs text-slate-400">Computes TF-IDF vector cosine distance and identifies transferable skill overlaps.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="text-xs font-mono font-bold text-emerald-400">Step 04</div>
            <h4 className="text-sm font-semibold text-white">Roadmap & ATS Studio</h4>
            <p className="text-xs text-slate-400">Constructs 0-100 weighted fit score, personalized learning timeline, and exportable PDF report.</p>
          </div>
        </div>
      </section>

      {/* Privacy Notice Banner */}
      <section className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-emerald-400">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1 flex-1">
          <h4 className="text-sm font-bold text-white">Candidate Privacy & Security By Design</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your resumes are analyzed exclusively within local session memory. SkillSync AI never permanently stores raw resume PDFs or leaks candidate identity without permission.
          </p>
        </div>
        <button
          onClick={onStartAnalysis}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 whitespace-nowrap transition-colors"
        >
          Begin Audit
        </button>
      </section>

      {/* Footer */}
      <footer className="pt-10 border-t border-slate-800/80 text-center text-xs text-slate-500 space-y-2">
        <p>SkillSync AI — Resume Intelligence & Career Growth Platform</p>
        <p className="text-[11px] text-slate-600">Built with FastAPI, PyMuPDF, Scikit-learn, React, and TypeScript.</p>
      </footer>
    </div>
  );
};
