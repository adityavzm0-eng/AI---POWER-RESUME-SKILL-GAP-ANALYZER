import React, { useState } from 'react';
import { 
  FileEdit, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw, 
  CheckCircle2, 
  TrendingUp,
  FileText
} from 'lucide-react';
import { ImprovementStudioData } from '../types/skillsync';
import { compareBeforeAfterApi } from '../services/api';

interface StudioPageProps {
  studioData: ImprovementStudioData;
  originalResumeText: string;
  jobDescriptionText: string;
  targetRole: string;
}

export const StudioPage: React.FC<StudioPageProps> = ({
  studioData,
  originalResumeText,
  jobDescriptionText,
  targetRole,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Before & After Simulator state
  const [updatedResumeText, setUpdatedResumeText] = useState(originalResumeText || '');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunSimulation = async () => {
    if (!updatedResumeText.trim() || !jobDescriptionText) return;
    setIsSimulating(true);
    try {
      const res = await compareBeforeAfterApi({
        original_resume_text: originalResumeText,
        updated_resume_text: updatedResumeText,
        job_description: jobDescriptionText,
        target_role: targetRole,
      });
      setSimulationResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-10 pb-16">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
          <FileEdit className="w-4 h-4" />
          <span>ATS Optimization & Revision Studio</span>
        </div>
        <h1 className="text-2xl font-bold text-white mt-1">
          Resume Improvement Studio & Before-After Simulator
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Actionable ATS compliance audit, high-impact missing keywords, and evidence-grounded Google XYZ bullet revisions.
        </p>
      </div>

      {/* ATS Compliance Audit Card */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              ATS Formatting & Parser Audit
            </h2>
            <p className="text-xs text-slate-400">Evaluates standard automated parsing criteria for applicant tracking systems</p>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span className="text-xs text-slate-400">ATS Score:</span>
            <span className="text-2xl font-bold text-cyan-400">{studioData.ats_audit.ats_score}%</span>
            <span className="text-[11px] text-slate-500">({studioData.ats_audit.total_passed}/{studioData.ats_audit.total_checks} passed)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {studioData.ats_audit.checks.map((c, i) => (
            <div 
              key={i} 
              className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                c.passed 
                  ? 'bg-slate-950/60 border-slate-800' 
                  : 'bg-rose-500/5 border-rose-500/20'
              }`}
            >
              {c.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5 text-xs">
                <span className="font-semibold text-white block">{c.criterion}</span>
                <p className="text-slate-400 leading-relaxed text-[11px]">{c.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* High-Value Missing Keywords with 1-Click Copy */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Missing High-Value ATS Keywords
          </h2>
          <p className="text-xs text-slate-400">Click any keyword to copy and incorporate into your technical skills or project descriptions</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {studioData.missing_keywords.map((kw, idx) => (
            <div 
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-white">
                  <span className="truncate">{kw.keyword}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                    kw.importance === 'Critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {kw.importance}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 pt-0.5">{kw.category}</div>
              </div>

              <button
                onClick={() => copyToClipboard(kw.keyword, `kw-${idx}`)}
                className="w-full py-1 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-[10px] font-medium text-slate-300 hover:text-cyan-400 border border-slate-800 flex items-center justify-center gap-1 transition-colors"
              >
                {copiedKey === `kw-${idx}` ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Keyword</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Side-by-Side Professional Summary Optimizer */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-violet-400" />
              Side-by-Side Professional Summary Optimizer
            </h2>
            <p className="text-xs text-slate-400">Rephrased to front-load verified competencies and align with '{targetRole}'</p>
          </div>

          <button
            onClick={() => copyToClipboard(studioData.summary_improvement.optimized, 'summary')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-semibold transition-colors"
          >
            {copiedKey === 'summary' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'summary' ? 'Copied to Clipboard' : 'Copy Optimized Summary'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Original */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Original Summary / Intro</span>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              "{studioData.summary_improvement.original}"
            </p>
          </div>

          {/* AI-Optimized */}
          <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/30 space-y-2 relative">
            <span className="text-[10px] uppercase font-bold text-violet-400 tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> ATS-Optimized Summary
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              "{studioData.summary_improvement.optimized}"
            </p>
            <div className="pt-2 border-t border-violet-500/20 text-[10px] text-slate-400 space-y-1">
              <span className="font-semibold text-violet-300 block">Enhancement Rationale:</span>
              {studioData.summary_improvement.key_changes.map((kc, kIdx) => (
                <div key={kIdx} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-violet-400" />
                  <span>{kc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Google XYZ Bullet Point Impact Enhancer */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-4">
        <div>
          <h2 className="text-base font-bold text-white">Google XYZ Achievement Bullet Enhancer</h2>
          <p className="text-xs text-slate-400">Rewriting passive duties into high-impact accomplishments (Accomplished [X], measured by [Y], by doing [Z])</p>
        </div>

        <div className="space-y-3">
          {studioData.bullet_point_improvements.map((bp) => (
            <div key={bp.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Draft / Original Bullet:</span>
                  <div className="p-2.5 rounded-lg bg-slate-900/50 text-xs text-slate-400 border border-slate-800">
                    "{bp.original}"
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-cyan-400">Google XYZ Impact Rewrite:</span>
                    <button
                      onClick={() => copyToClipboard(bp.improved, `bullet-${bp.id}`)}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      {copiedKey === `bullet-${bp.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === `bullet-${bp.id}` ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-cyan-950/20 text-xs text-slate-200 border border-cyan-500/30">
                    "{bp.improved}"
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1 border-t border-slate-800/80">
                <span className="font-semibold text-cyan-400">Impact Gain:</span>
                <span>{bp.rationale}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Before-and-After Simulator Section (Section 17.D) */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Before-and-After Compatibility Simulator
            </h2>
            <p className="text-xs text-slate-400">Test your updated resume revisions against the exact same job description to measure your score gain</p>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-semibold text-xs shadow-md transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Recalculating Match...' : 'Simulate Score Gain'}</span>
          </button>
        </div>

        <textarea
          rows={7}
          placeholder="Paste your edited / revised resume text here with newly added skills, metrics, and summary..."
          value={updatedResumeText}
          onChange={(e) => setUpdatedResumeText(e.target.value)}
          className="w-full p-3.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
        />

        {simulationResult && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between font-mono">
              <div className="flex items-center gap-4 text-xs">
                <span>Before Score: <strong className="text-slate-300">{simulationResult.before.score}%</strong></span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span>After Score: <strong className="text-emerald-400 text-sm">{simulationResult.after.score}%</strong></span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                +{simulationResult.delta}% Score Delta
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {simulationResult.impact_summary}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
