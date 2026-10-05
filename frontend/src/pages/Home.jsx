import React from 'react';
import {
  Flame,
  ArrowRight,
  ShieldAlert,
  Sliders,
  Database,
  GitCompare,
  Award,
  Layers,
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function Home({ setActivePage }) {
  return (
    <div className="space-y-12">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800">
        {/* Animated background ambient lights */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl animate-pulse-glow" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Academic Engineering Decision Support Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-slate-100 tracking-tight leading-tight">
              Low-Cost Hydrogen Storage <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">Cylinder Design</span>
            </h1>

            <p className="text-base text-slate-300 font-medium leading-relaxed">
              Preliminary Design, Material Comparison &amp; Engineering Decision Support System. 
              Perform Barlow thin-wall calculations, compare candidate structural materials, evaluate conceptual composite configurations, and analyze cost vs mass trade-offs.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setActivePage('calculator')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <span>Start Design Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActivePage('materials')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm transition-all"
              >
                <Database className="w-4 h-4 text-cyan-400" />
                <span>Explore Materials</span>
              </button>
            </div>
          </div>

          {/* Futuristic Hero Cylinder Visualizer */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-full max-w-sm h-80 flex items-center justify-center">
              {/* Outer Orbiting Hydrogen Particle Ring */}
              <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-spin" style={{ animationDuration: '25s' }}>
                <div className="absolute top-0 left-1/2 -ml-2 -mt-2 w-4 h-4 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/80 flex items-center justify-center text-[8px] font-bold text-slate-950">
                  H₂
                </div>
                <div className="absolute bottom-0 left-1/2 -ml-2 -mb-2 w-4 h-4 rounded-full bg-blue-400 shadow-lg shadow-blue-400/80 flex items-center justify-center text-[8px] font-bold text-slate-950">
                  H₂
                </div>
              </div>

              {/* 3D Glassy Cylinder Visual */}
              <div className="w-64 h-40 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-2 border-cyan-500/40 p-4 shadow-2xl relative flex flex-col justify-between overflow-hidden animate-float">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent pointer-events-none" />

                <div className="flex items-center justify-between text-xs font-bold text-cyan-400 z-10">
                  <span className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-cyan-400" /> 35 MPa H₂ Vessel
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Type I / III</span>
                </div>

                <div className="my-auto text-center z-10">
                  <span className="text-2xl font-black text-slate-100 block">t = 24.58 mm</span>
                  <span className="text-[11px] text-slate-400">Aluminium 6061-T6 Shell</span>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-700/60 pt-2 z-10">
                  <span>Capacity: 50 L</span>
                  <span>Mass: ~46.9 kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SYSTEM DISCLAIMER BANNER */}
      <DisclaimerBanner />

      {/* CORE CAPABILITIES HIGHLIGHTS */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-100">
            Engineering Analysis &amp; Decision Support Capabilities
          </h2>
          <p className="text-xs text-slate-400">
            Integrated quantitative workflow for hydrogen storage vessel preliminary evaluation
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            onClick={() => setActivePage('calculator')}
            className="glass-panel glass-card-hover rounded-2xl p-6 cursor-pointer space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Preliminary Design Calculator</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculate wall thickness using Barlow's / ASME thin-walled cylinder formula with strict stress safety verification ($SE - 0.6P &gt; 0$).
            </p>
          </div>

          <div
            onClick={() => setActivePage('materials')}
            className="glass-panel glass-card-hover rounded-2xl p-6 cursor-pointer space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Material Database</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore mechanical properties, reference stress, density, cost per kg, and data sources for metals and composites.
            </p>
          </div>

          <div
            onClick={() => setActivePage('comparison')}
            className="glass-panel glass-card-hover rounded-2xl p-6 cursor-pointer space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <GitCompare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Material Comparison</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compare candidate materials side-by-side on wall thickness, volume, mass, and estimated cost with comparative bar charts.
            </p>
          </div>

          <div
            onClick={() => setActivePage('recommendation')}
            className="glass-panel glass-card-hover rounded-2xl p-6 cursor-pointer space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Recommendation Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-criteria decision algorithm evaluating weighted scores for Cost Priority, Weight Priority, and Balanced optimization.
            </p>
          </div>

          <div
            onClick={() => setActivePage('sensitivity')}
            className="glass-panel glass-card-hover rounded-2xl p-6 cursor-pointer space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Sensitivity Analysis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactively vary pressure and geometry parameters to observe real-time curves for wall thickness and shell mass.
            </p>
          </div>

          <div
            onClick={() => setActivePage('dashboard')}
            className="glass-panel glass-card-hover rounded-2xl p-6 cursor-pointer space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Engineering Dashboard</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unified KPI overview, interactive SVG cylinder visualizer with animated hydrogen gas particles, and recent history.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
