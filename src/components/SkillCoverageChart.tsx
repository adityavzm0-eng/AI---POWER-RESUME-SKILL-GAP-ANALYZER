import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts';

interface SkillCoverageChartProps {
  matchedCount: number;
  partialCount: number;
  missingCount: number;
  additionalCount: number;
}

export const SkillCoverageChart: React.FC<SkillCoverageChartProps> = ({
  matchedCount,
  partialCount,
  missingCount,
  additionalCount,
}) => {
  const data = [
    { name: 'Matched Skills', count: matchedCount, color: '#10B981', desc: 'Direct explicit matches found in resume' },
    { name: 'Partially Matched', count: partialCount, color: '#F59E0B', desc: 'Transferable related skills' },
    { name: 'Missing Required', count: missingCount, color: '#F43F5E', desc: 'Key requirements lacking evidence' },
    { name: 'Additional Skills', count: additionalCount, color: '#8B5CF6', desc: 'Bonus strengths beyond JD' },
  ];

  return (
    <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white">Skill Coverage Distribution</h3>
          <p className="text-xs text-slate-400">Quantitative comparison of skills across evaluation categories</p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
          >
            <XAxis type="number" stroke="#64748B" fontSize={11} allowDecimals={false} />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="#94A3B8" 
              fontSize={12} 
              width={120}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl text-xs space-y-1">
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                        {d.name}
                      </div>
                      <div className="text-slate-300 font-mono text-sm">{d.count} detected</div>
                      <div className="text-slate-400 text-[11px]">{d.desc}</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={22}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800/80 text-xs">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: d.color }} />
            <span className="text-slate-400 truncate">{d.name}:</span>
            <span className="font-mono font-semibold text-white">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
