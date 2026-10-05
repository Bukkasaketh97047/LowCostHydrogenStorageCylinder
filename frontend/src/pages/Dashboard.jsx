import React, { useState, useEffect } from 'react';
import {
  Gauge,
  Box,
  Layers,
  Scale,
  DollarSign,
  ArrowRight,
  Sparkles,
  Award,
  RefreshCw,
  FileText
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import KpiCard from '../components/KpiCard';
import CylinderVisualizer from '../components/CylinderVisualizer';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { calculateDesignApi, fetchHistoryApi, INITIAL_MATERIALS } from '../services/api';

export default function Dashboard({ setActivePage, setReportData }) {
  const [currentDesign, setCurrentDesign] = useState({
    capacityLiters: 50,
    designPressureMpa: 35,
    cylinderDiameterMm: 300,
    cylinderLengthMm: 750,
    efficiencyFactor: 0.85,
    materialName: 'Aluminium 6061-T6',
    configurationName: 'Type I',
    optimizationPriority: 'Balanced'
  });

  const [calculationResult, setCalculationResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await calculateDesignApi(currentDesign);
      setCalculationResult(res);
      const hist = await fetchHistoryApi();
      setHistory(hist.slice(0, 5));
      setLoading(false);
    }
    loadData();
  }, [currentDesign]);

  // Demo charts data
  const pressureChartData = [
    { pressure: 10, Al6061: 7.03, SS304: 8.23, Carbon: 2.25 },
    { pressure: 25, Al6061: 17.58, SS304: 20.58, Carbon: 5.63 },
    { pressure: 35, Al6061: 24.58, SS304: 28.80, Carbon: 7.88 },
    { pressure: 50, Al6061: 35.15, SS304: 41.15, Carbon: 11.25 },
    { pressure: 70, Al6061: 49.21, SS304: 57.61, Carbon: 15.75 }
  ];

  const lengthMassChartData = [
    { length: 500, mass: calculationResult ? calculationResult.estimatedMassKg * 0.67 : 31.4 },
    { length: 750, mass: calculationResult ? calculationResult.estimatedMassKg : 46.9 },
    { length: 1000, mass: calculationResult ? calculationResult.estimatedMassKg * 1.33 : 62.5 },
    { length: 1250, mass: calculationResult ? calculationResult.estimatedMassKg * 1.67 : 78.3 },
    { length: 1500, mass: calculationResult ? calculationResult.estimatedMassKg * 2.0 : 93.8 }
  ];

  const materialCompareData = [
    { name: 'Al 6061-T6', cost: 211.1, mass: 46.9, thickness: 24.58 },
    { name: '304 Steel', cost: 587.3, mass: 183.5, thickness: 28.80 },
    { name: 'E-Glass', cost: 367.5, mass: 29.4, thickness: 13.10 },
    { name: 'Carbon/Epoxy', cost: 485.1, mass: 11.55, thickness: 7.88 }
  ];

  return (
    <div className="space-y-8">
      {/* Header Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Engineering Analysis Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time hydrogen pressure vessel telemetry &amp; material preliminary performance indicators
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('calculator')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>New Calculation</span>
          </button>
        </div>
      </div>

      <DisclaimerBanner compact />

      {/* SECTION 1: KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          title="Storage Capacity"
          value={currentDesign.capacityLiters}
          unit="L"
          icon={Box}
          color="cyan"
          subtitle="Target internal storage"
        />

        <KpiCard
          title="Design Pressure"
          value={currentDesign.designPressureMpa}
          unit="MPa"
          icon={Gauge}
          color="amber"
          subtitle="Compressed gaseous H₂"
        />

        <KpiCard
          title="Wall Thickness"
          value={calculationResult?.wallThicknessMm ? calculationResult.wallThicknessMm.toFixed(2) : '--'}
          unit="mm"
          icon={Layers}
          color="blue"
          subtitle="Barlow / ASME thin-wall"
        />

        <KpiCard
          title="Estimated Mass"
          value={calculationResult?.estimatedMassKg ? calculationResult.estimatedMassKg.toFixed(2) : '--'}
          unit="kg"
          icon={Scale}
          color="purple"
          subtitle="Shell mass estimate"
        />

        <KpiCard
          title="Estimated Cost"
          value={calculationResult?.estimatedCostUsd ? `$${calculationResult.estimatedCostUsd.toFixed(2)}` : '--'}
          unit="USD"
          icon={DollarSign}
          color="emerald"
          subtitle="Raw material cost"
        />
      </div>

      {/* SECTION 2 & SECTION 3: CURRENT DESIGN SUMMARY & INTERACTIVE CYLINDER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Current Design Specs */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                Current Design Parameters
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                ACTIVE RUN
              </span>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Selected Material:</span>
                <span className="font-bold text-cyan-400">{currentDesign.materialName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Selected Configuration:</span>
                <span className="font-bold text-slate-200">{currentDesign.configurationName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Target Capacity:</span>
                <span className="font-bold text-slate-200">{currentDesign.capacityLiters} L</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Design Pressure (P):</span>
                <span className="font-bold text-slate-200">{currentDesign.designPressureMpa} MPa</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Internal Diameter (D):</span>
                <span className="font-bold text-slate-200">{currentDesign.cylinderDiameterMm} mm</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Internal Radius (R):</span>
                <span className="font-bold text-slate-200">{(currentDesign.cylinderDiameterMm / 2).toFixed(1)} mm</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Cylinder Length (L):</span>
                <span className="font-bold text-slate-200">{currentDesign.cylinderLengthMm} mm</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Joint Efficiency (E):</span>
                <span className="font-bold text-slate-200">{currentDesign.efficiencyFactor}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (setReportData && calculationResult) {
                setReportData({ result: calculationResult, request: currentDesign });
              }
            }}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Generate Full Printable Engineering Report</span>
          </button>
        </div>

        {/* Interactive Cylinder Graphic */}
        <div className="lg:col-span-7">
          <CylinderVisualizer
            diameter={currentDesign.cylinderDiameterMm}
            length={currentDesign.cylinderLengthMm}
            thickness={calculationResult?.wallThicknessMm || 24.58}
            pressure={currentDesign.designPressureMpa}
            materialName={currentDesign.materialName}
            configurationName={currentDesign.configurationName}
          />
        </div>
      </div>

      {/* SECTION 4: INTERACTIVE RECHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Pressure vs Wall Thickness */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              1. Pressure vs Wall Thickness (t)
            </h3>
            <span className="text-[10px] text-slate-400">Barlow Formula Curves</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pressureChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="pressure" stroke="#94a3b8" fontSize={11} unit=" MPa" />
                <YAxis stroke="#94a3b8" fontSize={11} unit=" mm" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="Al6061" stroke="#06b6d4" strokeWidth={2} name="Al 6061-T6" />
                <Line type="monotone" dataKey="SS304" stroke="#f59e0b" strokeWidth={2} name="304 Stainless Steel" />
                <Line type="monotone" dataKey="Carbon" stroke="#10b981" strokeWidth={2} name="Carbon/Epoxy" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Length vs Estimated Mass */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              2. Cylinder Length vs Estimated Mass
            </h3>
            <span className="text-[10px] text-slate-400">Linear Volumetric Trend</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lengthMassChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="length" stroke="#94a3b8" fontSize={11} unit=" mm" />
                <YAxis stroke="#94a3b8" fontSize={11} unit=" kg" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="mass" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} name="Estimated Mass (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Material Cost Comparison */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              3. Material Cost Comparison ($ USD)
            </h3>
            <span className="text-[10px] text-slate-400">Est. Raw Shell Cost</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={materialCompareData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} unit=" $" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Bar dataKey="cost" fill="#10b981" radius={[8, 8, 0, 0]} name="Material Cost ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Material Mass Comparison */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              4. Material Mass Comparison (kg)
            </h3>
            <span className="text-[10px] text-slate-400">Weight Optimization</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={materialCompareData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} unit=" kg" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Bar dataKey="mass" fill="#06b6d4" radius={[8, 8, 0, 0]} name="Mass (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECTION 5: RECOMMENDATION & SECTION 6: RECENT CALCULATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recommendation Summary */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-6 flex flex-col justify-between border-l-4 border-l-cyan-500">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                Engineering Recommendation
              </h3>
            </div>

            <span className="text-xs text-slate-400 block mb-1">Preferred for Balanced Priority:</span>
            <span className="text-2xl font-black text-cyan-400 block">Aluminium 6061-T6</span>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Selected according to the <strong>Balanced Optimization Priority</strong> (weighted score: 0.382). 
              Provides high structural robustness at reasonable cost ($211.08) compared to heavier stainless steel ($587.33) or high-cost carbon composite ($485.10).
            </p>
          </div>

          <button
            onClick={() => setActivePage('recommendation')}
            className="w-full mt-6 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold rounded-xl border border-cyan-500/30 transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Full Multi-Criteria Decision Matrix</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Recent Calculation Records Table */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Recent Calculation Records
            </h3>
            <button
              onClick={() => setActivePage('history')}
              className="text-xs text-cyan-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>View All History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <th className="p-2.5 font-semibold">Material</th>
                  <th className="p-2.5 font-semibold">Config</th>
                  <th className="p-2.5 font-semibold">Press.</th>
                  <th className="p-2.5 font-semibold">Thickness</th>
                  <th className="p-2.5 font-semibold">Mass</th>
                  <th className="p-2.5 font-semibold">Est. Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {history.length > 0 ? (
                  history.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-2.5 font-bold text-cyan-300">{item.selectedMaterialName || item.materialName}</td>
                      <td className="p-2.5 text-slate-300">{item.selectedConfigurationName || item.configurationName}</td>
                      <td className="p-2.5 text-slate-300">{item.designPressureMpa} MPa</td>
                      <td className="p-2.5 font-semibold text-slate-100">{item.wallThicknessMm ? `${item.wallThicknessMm.toFixed(2)} mm` : '--'}</td>
                      <td className="p-2.5 text-slate-300">{item.estimatedMassKg ? `${item.estimatedMassKg.toFixed(2)} kg` : '--'}</td>
                      <td className="p-2.5 font-bold text-emerald-400">{item.estimatedCostUsd ? `$${item.estimatedCostUsd.toFixed(2)}` : '--'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-2.5 font-bold text-cyan-300">Aluminium 6061-T6</td>
                    <td className="p-2.5 text-slate-300">Type I</td>
                    <td className="p-2.5 text-slate-300">35 MPa</td>
                    <td className="p-2.5 font-semibold text-slate-100">24.58 mm</td>
                    <td className="p-2.5 text-slate-300">46.91 kg</td>
                    <td className="p-2.5 font-bold text-emerald-400">$211.08</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
