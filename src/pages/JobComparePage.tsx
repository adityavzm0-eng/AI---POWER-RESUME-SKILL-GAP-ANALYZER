import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { compareMultipleJobsApi } from '../services/api';

interface JobComparePageProps {
  currentResumeText: string;
}

export const JobComparePage: React.FC<JobComparePageProps> = ({ currentResumeText }) => {
  const [resumeText, setResumeText] = useState(currentResumeText || '');
  const [jobs, setJobs] = useState<Array<{ title: string; description: string }>>([
    {
      title: 'Senior Machine Learning Engineer',
      description: 'Requirements: 4+ years Python, PyTorch, Scikit-learn, MLOps, Docker, Kubernetes, Transformers, and FastAPI.'
    },
    {
      title: 'Senior Data Scientist',
      description: 'Requirements: Python, SQL, PostgreSQL, Pandas, NumPy, Scikit-learn, Statistical Modeling, Tableau, and Experiment Design.'
    },
    {
      title: 'Cloud DevOps / MLOps Engineer',
      description: 'Requirements: Linux, Docker, Kubernetes, CI/CD, GitHub Actions, AWS, Terraform, Python, and Prometheus.'
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const handleAddJob = () => {
    if (jobs.length < 4) {
      setJobs(prev => [...prev, { title: `Target Role #${prev.length + 1}`, description: '' }]);
    }
  };

  const handleRemoveJob = (index: number) => {
    setJobs(prev => prev.filter((_, i) => i !== index));
  };

  const handleJobChange = (index: number, field: 'title' | 'description', value: string) => {
    setJobs(prev => prev.map((j, i) => i === index ? { ...j, [field]: value } : j));
  };

  const handleRunComparison = async () => {
    if (!resumeText.trim()) return;
    setIsLoading(true);
    try {
      const data = await compareMultipleJobsApi({
        resume_text: resumeText,
        target_role: 'Candidate Profile',
        jobs: jobs.filter(j => j.description.trim().length > 10)
      });
      setResults(data.rankings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Multi-Role Intelligence</span>
        </div>
        <h1 className="text-2xl font-bold text-white mt-1">
          Multiple Job Match Studio
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Compare one candidate resume across multiple target roles simultaneously to determine the strongest evidence-based career fit.
        </p>
      </div>

      {/* Resume Input Area */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-white">
            Candidate Resume Source
          </label>
          <span className="text-[11px] text-slate-500 font-mono">
            {resumeText ? `${resumeText.split(/\s+/).length} words loaded` : 'Paste resume text'}
          </span>
        </div>
        <textarea
          rows={5}
          placeholder="Paste candidate resume text to evaluate across all jobs..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          className="w-full p-3.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
        />
      </div>

      {/* Job Descriptions Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Target Job Descriptions ({jobs.length}/4)</h2>
            <p className="text-xs text-slate-400">Add up to 4 job postings for side-by-side comparison</p>
          </div>

          {jobs.length < 4 && (
            <button
              onClick={handleAddJob}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold transition-colors border border-slate-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Role</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {jobs.map((job, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Role #{idx + 1}
                  </span>
                  {jobs.length > 1 && (
                    <button
                      onClick={() => handleRemoveJob(idx)}
                      className="text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove this role"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Job Title (e.g. Senior ML Engineer)"
                  value={job.title}
                  onChange={(e) => handleJobChange(idx, 'title', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />

                <textarea
                  rows={6}
                  placeholder="Paste requirements, skills, and qualifications..."
                  value={job.description}
                  onChange={(e) => handleJobChange(idx, 'description', e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono text-[11px]"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="text-center pt-2">
          <button
            onClick={handleRunComparison}
            disabled={isLoading || !resumeText.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Evaluating Semantic Similarities Across Roles...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Run Multi-Role Compatibility Comparison</span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Comparison Results Table / Cards */}
      {results && results.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-6">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              Role Compatibility Rankings & Gap Comparison
            </h2>
            <p className="text-xs text-slate-400">Ranked by evidence-based skill alignment</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.map((res, i) => {
              const isBest = i === 0;
              return (
                <div
                  key={i}
                  className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 relative ${
                    isBest
                      ? 'bg-gradient-to-b from-cyan-950/30 to-slate-950 border-cyan-500/50 shadow-xl shadow-cyan-500/10'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  {isBest && (
                    <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500 text-slate-950 shadow-md">
                      Strongest Alignment
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-base font-bold text-white">{res.job_title}</h4>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-extrabold font-mono text-cyan-400">
                          {res.overall_score}%
                        </span>
                        <span className="text-xs text-slate-400">{res.score_tier}</span>
                      </div>
                    </div>

                    {/* Matched skills */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Top Matched Skills ({res.matched_skills_count}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {res.matched_skills.map((s: string) => (
                          <span key={s} className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Missing skills */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Key Missing Gaps ({res.missing_skills_count}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {res.missing_critical_skills.map((s: string) => (
                          <span key={s} className="px-2 py-0.5 rounded text-[10px] bg-rose-500/10 text-rose-300 border border-rose-500/20">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300 block mb-1">Key Strengths:</span>
                    <ul className="space-y-0.5 list-disc pl-4 text-[10px]">
                      {res.strengths.map((st: string, idx: number) => (
                        <li key={idx}>{st}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
