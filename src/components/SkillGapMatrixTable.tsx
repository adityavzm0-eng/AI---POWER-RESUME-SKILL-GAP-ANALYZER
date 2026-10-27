import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  FileText
} from 'lucide-react';
import { SkillGapMatrixRow } from '../types/skillsync';

interface SkillGapMatrixTableProps {
  matrix: SkillGapMatrixRow[];
}

export const SkillGapMatrixTable: React.FC<SkillGapMatrixTableProps> = ({ matrix }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Matched' | 'Partially Matched' | 'Missing'>('All');
  const [selectedSnippet, setSelectedSnippet] = useState<{ skill: string; evidence: string } | null>(null);

  const filtered = matrix.filter((row) => {
    const matchesSearch = row.skill.toLowerCase().includes(search.toLowerCase()) ||
                          row.category.toLowerCase().includes(search.toLowerCase()) ||
                          row.resume_evidence.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || row.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">Skill Gap Matrix & Evidence Audit</h3>
          <p className="text-xs text-slate-400">Detailed breakdown of job requirements versus resume verification</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter skill or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium">
            {(['All', 'Missing', 'Partially Matched', 'Matched'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 rounded-lg transition-all text-[11px] ${
                  statusFilter === status
                    ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Skill & Category</th>
              <th className="py-3 px-3">Job Requirement</th>
              <th className="py-3 px-4">Resume Evidence</th>
              <th className="py-3 px-3">Match Status</th>
              <th className="py-3 px-3 text-right">Priority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  No matching skill records found.
                </td>
              </tr>
            ) : (
              filtered.map((row, idx) => {
                let statusBadge = (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" /> Matched
                  </span>
                );
                if (row.status === 'Partially Matched') {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      <HelpCircle className="w-3 h-3" /> Partial
                    </span>
                  );
                } else if (row.status === 'Missing') {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/30">
                      <AlertCircle className="w-3 h-3" /> Missing
                    </span>
                  );
                }

                let priorityBadge = <span className="text-slate-500 text-[11px]">Satisfied</span>;
                if (row.priority === 'High') {
                  priorityBadge = (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      P1 Critical
                    </span>
                  );
                } else if (row.priority === 'Medium') {
                  priorityBadge = (
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      P2 Practical
                    </span>
                  );
                }

                return (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    {/* Skill Name & Category */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{row.skill}</div>
                      <div className="text-[10px] text-slate-500">{row.category}</div>
                    </td>

                    {/* Job Requirement */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        row.job_requirement === 'Must-Have'
                          ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {row.job_requirement}
                      </span>
                    </td>

                    {/* Resume Evidence Snippet */}
                    <td className="py-3 px-4 max-w-xs truncate text-slate-400">
                      <button
                        onClick={() => setSelectedSnippet({ skill: row.skill, evidence: row.resume_evidence })}
                        className="text-left hover:text-cyan-400 transition-colors flex items-center gap-1.5 group max-w-full truncate"
                        title="Click to view full context snippet"
                      >
                        <FileText className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 flex-shrink-0" />
                        <span className="truncate">{row.resume_evidence}</span>
                      </button>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 whitespace-nowrap">{statusBadge}</td>

                    {/* Priority */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">{priorityBadge}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Snippet Modal / Drawer */}
      {selectedSnippet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                Evidence Snippet: {selectedSnippet.skill}
              </h4>
              <button
                onClick={() => setSelectedSnippet(null)}
                className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700"
              >
                Close
              </button>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono">
              "{selectedSnippet.evidence}"
            </div>
            <p className="text-[11px] text-slate-500">
              This snippet was verified by natural language boundary processing in the candidate's resume text.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
