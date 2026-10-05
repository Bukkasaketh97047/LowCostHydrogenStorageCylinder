import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function DisclaimerBanner({ compact = false }) {
  if (compact) {
    return (
      <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-300 flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Preliminary Engineering Estimation Only:</strong> Not a certified pressure-vessel manufacturing specification.
        </span>
      </div>
    );
  }

  return (
    <div className="glass-panel border-l-4 border-l-amber-500 rounded-xl p-4 my-4 bg-gradient-to-r from-amber-950/30 via-slate-900/40 to-slate-900/40 shadow-lg">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-amber-300 uppercase tracking-wider">
            Important Engineering Disclaimer
          </h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            This application provides <strong>preliminary engineering estimates</strong> for academic and decision-support purposes. 
            It is <strong>not a certified pressure-vessel design tool</strong> and must not be used as a final manufacturing or safety specification. 
            Actual hydrogen storage systems require verified material properties, applicable safety standards (e.g. ASME BPVC Section VIII, ISO 19881, SAE J2579), detailed finite element analysis (FEA), destruct testing, and professional review by certified pressure-vessel engineers.
          </p>
        </div>
      </div>
    </div>
  );
}
