import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RefreshCw,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Target,
  ShieldAlert,
  HelpCircle,
  CheckCircle2,
  BrainCircuit,
  Bot
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export const AIInsightsPanel: React.FC = () => {
  const { dataset, insights, loadingInsights, refreshInsights, setIsSettingsOpen } = useDashboard();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    if (!insights && dataset && !loadingInsights) {
      refreshInsights();
    }
  }, [dataset?.dataset_id]);

  if (!dataset) return null;

  const categoryMeta: Record<string, { label: string; icon: any; color: string; badgeColor: string }> = {
    key_finding: {
      label: 'Key Findings',
      icon: CheckCircle2,
      color: 'border-indigo-500/30 text-indigo-500',
      badgeColor: 'bg-indigo-500/10 text-indigo-500'
    },
    trend: {
      label: 'Growth & Trends',
      icon: TrendingUp,
      color: 'border-emerald-500/30 text-emerald-500',
      badgeColor: 'bg-emerald-500/10 text-emerald-500'
    },
    anomaly: {
      label: 'Anomalies & Outliers',
      icon: AlertTriangle,
      color: 'border-amber-500/30 text-amber-500',
      badgeColor: 'bg-amber-500/10 text-amber-500'
    },
    opportunity: {
      label: 'Opportunities',
      icon: Target,
      color: 'border-cyan-500/30 text-cyan-500',
      badgeColor: 'bg-cyan-500/10 text-cyan-500'
    },
    risk: {
      label: 'Data Quality & Risks',
      icon: ShieldAlert,
      color: 'border-rose-500/30 text-rose-500',
      badgeColor: 'bg-rose-500/10 text-rose-500'
    },
    recommendation: {
      label: 'Next Steps',
      icon: Lightbulb,
      color: 'border-purple-500/30 text-purple-500',
      badgeColor: 'bg-purple-500/10 text-purple-500'
    }
  };

  const filteredInsights = (insights?.insights || []).filter((item) => {
    return activeCategory === 'all' || item.category === activeCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Automated AI Insights & Evidence Engine</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Machine-generated summaries distinguishing verified empirical facts from strategic predictive hypotheses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refreshInsights()}
            disabled={loadingInsights}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingInsights ? 'animate-spin' : ''}`} />
            <span>{loadingInsights ? 'Analyzing Data...' : 'Regenerate Insights'}</span>
          </button>
        </div>
      </div>

      {/* Executive Summary Card */}
      {insights && (
        <div className="rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-500/20 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-indigo-500 font-bold text-sm">
              <BrainCircuit className="w-5 h-5" />
              <span>Executive Data Synthesis</span>
            </div>
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Provider: {insights.provider}
            </span>
          </div>

          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
            {insights.executive_summary}
          </p>

          {insights.data_quality_notes && insights.data_quality_notes.length > 0 && (
            <div className="mt-4 pt-3 border-t border-indigo-500/10 flex flex-wrap gap-2 text-xs">
              {insights.data_quality_notes.map((note, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                >
                  ✓ {note}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
            activeCategory === 'all'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          All Insights ({insights?.insights?.length || 0})
        </button>

        {Object.entries(categoryMeta).map(([catKey, meta]) => {
          const count = (insights?.insights || []).filter((i) => i.category === catKey).length;
          if (count === 0) return null;

          return (
            <button
              key={catKey}
              onClick={() => setActiveCategory(catKey)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                activeCategory === catKey
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{meta.label}</span>
              <span className="text-[10px] opacity-75">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Insights Cards Grid */}
      {loadingInsights ? (
        <div className="p-16 text-center">
          <BrainCircuit className="w-10 h-10 mx-auto text-indigo-500 animate-pulse mb-3" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Synthesizing statistical patterns & business anomalies...
          </p>
          <p className="text-xs text-slate-400 mt-1">Applying mathematical cross-validation on observed data matrix.</p>
        </div>
      ) : filteredInsights.length === 0 ? (
        <div className="p-12 text-center text-slate-400 border border-dashed rounded-2xl">
          No insights found under this category filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredInsights.map((item, index) => {
            const meta = categoryMeta[item.category] || categoryMeta.key_finding;
            const Icon = meta.icon;

            return (
              <div
                key={index}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${meta.badgeColor}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {meta.label}
                    </span>

                    {/* Scientific vs Hypothesis Label */}
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        item.is_hypothesis
                          ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                          : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      }`}
                    >
                      {item.is_hypothesis ? 'Hypothesis' : 'Verified Fact'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans mb-1.5">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.explanation}
                  </p>
                </div>

                {/* Evidence Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                  <div className="text-slate-400 font-mono truncate max-w-[240px]">
                    Evidence: <span className="text-slate-600 dark:text-slate-300 font-medium">{item.evidence}</span>
                  </div>
                  <span className="text-slate-400 text-[10px] font-semibold">
                    Confidence: {item.confidence}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
