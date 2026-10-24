import React, { useState } from 'react';
import {
  LayoutDashboard,
  UploadCloud,
  Filter,
  Download,
  Settings,
  Sun,
  Moon,
  Sparkles,
  Bot,
  ChevronDown,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

interface NavbarProps {
  onOpenExport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenExport }) => {
  const {
    dataset,
    theme,
    toggleTheme,
    setIsUploadOpen,
    setIsFilterOpen,
    setIsCopilotOpen,
    setIsSettingsOpen,
    activeFilterCount,
    loadSampleDataset
  } = useDashboard();

  const [samplesDropdownOpen, setSamplesDropdownOpen] = useState(false);

  const sampleDatasets = [
    { key: 'ecommerce', name: 'Global E-Commerce Sales', icon: '🛒', desc: 'Retail, orders, profits, discounts' },
    { key: 'saas', name: 'SaaS Cloud ARR & Churn', icon: '☁️', desc: 'MRR, seats, churn probability, NPS' },
    { key: 'hr', name: 'HR Workforce & Payroll', icon: '👥', desc: 'Salaries, performance, attrition, roles' },
    { key: 'healthcare', name: 'Hospital Admissions & Care', icon: '🏥', desc: 'Billing, length of stay, readmissions' }
  ];

  const healthScore = dataset?.profile?.dataset_health?.score || 95;
  const healthRating = dataset?.profile?.dataset_health?.rating || 'Excellent';

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left: Brand & Active Dataset */}
      <div className="flex items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-lg">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-300 bg-clip-text text-transparent">
                InsightAI
              </span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                AI Copilot
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5">
              Smart Dashboard Generator
            </p>
          </div>
        </div>

        {/* Current Dataset Pill */}
        {dataset && (
          <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs">
            <FileSpreadsheet className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200 max-w-[160px] truncate">
              {dataset.filename}
            </span>
            <div className="h-3 w-px bg-slate-300 dark:bg-slate-700" />
            <span className="text-slate-500 dark:text-slate-400">
              {dataset.row_count.toLocaleString()} rows · {dataset.col_count} cols
            </span>
            <div className="h-3 w-px bg-slate-300 dark:bg-slate-700" />
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                healthScore >= 80
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              {healthScore}% {healthRating}
            </span>
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sample Datasets Selector */}
        <div className="relative">
          <button
            onClick={() => setSamplesDropdownOpen(!samplesDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/70 transition-all"
            title="Switch demo dataset"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
            <span className="hidden sm:inline">Sample Datasets</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {samplesDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setSamplesDropdownOpen(false)}
            >
              <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Load Realistic Sample Dataset
              </div>
              {sampleDatasets.map((s) => (
                <button
                  key={s.key}
                  onClick={() => {
                    loadSampleDataset(s.key);
                    setSamplesDropdownOpen(false);
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/70 flex items-start gap-2.5 transition-colors group"
                >
                  <span className="text-lg p-1 rounded bg-slate-100 dark:bg-slate-800 group-hover:scale-110 transition-transform">
                    {s.icon}
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {s.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {s.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Upload Button */}
        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Data</span>
        </button>

        {/* Global Slicing Filter Toggle */}
        <button
          onClick={() => setIsFilterOpen(true)}
          className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
            activeFilterCount > 0
              ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-500 dark:text-indigo-400 font-semibold'
              : 'border-slate-200 dark:border-slate-700/70 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Interactive Slicing & Dicing"
        >
          <Filter className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Export Menu */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700/70 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          title="Export Dashboard or Data"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden md:inline">Export</span>
        </button>

        {/* Copilot Assistant Quick Toggle */}
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-500/20 transition-all"
        >
          <Bot className="w-4 h-4" />
          <span className="hidden sm:inline">Ask Copilot</span>
        </button>

        {/* Settings Modal Trigger */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="AI Model & API Configuration"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Dark / Light Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>
      </div>
    </header>
  );
};
