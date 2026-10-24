import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  Activity,
  Binary,
  Calendar,
  Hash,
  Type,
  TrendingUp,
  Percent,
  Search
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export const DataProfilingView: React.FC = () => {
  const { dataset } = useDashboard();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  if (!dataset || !dataset.profile) {
    return (
      <div className="p-8 text-center text-slate-400 text-sm">
        No dataset profile available. Please load or upload a dataset.
      </div>
    );
  }

  const { profile } = dataset;
  const health = profile.dataset_health;
  const overview = profile.overview;
  const columns = profile.columns;
  const correlations = profile.correlations || [];
  const matrix = profile.correlation_matrix || {};

  const typeIcons: Record<string, any> = {
    numerical: Hash,
    categorical: Type,
    date: Calendar,
    id: Binary,
    boolean: Layers
  };

  const typeColors: Record<string, string> = {
    numerical: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    categorical: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    date: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    id: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    boolean: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20'
  };

  const filteredColumns = Object.values(columns).filter((col) => {
    const matchesSearch = col.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || col.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Automated Data Profiler & Hygiene Report</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Statistical distribution analysis, outlier detection, schema inference, and correlation metrics.
          </p>
        </div>
      </div>

      {/* Health Gauge & Key Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Health Score Card */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full flex items-center justify-center border-4 border-indigo-500/30 bg-indigo-500/5">
            <span className="text-xl font-black font-sans text-indigo-500">
              {health.score}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Health Rating</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                {health.rating}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Completeness: <strong className="text-slate-800 dark:text-slate-200">{health.completeness_pct}%</strong>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Uniqueness: <strong className="text-slate-800 dark:text-slate-200">{health.uniqueness_pct}%</strong>
            </div>
          </div>
        </div>

        {/* Total Matrix Card */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Total Matrix Dimension
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-sans">
            {overview.total_rows.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-400">rows</span> × {overview.total_cols}{' '}
            <span className="text-xs font-normal text-slate-400">cols</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-2">
            <span>Duplicates: {overview.duplicate_rows} ({overview.duplicate_pct}%)</span>
          </div>
        </div>

        {/* Missing Values Card */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Missing / Null Values
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-sans">
            {overview.missing_cells.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-400">cells</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Overall matrix missingness: <strong className="text-slate-800 dark:text-slate-200">{overview.missing_pct}%</strong>
          </div>
        </div>

        {/* Inferred Types Distribution */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Inferred Column Roles
          </span>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(overview.column_types_count).map(([t, count]) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              >
                {t}: <strong>{count}</strong>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Quality Summary & Caveat Callout */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-500/10 via-slate-100/50 dark:via-slate-850 to-transparent border border-indigo-500/20 p-5 space-y-2">
        <div className="flex items-center gap-2 text-indigo-500 font-bold text-sm">
          <ShieldCheck className="w-4 h-4" />
          <span>Data Quality Summary & Statistical Integrity</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          {profile.quality_report.summary}
        </p>
        <p className="text-[11px] text-amber-500 dark:text-amber-400 font-medium italic">
          ⚠️ {profile.quality_report.caveat}
        </p>

        {profile.quality_report.warnings && profile.quality_report.warnings.length > 0 && (
          <div className="mt-3 pt-3 border-t border-indigo-500/10 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Hygiene Items to Review:
            </span>
            {profile.quality_report.warnings.map((w, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span>{w}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detailed Columns Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Column Profiling Matrix ({filteredColumns.length} of {overview.total_cols})
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Data Types</option>
              <option value="numerical">Numerical</option>
              <option value="categorical">Categorical</option>
              <option value="date">Date</option>
              <option value="id">Identifier</option>
              <option value="boolean">Boolean</option>
            </select>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search column..."
                className="text-xs pl-8 pr-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 w-44 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Column Name</th>
                <th className="py-3 px-4">Inferred Type</th>
                <th className="py-3 px-4">Missing %</th>
                <th className="py-3 px-4">Distinct</th>
                <th className="py-3 px-4">Min / Max</th>
                <th className="py-3 px-4">Mean (Avg)</th>
                <th className="py-3 px-4">Median</th>
                <th className="py-3 px-4">Std Dev</th>
                <th className="py-3 px-4">Outliers (IQR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredColumns.map((col) => {
                const Icon = typeIcons[col.type] || Hash;
                const stats = col.stats || {};
                const isNum = col.type === 'numerical';
                const isCat = col.type === 'categorical';
                const isDate = col.type === 'date';

                return (
                  <tr key={col.name} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span className="text-slate-400 text-xs">#</span>
                      {col.name}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          typeColors[col.type] || 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                        {col.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className={col.missing_pct > 10 ? 'text-rose-500 font-bold' : ''}>
                        {col.missing_pct}% ({col.missing_count})
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">{col.unique_count.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono">
                      {isNum && stats.min !== undefined
                        ? `${stats.min} → ${stats.max}`
                        : isDate && stats.min_date
                        ? `${stats.min_date} → ${stats.max_date}`
                        : '—'}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {isNum && stats.mean !== undefined ? stats.mean.toLocaleString() : '—'}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {isNum && stats.median !== undefined ? stats.median.toLocaleString() : '—'}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {isNum && stats.std !== undefined ? `±${stats.std}` : '—'}
                    </td>
                    <td className="py-3 px-4">
                      {isNum && stats.outliers_count !== undefined ? (
                        stats.outliers_count > 0 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            {stats.outliers_count} ({stats.outliers_pct}%)
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">0 (Normal)</span>
                        )
                      ) : isCat && stats.mode ? (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[120px] block" title={`Mode: ${stats.mode}`}>
                          Mode: {stats.mode}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Numerical Associations & Correlation Heatmap */}
      {correlations.length > 0 && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <span>Statistical Correlation Ranking (Pearson r)</span>
            </h2>
            <span className="text-[11px] text-slate-400">
              Only showing statistical associations with |r| ≥ 0.25
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {correlations.slice(0, 6).map((c, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {c.col1} ↔ {c.col2}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {c.relationship}
                  </div>
                </div>
                <div
                  className={`text-sm font-mono font-black px-2 py-1 rounded-lg ${
                    c.r > 0
                      ? 'bg-indigo-500/10 text-indigo-500'
                      : 'bg-rose-500/10 text-rose-500'
                  }`}
                >
                  {c.r > 0 ? `+${c.r.toFixed(2)}` : c.r.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
