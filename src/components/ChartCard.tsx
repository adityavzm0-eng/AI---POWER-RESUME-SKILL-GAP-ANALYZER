import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  BarChart2,
  LineChart as LineIcon,
  AreaChart as AreaIcon,
  PieChart as PieIcon,
  Maximize2,
  Minimize2,
  Trash2,
  Settings2,
  HelpCircle,
  TrendingUp,
  Download
} from 'lucide-react';
import { ChartConfig, ChartType } from '../types/dashboard';
import { useDashboard } from '../context/DashboardContext';

interface ChartCardProps {
  chart: ChartConfig;
}

const PALETTE = [
  '#6366F1', // Indigo
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#3B82F6', // Blue
  '#14B8A6'  // Teal
];

export const ChartCard: React.FC<ChartCardProps> = ({ chart }) => {
  const { dataset, updateChart, removeChart, theme } = useDashboard();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Editable configuration state
  const [tempType, setTempType] = useState<ChartType>(chart.type);
  const [tempX, setTempX] = useState<string>(chart.x_column);
  const [tempY, setTempY] = useState<string>(chart.y_column || '');
  const [tempAgg, setTempAgg] = useState<string>(chart.aggregation || 'sum');

  const numCols = dataset?.profile?.column_types?.numerical || [];
  const allCols = Object.keys(dataset?.profile?.columns || {});

  const handleApplyConfig = async () => {
    await updateChart(chart.id, {
      type: tempType,
      x_column: tempX,
      y_column: tempY || undefined,
      aggregation: tempAgg
    });
    setIsConfigOpen(false);
  };

  const handleTypeQuickSwitch = async (newType: ChartType) => {
    setTempType(newType);
    await updateChart(chart.id, { type: newType });
  };

  const isDark = theme === 'dark';
  const gridColor = isDark ? '#1E293B' : '#E2E8F0';
  const textColor = isDark ? '#94A3B8' : '#64748B';
  const tooltipBg = isDark ? '#0F172A' : '#FFFFFF';
  const tooltipBorder = isDark ? '#334155' : '#CBD5E1';

  const formatTooltipValue = (val: any) => {
    if (typeof val === 'number') {
      if (Math.abs(val) >= 1_000_000) return `${(val / 1_000_000).toFixed(2)}M`;
      if (Math.abs(val) >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
      return val.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }
    return val;
  };

  const renderChartGraphic = () => {
    if (!chart.data || chart.data.length === 0) {
      return (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs">
          <HelpCircle className="w-8 h-8 mb-2 opacity-50" />
          <span>No matching data points found for this chart configuration.</span>
        </div>
      );
    }

    const dataKeyY = chart.y_column || 'value';

    switch (chart.type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chart.data} margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.6} />
              <XAxis
                dataKey="name"
                tick={{ fill: textColor, fontSize: 11 }}
                stroke={gridColor}
                angle={-25}
                textAnchor="end"
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fill: textColor, fontSize: 11 }} stroke={gridColor} tickFormatter={formatTooltipValue} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderColor: tooltipBorder,
                  borderRadius: 8,
                  fontSize: 12,
                  color: isDark ? '#F8FAFC' : '#0F172A'
                }}
                formatter={formatTooltipValue}
              />
              <Line
                type="monotone"
                dataKey={dataKeyY}
                stroke="#6366F1"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#6366F1' }}
                activeDot={{ r: 6, stroke: '#818CF8', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart.data} margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
              <defs>
                <linearGradient id={`grad_${chart.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.6} />
              <XAxis
                dataKey="name"
                tick={{ fill: textColor, fontSize: 11 }}
                stroke={gridColor}
                angle={-25}
                textAnchor="end"
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fill: textColor, fontSize: 11 }} stroke={gridColor} tickFormatter={formatTooltipValue} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderColor: tooltipBorder,
                  borderRadius: 8,
                  fontSize: 12,
                  color: isDark ? '#F8FAFC' : '#0F172A'
                }}
                formatter={formatTooltipValue}
              />
              <Area
                type="monotone"
                dataKey={dataKeyY}
                stroke="#6366F1"
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#grad_${chart.id})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderColor: tooltipBorder,
                  borderRadius: 8,
                  fontSize: 12,
                  color: isDark ? '#F8FAFC' : '#0F172A'
                }}
                formatter={formatTooltipValue}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(val) => <span className="text-xs text-slate-500 dark:text-slate-400">{val}</span>}
              />
              <Pie
                data={chart.data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {chart.data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.6} />
              <XAxis
                dataKey={chart.x_column}
                name={chart.x_column}
                tick={{ fill: textColor, fontSize: 11 }}
                stroke={gridColor}
                tickFormatter={formatTooltipValue}
              />
              <YAxis
                dataKey={dataKeyY}
                name={dataKeyY}
                tick={{ fill: textColor, fontSize: 11 }}
                stroke={gridColor}
                tickFormatter={formatTooltipValue}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderColor: tooltipBorder,
                  borderRadius: 8,
                  fontSize: 12
                }}
                formatter={formatTooltipValue}
              />
              <Scatter name={chart.title} data={chart.data} fill="#06B6D4" shape="circle" />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'bar':
      default:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart.data} margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.6} />
              <XAxis
                dataKey="name"
                tick={{ fill: textColor, fontSize: 11 }}
                stroke={gridColor}
                angle={-25}
                textAnchor="end"
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fill: textColor, fontSize: 11 }} stroke={gridColor} tickFormatter={formatTooltipValue} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderColor: tooltipBorder,
                  borderRadius: 8,
                  fontSize: 12,
                  color: isDark ? '#F8FAFC' : '#0F172A'
                }}
                formatter={formatTooltipValue}
              />
              <Bar dataKey={dataKeyY} fill="#6366F1" radius={[6, 6, 0, 0]}>
                {chart.data.map((_, index) => (
                  <Cell
                    key={`bar-cell-${index}`}
                    fill={chart.x_column === 'Other' ? '#94A3B8' : PALETTE[index % PALETTE.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  const chartTypes: { type: ChartType; label: string; icon: any }[] = [
    { type: 'bar', label: 'Bar', icon: BarChart2 },
    { type: 'line', label: 'Line', icon: LineIcon },
    { type: 'area', label: 'Area', icon: AreaIcon },
    { type: 'pie', label: 'Donut', icon: PieIcon },
    { type: 'scatter', label: 'Scatter', icon: TrendingUp }
  ];

  return (
    <div
      className={`relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all flex flex-col ${
        isFullscreen
          ? 'fixed inset-4 z-50 overflow-auto bg-white dark:bg-slate-900 shadow-2xl'
          : chart.width === 'full'
          ? 'col-span-1 lg:col-span-2'
          : 'col-span-1'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans tracking-tight">
            {chart.title}
          </h3>
          {chart.description && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {chart.description}
            </p>
          )}
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1">
          {/* Quick Type Switcher */}
          <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700/60">
            {chartTypes.map((t) => {
              const Icon = t.icon;
              const isSelected = chart.type === t.type;
              return (
                <button
                  key={t.type}
                  onClick={() => handleTypeQuickSwitch(t.type)}
                  className={`p-1 rounded-md text-xs transition-colors ${
                    isSelected
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                  title={`Switch to ${t.label} chart`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>

          {/* Config Gear */}
          <button
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
              isConfigOpen ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500' : ''
            }`}
            title="Configure Chart Dimensions"
          >
            <Settings2 className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen View'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Remove Chart */}
          <button
            onClick={() => removeChart(chart.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title="Remove from Dashboard"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Axis & Aggregation In-Card Config Panel */}
      {isConfigOpen && (
        <div className="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs grid grid-cols-1 sm:grid-cols-4 gap-2.5 animate-in fade-in duration-100">
          <div>
            <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">X-Axis Column</label>
            <select
              value={tempX}
              onChange={(e) => setTempX(e.target.value)}
              className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            >
              {allCols.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">Y-Axis Measure</label>
            <select
              value={tempY}
              onChange={(e) => setTempY(e.target.value)}
              className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="">(Row Count)</option>
              {numCols.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">Aggregation</label>
            <select
              value={tempAgg}
              onChange={(e) => setTempAgg(e.target.value)}
              className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="sum">Sum</option>
              <option value="avg">Average</option>
              <option value="count">Count</option>
              <option value="min">Min</option>
              <option value="max">Max</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleApplyConfig}
              className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-sm transition-colors"
            >
              Apply Updates
            </button>
          </div>
        </div>
      )}

      {/* Chart Canvas */}
      <div className={`w-full ${isFullscreen ? 'h-[75vh]' : 'h-72'} pt-2`}>
        {renderChartGraphic()}
      </div>

      {/* Footer Info */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
            X: {chart.x_column}
          </span>
          {chart.y_column && (
            <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
              Y: {chart.y_column} ({chart.aggregation})
            </span>
          )}
        </div>
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          {chart.type}
        </span>
      </div>
    </div>
  );
};
