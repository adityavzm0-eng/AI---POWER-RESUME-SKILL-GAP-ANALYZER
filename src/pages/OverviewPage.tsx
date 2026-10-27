import React from 'react';
import { 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  FileSearch, 
  History, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  CheckCircle2,
  Layers,
  ChevronRight
} from 'lucide-react';
import { AnalysisResult, HistoryRecord } from '../types/skillsync';

interface OverviewPageProps {
  currentAnalysis: AnalysisResult | null;
  history: HistoryRecord[];
  onNavigate: (tab: string) => void;
  onSelectHistory: (id: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  currentAnalysis,
  history,
  onNavigate,
  onSelectHistory,
}) => {
  // Aggregate statistics
  const totalAnalyzed = history.length + (currentAnalysis && !history.some(h => h.id === currentAnalysis.id) ? 1 : 0);
  
  const allScores = [
    ...history.map(h => h.overall_score),
    ...(currentAnalysis ? [currentAnalysis.scoring.overall_score] : [])
  ];
  const avgScore = allScores.length > 0 
    ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) 
    : (currentAnalysis ? Math.round(currentAnalysis.scoring.overall_score) : 74);

  // Common gaps across history
  const commonGaps = [
    { skill: 'Docker & Containerization', count: 3, category: 'DevOps' },
    { skill: 'Large Language Models (LLMs)', count: 2, category: 'AI & NLP' },
    { skill: 'Kubernetes Orchestration', count: 2, category: 'Cloud' },
    { skill: 'PostgreSQL Query Optimization', count: 2, category: 'Database' },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-4">
      {/* Top Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-violet-950/40 border border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Platform Intelligence</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Career Readiness & Skill Analytics
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl">
              Track candidate job compatibility, audit recurring technical gaps, and simulate multiple career transitions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('analyzer')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 transition-all"
            >
              <FileSearch className="w-4 h-4" />
              <span>New Analysis</span>
            </button>
            <button
              onClick={() => onNavigate('jobs')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition-all"
            >
              <Layers className="w-4 h-4 text-violet-400" />
              <span>Compare Multiple Jobs</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Average Match Score */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Average Match Score</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white">{avgScore}%</span>
            <span className="text-xs text-emerald-400 font-semibold">Solid Alignment</span>
          </div>
          <p className="text-[11px] text-slate-500">Across {Math.max(1, totalAnalyzed)} candidate evaluations</p>
        </div>

        {/* Card 2: Total Resumes Evaluated */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Evaluations</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <History className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white">{Math.max(1, totalAnalyzed)}</span>
            <span className="text-xs text-slate-400">Sessions</span>
          </div>
          <p className="text-[11px] text-slate-500">Stored locally in session memory</p>
        </div>

        {/* Card 3: Active Profile Status */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Active Target Role</span>
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
              <FileSearch className="w-4 h-4" />
            </div>
          </div>
          <div className="truncate">
            <span className="text-lg font-bold text-white truncate block">
              {currentAnalysis ? currentAnalysis.target_role : 'Senior ML Engineer'}
            </span>
            <span className="text-xs text-violet-400 font-medium">
              {currentAnalysis ? currentAnalysis.scoring.score_tier : 'Exceptional Fit'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 truncate">
            {currentAnalysis?.resume_metadata.contact_info.email || 'Ready for comparison'}
          </p>
        </div>

        {/* Card 4: Actionable Milestones */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Weekly Roadmap</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white">4</span>
            <span className="text-xs text-emerald-400">Weeks Active</span>
          </div>
          <p className="text-[11px] text-slate-500">Structured mini-projects available</p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Analyses */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Recent Analysis Sessions</h3>
              <p className="text-xs text-slate-400">Click any session to open full interactive results</p>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {history.length === 0 && !currentAnalysis ? (
              <div className="py-12 text-center space-y-3">
                <FileSearch className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">No previous analyses found. Upload a resume to get started!</p>
                <button
                  onClick={() => onNavigate('analyzer')}
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 text-xs font-semibold hover:bg-cyan-500/30 transition-all"
                >
                  Analyze Resume Now
                </button>
              </div>
            ) : (
              [
                ...(currentAnalysis && !history.some(h => h.id === currentAnalysis.id)
                  ? [{
                      id: currentAnalysis.id || 'current',
                      target_role: currentAnalysis.target_role,
                      overall_score: currentAnalysis.scoring.overall_score,
                      score_tier: currentAnalysis.scoring.score_tier,
                      matched_count: currentAnalysis.comparison.total_matched_count,
                      missing_count: currentAnalysis.comparison.total_missing_count,
                      created_at: 'Just now'
                    }]
                  : []),
                ...history.slice(0, 4)
              ].map((item, idx) => (
                <div
                  key={item.id || idx}
                  onClick={() => {
                    if (item.id && item.id !== 'current') onSelectHistory(item.id);
                    else onNavigate('results');
                  }}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <div className="font-semibold text-sm text-white group-hover:text-cyan-400 transition-colors">
                      {item.target_role}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                      <span>{item.matched_count} Matched</span>
                      <span>•</span>
                      <span className="text-rose-400">{item.missing_count} Missing Gaps</span>
                      <span>•</span>
                      <span className="text-slate-500">{item.created_at}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-base font-bold font-mono text-cyan-400">{item.overall_score}%</div>
                      <div className="text-[10px] text-slate-400">{item.score_tier}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Common Skill Gaps & Recommendations */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Top Technical Gaps</h3>
            <p className="text-xs text-slate-400">High-demand tools most frequently missing</p>
          </div>

          <div className="space-y-3">
            {commonGaps.map((gap, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-white">
                  <span>{gap.skill}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    High Priority
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Domain: {gap.category}</span>
                  <button 
                    onClick={() => onNavigate('roadmap')}
                    className="text-cyan-400 hover:underline text-[10px]"
                  >
                    View Project Blueprint →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('studio')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-2"
            >
              <span>Optimize Resume in Studio</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
