import React, { useState, useEffect } from 'react';
import {
  Award,
  Sliders,
  DollarSign,
  Scale,
  Layers,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { recommendMaterialApi } from '../services/api';

export default function Recommendation({ setActivePage }) {
  const [priority, setPriority] = useState('Balanced');
  const [recommendationResult, setRecommendationResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const req = {
    capacityLiters: 50,
    designPressureMpa: 35,
    cylinderDiameterMm: 300,
    cylinderLengthMm: 750,
    efficiencyFactor: 0.85,
    configurationName: 'Type I',
    optimizationPriority: priority
  };

  useEffect(() => {
    async function loadRec() {
      setLoading(true);
      const res = await recommendMaterialApi(req);
      setRecommendationResult(res);
      setLoading(false);
    }
    loadRec();
  }, [priority]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-2">
            <Award className="w-7 h-7 text-cyan-400" />
            Engineering Recommendation Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Multi-criteria decision evaluation using weighted normalization ($Score = w_C C_n + w_W W_n + w_T T_n$).
          </p>
        </div>
      </div>

      <DisclaimerBanner compact />

      {/* PRIORITY SELECTOR CARDS */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-3">
          Select Optimization Objective Strategy
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Cost Priority */}
          <div
            onClick={() => setPriority('Cost')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              priority === 'Cost'
                ? 'bg-emerald-950/30 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <DollarSign className="w-5 h-5" />
                <span>Cost Priority</span>
              </div>
              {priority === 'Cost' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Weights: <strong>70% Cost</strong>, 20% Mass, 10% Thickness. Minimizes expenditure for budget-constrained projects.
            </p>
          </div>

          {/* Weight Priority */}
          <div
            onClick={() => setPriority('Weight')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              priority === 'Weight'
                ? 'bg-cyan-950/30 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Scale className="w-5 h-5" />
                <span>Weight (Mass) Priority</span>
              </div>
              {priority === 'Weight' && <CheckCircle2 className="w-5 h-5 text-cyan-400" />}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Weights: 20% Cost, <strong>70% Mass</strong>, 10% Thickness. Minimizes dead weight for mobility / transport systems.
            </p>
          </div>

          {/* Balanced Priority */}
          <div
            onClick={() => setPriority('Balanced')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              priority === 'Balanced'
                ? 'bg-blue-950/30 border-blue-500/60 shadow-lg shadow-blue-500/10'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <Sliders className="w-5 h-5" />
                <span>Balanced Strategy</span>
              </div>
              {priority === 'Balanced' && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Weights: <strong>40% Cost</strong>, <strong>40% Mass</strong>, 20% Thickness. Provides optimal commercial trade-off.
            </p>
          </div>
        </div>
      </div>

      {/* RECOMMENDED MATERIAL HERO CARD */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border-l-4 border-l-cyan-400 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider block">
              Recommended Material Choice ({priority} Priority)
            </span>
            <h2 className="text-3xl font-black text-slate-100 mt-1">
              {recommendationResult?.recommendedMaterial || 'Aluminium 6061-T6'}
            </h2>
          </div>

          <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Weighted Penalty Score</span>
            <span className="text-xl font-black text-cyan-300">
              {recommendationResult?.score ? recommendationResult.score.toFixed(3) : '0.382'}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          {recommendationResult?.rationale || 'Selected according to the optimization priority. Lowest penalty score indicates preferred candidate option.'}
        </p>
      </div>

      {/* FULL MULTI-CRITERIA SCORING TABLE */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-3">
          Multi-Criteria Normalized Evaluation Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <th className="p-3 font-semibold">Rank</th>
                <th className="p-3 font-semibold">Material Grade</th>
                <th className="p-3 font-semibold">Est. Cost ($)</th>
                <th className="p-3 font-semibold">Est. Mass (kg)</th>
                <th className="p-3 font-semibold">Thickness (mm)</th>
                <th className="p-3 font-semibold">Normalized Score</th>
                <th className="p-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recommendationResult?.allMaterialScores?.map((scoreItem, idx) => (
                <tr key={idx} className={`hover:bg-slate-900/40 transition-colors ${idx === 0 ? 'bg-cyan-500/10' : ''}`}>
                  <td className="p-3 font-bold text-slate-300">#{idx + 1}</td>
                  <td className="p-3 font-bold text-cyan-300">{scoreItem.materialName}</td>
                  <td className="p-3 font-bold text-emerald-400">${scoreItem.costUsd.toFixed(2)}</td>
                  <td className="p-3 font-semibold text-slate-100">{scoreItem.massKg.toFixed(2)} kg</td>
                  <td className="p-3 text-slate-300">{scoreItem.wallThicknessMm.toFixed(2)} mm</td>
                  <td className="p-3 font-black text-cyan-400">{scoreItem.score.toFixed(3)}</td>
                  <td className="p-3">
                    {idx === 0 ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        PREFERRED
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">Alternative</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
