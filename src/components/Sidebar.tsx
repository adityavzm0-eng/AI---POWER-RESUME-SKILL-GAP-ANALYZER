import React from 'react';
import {
  LayoutDashboard,
  FileSearch,
  Radar,
  Milestone,
  FileEdit,
  Layers,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Home
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  hasAnalysis: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
  hasAnalysis,
}) => {
  const navItems = [
    { id: 'landing', label: 'Home / Welcome', icon: Home },
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'analyzer', label: 'Resume Analyzer', icon: FileSearch, badge: 'Main' },
    { id: 'results', label: 'Skill Gap Intelligence', icon: Radar, disabled: !hasAnalysis },
    { id: 'roadmap', label: 'Career Roadmap', icon: Milestone, disabled: !hasAnalysis },
    { id: 'studio', label: 'Improvement Studio', icon: FileEdit, disabled: !hasAnalysis },
    { id: 'jobs', label: 'Job Match Studio', icon: Layers },
    { id: 'history', label: 'Analysis History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`relative z-20 flex flex-col justify-between transition-all duration-300 ease-in-out border-r border-slate-800/80 bg-[#0B0F19]/95 backdrop-blur-xl ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Navigation Links */}
      <div className="p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isDisabled = item.disabled;

          return (
            <button
              key={item.id}
              disabled={isDisabled}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/15 via-blue-500/15 to-violet-500/15 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/5'
                  : isDisabled
                  ? 'opacity-40 cursor-not-allowed text-slate-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 transition-transform ${
                  isActive
                    ? 'text-cyan-400 scale-105'
                    : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />

              {!collapsed && (
                <div className="flex items-center justify-between flex-1 truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {item.badge}
                    </span>
                  )}
                  {isDisabled && (
                    <span className="ml-auto text-[10px] text-slate-600">
                      Run analysis
                    </span>
                  )}
                </div>
              )}

              {/* Active glow pip */}
              {isActive && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-cyan-400 shadow-glow" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Privacy & Collapse Control */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        {!collapsed && (
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Privacy Guaranteed</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Resumes are parsed securely in local memory. Raw files are not retained permanently.
            </p>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-300">
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
