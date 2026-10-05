import React, { useState } from 'react';
import {
  Calculator as CalcIcon,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowRight,
  Flame
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { calculateDesignApi, saveLocalHistory, INITIAL_MATERIALS, CONFIGURATIONS } from '../services/api';

export default function Calculator({ setActivePage, setCalculationResult, setCurrentRequest }) {
  const [formData, setFormData] = useState({
    capacityLiters: 50,
    designPressureMpa: 35,
    cylinderDiameterMm: 300,
    cylinderLengthMm: 750,
    materialName: 'Aluminium 6061-T6',
    configurationName: 'Type I',
    optimizationPriority: 'Balanced',
    efficiencyFactor: 0.85
  });

  const [errors, setErrors] = useState({});
  const [calculating, setCalculating] = useState(false);

  // Selected material data for real-time validation feedback
  const selectedMat = INITIAL_MATERIALS.find(m => m.name === formData.materialName) || INITIAL_MATERIALS[0];
  const P_Pa = (parseFloat(formData.designPressureMpa) || 0) * 1e6;
  const S_Pa = selectedMat.allowableStress * 1e6;
  const E = parseFloat(formData.efficiencyFactor) || 0.85;
  const SE_minus_06P = (S_Pa * E) - (0.6 * P_Pa);
  const isStressConditionValid = SE_minus_06P > 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.capacityLiters || parseFloat(formData.capacityLiters) <= 0) {
      errs.capacityLiters = 'Capacity must be greater than 0';
    }
    if (!formData.designPressureMpa || parseFloat(formData.designPressureMpa) <= 0) {
      errs.designPressureMpa = 'Design pressure must be greater than 0';
    }
    if (!formData.cylinderDiameterMm || parseFloat(formData.cylinderDiameterMm) <= 0) {
      errs.cylinderDiameterMm = 'Diameter must be greater than 0';
    }
    if (!formData.cylinderLengthMm || parseFloat(formData.cylinderLengthMm) <= 0) {
      errs.cylinderLengthMm = 'Length must be greater than 0';
    }
    if (!formData.efficiencyFactor || parseFloat(formData.efficiencyFactor) <= 0 || parseFloat(formData.efficiencyFactor) > 1.0) {
      errs.efficiencyFactor = 'Efficiency factor must be between 0.01 and 1.0';
    }
    if (!isStressConditionValid) {
      errs.stressCondition = `SE - 0.6P condition failed (${(SE_minus_06P / 1e6).toFixed(2)} MPa <= 0). Material reference stress is insufficient for ${formData.designPressureMpa} MPa pressure.`;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setCalculating(true);
    const result = await calculateDesignApi(formData);
    setCalculating(false);

    if (result) {
      setCalculationResult(result);
      if (setCurrentRequest) setCurrentRequest(formData);
      saveLocalHistory({ ...formData, ...result });
      setActivePage('results');
    }
  };

  const loadPresetDemo = () => {
    setFormData({
      capacityLiters: 50,
      designPressureMpa: 35,
      cylinderDiameterMm: 300,
      cylinderLengthMm: 750,
      materialName: 'Aluminium 6061-T6',
      configurationName: 'Type I',
      optimizationPriority: 'Balanced',
      efficiencyFactor: 0.85
    });
    setErrors({});
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-2">
            <CalcIcon className="w-7 h-7 text-cyan-400" />
            Preliminary Design Calculator
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Input pressure vessel geometry, operating pressure, and candidate material to run numerical calculations.
          </p>
        </div>

        <button
          type="button"
          onClick={loadPresetDemo}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs text-cyan-300 font-semibold transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Load Sample Demo Data (50L / 35MPa)</span>
        </button>
      </div>

      <DisclaimerBanner compact />

      {/* Main Form Panel */}
      <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 sm:p-8 space-y-8 border border-slate-800">
        
        {/* Section A: Vessel Specifications */}
        <div>
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Flame className="w-4 h-4" /> 1. Storage &amp; Geometry Specifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Storage Capacity */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Storage Capacity (Liters) *
              </label>
              <input
                type="number"
                step="any"
                name="capacityLiters"
                value={formData.capacityLiters}
                onChange={handleChange}
                placeholder="e.g. 50"
                className={`w-full bg-slate-900 text-xs text-slate-100 rounded-xl px-4 py-3 border ${
                  errors.capacityLiters ? 'border-red-500/80 focus:ring-red-500/30' : 'border-slate-800 focus:border-cyan-500/50'
                } focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all`}
              />
              {errors.capacityLiters && <span className="text-[11px] text-red-400 mt-1 block">{errors.capacityLiters}</span>}
            </div>

            {/* Design Pressure */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Design Operating Pressure (MPa) *
              </label>
              <input
                type="number"
                step="any"
                name="designPressureMpa"
                value={formData.designPressureMpa}
                onChange={handleChange}
                placeholder="e.g. 35"
                className={`w-full bg-slate-900 text-xs text-slate-100 rounded-xl px-4 py-3 border ${
                  errors.designPressureMpa ? 'border-red-500/80 focus:ring-red-500/30' : 'border-slate-800 focus:border-cyan-500/50'
                } focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all`}
              />
              {errors.designPressureMpa && <span className="text-[11px] text-red-400 mt-1 block">{errors.designPressureMpa}</span>}
              <span className="text-[10px] text-slate-500 mt-1 block">Standard ranges: 35 MPa (~5,000 psi) or 70 MPa (~10,000 psi)</span>
            </div>

            {/* Cylinder Diameter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Cylinder Internal Diameter D (mm) *
              </label>
              <input
                type="number"
                step="any"
                name="cylinderDiameterMm"
                value={formData.cylinderDiameterMm}
                onChange={handleChange}
                placeholder="e.g. 300"
                className={`w-full bg-slate-900 text-xs text-slate-100 rounded-xl px-4 py-3 border ${
                  errors.cylinderDiameterMm ? 'border-red-500/80 focus:ring-red-500/30' : 'border-slate-800 focus:border-cyan-500/50'
                } focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all`}
              />
              {errors.cylinderDiameterMm && <span className="text-[11px] text-red-400 mt-1 block">{errors.cylinderDiameterMm}</span>}
            </div>

            {/* Cylinder Length */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Cylinder Body Length L (mm) *
              </label>
              <input
                type="number"
                step="any"
                name="cylinderLengthMm"
                value={formData.cylinderLengthMm}
                onChange={handleChange}
                placeholder="e.g. 750"
                className={`w-full bg-slate-900 text-xs text-slate-100 rounded-xl px-4 py-3 border ${
                  errors.cylinderLengthMm ? 'border-red-500/80 focus:ring-red-500/30' : 'border-slate-800 focus:border-cyan-500/50'
                } focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all`}
              />
              {errors.cylinderLengthMm && <span className="text-[11px] text-red-400 mt-1 block">{errors.cylinderLengthMm}</span>}
            </div>
          </div>
        </div>

        {/* Section B: Material & Construction Configuration */}
        <div>
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Info className="w-4 h-4" /> 2. Material &amp; Structural Configuration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Material Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select Candidate Material *
              </label>
              <select
                name="materialName"
                value={formData.materialName}
                onChange={handleChange}
                className="w-full bg-slate-900 text-xs text-slate-100 rounded-xl px-4 py-3 border border-slate-800 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all"
              >
                {INITIAL_MATERIALS.map(m => (
                  <option key={m.id} value={m.name}>
                    {m.name} ({m.type}) - S: {m.allowableStress} MPa
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Ref. Allowable Stress S: {selectedMat.allowableStress} MPa | Density: {selectedMat.density} kg/m³
              </span>
            </div>

            {/* Configuration Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select Cylinder Configuration *
              </label>
              <select
                name="configurationName"
                value={formData.configurationName}
                onChange={handleChange}
                className="w-full bg-slate-900 text-xs text-slate-100 rounded-xl px-4 py-3 border border-slate-800 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all"
              >
                {CONFIGURATIONS.map(c => (
                  <option key={c.id} value={c.name}>
                    {c.name} - {c.constructionType}
                  </option>
                ))}
              </select>

              {formData.configurationName !== 'Type I' && (
                <div className="mt-2 p-2.5 bg-amber-950/30 border border-amber-500/30 rounded-xl text-[11px] text-amber-300 flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Conceptual Option Notice:</strong> {formData.configurationName} uses composite overwrap mechanics approximations. Detailed laminate micromechanics are required for manufacturing specs.
                  </span>
                </div>
              )}
            </div>

            {/* Optimization Priority */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Optimization Priority *
              </label>
              <select
                name="optimizationPriority"
                value={formData.optimizationPriority}
                onChange={handleChange}
                className="w-full bg-slate-900 text-xs text-slate-100 rounded-xl px-4 py-3 border border-slate-800 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all"
              >
                <option value="Cost">Cost Priority (70% Cost, 20% Mass, 10% Thickness)</option>
                <option value="Weight">Weight Priority (20% Cost, 70% Mass, 10% Thickness)</option>
                <option value="Balanced">Balanced Priority (40% Cost, 40% Mass, 20% Thickness)</option>
              </select>
            </div>

            {/* Efficiency Factor */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Joint / Weld Efficiency Factor (E) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="1.0"
                name="efficiencyFactor"
                value={formData.efficiencyFactor}
                onChange={handleChange}
                placeholder="e.g. 0.85"
                className={`w-full bg-slate-900 text-xs text-slate-100 rounded-xl px-4 py-3 border ${
                  errors.efficiencyFactor ? 'border-red-500/80 focus:ring-red-500/30' : 'border-slate-800 focus:border-cyan-500/50'
                } focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all`}
              />
              {errors.efficiencyFactor && <span className="text-[11px] text-red-400 mt-1 block">{errors.efficiencyFactor}</span>}
              <span className="text-[10px] text-slate-500 mt-1 block">Seamless / full radiography = 1.0, standard weld = 0.85</span>
            </div>
          </div>
        </div>

        {/* Real-time Stress Safety Verification Banner */}
        <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between transition-all ${
          isStressConditionValid 
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
            : 'bg-red-950/30 border-red-500/40 text-red-300'
        }`}>
          <div className="flex items-center gap-2.5">
            {isStressConditionValid ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <div>
              <strong className="block">
                Barlow Stress Safety Check: SE - 0.6P = {(SE_minus_06P / 1e6).toFixed(2)} MPa
              </strong>
              <span>
                {isStressConditionValid 
                  ? 'Positive stress margin satisfied (SE - 0.6P > 0). Ready for calculation.' 
                  : 'CRITICAL FAILURE: Material stress SE is <= 0.6P. Increase allowable stress or lower design pressure.'}
              </span>
            </div>
          </div>

          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
            isStressConditionValid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {isStressConditionValid ? 'VALID' : 'INVALID'}
          </span>
        </div>

        {errors.stressCondition && (
          <p className="text-xs font-semibold text-red-400">{errors.stressCondition}</p>
        )}

        {/* Submit Action Button */}
        <button
          type="submit"
          disabled={calculating || !isStressConditionValid}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {calculating ? (
            <span>Computing Design Equations...</span>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>[Calculate Design &amp; View Results]</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
