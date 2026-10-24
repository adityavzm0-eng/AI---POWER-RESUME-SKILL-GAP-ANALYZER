import React from 'react';
import { PlusCircle, Sparkles, Filter, RefreshCw } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { KPICardsGrid } from './KPICardsGrid';
import { ChartCard } from './ChartCard';

export const DashboardView: React.FC = () => {
  const { dataset, charts, setIsAddChartOpen, activeFilterCount, clearFilters, refreshInsights } = useDashboard();

  if (!dataset) {
    return null;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Executive Analytics Dashboard</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              Live Data
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dynamic aggregations and multidimensional visual synthesis generated directly from <span className="font-semibold text-slate-700 dark:text-slate-200">{dataset.filename}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/30 transition-colors flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Reset {activeFilterCount} Filters</span>
            </button>
          )}

          <button
            onClick={() => setIsAddChartOpen(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Visualization</span>
          </button>
        </div>
      </div>

      {/* Dynamic KPI Cards */}
      <KPICardsGrid />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {charts.map((chart) => (
          <ChartCard key={chart.id} chart={chart} />
        ))}
      </div>

      {charts.length === 0 && (
        <div className="p-12 text-center border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
          <p className="text-slate-500 text-sm">No visualizations currently active.</p>
          <button
            onClick={() => setIsAddChartOpen(true)}
            className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            Create Your First Chart
          </button>
        </div>
      )}
    </div>
  );
};
