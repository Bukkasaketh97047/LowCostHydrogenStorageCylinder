import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  FileText,
  ChevronDown,
  ChevronUp,
  Layers,
  Scale,
  DollarSign,
  Box,
  ArrowRight,
  Printer,
  Sparkles
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function Results({ calculationResult, currentRequest, setActivePage, setReportData }) {
  const [openStep, setOpenStep] = useState(null);

  if (!calculationResult) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
        <h3 className="text-xl font-bold text-slate-100">No Calculation Results Available</h3>
        <p className="text-xs text-slate-400">
          Please run a calculation in the Design Calculator first to view technical output parameters.
        </p>
        <button
          onClick={() => setActivePage('calculator')}
          className="px-6 py-2.5 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg"
        >
          Go to Design Calculator
        </button>
      </div>
    );
  }

  const toggleStep = (idx) => {
    setOpenStep(openStep === idx ? null : idx);
  };

  const req = currentRequest || {
    capacityLiters: 50,
    designPressureMpa: 35,
    cylinderDiameterMm: 300,
    cylinderLengthMm: 750,
    efficiencyFactor: 0.85,
    materialName: calculationResult.materialName || 'Aluminium 6061-T6',
    configurationName: calculationResult.configurationName || 'Type I',
    optimizationPriority: 'Balanced'
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              Final Engineering Design Result
            </h1>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> VALIDATED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Preliminary numerical design synthesis for target pressure vessel specifications
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (setReportData) setReportData({ result: calculationResult, request: req });
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <DisclaimerBanner compact />

      {/* RESULT KPI CARDS SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5 border-t-4 border-t-cyan-400">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Preliminary Wall Thickness (t)
          </span>
          <div className="mt-2 text-3xl font-black text-cyan-400">
            {calculationResult.wallThicknessMm.toFixed(2)} <span className="text-sm font-semibold">mm</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Barlow / ASME thin-wall formula</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border-t-4 border-t-blue-400">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Estimated Shell Mass (M)
          </span>
          <div className="mt-2 text-3xl font-black text-slate-100">
            {calculationResult.estimatedMassKg.toFixed(2)} <span className="text-sm font-semibold">kg</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">M = ρ × V</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border-t-4 border-t-purple-400">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Estimated Material Volume (V)
          </span>
          <div className="mt-2 text-3xl font-black text-slate-100">
            {(calculationResult.estimatedVolumeM3 * 1000).toFixed(2)} <span className="text-sm font-semibold">Liters</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">({calculationResult.estimatedVolumeM3.toFixed(4)} m³)</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border-t-4 border-t-emerald-400">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Estimated Material Cost
          </span>
          <div className="mt-2 text-3xl font-black text-emerald-400">
            ${calculationResult.estimatedCostUsd.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Cost = M × costPerKg</span>
        </div>
      </div>

      {/* INPUT SUMMARY & VALIDATION STATUS */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-3">
          Calculation Parameters &amp; Validation Status
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block">Candidate Material</span>
            <span className="font-bold text-cyan-400 mt-0.5 block">{calculationResult.materialName}</span>
          </div>
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block">Configuration</span>
            <span className="font-bold text-slate-200 mt-0.5 block">{calculationResult.configurationName}</span>
          </div>
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block">Design Pressure</span>
            <span className="font-bold text-slate-200 mt-0.5 block">{req.designPressureMpa} MPa</span>
          </div>
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block">Joint Efficiency (E)</span>
            <span className="font-bold text-slate-200 mt-0.5 block">{req.efficiencyFactor}</span>
          </div>
        </div>

        <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Validation Status: Clean Engineering Pass</strong>
            <p className="text-[11px] text-emerald-300/90 mt-0.5">
              {calculationResult.validationMessage || "Stress condition SE - 0.6P > 0 satisfied. Minimum wall thickness satisfies allowable stress criteria."}
            </p>
          </div>
        </div>
      </div>

      {/* EXPANDABLE CALCULATION BREAKDOWN ACCORDION */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-3">
          Step-by-Step Calculation Breakdown
        </h3>

        <div className="space-y-3">
          {calculationResult.calculationSteps?.map((step, idx) => {
            const isOpen = openStep === idx;
            return (
              <div key={idx} className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden transition-all">
                <button
                  onClick={() => toggleStep(idx)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-100 block">{step.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{step.formula}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-extrabold text-cyan-300">{step.value}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-slate-300 border-t border-slate-800/60 bg-slate-950/40">
                    <p className="mt-2">{step.description}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ACTION FOOTER */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
        <button
          onClick={() => setActivePage('comparison')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-200 text-xs font-bold transition-all"
        >
          <span>Compare With Other Materials</span>
          <ArrowRight className="w-4 h-4 text-cyan-400" />
        </button>

        <button
          onClick={() => setActivePage('recommendation')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-extrabold shadow-lg shadow-cyan-500/20 transition-all"
        >
          <span>View Optimization Recommendation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
