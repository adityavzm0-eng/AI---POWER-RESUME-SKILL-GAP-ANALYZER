import React from 'react';
import {
  X,
  Filter,
  RotateCcw,
  CheckSquare,
  Square,
  Calendar,
  Hash,
  Layers
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export const FilterDrawer: React.FC = () => {
  const {
    dataset,
    filters,
    updateFilter,
    clearFilters,
    isFilterOpen,
    setIsFilterOpen,
    activeFilterCount
  } = useDashboard();

  if (!isFilterOpen || !dataset) return null;

  const { profile } = dataset;
  const catCols = profile.column_types.categorical || [];
  const numCols = profile.column_types.numerical || [];
  const dateCols = profile.column_types.date || [];

  const handleCatCheckboxToggle = (col: string, val: string) => {
    const current = filters.categorical[col] || [];
    let updated: string[];
    if (current.includes(val)) {
      updated = current.filter((v) => v !== val);
    } else {
      updated = [...current, val];
    }
    updateFilter('categorical', col, updated);
  };

  const handleDateChange = (col: string, key: 'start' | 'end', val: string) => {
    const current = filters.date[col] || {};
    updateFilter('date', col, { ...current, [key]: val || undefined });
  };

  const handleNumericChange = (col: string, key: 'min' | 'max', val: string) => {
    const current = filters.numeric[col] || {};
    const parsed = val !== '' ? parseFloat(val) : undefined;
    updateFilter('numeric', col, { ...current, [key]: parsed });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Interactive Slicing & Dicing
              </h2>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select criteria to slice data in real time. KPIs, charts, and correlations will automatically recompute.
            </p>

            {/* Date Filters */}
            {dateCols.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span>Temporal Slicers (Date Ranges)</span>
                </div>

                {dateCols.map((col) => {
                  const dateVal = filters.date[col] || {};
                  const stats = profile.columns[col]?.stats || {};

                  return (
                    <div key={col} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-2">{col}</span>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Start Date</label>
                          <input
                            type="date"
                            value={dateVal.start || ''}
                            onChange={(e) => handleDateChange(col, 'start', e.target.value)}
                            min={stats.min_date}
                            max={stats.max_date}
                            className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">End Date</label>
                          <input
                            type="date"
                            value={dateVal.end || ''}
                            onChange={(e) => handleDateChange(col, 'end', e.target.value)}
                            min={stats.min_date}
                            max={stats.max_date}
                            className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Categorical Dimensions */}
            {catCols.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Categorical Dimensions</span>
                </div>

                {catCols.slice(0, 4).map((col) => {
                  const selectedVals = filters.categorical[col] || [];
                  const topVals = profile.columns[col]?.stats?.top_values || [];

                  return (
                    <div key={col} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{col}</span>
                        {selectedVals.length > 0 && (
                          <span className="text-[10px] text-indigo-500 font-bold">
                            {selectedVals.length} selected
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {topVals.map((item: any) => {
                          const isChecked = selectedVals.includes(item.value);
                          return (
                            <label
                              key={item.value}
                              className="flex items-center justify-between py-1 px-1.5 rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-800 cursor-pointer text-slate-700 dark:text-slate-300 select-none"
                            >
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleCatCheckboxToggle(col, item.value)}
                                  className="rounded border-slate-400 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                                />
                                <span className="truncate max-w-[170px]">{item.value}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {item.count}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Numeric Sliders / Bounds */}
            {numCols.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  <Hash className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Numeric Range Bounds</span>
                </div>

                {numCols.slice(0, 3).map((col) => {
                  const numVal = filters.numeric[col] || {};
                  const stats = profile.columns[col]?.stats || {};

                  return (
                    <div key={col} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">{col}</span>
                      <div className="text-[10px] text-slate-400 mb-2 font-mono">
                        Data bounds: [{stats.min} to {stats.max}]
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Min Value</label>
                          <input
                            type="number"
                            value={numVal.min !== undefined ? numVal.min : ''}
                            onChange={(e) => handleNumericChange(col, 'min', e.target.value)}
                            placeholder={stats.min?.toString()}
                            className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Max Value</label>
                          <input
                            type="number"
                            value={numVal.max !== undefined ? numVal.max : ''}
                            onChange={(e) => handleNumericChange(col, 'max', e.target.value)}
                            placeholder={stats.max?.toString()}
                            className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-end">
            <button
              onClick={() => setIsFilterOpen(false)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm transition-colors"
            >
              Done Filtering
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
