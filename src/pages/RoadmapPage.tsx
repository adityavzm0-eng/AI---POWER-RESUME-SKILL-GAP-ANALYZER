import React, { useState } from 'react';
import { 
  Milestone, 
  Calendar, 
  Clock, 
  CheckCircle, 
  CheckCircle2, 
  BookOpen, 
  Code2, 
  FolderGit2, 
  Award,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { PersonalizedRoadmap, InterviewQuestion, ProjectRecommendation } from '../types/skillsync';

interface RoadmapPageProps {
  roadmap: PersonalizedRoadmap;
  interviewPrep: InterviewQuestion[];
  projectRecommendations: ProjectRecommendation[];
}

export const RoadmapPage: React.FC<RoadmapPageProps> = ({
  roadmap,
  interviewPrep,
  projectRecommendations,
}) => {
  const [priorityTab, setPriorityTab] = useState<'essential' | 'practical' | 'advanced'>('essential');
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({});
  const [expandedInterviewIdx, setExpandedInterviewIdx] = useState<number | null>(0);

  const toggleMilestone = (key: string) => {
    setCompletedMilestones(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const currentSkills = 
    priorityTab === 'essential' 
      ? roadmap.essential_skills 
      : priorityTab === 'practical' 
      ? roadmap.practical_skills 
      : roadmap.advanced_skills;

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-10 pb-16">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
          <Milestone className="w-4 h-4" />
          <span>Tailored Career Acceleration</span>
        </div>
        <h1 className="text-2xl font-bold text-white mt-1">
          Personalized AI Learning Roadmap & Interview Prep
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Target Role: <span className="text-slate-200 font-semibold">{roadmap.role_title}</span> • Estimated Duration: {roadmap.total_estimated_weeks} Weeks ({roadmap.total_estimated_hours})
        </p>
      </div>

      {/* 4-Week Timeline Track */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            4-Week Structured Implementation Timeline
          </h2>
          <p className="text-xs text-slate-400">Step-by-step milestones to eliminate your verified skill gaps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roadmap.timeline.map((wk, idx) => {
            return (
              <div 
                key={wk.week}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md flex flex-col justify-between space-y-3 relative group hover:border-slate-700 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {wk.week}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Phase 0{idx + 1}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{wk.phase}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{wk.focus}</p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    <div className="text-[11px] font-semibold text-slate-400">Milestones:</div>
                    {wk.milestones.map((m, mIdx) => {
                      const mKey = `${wk.week}-${mIdx}`;
                      const isDone = completedMilestones[mKey];
                      return (
                        <div
                          key={mIdx}
                          onClick={() => toggleMilestone(mKey)}
                          className={`flex items-start gap-2 text-xs p-1.5 rounded-lg cursor-pointer transition-colors ${
                            isDone ? 'bg-emerald-500/10 text-emerald-300' : 'hover:bg-slate-800/50 text-slate-300'
                          }`}
                        >
                          <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${isDone ? 'text-emerald-400' : 'text-slate-600'}`} />
                          <span className={`leading-snug ${isDone ? 'line-through text-slate-500' : ''}`}>{m}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
                  <span className="text-cyan-400 font-semibold block text-[10px] uppercase">Deliverable:</span>
                  <span className="truncate block text-slate-300">{wk.deliverable}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Priority Upskilling Curriculum */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-violet-400" />
              Targeted Skill Curriculum & Blueprints
            </h2>
            <p className="text-xs text-slate-400">Grounded in requirements identified from your resume comparison</p>
          </div>

          {/* Priority Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <button
              onClick={() => setPriorityTab('essential')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                priorityTab === 'essential'
                  ? 'bg-rose-500/20 text-rose-400 font-semibold border border-rose-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Priority 1 — Essential ({roadmap.essential_skills.length})
            </button>
            <button
              onClick={() => setPriorityTab('practical')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                priorityTab === 'practical'
                  ? 'bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Priority 2 — Practical ({roadmap.practical_skills.length})
            </button>
            <button
              onClick={() => setPriorityTab('advanced')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                priorityTab === 'advanced'
                  ? 'bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Priority 3 — Advanced ({roadmap.advanced_skills.length})
            </button>
          </div>
        </div>

        {/* Skill Detail Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentSkills.length === 0 ? (
            <div className="col-span-2 py-8 text-center text-slate-500 text-xs">
              No skills currently assigned to this priority tier.
            </div>
          ) : (
            currentSkills.map((sk, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white">{sk.skill}</h3>
                    <span className="text-[10px] text-slate-500">{sk.category}</span>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                    <Clock className="w-3 h-3" />
                    {sk.estimated_hours}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  <span className="font-semibold text-slate-400">Why it matters: </span>
                  {sk.why_it_matters}
                </p>

                {/* Topics to Learn */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-slate-400">Core Learning Topics:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {sk.topics.map((tp, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300 border border-slate-800">
                        {tp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hands-on Mini Project */}
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-cyan-400 text-[11px]">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Practical Mini-Project:</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{sk.mini_project}</p>
                </div>

                <div className="text-[11px] text-emerald-400 pt-1 font-medium flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Outcome: {sk.outcome}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recommended Portfolio Projects */}
      {projectRecommendations.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-cyan-400" />
              Tailored Portfolio Projects
            </h2>
            <p className="text-xs text-slate-400">Capstone project architectures specifically designed to demonstrate your missing skills</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectRecommendations.map((proj, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {proj.primary_skill} Focus
                  </span>
                  <div className="flex gap-1">
                    {proj.tech_stack.map(t => (
                      <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{proj.overview}</p>

                <div className="space-y-1 text-xs">
                  <span className="text-[11px] font-semibold text-slate-400">Architecture Steps:</span>
                  <ul className="space-y-1 text-[11px] text-slate-400 pl-4 list-disc">
                    {proj.architecture_steps.map((st, sIdx) => (
                      <li key={sIdx}>{st}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-cyan-300 font-mono">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Resume Bullet Ready to Copy:</span>
                  "{proj.resume_bullet_sample}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Role-Specific Interview Preparation Generator */}
      {interviewPrep.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Role-Specific Interview Question Bank
            </h2>
            <p className="text-xs text-slate-400">Technical theory, coding prompts, and project behavioral questions with model answers</p>
          </div>

          <div className="space-y-3">
            {interviewPrep.map((q, idx) => {
              const isExpanded = expandedInterviewIdx === idx;
              return (
                <div key={idx} className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                  <button
                    onClick={() => setExpandedInterviewIdx(isExpanded ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-900/60 transition-colors"
                  >
                    <div className="space-y-0.5 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {q.skill}
                        </span>
                        <span className="text-[11px] text-slate-500">{q.category}</span>
                      </div>
                      <div className="text-xs font-semibold text-white pt-1">
                        {q.theory_question}
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {isExpanded && (
                    <div className="p-4 pt-1 border-t border-slate-800/80 space-y-3 text-xs bg-slate-900/30">
                      <div>
                        <span className="text-[11px] font-semibold text-emerald-400 block mb-1">Model Technical Answer:</span>
                        <p className="text-slate-300 leading-relaxed font-sans bg-slate-950 p-3 rounded-lg border border-slate-800">
                          {q.model_answer}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                          <span className="text-[11px] font-semibold text-cyan-400 block mb-1">Coding Challenge:</span>
                          <p className="text-slate-400 font-mono text-[11px]">{q.coding_challenge}</p>
                        </div>

                        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                          <span className="text-[11px] font-semibold text-violet-400 block mb-1">Behavioral / Architecture Prompt:</span>
                          <p className="text-slate-400 text-[11px]">{q.behavioral_project_question}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
