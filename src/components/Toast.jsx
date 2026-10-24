import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-400 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-500/30 bg-emerald-950/80 text-emerald-200',
    error: 'border-rose-500/30 bg-rose-950/80 text-rose-200',
    info: 'border-sky-500/30 bg-slate-900/90 text-sky-200'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-fade-in shadow-2xl">
      <div className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg ${borders[type] || borders.info}`}>
        {icons[type] || icons.info}
        <div className="text-sm font-medium leading-relaxed pr-2">
          {message}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-0.5 rounded-lg ml-auto"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
