import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb({ activePage, setActivePage }) {
  const pageNames = {
    home: 'Home / Overview',
    dashboard: 'Engineering Dashboard',
    calculator: 'Design Calculator',
    materials: 'Material Database',
    comparison: 'Material Comparison',
    recommendation: 'Recommendation Engine',
    sensitivity: 'Sensitivity Analysis',
    history: 'Calculation History',
    methodology: 'Calculation Methodology',
    architecture: 'System Architecture',
    about: 'About & Project Scope'
  };

  const name = pageNames[activePage] || 'Dashboard';

  return (
    <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
      <button
        onClick={() => setActivePage('home')}
        className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>System</span>
      </button>
      <ChevronRight className="w-3 h-3 text-slate-600" />
      <span className="font-semibold text-slate-200">{name}</span>
    </div>
  );
}
