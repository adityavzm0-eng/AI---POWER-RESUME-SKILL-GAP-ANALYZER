import React from 'react';
import { ShieldAlert, Award, TrendingUp, CheckCircle2, XCircle, ArrowUpRight } from 'lucide-react';
import { ScoringData } from '../types/skillsync';

interface ScoreGaugeProps {
  scoring: ScoringData;
  matchedCount: number;
  missingCount: number;
  partialCount: number;
  totalRequired: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  scoring,
  matchedCount,
  missingCount,
  partialCount,
  totalRequired,
}) => {
  const score = Math.min(100, Math.max(0, scoring.overall_score || 0));
  
  // Calculate SVG circular stroke parameters
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine dynamic gradient color based on score tier
  let ringGradient = 'from-cyan-500 to-blue-500';
  let badgeColor = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
  if (score >= 80) {
    ringGradient = 'from-emerald-400 via-cyan-400 to-blue-500';
    badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  } else if (score >= 65) {
    ringGradient = 'from-cyan-400 to-violet-500';
    badgeColor = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
  } else if (score >= 50) {
    ringGradient = 'from-amber-400 to-orange-500';
    badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  } else {
    ringGradient = 'from-rose-500 to-red-600';
    badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  }

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Background soft glow */}
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Circular Animated SVG Gauge */}
        <div className="relative flex-shrink-0 flex items-center justify-center">
          <svg className="w-52 h-52 transform -rotate-90">
            {/* Background track circle */}
            <circle
              cx="104"
              cy="104"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              className="text-slate-800/80 fill-transparent"
            />
            {/* Animated progress circle */}
            <circle
              cx="104"
              cy="104"
              r={radius}
              stroke="url(#scoreGradient)"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="fill-transparent transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Score Readout */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-extrabold tracking-tight text-white font-mono">
              {score}
              <span className="text-xl text-slate-500 font-sans font-normal">/100</span>
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-1">
              Estimated Fit
            </span>
          </div>
        </div>

        {/* Breakdown & Context Column */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeColor}`}>
                <Award className="w-3.5 h-3.5" />
                {scoring.score_tier || 'Match Result'}
              </span>
              <h2 className="text-xl font-bold text-white mt-1.5">
                Job Compatibility Assessment
              </h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                {matchedCount} Matched
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <TrendingUp className="w-4 h-4" />
                {partialCount} Partial
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <XCircle className="w-4 h-4" />
                {missingCount} Missing
              </span>
            </div>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            {scoring.verdict}
          </p>

          {/* Granular Sub-score Bars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Must-Have Skills</span>
                <span className="font-mono text-cyan-400">{scoring.breakdown.required_skills_coverage}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-400 rounded-full transition-all duration-700" 
                  style={{ width: `${scoring.breakdown.required_skills_coverage}%` }} 
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Semantic Fit</span>
                <span className="font-mono text-blue-400">{scoring.breakdown.semantic_similarity}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-700" 
                  style={{ width: `${scoring.breakdown.semantic_similarity}%` }} 
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Project Proof</span>
                <span className="font-mono text-violet-400">{scoring.breakdown.project_evidence}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-violet-500 rounded-full transition-all duration-700" 
                  style={{ width: `${scoring.breakdown.project_evidence}%` }} 
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Experience Alignment</span>
                <span className="font-mono text-indigo-400">{scoring.breakdown.experience_alignment}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-700" 
                  style={{ width: `${scoring.breakdown.experience_alignment}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Legal / Ethical Disclaimer required by spec */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
            <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 text-slate-500" />
            <span>{scoring.disclaimer}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
