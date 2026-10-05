import React, { useState, useEffect, useMemo } from 'react';
import {
  History as HistIcon,
  Trash2,
  Play,
  Search,
  RotateCcw,
  Calendar,
  Layers,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { fetchHistoryApi, deleteLocalHistory } from '../services/api';

export default function History({ setActivePage, setCalculationResult, setCurrentRequest }) {
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadHist() {
      const data = await fetchHistoryApi();
      setRecords(data);
    }
    loadHist();
  }, []);

  const handleDelete = (id) => {
    const updated = deleteLocalHistory(id);
    setRecords(updated);
  };

  const handleRecalculate = (rec) => {
    if (setCurrentRequest) {
      setCurrentRequest({
        capacityLiters: rec.capacityLiters || 50,
        designPressureMpa: rec.designPressureMpa || 35,
        cylinderDiameterMm: rec.cylinderDiameterMm || 300,
        cylinderLengthMm: rec.cylinderLengthMm || 750,
        efficiencyFactor: rec.efficiencyFactor || 0.85,
        materialName: rec.selectedMaterialName || rec.materialName || 'Aluminium 6061-T6',
        configurationName: rec.selectedConfigurationName || rec.configurationName || 'Type I',
        optimizationPriority: rec.optimizationPriority || 'Balanced'
      });
    }
    setActivePage('calculator');
  };

  const handleView = (rec) => {
    if (setCalculationResult) setCalculationResult(rec);
    if (setCurrentRequest) {
      setCurrentRequest({
        capacityLiters: rec.capacityLiters || 50,
        designPressureMpa: rec.designPressureMpa || 35,
        cylinderDiameterMm: rec.cylinderDiameterMm || 300,
        cylinderLengthMm: rec.cylinderLengthMm || 750,
        efficiencyFactor: rec.efficiencyFactor || 0.85,
        materialName: rec.selectedMaterialName || rec.materialName || 'Aluminium 6061-T6',
        configurationName: rec.selectedConfigurationName || rec.configurationName || 'Type I',
        optimizationPriority: rec.optimizationPriority || 'Balanced'
      });
    }
    setActivePage('results');
  };

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const mat = (r.selectedMaterialName || r.materialName || '').toLowerCase();
      const cfg = (r.selectedConfigurationName || r.configurationName || '').toLowerCase();
      const q = searchQuery.toLowerCase();
      return mat.includes(q) || cfg.includes(q);
    });
  }, [records, searchQuery]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-2">
            <HistIcon className="w-7 h-7 text-cyan-400" />
            Calculation History &amp; Audit Trail
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Persisted history log of design calculation iterations, geometry inputs, and numerical output records.
          </p>
        </div>
      </div>

      <DisclaimerBanner compact />

      {/* Search Bar */}
      <div className="glass-panel rounded-2xl p-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter calculation history by material or configuration..."
            className="w-full bg-slate-900 text-xs text-slate-200 placeholder-slate-500 rounded-xl pl-9 pr-4 py-2.5 border border-slate-800 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* HISTORY TABLE */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <th className="p-3 font-semibold">Timestamp</th>
                <th className="p-3 font-semibold">Material Grade</th>
                <th className="p-3 font-semibold">Config</th>
                <th className="p-3 font-semibold">Capacity</th>
                <th className="p-3 font-semibold">Pressure</th>
                <th className="p-3 font-semibold">Thickness</th>
                <th className="p-3 font-semibold">Mass</th>
                <th className="p-3 font-semibold">Est. Cost</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((r, idx) => (
                  <tr key={r.id || idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3 text-slate-400 font-mono text-[11px]">
                      {r.createdAt ? new Date(r.createdAt).toLocaleString() : 'Recent'}
                    </td>
                    <td className="p-3 font-bold text-cyan-300">
                      {r.selectedMaterialName || r.materialName}
                    </td>
                    <td className="p-3 text-slate-300">
                      {r.selectedConfigurationName || r.configurationName}
                    </td>
                    <td className="p-3 text-slate-300">{r.capacityLiters} L</td>
                    <td className="p-3 text-slate-300">{r.designPressureMpa} MPa</td>
                    <td className="p-3 font-bold text-slate-100">
                      {r.wallThicknessMm ? `${r.wallThicknessMm.toFixed(2)} mm` : '--'}
                    </td>
                    <td className="p-3 text-slate-300">
                      {r.estimatedMassKg ? `${r.estimatedMassKg.toFixed(2)} kg` : '--'}
                    </td>
                    <td className="p-3 font-bold text-emerald-400">
                      {r.estimatedCostUsd ? `$${r.estimatedCostUsd.toFixed(2)}` : '--'}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleView(r)}
                          className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 rounded-lg text-[11px] font-bold"
                          title="View Results"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleRecalculate(r)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-bold"
                          title="Recalculate with inputs"
                        >
                          Rerun
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded-lg"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-400">
                    No calculation history records found. Run a design calculation to record historical logs.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
