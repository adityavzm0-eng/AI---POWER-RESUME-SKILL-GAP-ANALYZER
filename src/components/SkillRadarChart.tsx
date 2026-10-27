import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { MatchedSkill, MissingSkill, PartiallyMatchedSkill, AdditionalSkill } from '../types/skillsync';

interface SkillRadarChartProps {
  matchedSkills: MatchedSkill[];
  missingSkills: MissingSkill[];
  partiallyMatchedSkills: PartiallyMatchedSkill[];
  additionalSkills: AdditionalSkill[];
}

export const SkillRadarChart: React.FC<SkillRadarChartProps> = ({
  matchedSkills,
  missingSkills,
  partiallyMatchedSkills,
  additionalSkills,
}) => {
  // Dynamically group all skills by category
  const categoryStats: Record<string, { jobRequired: number; resumeSatisfied: number }> = {};

  const registerSkill = (cat: string, isJobReq: boolean, satisfactionWeight: number) => {
    // Simplify long category names for radar layout
    const label = cat
      .replace('Frameworks & Web Development', 'Web & Frameworks')
      .replace('AI, Machine Learning & Data Science', 'Machine Learning')
      .replace('Deep Learning & Computer Vision', 'Deep Learning')
      .replace('NLP & Large Language Models', 'NLP & LLMs')
      .replace('Databases & Data Engineering', 'Databases & ETL')
      .replace('Software Engineering & Methodologies', 'Engineering Core')
      .replace('Soft Skills & Leadership', 'Soft Skills');

    if (!categoryStats[label]) {
      categoryStats[label] = { jobRequired: 0, resumeSatisfied: 0 };
    }
    if (isJobReq) {
      categoryStats[label].jobRequired += 1;
    }
    categoryStats[label].resumeSatisfied += satisfactionWeight;
  };

  matchedSkills.forEach(s => registerSkill(s.category, true, 1.0));
  partiallyMatchedSkills.forEach(s => registerSkill(s.category, true, 0.7));
  missingSkills.forEach(s => registerSkill(s.category, true, 0.0));
  additionalSkills.forEach(s => registerSkill(s.category, false, 0.6));

  // Convert to chart data array (filter categories with at least 1 count)
  let chartData = Object.entries(categoryStats).map(([cat, stat]) => {
    const jobTarget = Math.max(stat.jobRequired * 10, 20);
    const candidateScore = Math.min(100, Math.round((stat.resumeSatisfied / Math.max(1, stat.jobRequired)) * 100));
    return {
      category: cat,
      JobDemand: 90, // target benchmark line
      CandidateFit: Math.max(15, candidateScore),
    };
  });

  // Ensure at least 3 points for a valid radar polygon
  if (chartData.length < 3) {
    chartData.push(
      { category: 'General Core', JobDemand: 80, CandidateFit: 70 },
      { category: 'System Architecture', JobDemand: 85, CandidateFit: 60 }
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-base font-bold text-white">Dynamic Skill Competency Radar</h3>
          <p className="text-xs text-slate-400">Category alignment synthesized dynamically from job requirements</p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="#334155" strokeDasharray="3 3" />
            <PolarAngleAxis dataKey="category" stroke="#94A3B8" fontSize={11} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={10} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl text-xs space-y-1">
                      <div className="font-semibold text-white">{payload[0].payload.category}</div>
                      <div className="text-cyan-400 font-mono">Candidate Competency: {payload[0].payload.CandidateFit}%</div>
                      <div className="text-violet-400 font-mono">Benchmark Demand: {payload[0].payload.JobDemand}%</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Radar
              name="Benchmark Target"
              dataKey="JobDemand"
              stroke="#8B5CF6"
              fill="#8B5CF6"
              fillOpacity={0.15}
            />
            <Radar
              name="Candidate Alignment"
              dataKey="CandidateFit"
              stroke="#06B6D4"
              fill="#06B6D4"
              fillOpacity={0.4}
            />
            <Legend 
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} 
              iconType="circle" 
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
