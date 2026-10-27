import React from 'react';
import { 
  Sparkles, 
  Menu, 
  Download, 
  Zap, 
  ChevronRight
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLoadPreset: () => void;
  onExportPdf: () => void;
  hasAnalysisData: boolean;
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

const TAB_TITLES: Record<string, string> = {
  landing: 'Welcome to SkillSync AI',
  overview: 'Executive Analytics Overview',
  analyzer: 'Resume & Job Description Analyzer',
  results: 'Skill Gap Intelligence Dashboard',
  roadmap: 'Personalized Career Growth Roadmap',
  studio: 'ATS Resume Improvement Studio',
  jobs: 'Multiple Job Match Studio',
  history: 'Analysis History & Privacy',
  settings: 'Scoring & Engine Configuration',
};

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onLoadPreset,
  onExportPdf,
  hasAnalysisData,
  onToggleSidebar,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-[#0B0F19]/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors focus:outline-none"
          title="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div 
          onClick={() => onTabChange('landing')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/30 transition-all">
            <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-white font-sans text-base">
                SkillSync <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">AI</span>
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                SaaS
              </span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center text-slate-600 text-xs pl-3 border-l border-slate-800">
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 mx-1" />
          <span className="text-slate-300 font-medium">{TAB_TITLES[activeTab] || 'Dashboard'}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Try Sample Data Button */}
        <button
          onClick={onLoadPreset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-cyan-400 border border-cyan-500/30 shadow-sm transition-all hover:border-cyan-500/60"
        >
          <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="hidden sm:inline">Try Demo Sample</span>
          <span className="sm:hidden">Demo</span>
        </button>

        {/* Export PDF Button (active when data available) */}
        {hasAnalysisData && (
          <button
            onClick={onExportPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
            title="Download full analysis as PDF report"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        )}

        {/* Engine status indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>NLP Engine Active</span>
        </div>
      </div>
    </header>
  );
};
