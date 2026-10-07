import React, { useState } from 'react';
import {
  Calculator as CalcIcon,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Sparkles
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';
import {
  calculateDesignApi,
  evaluateRecommendation,
  saveLocalHistory,
  INITIAL_MATERIALS
} from '../services/api';

export default function Calculator({ setActivePage, setCalculationResult, setCurrentRequest }) {
  const [formData, setFormData] = useState({
    capacityLiters: 50,
    designPressureMpa: 35,
    cylinderDiameterMm: 300,
    cylinderLengthMm: 750,
    cylinderSizeType: 'Medium',
    maxAllowableLengthMm: 1500,
    maxAllowableDiameterMm: 400,
    materialName: 'Aluminium 6061-T6',
    configurationName: 'Type I',
    optimizationPriority: 'Balanced',
    efficiencyFactor: 0.85
  });

  const [errors, setErrors] = useState({});
  const [calculating, setCalculating] = useState(false);

  // Dynamic automatic recommendation evaluation
  const recEvaluation = evaluateRecommendation(formData);

  // Automatically recommended material and configuration selection
  const activeMaterialName = recEvaluation.recommendedMaterial || formData.materialName;
  const selectedMat = INITIAL_MATERIALS.find(m => m.name === activeMaterialName) || INITIAL_MATERIALS[0];
  
  const P_Pa = (parseFloat(formData.designPressureMpa) || 0) * 1e6;
  const S_Pa = selectedMat.allowableStress * 1e6;
  const E = parseFloat(formData.efficiencyFactor) || 0.85;
  const SE_minus_06P = (S_Pa * E) - (0.6 * P_Pa);
  const isStressConditionValid = recEvaluation.isValid && SE_minus_06P > 0;

  // Real-time geometry constraint checks
  const isLengthExceeded = !!(
    formData.maxAllowableLengthMm &&
    parseFloat(formData.cylinderLengthMm) > parseFloat(formData.maxAllowableLengthMm)
  );

  const isDiameterExceeded = !!(
    formData.maxAllowableDiameterMm &&
    parseFloat(formData.cylinderDiameterMm) > parseFloat(formData.maxAllowableDiameterMm)
  );

  const handleSizeTypeChange = (e) => {
    const sizeType = e.target.value;
    setFormData(prev => {
      let nextState = { ...prev, cylinderSizeType: sizeType };
      if (sizeType === 'Small') {
        nextState.capacityLiters = 15;
        nextState.cylinderDiameterMm = 225;
        nextState.cylinderLengthMm = 500;
      } else if (sizeType === 'Medium') {
        nextState.capacityLiters = 50;
        nextState.cylinderDiameterMm = 300;
        nextState.cylinderLengthMm = 750;
      } else if (sizeType === 'Large') {
        nextState.capacityLiters = 100;
        nextState.cylinderDiameterMm = 400;
        nextState.cylinderLengthMm = 1200;
      }

      const rec = evaluateRecommendation(nextState);
      if (rec.isValid) {
        nextState.materialName = rec.recommendedMaterial;
        nextState.configurationName = rec.recommendedConfiguration;
      }

      return nextState;
    });

    if (errors.cylinderLengthMm) setErrors(prev => ({ ...prev, cylinderLengthMm: null }));
    if (errors.cylinderDiameterMm) setErrors(prev => ({ ...prev, cylinderDiameterMm: null }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      if (['capacityLiters', 'cylinderDiameterMm', 'cylinderLengthMm'].includes(name)) {
        if (prev.cylinderSizeType !== 'Custom') {
          next.cylinderSizeType = 'Custom';
        }
      }

      const rec = evaluateRecommendation(next);
      if (rec.isValid) {
        next.materialName = rec.recommendedMaterial;
        next.configurationName = rec.recommendedConfiguration;
      }

      return next;
    });

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
    } else if (
      formData.maxAllowableDiameterMm &&
      parseFloat(formData.cylinderDiameterMm) > parseFloat(formData.maxAllowableDiameterMm)
    ) {
      errs.cylinderDiameterMm = 'Cylinder diameter exceeds the maximum allowable diameter.';
    }

    if (!formData.cylinderLengthMm || parseFloat(formData.cylinderLengthMm) <= 0) {
      errs.cylinderLengthMm = 'Length must be greater than 0';
    } else if (
      formData.maxAllowableLengthMm &&
      parseFloat(formData.cylinderLengthMm) > parseFloat(formData.maxAllowableLengthMm)
    ) {
      errs.cylinderLengthMm = 'Cylinder body length exceeds the maximum allowable length.';
    }

    if (!formData.maxAllowableLengthMm || parseFloat(formData.maxAllowableLengthMm) <= 0) {
      errs.maxAllowableLengthMm = 'Maximum allowable length must be greater than 0';
    }

    if (!formData.maxAllowableDiameterMm || parseFloat(formData.maxAllowableDiameterMm) <= 0) {
      errs.maxAllowableDiameterMm = 'Maximum allowable diameter must be greater than 0';
    }

    if (!recEvaluation.isValid) {
      errs.stressCondition = recEvaluation.validationError || 'Design safety conditions violated.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isLengthExceeded || isDiameterExceeded) {
      setErrors({
        geometry: isLengthExceeded
          ? 'Design cannot be evaluated because the entered cylinder length exceeds the maximum allowable length.'
          : 'Design cannot be evaluated because the entered cylinder diameter exceeds the maximum allowable diameter.'
      });
      return;
    }

    const rec = evaluateRecommendation(formData);
    if (!rec.isValid) {
      setErrors({ geometry: rec.validationError });
      return;
    }

    const updatedFormData = {
      ...formData,
      materialName: rec.recommendedMaterial,
      configurationName: rec.recommendedConfiguration
    };

    setCalculating(true);
    const result = await calculateDesignApi(updatedFormData);
    setCalculating(false);

    if (result) {
      const fullResult = { ...result, recommendationInfo: rec };
      setCalculationResult(fullResult);
      if (setCurrentRequest) setCurrentRequest(updatedFormData);
      saveLocalHistory({ ...updatedFormData, ...fullResult });
      setActivePage('results');
    }
  };

  const loadPresetDemo = () => {
    const demoData = {
      capacityLiters: 50,
      designPressureMpa: 35,
      cylinderDiameterMm: 300,
      cylinderLengthMm: 750,
      cylinderSizeType: 'Medium',
      maxAllowableLengthMm: 1500,
      maxAllowableDiameterMm: 400,
      materialName: 'Aluminium 6061-T6',
      configurationName: 'Type I',
      optimizationPriority: 'Balanced',
      efficiencyFactor: 0.85
    };

    const rec = evaluateRecommendation(demoData);
    if (rec.isValid) {
      demoData.materialName = rec.recommendedMaterial;
      demoData.configurationName = rec.recommendedConfiguration;
    }

    setFormData(demoData);
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
            Input pressure vessel geometry and operating pressure to run automated engineering calculations.
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
        
        {/* Section 1: Vessel Specifications */}
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

            {/* Design Operating Pressure */}
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
                  errors.cylinderDiameterMm || isDiameterExceeded ? 'border-red-500/80 focus:ring-red-500/30' : 'border-slate-800 focus:border-cyan-500/50'
                } focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all`}
              />
              {(errors.cylinderDiameterMm || isDiameterExceeded) && (
                <span className="text-[11px] text-red-400 mt-1 block font-semibold">
                  {errors.cylinderDiameterMm || 'Cylinder diameter exceeds the maximum allowable diameter.'}
                </span>
              )}
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
                  errors.cylinderLengthMm || isLengthExceeded ? 'border-red-500/80 focus:ring-red-500/30' : 'border-slate-800 focus:border-cyan-500/50'
                } focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all`}
              />
              {(errors.cylinderLengthMm || isLengthExceeded) && (
                <span className="text-[11px] text-red-400 mt-1 block font-semibold">
                  {errors.cylinderLengthMm || 'Cylinder body length exceeds the maximum allowable length.'}
                </span>
              )}
            </div>

            {/* Cylinder Size / Type Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Cylinder Size / Type *
              </label>
              <select
                name="cylinderSizeType"
                value={formData.cylinderSizeType}
                onChange={handleSizeTypeChange}
                className="w-full bg-slate-900 text-xs text-slate-100 rounded-xl px-4 py-3 border border-slate-800 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all"
              >
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
                <option value="Custom">Custom</option>
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Select a design size preset or define custom dimensions.
              </span>
            </div>

            {/* Maximum Allowable Cylinder Length */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Maximum Allowable Cylinder Length (mm) *
              </label>
              <input
                type="number"
                step="any"
                name="maxAllowableLengthMm"
                value={formData.maxAllowableLengthMm}
                onChange={handleChange}
                placeholder="e.g. 1500"
                className={`w-full bg-slate-900 text-xs text-slate-100 rounded-xl px-4 py-3 border ${
                  errors.maxAllowableLengthMm || isLengthExceeded ? 'border-red-500/80 focus:ring-red-500/30' : 'border-slate-800 focus:border-cyan-500/50'
                } focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all`}
              />
              {errors.maxAllowableLengthMm && (
                <span className="text-[11px] text-red-400 mt-1 block font-semibold">{errors.maxAllowableLengthMm}</span>
              )}
              <span className="text-[10px] text-slate-400 mt-1 block">
                Maximum permitted cylinder body length.
              </span>
            </div>

            {/* Maximum Allowable Diameter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Maximum Allowable Diameter (mm)
              </label>
              <input
                type="number"
                step="any"
                name="maxAllowableDiameterMm"
                value={formData.maxAllowableDiameterMm}
                onChange={handleChange}
                placeholder="e.g. 400"
                className={`w-full bg-slate-900 text-xs text-slate-100 rounded-xl px-4 py-3 border ${
                  errors.maxAllowableDiameterMm || isDiameterExceeded ? 'border-red-500/80 focus:ring-red-500/30' : 'border-slate-800 focus:border-cyan-500/50'
                } focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all`}
              />
              {errors.maxAllowableDiameterMm && (
                <span className="text-[11px] text-red-400 mt-1 block font-semibold">{errors.maxAllowableDiameterMm}</span>
              )}
              <span className="text-[10px] text-slate-400 mt-1 block">
                Maximum permitted internal cylinder diameter.
              </span>
            </div>
          </div>
        </div>

        {/* Real-time Stress Safety Verification & Recommendation Banner */}
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
              <strong className="block flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Automatic Recommendation: {recEvaluation.recommendedMaterial || 'None'} ({recEvaluation.recommendedConfiguration || 'N/A'})
              </strong>
              <span>
                {isStressConditionValid 
                  ? `Barlow stress safety satisfied (SE - 0.6P = ${(SE_minus_06P / 1e6).toFixed(2)} MPa > 0). Ready to compute design.` 
                  : (recEvaluation.validationError || 'CRITICAL FAILURE: Material stress SE is <= 0.6P or geometry limit exceeded.')}
              </span>
            </div>
          </div>

          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
            isStressConditionValid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {isStressConditionValid ? 'VALID' : 'INVALID'}
          </span>
        </div>

        {errors.geometry && (
          <p className="text-xs font-semibold text-red-400">{errors.geometry}</p>
        )}
        {errors.stressCondition && (
          <p className="text-xs font-semibold text-red-400">{errors.stressCondition}</p>
        )}

        {/* Submit Action Button */}
        <button
          type="submit"
          disabled={calculating || !isStressConditionValid || isLengthExceeded || isDiameterExceeded}
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
