import React, { useState, useEffect } from 'react';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  ChevronLeft,
  ChevronRight,
  Database,
  Filter
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import * as api from '../services/api';

export const DataPreviewTable: React.FC = () => {
  const { dataset, filters, getCsvExportUrl } = useDashboard();
  const [rows, setRows] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState('');
  const [sortCol, setSortCol] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(false);

  const fetchRecords = async () => {
    if (!dataset) return;
    setLoading(true);
    try {
      const res = await api.fetchDatasetPreview(dataset.dataset_id, {
        page: currentPage,
        page_size: pageSize,
        search: search.trim() || undefined,
        sort_column: sortCol,
        sort_order: sortOrder,
        filters
      });
      setRows(res.rows || []);
      setTotalRecords(res.total_records || 0);
      setTotalPages(res.total_pages || 1);
    } catch (err) {
      console.error('Failed to load table slice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [dataset?.dataset_id, currentPage, pageSize, sortCol, sortOrder, filters]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchRecords();
  };

  const handleSortToggle = (colName: string) => {
    if (sortCol === colName) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else {
        setSortCol(undefined);
        setSortOrder('asc');
      }
    } else {
      setSortCol(colName);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  if (!dataset) return null;

  const columns = Object.keys(dataset.profile?.columns || {});

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Data Grid & Records Explorer</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse, search, sort, and inspect tabular records from{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-200">{dataset.filename}</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={api.getCsvExportUrl(dataset.dataset_id)}
            download={`${dataset.filename}`}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search across all text attributes..."
            className="w-full text-xs pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </form>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          >
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>

          <span className="font-mono text-slate-700 dark:text-slate-300">
            {totalRecords.toLocaleString()} matching records
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="sticky top-0 bg-slate-50 dark:bg-slate-850 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800 z-10">
              <tr>
                <th className="py-3 px-4 w-12 text-center text-slate-400">#</th>
                {columns.map((col) => {
                  const isSorted = sortCol === col;
                  const colProfile = dataset.profile?.columns?.[col];

                  return (
                    <th
                      key={col}
                      onClick={() => handleSortToggle(col)}
                      className="py-3 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-800 dark:text-slate-200">{col}</span>
                        {isSorted ? (
                          sortOrder === 'asc' ? (
                            <ArrowUp className="w-3 h-3 text-indigo-500" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-indigo-500" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-40 hover:opacity-100" />
                        )}
                        {colProfile && (
                          <span className="text-[9px] uppercase font-mono px-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-500">
                            {colProfile.type}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="py-12 text-center text-slate-400">
                    Loading records...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="py-12 text-center text-slate-400">
                    No records match current filter criteria.
                  </td>
                </tr>
              ) : (
                rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors font-mono">
                    <td className="py-2.5 px-4 text-center text-slate-400 text-[11px]">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    {columns.map((col) => {
                      const val = row[col];
                      return (
                        <td key={col} className="py-2.5 px-4">
                          {val === null || val === undefined ? (
                            <span className="text-slate-400 italic">null</span>
                          ) : typeof val === 'number' ? (
                            val.toLocaleString()
                          ) : (
                            String(val)
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-xs text-slate-500">
          <div>
            Page <strong className="text-slate-800 dark:text-slate-200">{currentPage}</strong> of{' '}
            <strong className="text-slate-800 dark:text-slate-200">{totalPages}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
