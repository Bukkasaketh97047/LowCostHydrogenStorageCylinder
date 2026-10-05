import React from 'react';
import { Printer, X, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ReportModal({ isOpen, onClose, currentResult, currentRequest }) {
  if (!isOpen || !currentResult) return null;

  const handlePrint = () => {
    window.print();
  };

  const req = currentRequest || {
    capacityLiters: 50,
    designPressureMpa: 35,
    cylinderDiameterMm: 300,
    cylinderLengthMm: 750,
    efficiencyFactor: 0.85,
    materialName: currentResult.materialName || 'Aluminium 6061-T6',
    configurationName: currentResult.configurationName || 'Type I',
    optimizationPriority: 'Balanced'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto no-print">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Header Controls */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              Engineering Analysis & Design Report
            </h3>
            <p className="text-xs text-slate-400">Preliminary Decision Support Document</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF Report
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Surface */}
        <div className="bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800/80 text-slate-200 text-xs space-y-6">
          {/* Document Header */}
          <div className="flex justify-between items-start border-b border-slate-800 pb-6">
            <div>
              <h2 className="text-lg font-black text-cyan-400 uppercase tracking-wide">
                HYDROGEN STORAGE CYLINDER PRELIMINARY DESIGN REPORT
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Project Title: Low-Cost Hydrogen Storage Cylinder – Design & Material Recommendation System
              </p>
              <p className="text-slate-500 text-[11px]">
                Report Ref: HYDRO-ENG-REPORT-{Date.now().toString().slice(-6)} | Generated: {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold rounded-md">
                PRELIMINARY EVALUATION
              </span>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div>
            <h4 className="font-bold text-slate-100 uppercase text-xs border-b border-slate-800 pb-1 mb-3">
              1. Executive Summary & Design Results
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Min Wall Thickness (t)</span>
                <span className="text-base font-extrabold text-cyan-400">
                  {currentResult.wallThicknessMm ? `${currentResult.wallThicknessMm.toFixed(2)} mm` : 'N/A'}
                </span>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Estimated Mass (M)</span>
                <span className="text-base font-extrabold text-slate-100">
                  {currentResult.estimatedMassKg ? `${currentResult.estimatedMassKg.toFixed(2)} kg` : 'N/A'}
                </span>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Estimated Volume (V)</span>
                <span className="text-base font-extrabold text-slate-100">
                  {currentResult.estimatedVolumeM3 ? `${(currentResult.estimatedVolumeM3 * 1000).toFixed(2)} L` : 'N/A'}
                </span>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Estimated Material Cost</span>
                <span className="text-base font-extrabold text-emerald-400">
                  {currentResult.estimatedCostUsd ? `$${currentResult.estimatedCostUsd.toFixed(2)}` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Input Parameters */}
          <div>
            <h4 className="font-bold text-slate-100 uppercase text-xs border-b border-slate-800 pb-1 mb-3">
              2. Design Parameters & Specifications
            </h4>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <th className="p-2 font-semibold">Parameter</th>
                  <th className="p-2 font-semibold">Value</th>
                  <th className="p-2 font-semibold">Unit</th>
                  <th className="p-2 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr>
                  <td className="p-2 text-slate-300">Storage Capacity</td>
                  <td className="p-2 font-bold text-slate-100">{req.capacityLiters}</td>
                  <td className="p-2 text-slate-400">Liters</td>
                  <td className="p-2 text-slate-400">Internal volume target</td>
                </tr>
                <tr>
                  <td className="p-2 text-slate-300">Design Pressure (P)</td>
                  <td className="p-2 font-bold text-slate-100">{req.designPressureMpa}</td>
                  <td className="p-2 text-slate-400">MPa</td>
                  <td className="p-2 text-slate-400">Operating pressure constraint</td>
                </tr>
                <tr>
                  <td className="p-2 text-slate-300">Cylinder Internal Diameter (D)</td>
                  <td className="p-2 font-bold text-slate-100">{req.cylinderDiameterMm}</td>
                  <td className="p-2 text-slate-400">mm</td>
                  <td className="p-2 text-slate-400">R = {(req.cylinderDiameterMm / 2).toFixed(1)} mm</td>
                </tr>
                <tr>
                  <td className="p-2 text-slate-300">Cylinder Length (L)</td>
                  <td className="p-2 font-bold text-slate-100">{req.cylinderLengthMm}</td>
                  <td className="p-2 text-slate-400">mm</td>
                  <td className="p-2 text-slate-400">Overall body length</td>
                </tr>
                <tr>
                  <td className="p-2 text-slate-300">Selected Material Grade</td>
                  <td className="p-2 font-bold text-cyan-400">{req.materialName}</td>
                  <td className="p-2 text-slate-400">-</td>
                  <td className="p-2 text-slate-400">Primary structural candidate</td>
                </tr>
                <tr>
                  <td className="p-2 text-slate-300">Cylinder Configuration</td>
                  <td className="p-2 font-bold text-slate-100">{req.configurationName}</td>
                  <td className="p-2 text-slate-400">-</td>
                  <td className="p-2 text-slate-400">Construction type</td>
                </tr>
                <tr>
                  <td className="p-2 text-slate-300">Weld Efficiency Factor (E)</td>
                  <td className="p-2 font-bold text-slate-100">{req.efficiencyFactor}</td>
                  <td className="p-2 text-slate-400">-</td>
                  <td className="p-2 text-slate-400">Joint quality coefficient</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 3: Calculation Breakdown */}
          <div>
            <h4 className="font-bold text-slate-100 uppercase text-xs border-b border-slate-800 pb-1 mb-3">
              3. Calculation Engineering Steps
            </h4>
            <div className="space-y-2">
              {currentResult.calculationSteps?.map((step, idx) => (
                <div key={idx} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-slate-200 block">{step.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{step.formula}</span>
                  </div>
                  <span className="font-bold text-cyan-300">{step.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Disclaimer Box */}
          <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 text-[11px] text-amber-200 leading-relaxed">
            <strong className="block text-amber-400 uppercase font-bold mb-1">
              Safety & Regulatory Disclaimer
            </strong>
            This document is generated by an academic decision-support software tool for preliminary estimations. 
            It does NOT constitute a certified pressure vessel engineering drawing or manufacturing specification. 
            Final designs must undergo finite element analysis, ASME Section VIII qualification, and physical burst testing.
          </div>
        </div>
      </div>
    </div>
  );
}
