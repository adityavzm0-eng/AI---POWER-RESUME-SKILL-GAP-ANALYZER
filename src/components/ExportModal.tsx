import React, { useState } from 'react';
import {
  X,
  Download,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useDashboard } from '../context/DashboardContext';
import * as api from '../services/api';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { dataset, showToast } = useDashboard();
  const [exportingType, setExportingType] = useState<string | null>(null);

  if (!isOpen || !dataset) return null;

  const handleExportPDF = async () => {
    setExportingType('pdf');
    try {
      const element = document.getElementById('dashboard-capture-root');
      if (!element) throw new Error('Dashboard view not found');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0B0F19' : '#FFFFFF'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`InsightAI_${dataset.filename.replace(/\.[^/.]+$/, '')}_Report.pdf`);
      showToast('Dashboard exported as PDF', 'success');
      onClose();
    } catch (err) {
      console.error(err);
      showToast('Failed to export PDF', 'error');
    } finally {
      setExportingType(null);
    }
  };

  const handleExportPNG = async () => {
    setExportingType('png');
    try {
      const element = document.getElementById('dashboard-capture-root');
      if (!element) throw new Error('Dashboard view not found');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0B0F19' : '#FFFFFF'
      });

      const link = document.createElement('a');
      link.download = `InsightAI_${dataset.filename.replace(/\.[^/.]+$/, '')}_Snapshot.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('Dashboard exported as PNG snapshot', 'success');
      onClose();
    } catch (err) {
      console.error(err);
      showToast('Failed to export PNG', 'error');
    } finally {
      setExportingType(null);
    }
  };

  const handleExportCSV = () => {
    window.open(api.getCsvExportUrl(dataset.dataset_id), '_blank');
    showToast('Downloading CSV dataset...', 'info');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Download className="w-4 h-4" />
            <span>Export Center</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Export Dashboard & Data
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Save presentation-ready PDF reports, image snapshots, or raw datasets.
          </p>
        </div>

        {/* Export Options List */}
        <div className="space-y-3">
          {/* PDF Report */}
          <button
            onClick={handleExportPDF}
            disabled={exportingType !== null}
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 bg-slate-50 dark:bg-slate-850 hover:bg-indigo-50/50 dark:hover:bg-slate-800 transition-all flex items-center justify-between group disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
                {exportingType === 'pdf' ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                  Full Dashboard Report (PDF)
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Vector-grade high-resolution document with all KPIs & charts.
                </div>
              </div>
            </div>
          </button>

          {/* PNG Snapshot */}
          <button
            onClick={handleExportPNG}
            disabled={exportingType !== null}
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 bg-slate-50 dark:bg-slate-850 hover:bg-indigo-50/50 dark:hover:bg-slate-800 transition-all flex items-center justify-between group disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                {exportingType === 'png' ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                  High-Res Image Snapshot (PNG)
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Crisp screenshot ready for slide decks and emails.
                </div>
              </div>
            </div>
          </button>

          {/* CSV Raw Data */}
          <button
            onClick={handleExportCSV}
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 bg-slate-50 dark:bg-slate-850 hover:bg-indigo-50/50 dark:hover:bg-slate-800 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                  Dataset Records (CSV)
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Download full underlying tabular data matrix.
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
