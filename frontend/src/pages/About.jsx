import React from 'react';
import { Info, Target, AlertTriangle, Lightbulb, Rocket, CheckCircle2 } from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function About() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-2">
            <Info className="w-7 h-7 text-cyan-400" />
            About Project &amp; Scope
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Academic engineering decision support system for hydrogen storage cylinder preliminary design &amp; material recommendation.
          </p>
        </div>
      </div>

      <DisclaimerBanner compact />

      {/* PROJECT OBJECTIVE & PROBLEM STATEMENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-3xl p-6 space-y-3 border-l-4 border-l-cyan-400">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Target className="w-5 h-5" />
            <span>Project Objective</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            To develop an accessible, web-based engineering decision-support tool that allows engineering students, researchers, and system designers to perform preliminary sizing, wall thickness estimations, material comparisons, and multi-criteria optimization for compressed gaseous hydrogen storage vessels.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 space-y-3 border-l-4 border-l-amber-400">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5" />
            <span>Problem Statement</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            High-pressure hydrogen storage (35 - 70 MPa) requires balancing structural strength, material cost, vessel mass, and hydrogen embrittlement resistance. Early-stage design decisions lack fast, interactive decision-support tools without opening expensive CAD/FEA suites.
          </p>
        </div>
      </div>

      {/* LIMITATIONS & FUTURE SCOPE */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
          <Rocket className="w-4 h-4 text-cyan-400" /> System Limitations &amp; Future Development Scope
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-3">
            <h4 className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">Current System Limitations</h4>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>Type I calculations use Barlow's thin-wall formula (t = (P * R) / (SE - 0.6P)). Thick-wall hoop stress distribution (r_o / r_i &gt; 1.1) requires Lamé equations.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>Type III and Type IV composite filament winding overwraps use conceptual mechanics scaling factors rather than full classical laminate theory (CLT).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>Thermal fatigue, cyclic hydrogen embrittlement microcracking, and dome end-cap stress concentrations are omitted from preliminary formulas.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-cyan-300 uppercase tracking-wider text-[11px]">Future Development Scope</h4>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>Classical Composite Mechanics &amp; Winding Angle Optimization ($\pm 54.7^\circ$ geodesic helical winding).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>Automated CAD Export (STEP / IGES 3D geometry file generation for SolidWorks/Autodesk).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>ASME BPVC Section VIII Div 3 &amp; ISO 19881 Compliance Verification Modules.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>Finite Element Analysis (FEA) solver integration for stress concentration heatmaps.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
