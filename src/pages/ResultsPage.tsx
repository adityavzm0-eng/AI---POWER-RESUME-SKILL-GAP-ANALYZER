import React from 'react';
import { 
  Award, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  Milestone, 
  FileEdit, 
  Layers,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Bot
} from 'lucide-react';
import { AnalysisResult } from '../types/skillsync';
import { ScoreGauge } from '../components/ScoreGauge';
import { SkillCoverageChart } from '../components/SkillCoverageChart';
import { SkillRadarChart } from '../components/SkillRadarChart';
import { SkillGapMatrixTable } from '../components/SkillGapMatrixTable';

interface ResultsPageProps {
  data: AnalysisResult;
  onNavigate: (tab: string) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ data, onNavigate }) => {
  const {
    target_role,
    experience_level,
    resume_metadata,
    comparison,
    scoring,
    improvement_studio,
    llm_insights
  } = data;

  // Sections completeness check
  const allExpectedSections = ['summary', 'skills', 'experience', 'education', 'projects', 'certifications'];
  const detectedSections = Object.keys(resume_metadata.sections || {});
  const missingSections = allExpectedSections.filter(s => !detectedSections.includes(s));

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-8 pb-16">
      {/* Top Breadcrumb & Actions Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Analysis Result</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">{data.resume_metadata.pdf_info?.filename || 'Resume Document'}</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            Skill Gap Intelligence: <span className="text-cyan-400">{target_role}</span>
          </h1>
          <p className="text-xs text-slate-400">
            Evaluated for {experience_level} • ~{resume_metadata.experience_years.toFixed(1)} yrs verified experience
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('roadmap')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold text-xs shadow-md transition-all hover:scale-[1.02]"
          >
            <Milestone className="w-3.5 h-3.5" />
            <span>View 4-Week Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigate('studio')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
          >
            <FileEdit className="w-3.5 h-3.5 text-cyan-400" />
            <span>Improve Resume</span>
          </button>
        </div>
      </div>

      {/* Main Score Gauge */}
      <ScoreGauge
        scoring={scoring}
        matchedCount={comparison.total_matched_count}
        missingCount={comparison.total_missing_count}
        partialCount={comparison.total_partial_count}
        totalRequired={comparison.total_required_jd_skills}
      />

      {/* Optional LLM Strategic Insight Banner */}
      {llm_insights && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-950/40 via-blue-950/30 to-slate-900/50 border border-violet-500/30 shadow-lg backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-300">
              <Bot className="w-4 h-4 text-violet-400" />
              <span>AI Executive Recruiter Advice ({llm_insights.provider.toUpperCase()})</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
              {llm_insights.ai_generated ? 'Live Model Output' : 'NLP Heuristic Engine'}
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-sans">
            "{llm_insights.executive_advice}"
          </p>
        </div>
      )}

      {/* Strengths & Improvement Areas Evidence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Verified Profile Strengths
          </h3>
          <ul className="space-y-2">
            {scoring.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvement Priorities */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            Top Upskilling Priorities
          </h3>
          <ul className="space-y-2">
            {scoring.improvement_priorities.map((imp, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Interactive Charts: Horizontal Bar & Dynamic Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillCoverageChart
          matchedCount={comparison.total_matched_count}
          partialCount={comparison.total_partial_count}
          missingCount={comparison.total_missing_count}
          additionalCount={comparison.total_additional_count}
        />

        <SkillRadarChart
          matchedSkills={comparison.matched_skills}
          missingSkills={comparison.missing_skills}
          partiallyMatchedSkills={comparison.partially_matched_skills}
          additionalSkills={comparison.additional_skills}
        />
      </div>

      {/* Skill Gap Matrix Table */}
      <SkillGapMatrixTable matrix={comparison.skill_gap_matrix} />

      {/* Additional Candidate Skills & Resume Completeness Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Additional Skills */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-3">
          <div>
            <h3 className="text-sm font-bold text-white">Bonus Skills in Candidate Profile</h3>
            <p className="text-xs text-slate-400">Relevant competencies demonstrated beyond the job posting's core requirements</p>
          </div>
          {comparison.additional_skills.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No additional extraneous skills detected.</p>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1">
              {comparison.additional_skills.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl text-xs font-medium bg-slate-950 text-slate-300 border border-slate-800 hover:border-violet-500/40 transition-colors"
                  title={s.value_add}
                >
                  <span className="text-violet-400 font-semibold mr-1">+</span>
                  {s.skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Resume Completeness Audit */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-3">
          <div>
            <h3 className="text-sm font-bold text-white">Resume Completeness Audit</h3>
            <p className="text-xs text-slate-400">Detection of standard ATS professional sections</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {allExpectedSections.map((sec) => {
              const isFound = detectedSections.includes(sec);
              return (
                <div 
                  key={sec} 
                  className={`p-2 rounded-xl flex items-center justify-between border ${
                    isFound 
                      ? 'bg-slate-950 border-slate-800 text-slate-300' 
                      : 'bg-rose-500/5 border-rose-500/20 text-rose-400'
                  }`}
                >
                  <span className="capitalize">{sec}</span>
                  {isFound ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="text-[10px] text-rose-400 font-medium">Missing</span>
                  )}
                </div>
              );
            })}
          </div>
          {missingSections.length > 0 && (
            <p className="text-[11px] text-amber-400 pt-1">
              Tip: Adding dedicated '{missingSections.join(', ')}' section headers significantly boosts ATS parsing accuracy.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
