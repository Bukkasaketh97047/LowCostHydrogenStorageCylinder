import React, { useState } from 'react';
import { Gauge, Layers, Info } from 'lucide-react';

export default function CylinderVisualizer({
  diameter = 300,
  length = 750,
  thickness = 24.58,
  pressure = 35,
  materialName = "Aluminium 6061-T6",
  configurationName = "Type I"
}) {
  const [activeLayer, setActiveLayer] = useState('all');

  // Compute proportional SVG dimensions
  const outerRadius = 70;
  const innerRadius = Math.max(25, outerRadius - Math.min(30, (thickness / diameter) * 120));
  const cylinderWidth = Math.min(380, Math.max(200, length * 0.4));

  // Determine pressure glow color
  const getPressureColor = () => {
    if (pressure > 70) return '#ef4444'; // Red
    if (pressure > 40) return '#f59e0b'; // Amber
    return '#06b6d4'; // Cyan
  };

  const pressureColor = getPressureColor();

  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
      {/* Visualizer Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-100">Interactive Cylinder Visualizer</h3>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {configurationName}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time geometry rendering, wall thickness scale & internal hydrogen particle dynamics
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveLayer('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              activeLayer === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Full Assembly
          </button>
          <button
            onClick={() => setActiveLayer('wall')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              activeLayer === 'wall' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Wall Cross-Section
          </button>
        </div>
      </div>

      {/* SVG Cylinder Visualizer Graphic */}
      <div className="relative w-full h-72 flex items-center justify-center bg-slate-950/60 rounded-xl border border-slate-800/80 p-4">
        {/* Glow ambient background */}
        <div 
          className="absolute w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: pressureColor }}
        />

        <svg width="100%" height="100%" viewBox="0 0 600 240" className="overflow-visible">
          <defs>
            {/* Cylinder Metallic / Wall Gradient */}
            <linearGradient id="cylinderBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="30%" stopColor="#334155" />
              <stop offset="50%" stopColor="#64748b" />
              <stop offset="70%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Composite Wrap Gradient */}
            <linearGradient id="compositeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.8" />
            </linearGradient>

            {/* Internal Gas Glow Gradient */}
            <radialGradient id="gasGlowGrad">
              <stop offset="0%" stopColor={pressureColor} stopOpacity="0.45" />
              <stop offset="70%" stopColor={pressureColor} stopOpacity="0.1" />
              <stop offset="100%" stopColor={pressureColor} stopOpacity="0" />
            </radialGradient>

            {/* Particle Glow */}
            <filter id="glowFilter">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Center Coordinates: X=300, Y=120 */}
          {/* Cylinder Main Body Group */}
          <g transform="translate(100, 30)">
            {/* Outer Wall Body */}
            <rect
              x="50"
              y="10"
              width={cylinderWidth}
              height={outerRadius * 2}
              rx="4"
              fill="url(#cylinderBodyGrad)"
              stroke="#475569"
              strokeWidth="2"
            />

            {/* Left Hemisphere / End Cap Dome */}
            <path
              d={`M 50 10 C 10 10, 10 ${10 + outerRadius * 2}, 50 ${10 + outerRadius * 2} Z`}
              fill="url(#cylinderBodyGrad)"
              stroke="#475569"
              strokeWidth="2"
            />

            {/* Right Hemisphere / End Cap Dome */}
            <path
              d={`M ${50 + cylinderWidth} 10 C ${50 + cylinderWidth + 40} 10, ${50 + cylinderWidth + 40} ${10 + outerRadius * 2}, ${50 + cylinderWidth} ${10 + outerRadius * 2} Z`}
              fill="url(#cylinderBodyGrad)"
              stroke="#475569"
              strokeWidth="2"
            />

            {/* If Composite wrap (Type III or Type IV), show outer composite skin */}
            {(configurationName === 'Type III' || configurationName === 'Type IV') && (
              <rect
                x="48"
                y="8"
                width={cylinderWidth + 4}
                height={outerRadius * 2 + 4}
                rx="6"
                fill="url(#compositeGrad)"
                stroke="#06b6d4"
                strokeWidth="1.5"
                strokeDasharray="4,2"
                opacity="0.8"
              />
            )}

            {/* Inner Gas Chamber Cavity (When showing wall section) */}
            <rect
              x="55"
              y={10 + (outerRadius - innerRadius)}
              width={cylinderWidth - 10}
              height={innerRadius * 2}
              rx="2"
              fill="url(#gasGlowGrad)"
              stroke={pressureColor}
              strokeWidth="1"
              strokeDasharray="3,3"
            />

            {/* Animated Hydrogen Particles in Cavity */}
            {[
              { cx: 100, cy: 70, r: 4, dur: '3.2s' },
              { cx: 180, cy: 110, r: 3, dur: '2.5s' },
              { cx: 240, cy: 60, r: 5, dur: '4.1s' },
              { cx: 150, cy: 130, r: 3.5, dur: '3.8s' },
              { cx: 300, cy: 90, r: 4.5, dur: '2.9s' },
              { cx: 210, cy: 140, r: 3, dur: '3.5s' }
            ].map((p, idx) => (
              <g key={idx}>
                <circle cx={p.cx} cy={p.cy} r={p.r} fill="#ffffff" filter="url(#glowFilter)">
                  <animate
                    attributeName="cy"
                    values={`${p.cy - 12}; ${p.cy + 12}; ${p.cy - 12}`}
                    dur={p.dur}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.4; 0.9; 0.4"
                    dur={p.dur}
                    repeatCount="indefinite"
                  />
                </circle>
                <text
                  x={p.cx + 6}
                  y={p.cy + 4}
                  fill="#67e8f9"
                  fontSize="8"
                  fontWeight="bold"
                  opacity="0.8"
                >
                  H₂
                </text>
              </g>
            ))}

            {/* Wall Thickness Callout Arrow */}
            <g transform={`translate(${50 + cylinderWidth / 2}, ${10 + (outerRadius - innerRadius) / 2})`}>
              <line x1="0" y1="0" x2="0" y2={outerRadius - innerRadius} stroke="#06b6d4" strokeWidth="2" markerEnd="url(#arrow)" />
              <text x="12" y={(outerRadius - innerRadius) / 2 + 4} fill="#06b6d4" fontSize="11" fontWeight="bold">
                t = {thickness ? thickness.toFixed(2) : '--'} mm
              </text>
            </g>

            {/* Length Label dimension line */}
            <g transform={`translate(50, ${10 + outerRadius * 2 + 25})`}>
              <line x1="0" y1="0" x2={cylinderWidth} y2="0" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="0" y1="-5" x2="0" y2="5" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1={cylinderWidth} y1="-5" x2={cylinderWidth} y2="5" stroke="#94a3b8" strokeWidth="1.5" />
              <text x={cylinderWidth / 2} y="16" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontWeight="semibold">
                Length L = {length} mm
              </text>
            </g>

            {/* Diameter Label dimension line */}
            <g transform={`translate(${50 + cylinderWidth + 50}, 10)`}>
              <line x1="0" y1="0" x2="0" y2={outerRadius * 2} stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="-5" y1="0" x2="5" y2="0" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="-5" y1={outerRadius * 2} x2="5" y2={outerRadius * 2} stroke="#94a3b8" strokeWidth="1.5" />
              <text x="12" y={outerRadius + 4} fill="#cbd5e1" fontSize="11" fontWeight="semibold">
                Ø D = {diameter} mm
              </text>
              <text x="12" y={outerRadius + 18} fill="#64748b" fontSize="9">
                (R = {(diameter / 2).toFixed(1)} mm)
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Visualizer Footer Technical Telemetry */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Design Pressure</span>
          <div className="flex items-center justify-center gap-1 mt-1 text-slate-100 font-bold text-base">
            <Gauge className="w-4 h-4 text-cyan-400" />
            <span>{pressure} MPa</span>
          </div>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Selected Material</span>
          <span className="text-slate-100 font-bold text-xs mt-1 block truncate" title={materialName}>
            {materialName}
          </span>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Wall Thickness (t)</span>
          <span className="text-cyan-400 font-bold text-base mt-1 block">
            {thickness ? `${thickness.toFixed(2)} mm` : 'N/A'}
          </span>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Internal Radius (R)</span>
          <span className="text-slate-100 font-bold text-base mt-1 block">
            {(diameter / 2).toFixed(1)} mm
          </span>
        </div>
      </div>
    </div>
  );
}
