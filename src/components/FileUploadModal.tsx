import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  X,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Database
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export const FileUploadModal: React.FC = () => {
  const { isUploadOpen, setIsUploadOpen, uploadFile, loadSampleDataset, loading } = useDashboard();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isUploadOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    setUploadError(null);
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValid) {
      setUploadError('Please select a valid CSV (.csv) or Excel (.xlsx, .xls) file.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setUploadError('File size exceeds the 50MB limit.');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleStartUpload = async () => {
    if (!selectedFile) return;
    try {
      await uploadFile(selectedFile);
    } catch (err: any) {
      setUploadError(err.message || 'Upload processing failed.');
    }
  };

  const sampleDatasets = [
    {
      key: 'ecommerce',
      title: 'E-Commerce Sales & Profit',
      desc: '380 transactions with customer segments, product categories, discounts & margins.',
      icon: '🛒'
    },
    {
      key: 'saas',
      title: 'SaaS Subscriptions & Churn',
      desc: '260 accounts tracking MRR, ARR, seat utilization, churn probabilities & NPS.',
      icon: '☁️'
    },
    {
      key: 'hr',
      title: 'HR Talent & Payroll',
      desc: '280 employees across departments, salaries, bonus structures & attrition risk.',
      icon: '👥'
    },
    {
      key: 'healthcare',
      title: 'Hospital Clinical Operations',
      desc: '250 patient records covering lengths of stay, billing, insurance carriers & readmission.',
      icon: '🏥'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setIsUploadOpen(false)}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <UploadCloud className="w-4 h-4" />
            <span>Dataset Ingestion</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Upload Dataset or Select Sample
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Upload CSV or Excel files. Schemas, distributions, and dashboards will be synthesized automatically.
          </p>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
              : selectedFile
              ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20'
              : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 bg-slate-50 dark:bg-slate-850/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto mb-3">
            <FileSpreadsheet className="w-6 h-6" />
          </div>

          {selectedFile ? (
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-500 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                File Ready for Profiling
              </span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {selectedFile.name}
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Drag and drop your dataset here, or <span className="text-indigo-500 underline">browse</span>
              </p>
              <p className="text-xs text-slate-400">
                Supports CSV (.csv) and Excel (.xlsx, .xls) up to 50MB
              </p>
            </div>
          )}
        </div>

        {uploadError && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Upload Action Button */}
        {selectedFile && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleStartUpload}
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <span>{loading ? 'Analyzing Schema...' : 'Process & Generate Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Sample Datasets Section */}
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Or Start Instantly with a Curated Dataset:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {sampleDatasets.map((sample) => (
              <button
                key={sample.key}
                onClick={async () => {
                  await loadSampleDataset(sample.key);
                  setIsUploadOpen(false);
                }}
                className="p-3 text-left rounded-xl bg-slate-50 dark:bg-slate-850 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-500/50 transition-all flex items-start gap-3 group"
              >
                <span className="text-xl p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group-hover:scale-110 transition-transform">
                  {sample.icon}
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-500 transition-colors">
                    {sample.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {sample.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
