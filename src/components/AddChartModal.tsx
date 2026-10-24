import React, { useState, useEffect } from 'react';
import {
  X,
  PlusCircle,
  BarChart2,
  LineChart,
  AreaChart,
  PieChart,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { ChartConfig, ChartType } from '../types/dashboard';
import * as api from '../services/api';

export const AddChartModal: React.FC = () => {
  const { dataset, isAddChartOpen, setIsAddChartOpen, addCustomChart, filters } = useDashboard();

  const [title, setTitle] = useState('');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [xCol, setXCol] = useState('');
  const [yCol, setYCol] = useState('');
  const [aggregation, setAggregation] = useState('sum');
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const numCols = dataset?.profile?.column_types?.numerical || [];
  const catCols = dataset?.profile?.column_types?.categorical || [];
  const allCols = Object.keys(dataset?.profile?.columns || {});

  // Set default columns
  useEffect(() => {
    if (dataset && allCols.length > 0) {
      const defaultX = catCols[0] || allCols[0];
      const defaultY = numCols[0] || '';
      setXCol(defaultX);
      setYCol(defaultY);
      setTitle(`${defaultY ? defaultY.replace('_', ' ') : 'Count'} by ${defaultX.replace('_', ' ')}`);
    }
  }, [dataset, isAddChartOpen]);

  // Fetch preview data when parameters change
  useEffect(() => {
    if (!dataset || !xCol) return;

    const fetchPreview = async () => {
      setLoadingPreview(true);
      try {
        const res = await api.computeChartData(dataset.dataset_id, {
          x_column: xCol,
          y_column: yCol || undefined,
          aggregation,
          chart_type: chartType,
          limit: 10,
          filters
        });
        setPreviewData(res.data || []);
      } catch (err) {
        console.error('Failed to compute preview:', err);
      } finally {
        setLoadingPreview(false);
      }
    };

    fetchPreview();
  }, [dataset?.dataset_id, xCol, yCol, aggregation, chartType]);

  if (!isAddChartOpen || !dataset) return null;

  const handleCreateChart = () => {
    const newChart: ChartConfig = {
      id: `custom_${Date.now()}`,
      title: title.trim() || `${yCol || 'Count'} by ${xCol}`,
      type: chartType,
      x_column: xCol,
      y_column: yCol || undefined,
      aggregation,
      data: previewData,
      description: `Custom visualization of ${yCol || 'count'} across ${xCol}.`,
      width: 'half'
    };
    addCustomChart(newChart);
    setIsAddChartOpen(false);
  };

  const types: { type: ChartType; label: string; icon: any }[] = [
    { type: 'bar', label: 'Bar', icon: BarChart2 },
    { type: 'line', label: 'Line', icon: LineChart },
    { type: 'area', label: 'Area', icon: AreaChart },
    { type: 'pie', label: 'Donut', icon: PieChart },
    { type: 'scatter', label: 'Scatter', icon: TrendingUp }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setIsAddChartOpen(false)}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <PlusCircle className="w-4 h-4" />
            <span>Dashboard Studio</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Create Custom Visualization
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Select dimensions, metrics, and aggregation functions from your dataset.
          </p>
        </div>

        {/* Form Controls */}
        <div className="space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
              Chart Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sales by Product Category"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Chart Type Selector */}
          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1.5">
              Visualization Format
            </label>
            <div className="grid grid-cols-5 gap-2">
              {types.map((t) => {
                const Icon = t.icon;
                const isSelected = chartType === t.type;
                return (
                  <button
                    key={t.type}
                    type="button"
                    onClick={() => setChartType(t.type)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px]">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dimension & Metric Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
                X-Axis / Category
              </label>
              <select
                value={xCol}
                onChange={(e) => setXCol(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                {allCols.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
                Y-Axis / Metric
              </label>
              <select
                value={yCol}
                onChange={(e) => setYCol(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="">(Record Count)</option>
                {numCols.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
                Aggregation Function
              </label>
              <select
                value={aggregation}
                onChange={(e) => setAggregation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="sum">Sum</option>
                <option value="avg">Average</option>
                <option value="count">Count</option>
                <option value="min">Min</option>
                <option value="max">Max</option>
              </select>
            </div>
          </div>

          {/* Mini Preview Count */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>
              {loadingPreview
                ? 'Computing aggregation...'
                : `Preview matches ${previewData.length} discrete categories.`}
            </span>
            <span className="font-mono text-indigo-500 font-semibold">
              Live Verified
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={() => setIsAddChartOpen(false)}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateChart}
            disabled={!xCol || previewData.length === 0}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Pin Visualization</span>
          </button>
        </div>
      </div>
    </div>
  );
};
