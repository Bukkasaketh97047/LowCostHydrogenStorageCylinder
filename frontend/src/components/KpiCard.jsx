import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function KpiCard({ title, value, unit, icon: Icon, trend, trendLabel, subtitle, color = 'cyan' }) {
  const colorMap = {
    cyan: 'from-cyan-500/20 to-blue-600/10 text-cyan-400 border-cyan-500/30',
    blue: 'from-blue-500/20 to-indigo-600/10 text-blue-400 border-blue-500/30',
    emerald: 'from-emerald-500/20 to-teal-600/10 text-emerald-400 border-emerald-500/30',
    amber: 'from-amber-500/20 to-orange-600/10 text-amber-400 border-amber-500/30',
    purple: 'from-purple-500/20 to-indigo-600/10 text-purple-400 border-purple-500/30'
  };

  const currentTheme = colorMap[color] || colorMap.cyan;

  return (
    <div className="glass-panel glass-card-hover rounded-2xl p-5 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${currentTheme} rounded-full blur-2xl opacity-20 -mr-10 -mt-10 group-hover:opacity-40 transition-opacity`} />
      
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            {title}
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold tracking-tight text-slate-100">
              {value}
            </span>
            {unit && <span className="text-sm font-semibold text-cyan-400">{unit}</span>}
          </div>
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl bg-slate-800/80 border border-slate-700/50 ${currentTheme.split(' ')[2]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
        {subtitle ? (
          <span className="text-slate-400">{subtitle}</span>
        ) : (
          <div className="flex items-center gap-1.5 text-slate-400">
            {trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
            {trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-cyan-400" />}
            {trend === 'neutral' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
            <span>{trendLabel || 'Nominal preliminary parameter'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
