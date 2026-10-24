import React, { useEffect } from 'react';
import { X, Download, ExternalLink, Award, CheckCircle2 } from 'lucide-react';

const CertificateModal = ({ certificate, isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !certificate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-10 backdrop-blur">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-100 block leading-tight">
                {certificate.title || certificate.company}
              </span>
              <span className="text-xs text-indigo-400 font-mono">
                {certificate.issuer || certificate.role}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={certificate.image || certificate.certificateImage}
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
              title="Download Certificate Image"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Image Body */}
        <div className="overflow-y-auto p-4 sm:p-6 bg-slate-950 flex flex-col items-center justify-center">
          <div className="rounded-xl overflow-hidden border border-slate-800 shadow-2xl max-w-full">
            <img
              src={certificate.image || certificate.certificateImage}
              alt={certificate.title || "Internship Certificate"}
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
            />
          </div>

          {/* Metadata pill */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300">
            {(certificate.internId || certificate.certificateId) && (
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 font-mono">
                ID: <strong className="text-indigo-300">{certificate.internId || certificate.certificateId}</strong>
              </span>
            )}
            {certificate.period && (
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 font-mono">
                Period: {certificate.period}
              </span>
            )}
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Authenticity
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
