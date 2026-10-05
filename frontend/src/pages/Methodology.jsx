import React from 'react';
import { Workflow, ArrowRight, ShieldCheck, Cpu, Layers } from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function Methodology() {
  const steps = [
    { title: '1. User Input Parameters', desc: 'Capacity (L), Pressure P (MPa), Diameter D (mm), Length L (mm), Joint Efficiency E' },
    { title: '2. Input Validation', desc: 'Validates positive bounds & stress margin: SE - 0.6P > 0' },
    { title: '3. Unit Conversion', desc: 'MPa → Pascals (×10⁶), mm → meters (/1000), R = D/2' },
    { title: '4. Material Selection', desc: 'Retrieves density (ρ), allowable design stress (S), raw cost ($/kg)' },
    { title: '5. Thickness Calculation', desc: 'Barlow / ASME thin-wall formula: t = (P × R) / (S × E - 0.6 × P)' },
    { title: '6. Volume Estimation', desc: 'Wall material volume approximation: V ≈ π × D × L × t' },
    { title: '7. Shell Mass Estimation', desc: 'Mass calculation: M = ρ × V' },
    { title: '8. Material Cost Estimation', desc: 'Estimated raw material cost: Cost = M × costPerKg' },
    { title: '9. Multi-Material Comparison', desc: 'Side-by-side comparative matrix across all candidate grades' },
    { title: '10. Recommendation Engine', desc: 'Normalized multi-criteria penalty scoring (Cost, Mass, Thickness)' }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-2">
            <Workflow className="w-7 h-7 text-cyan-400" />
            Engineering Calculation Methodology
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Mathematical foundations, ASME / Barlow pressure vessel equations, and multi-criteria optimization logic.
          </p>
        </div>
      </div>

      <DisclaimerBanner compact />

      {/* VISUAL WORKFLOW FLOWCHART */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-3">
          Visual System Engineering Workflow
        </h3>

        <div className="space-y-3">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4 group hover:border-cyan-500/40 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0">
                    0{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">{step.title}</h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{step.desc}</p>
                  </div>
                </div>
                <ShieldCheck className="w-4 h-4 text-cyan-500/40 group-hover:text-cyan-400 transition-colors" />
              </div>

              {idx < steps.length - 1 && (
                <div className="flex justify-center my-1">
                  <div className="w-0.5 h-4 bg-gradient-to-b from-cyan-500 to-blue-600 animate-pulse" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* MATHEMATICAL DERIVATION DETAILS */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-3">
          Barlow / ASME Section VIII Thin-Walled Cylinder Equation
        </h3>

        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
          <p className="text-cyan-400 font-bold text-sm">t = (P × R) / (S × E - 0.6 × P)</p>
          <div className="text-slate-300 space-y-1 text-[11px]">
            <p>Where:</p>
            <p>• P = Internal Design Operating Pressure (Pa)</p>
            <p>• R = Internal Cylinder Radius = D / 2 (m)</p>
            <p>• S = Material Reference Allowable Yield/Design Stress (Pa)</p>
            <p>• E = Joint / Weld Efficiency Factor (0.01 - 1.0)</p>
            <p>• t = Minimum Preliminary Wall Thickness (m)</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The factor 0.6P in the denominator accounts for non-linear hoop stress distribution across thin-walled pressure vessel shells under internal hydrostatic gas pressure.
        </p>
      </div>
    </div>
  );
}
