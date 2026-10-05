import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  Check,
  TrendingDown,
  Layers,
  Scale,
  DollarSign,
  Award,
  Sparkles
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { compareMaterialsApi, INITIAL_MATERIALS } from '../services/api';

export default function Comparison({ setActivePage }) {
  const [selectedMaterials, setSelectedMaterials] = useState([
    'Aluminium 6061-T6',
    '304 Stainless Steel',
    'E-Glass/Epoxy',
    'Carbon/Epoxy'
  ]);

  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);

  const req = {
    capacityLiters: 50,
    designPressureMpa: 35,
    cylinderDiameterMm: 300,
    cylinderLengthMm: 750,
    efficiencyFactor: 0.85,
    configurationName: 'Type I'
  };

  useEffect(() => {
    async function loadComparison() {
      setLoading(true);
      const res = await compareMaterialsApi({ ...req, materialNames: selectedMaterials });
      setComparisonData(res);
      setLoading(false);
    }
    loadComparison();
  }, [selectedMaterials]);

  const toggleMaterial = (name) => {
    if (selectedMaterials.includes(name)) {
      if (selectedMaterials.length > 1) {
        setSelectedMaterials(selectedMaterials.filter(m => m !== name));
      }
    } else {
      setSelectedMaterials([...selectedMaterials, name]);
    }
  };

  // Recharts chart data
  const chartData = comparisonData?.materialResults?.map(res => ({
    name: res.materialName,
    thickness: res.wallThicknessMm,
    mass: res.estimatedMassKg,
    cost: res.estimatedCostUsd,
    volume: res.estimatedVolumeM3 * 1000
  })) || [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-2">
            <GitCompare className="w-7 h-7 text-cyan-400" />
            Material Performance Comparison
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Comparative quantitative evaluation of candidate structural materials at 35 MPa design pressure.
          </p>
        </div>
      </div>

      <DisclaimerBanner compact />

      {/* Material Checkbox Selector */}
      <div className="glass-panel rounded-2xl p-5 space-y-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Select Candidate Materials to Compare:
        </span>
        <div className="flex flex-wrap gap-3">
          {INITIAL_MATERIALS.map(m => {
            const isSelected = selectedMaterials.includes(m.name);
            return (
              <button
                key={m.id}
                onClick={() => toggleMaterial(m.name)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                  isSelected ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-700'
                }`}>
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>{m.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* HIGHLIGHT PREFERRED CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-emerald-400">
          <span className="text-xs text-slate-400 uppercase font-bold block">Lowest Material Cost</span>
          <span className="text-xl font-extrabold text-emerald-400 mt-1 block">
            {comparisonData?.preferredMaterialCost || 'Aluminium 6061-T6'}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Preferred for Cost Optimization</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-cyan-400">
          <span className="text-xs text-slate-400 uppercase font-bold block">Lowest Shell Mass</span>
          <span className="text-xl font-extrabold text-cyan-400 mt-1 block">
            {comparisonData?.preferredMaterialWeight || 'Carbon/Epoxy'}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Preferred for Lightweighting</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-blue-400">
          <span className="text-xs text-slate-400 uppercase font-bold block">Thinnest Wall Profile</span>
          <span className="text-xl font-extrabold text-blue-400 mt-1 block">
            {comparisonData?.preferredMaterialThickness || 'Carbon/Epoxy'}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Preferred for Compact Envelope</span>
        </div>
      </div>

      {/* COMPARISON TABLE */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-3">
          Detailed Numerical Comparison Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <th className="p-3 font-semibold">Material</th>
                <th className="p-3 font-semibold">Allowable Stress (S)</th>
                <th className="p-3 font-semibold">Density (ρ)</th>
                <th className="p-3 font-semibold">Wall Thickness (t)</th>
                <th className="p-3 font-semibold">Wall Volume (V)</th>
                <th className="p-3 font-semibold">Estimated Mass (M)</th>
                <th className="p-3 font-semibold">Estimated Cost ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {comparisonData?.materialResults?.map((res, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3 font-bold text-cyan-300">{res.materialName}</td>
                  <td className="p-3 text-slate-300">
                    {INITIAL_MATERIALS.find(m => m.name === res.materialName)?.allowableStress} MPa
                  </td>
                  <td className="p-3 text-slate-300">
                    {INITIAL_MATERIALS.find(m => m.name === res.materialName)?.density} kg/m³
                  </td>
                  <td className="p-3 font-bold text-slate-100">
                    {res.isValid ? `${res.wallThicknessMm.toFixed(2)} mm` : 'FAIL'}
                  </td>
                  <td className="p-3 text-slate-300">
                    {res.isValid ? `${(res.estimatedVolumeM3 * 1000).toFixed(2)} L` : '--'}
                  </td>
                  <td className="p-3 font-bold text-slate-100">
                    {res.isValid ? `${res.estimatedMassKg.toFixed(2)} kg` : '--'}
                  </td>
                  <td className="p-3 font-bold text-emerald-400">
                    {res.isValid ? `$${res.estimatedCostUsd.toFixed(2)}` : '--'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* COMPARATIVE BAR CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mass Comparison Bar Chart */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-3">
            Estimated Shell Mass (kg)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} unit=" kg" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} />
                <Bar dataKey="mass" fill="#06b6d4" radius={[8, 8, 0, 0]} name="Mass (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost Comparison Bar Chart */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-3">
            Estimated Material Cost ($ USD)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} unit=" $" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} />
                <Bar dataKey="cost" fill="#10b981" radius={[8, 8, 0, 0]} name="Cost ($ USD)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
