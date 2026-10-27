import React from 'react';
import { 
  History, 
  Trash2, 
  ArrowRight, 
  Award, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { HistoryRecord } from '../types/skillsync';

interface HistoryPageProps {
  history: HistoryRecord[];
  onSelectRecord: (id: string) => void;
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
  onRefresh: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  history,
  onSelectRecord,
  onDeleteRecord,
  onClearAll,
  onRefresh,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <History className="w-4 h-4" />
            <span>Persistence & Privacy</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            Analysis History & Session Archive
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review past evaluations, reload previous reports, or purge records for complete privacy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Refresh</span>
          </button>

          {history.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to permanently clear all analysis history?')) {
                  onClearAll();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge All Records</span>
            </button>
          )}
        </div>
      </div>

      {/* History Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-4">
        {history.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <History className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-white">No Saved History Records</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Run a resume analysis to see your saved evaluations archived here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800/80">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Target Role</th>
                  <th className="py-3 px-3">Fit Score</th>
                  <th className="py-3 px-3">Matched</th>
                  <th className="py-3 px-3">Gaps</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {history.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {rec.created_at}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-white">
                      {rec.target_role}
                      <span className="block text-[10px] font-normal text-slate-500">
                        {rec.experience_level || 'Mid-Level'}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-cyan-400 text-sm">{rec.overall_score}%</span>
                        <span className="text-[10px] text-slate-400">({rec.score_tier})</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-emerald-400 font-mono">
                      {rec.matched_count}
                    </td>

                    <td className="py-3.5 px-3 text-rose-400 font-mono">
                      {rec.missing_count}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => onSelectRecord(rec.id)}
                        className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-medium inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Open Report</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onDeleteRecord(rec.id)}
                        className="p-1 rounded-lg text-slate-500 hover:text-rose-400 transition-colors inline-block align-middle"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-400">
          <strong className="text-white block">Local Data Ownership Guarantee</strong>
          <p className="leading-relaxed text-[11px]">
            Analysis records are stored in a local lightweight SQLite database (<code className="text-cyan-400">backend/app/storage/skillsync.db</code>). Raw uploaded resume documents are never permanently archived. You can click "Purge All Records" at any time to permanently erase all saved history.
          </p>
        </div>
      </div>
    </div>
  );
};
