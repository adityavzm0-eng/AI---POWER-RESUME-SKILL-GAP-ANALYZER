import React, { useState } from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Table,
  Lightbulb,
  Bot,
  ChevronLeft,
  ChevronRight,
  Database,
  ShieldCheck,
  Activity,
  Layers
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, dataset } = useDashboard();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    {
      id: 'dashboard',
      label: 'Executive Dashboard',
      icon: LayoutDashboard,
      badge: dataset?.dashboard?.charts?.length ? `${dataset.dashboard.charts.length} Charts` : null
    },
    {
      id: 'profiling',
      label: 'Data Profiling & Quality',
      icon: BarChart3,
      badge: dataset?.profile?.dataset_health?.score ? `${dataset.profile.dataset_health.score}%` : null
    },
    {
      id: 'explorer',
      label: 'Data Grid & Explorer',
      icon: Table,
      badge: dataset?.row_count ? `${dataset.row_count.toLocaleString()}` : null
    },
    {
      id: 'insights',
      label: 'AI Insights & Anomalies',
      icon: Lightbulb,
      badge: 'AI'
    },
    {
      id: 'copilot',
      label: 'InsightAI Copilot',
      icon: Bot,
      badge: 'Chat'
    }
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 z-20 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-5 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow flex items-center justify-center text-slate-500 hover:text-indigo-500 transition-colors z-30"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-2 space-y-1">
        <div className={`px-3 py-1 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 ${collapsed ? 'hidden' : 'block'}`}>
          Analytics Workspace
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400 group-hover:scale-110'
                }`}
              />
              {!collapsed && (
                <div className="flex items-center justify-between flex-1 truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                        isActive
                          ? 'bg-indigo-700 text-indigo-100'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Dataset Quick Details */}
      {!collapsed && dataset && (
        <div className="p-3 m-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              Active Schema
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono font-bold">
              READY
            </span>
          </div>

          <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Records</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200 font-mono">
                {dataset.row_count.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Dimensions</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200 font-mono">
                {dataset.col_count}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Data Quality</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                {dataset.profile?.dataset_health?.score}%
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
