import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export default function ToastNotification({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-red-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-500/40 bg-emerald-950/90 text-emerald-200',
    error: 'border-red-500/40 bg-red-950/90 text-red-200',
    warning: 'border-amber-500/40 bg-amber-950/90 text-amber-200',
    info: 'border-cyan-500/40 bg-cyan-950/90 text-cyan-200'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in fade-in slide-in-from-bottom-5">
      <div className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-md flex items-start justify-between gap-3 text-xs font-medium ${borders[toast.type] || borders.info}`}>
        <div className="flex items-start gap-2.5">
          {icons[toast.type] || icons.info}
          <span className="leading-relaxed mt-0.5">{toast.text}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-800/40 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
