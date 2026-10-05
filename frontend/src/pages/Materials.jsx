import React, { useState, useMemo } from 'react';
import {
  Database,
  Search,
  Filter,
  ArrowUpDown,
  FileText,
  Info,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { INITIAL_MATERIALS } from '../services/api';

export default function Materials() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const filteredMaterials = useMemo(() => {
    return INITIAL_MATERIALS.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            m.notes.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'All' || 
                          (typeFilter === 'Metallic' && m.type.includes('Metallic')) ||
                          (typeFilter === 'Composite' && m.type.includes('Composite'));
      return matchesSearch && matchesType;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'density') return a.density - b.density;
      if (sortBy === 'stress') return b.allowableStress - a.allowableStress;
      if (sortBy === 'cost') return a.costPerKg - b.costPerKg;
      return 0;
    });
  }, [searchQuery, typeFilter, sortBy]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-2">
            <Database className="w-7 h-7 text-cyan-400" />
            Engineering Material Database
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Reference physical, mechanical &amp; cost specifications for metallic alloys and fiber composite matrix systems.
          </p>
        </div>
      </div>

      <DisclaimerBanner compact />

      {/* Controls Bar: Search, Filter, Sort */}
      <div className="glass-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search material grade, properties..."
            className="w-full bg-slate-900 text-xs text-slate-200 placeholder-slate-500 rounded-xl pl-9 pr-4 py-2.5 border border-slate-800 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-900 text-slate-200 text-xs rounded-xl px-3 py-2 border border-slate-800 focus:outline-none"
          >
            <option value="All">All Types</option>
            <option value="Metallic">Metallic Alloys</option>
            <option value="Composite">Composites</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 text-xs">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900 text-slate-200 text-xs rounded-xl px-3 py-2 border border-slate-800 focus:outline-none"
          >
            <option value="name">Sort by Name</option>
            <option value="density">Sort by Density (Lowest)</option>
            <option value="stress">Sort by Allowable Stress (Highest)</option>
            <option value="cost">Sort by Cost per kg (Lowest)</option>
          </select>
        </div>
      </div>

      {/* MATERIAL CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMaterials.map((m) => (
          <div
            key={m.id}
            className="glass-panel glass-card-hover rounded-3xl p-6 space-y-4 border border-slate-800 relative overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                    {m.type}
                  </span>
                  <h3 className="text-xl font-bold text-slate-100 mt-0.5">{m.name}</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-slate-900 border border-slate-800 text-emerald-400">
                  ${m.costPerKg.toFixed(2)} / kg
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                {m.notes}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block uppercase">Density (ρ)</span>
                  <span className="font-extrabold text-slate-100 text-sm">{m.density} kg/m³</span>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block uppercase">Allowable Stress (S)</span>
                  <span className="font-extrabold text-cyan-400 text-sm">{m.allowableStress} MPa</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 truncate max-w-[200px]" title={m.source}>
                Source: {m.source}
              </span>

              <button
                onClick={() => setSelectedMaterial(m)}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-bold transition-all text-xs flex items-center gap-1"
              >
                <span>View Details</span>
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DETAIL MODAL */}
      {selectedMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-cyan-400 font-bold uppercase">{selectedMaterial.type}</span>
                <h3 className="text-xl font-bold text-slate-100">{selectedMaterial.name}</h3>
              </div>
              <button
                onClick={() => setSelectedMaterial(null)}
                className="text-slate-400 hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Density (ρ)</span>
                  <span className="font-extrabold text-slate-100 text-base">{selectedMaterial.density} kg/m³</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Allowable Stress (S)</span>
                  <span className="font-extrabold text-cyan-400 text-base">{selectedMaterial.allowableStress} MPa</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Raw Cost per kg</span>
                  <span className="font-extrabold text-emerald-400 text-base">${selectedMaterial.costPerKg.toFixed(2)} USD</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Database Status</span>
                  <span className="font-bold text-slate-200 text-xs">Verified Reference</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-200 mb-1">Engineering Notes &amp; Application</h4>
                <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {selectedMaterial.notes}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-200 mb-1">Standard / Citation Source</h4>
                <p className="text-slate-400 italic bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {selectedMaterial.source}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedMaterial(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
