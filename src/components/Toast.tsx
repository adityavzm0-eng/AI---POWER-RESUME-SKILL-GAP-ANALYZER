import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export const Toast: React.FC = () => {
  const { toast } = useDashboard();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    error: <AlertTriangle className="w-5 h-5 text-rose-400" />,
    info: <Info className="w-5 h-5 text-indigo-400" />
  };

  const borders = {
    success: 'border-emerald-500/30 bg-emerald-950/80 text-emerald-200',
    error: 'border-rose-500/30 bg-rose-950/80 text-rose-200',
    info: 'border-indigo-500/30 bg-indigo-950/80 text-indigo-200'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl ${
          borders[toast.type]
        }`}
      >
        {icons[toast.type]}
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
    </div>
  );
};
