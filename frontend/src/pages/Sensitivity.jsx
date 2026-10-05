import React, { useState, useMemo } from 'react';
import { Sliders, Gauge, Scale, Layers, Activity } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { INITIAL_MATERIALS } from '../services/api';

export default function Sensitivity() {
  const [pressureRange, setPressureRange] = useState(35);
  const [lengthRange, setLengthRange] = useState(750);
  const [diameter, setDiameter] = useState(300);
  const [efficiency, setEfficiency] = useState(0.85);

  // Analysis 1: Dynamic Pressure vs Wall Thickness Curve (10 MPa to 100 MPa)
  const pressureSensitivityData = useMemo(() => {
    const points = [];
    for (let p = 10; p <= 100; p += 10) {
      const point = { pressure: p };
      INITIAL_MATERIALS.forEach(m => {
        const P_Pa = p * 1e6;
        const R_m = (diameter / 1000.0) / 2.0;
        const S_Pa = m.allowableStress * 1e6;
        const denom = (S_Pa * efficiency) - (0.6 * P_Pa);
        if (denom > 0) {
          const t_mm = ((P_Pa * R_m) / denom) * 1000.0;
          point[m.name.split(' ')[0]] = parseFloat(t_mm.toFixed(2));
        } else {
          point[m.name.split(' ')[0]] = null;
        }
      });
      points.push(point);
    }
    return points;
  }, [diameter, efficiency]);

  // Analysis 2: Dynamic Cylinder Length vs Estimated Mass (300 mm to 2000 mm)
  const lengthSensitivityData = useMemo(() => {
    const points = [];
    const p_Pa = pressureRange * 1e6;
    const R_m = (diameter / 1000.0) / 2.0;
    const D_m = diameter / 1000.0;

    for (let l = 300; l <= 2000; l += 150) {
      const L_m = l / 1000.0;
      const point = { length: l };
      INITIAL_MATERIALS.forEach(m => {
        const S_Pa = m.allowableStress * 1e6;
        const denom = (S_Pa * efficiency) - (0.6 * p_Pa);
        if (denom > 0) {
          const t_m = (p_Pa * R_m) / denom;
          const V_m3 = Math.PI * D_m * L_m * t_m;
          const M_kg = m.density * V_m3;
          point[m.name.split(' ')[0]] = parseFloat(M_kg.toFixed(2));
        } else {
          point[m.name.split(' ')[0]] = null;
        }
      });
      points.push(point);
    }
    return points;
  }, [pressureRange, diameter, efficiency]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-2">
            <Sliders className="w-7 h-7 text-cyan-400" />
            Parametric Sensitivity Analysis
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Observe real-time parametric sensitivity curves by varying operating pressure and cylinder geometry sliders.
          </p>
        </div>
      </div>

      <DisclaimerBanner compact />

      {/* ANALYSIS 1: PRESSURE VS WALL THICKNESS */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Gauge className="w-4 h-4 text-cyan-400" /> Analysis 1: Operating Pressure vs Wall Thickness (t)
            </h3>
            <p className="text-xs text-slate-400">Dynamic curve response across all candidate materials (10 MPa - 100 MPa)</p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800 text-xs">
            <span className="text-slate-400">Active Pressure Slider:</span>
            <span className="font-extrabold text-cyan-400 text-sm">{pressureRange} MPa</span>
          </div>
        </div>

        {/* Pressure Slider Control */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span>Operating Pressure (P) Slider:</span>
            <span className="text-cyan-400">{pressureRange} MPa</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="1"
            value={pressureRange}
            onChange={(e) => setPressureRange(parseFloat(e.target.value))}
            className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
          />
        </div>

        {/* Pressure vs Thickness Chart */}
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pressureSensitivityData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="pressure" stroke="#94a3b8" fontSize={11} unit=" MPa" />
              <YAxis stroke="#94a3b8" fontSize={11} unit=" mm" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="Aluminium" stroke="#06b6d4" strokeWidth={2.5} name="Al 6061-T6" />
              <Line type="monotone" dataKey="304" stroke="#f59e0b" strokeWidth={2.5} name="304 Steel" />
              <Line type="monotone" dataKey="E-Glass/Epoxy" stroke="#8b5cf6" strokeWidth={2.5} name="E-Glass" />
              <Line type="monotone" dataKey="Carbon/Epoxy" stroke="#10b981" strokeWidth={2.5} name="Carbon/Epoxy" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ANALYSIS 2: CYLINDER LENGTH VS ESTIMATED MASS */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-400" /> Analysis 2: Cylinder Length vs Estimated Shell Mass (kg)
            </h3>
            <p className="text-xs text-slate-400">Geometry scaling effect on total vessel mass (Length 300 mm - 2000 mm)</p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800 text-xs">
            <span className="text-slate-400">Active Length Slider:</span>
            <span className="font-extrabold text-cyan-400 text-sm">{lengthRange} mm</span>
          </div>
        </div>

        {/* Length Slider Control */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span>Cylinder Length (L) Slider:</span>
            <span className="text-cyan-400">{lengthRange} mm</span>
          </div>
          <input
            type="range"
            min="300"
            max="2000"
            step="25"
            value={lengthRange}
            onChange={(e) => setLengthRange(parseFloat(e.target.value))}
            className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
          />
        </div>

        {/* Length vs Mass Chart */}
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lengthSensitivityData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="length" stroke="#94a3b8" fontSize={11} unit=" mm" />
              <YAxis stroke="#94a3b8" fontSize={11} unit=" kg" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="Aluminium" stroke="#06b6d4" strokeWidth={2.5} name="Al 6061-T6" />
              <Line type="monotone" dataKey="304" stroke="#f59e0b" strokeWidth={2.5} name="304 Steel" />
              <Line type="monotone" dataKey="E-Glass/Epoxy" stroke="#8b5cf6" strokeWidth={2.5} name="E-Glass" />
              <Line type="monotone" dataKey="Carbon/Epoxy" stroke="#10b981" strokeWidth={2.5} name="Carbon/Epoxy" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
