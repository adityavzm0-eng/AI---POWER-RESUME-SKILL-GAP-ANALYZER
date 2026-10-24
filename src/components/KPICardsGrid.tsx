import React from 'react';
import { TrendingUp, TrendingDown, Layers, Calculator, BarChart2 } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export const KPICardsGrid: React.FC = () => {
  const { kpis } = useDashboard();

  if (!kpis || kpis.length === 0) {
    return null;
  }

  const icons = [Calculator, TrendingUp, Layers, BarChart2];
  const colorGradients = [
    'from-indigo-500/10 via-indigo-500/5 to-transparent border-indigo-500/20 text-indigo-500',
    'from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/20 text-emerald-500',
    'from-cyan-500/10 via-cyan-500/5 to-transparent border-cyan-500/20 text-cyan-500',
    'from-purple-500/10 via-purple-500/5 to-transparent border-purple-500/20 text-purple-500'
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi, index) => {
        const Icon = icons[index % icons.length];
        const colorStyle = colorGradients[index % colorGradients.length];

        return (
          <div
            key={kpi.id || index}
            className={`relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all group`}
          >
            {/* Ambient subtle glow background */}
            <div
              className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorStyle} rounded-full blur-2xl -mr-10 -mt-10 opacity-70 pointer-events-none group-hover:scale-125 transition-transform`}
            />

            <div className="relative flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate max-w-[170px]">
                {kpi.title}
              </span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="relative flex items-baseline justify-between">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
                {kpi.value}
              </div>

              {kpi.trend && (
                <div
                  className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                    kpi.trend_positive
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {kpi.trend_positive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{kpi.trend}</span>
                </div>
              )}
            </div>

            <div className="relative mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate max-w-[140px] font-mono">
                {kpi.column}
              </span>
              <span className="uppercase text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                {kpi.aggregation}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
