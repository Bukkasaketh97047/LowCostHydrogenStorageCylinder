const API_BASE_URL = '/api';

export function getAuthHeaders() {
  const token = localStorage.getItem('hydro_token') || sessionStorage.getItem('hydro_token');
  return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

// Pre-seeded materials
export const INITIAL_MATERIALS = [
  {
    id: 1,
    name: 'Aluminium 6061-T6',
    type: 'Metallic (Light Alloy)',
    density: 2700,
    allowableStress: 240,
    costPerKg: 4.50,
    source: 'ASM Material Data / Engineering Handbooks',
    notes: 'Standard aerospace and automotive structural aluminum alloy. High corrosion resistance and lightweight.'
  },
  {
    id: 2,
    name: '304 Stainless Steel',
    type: 'Metallic (Austenitic Steel)',
    density: 8000,
    allowableStress: 205,
    costPerKg: 3.20,
    source: 'ASME Boiler & Pressure Vessel Code (BPVC)',
    notes: 'High ductility, excellent toughness and hydrogen embrittlement resistance, but heavy weight.'
  },
  {
    id: 3,
    name: 'E-Glass/Epoxy',
    type: 'Composite (Glass Fiber)',
    density: 2000,
    allowableStress: 450,
    costPerKg: 12.50,
    source: 'Composite Materials Handbook (MIL-HDBK-17)',
    notes: 'Moderate strength composite material with good dielectric properties and low raw material cost.'
  },
  {
    id: 4,
    name: 'Carbon/Epoxy',
    type: 'Composite (Carbon Fiber)',
    density: 1550,
    allowableStress: 750,
    costPerKg: 42.00,
    source: 'Torayca T700 / Advanced Composite Specifications',
    notes: 'Ultra-high strength-to-weight ratio. Preferred for lightweight high-pressure Type III & Type IV storage.'
  }
];

export const CONFIGURATIONS = [
  {
    id: 1,
    name: 'Type I',
    description: 'Monolithic all-metal pressure vessel (Aluminium alloy or Steel). Heavy weight, lowest manufacturing complexity.',
    constructionType: 'All-metal construction',
    isConceptualOnly: false
  },
  {
    id: 2,
    name: 'Type III',
    description: 'Seamless thin metallic liner (Aluminum or Steel) fully overwrapped with carbon composite filament winding.',
    constructionType: 'Metal Liner + Full Composite Wrap',
    isConceptualOnly: true
  },
  {
    id: 3,
    name: 'Type IV',
    description: 'Non-metallic high-density polyethylene (HDPE) liner fully overwrapped with carbon composite filament winding.',
    constructionType: 'Polymer Liner + Full Composite Wrap',
    isConceptualOnly: true
  }
];

// Fallback Calculation Engine in JS
export function runLocalCalculation(request, materialList = INITIAL_MATERIALS) {
  const material = materialList.find(m => m.name.toLowerCase() === request.materialName.toLowerCase()) || materialList[0];
  
  const P_MPa = parseFloat(request.designPressureMpa);
  const P_Pa = P_MPa * 1e6;

  const D_mm = parseFloat(request.cylinderDiameterMm);
  const D_m = D_mm / 1000.0;

  const L_mm = parseFloat(request.cylinderLengthMm);
  const L_m = L_mm / 1000.0;

  const E = parseFloat(request.efficiencyFactor);
  const S_MPa = material.allowableStress;
  const S_Pa = S_MPa * 1e6;
  const density = material.density;
  const costPerKg = material.costPerKg;

  const denominator_Pa = (S_Pa * E) - (0.6 * P_Pa);

  if (denominator_Pa <= 0) {
    return {
      materialName: material.name,
      configurationName: request.configurationName,
      isValid: false,
      validationMessage: `Failure: Material allowable stress condition (SE - 0.6P = ${(denominator_Pa / 1e6).toFixed(2)} MPa) is <= 0. Material cannot safely sustain design pressure of ${P_MPa} MPa.`,
      wallThicknessMm: 0,
      estimatedVolumeM3: 0,
      estimatedMassKg: 0,
      estimatedCostUsd: 0,
      disclaimer: "IMPORTANT: This application provides preliminary engineering estimates for academic and decision-support purposes.",
      calculationSteps: []
    };
  }

  const R_m = D_m / 2.0;
  let configThicknessFactor = 1.0;
  let effectiveDensity = density;
  let effectiveCostPerKg = costPerKg;
  let configNote = "";

  if (request.configurationName === 'Type III') {
    configThicknessFactor = 0.50;
    effectiveDensity = (density * 0.3) + (1580.0 * 0.7);
    effectiveCostPerKg = (costPerKg * 0.3) + (38.0 * 0.7);
    configNote = " (Conceptual Composite Overwrap Factor Applied)";
  } else if (request.configurationName === 'Type IV') {
    configThicknessFactor = 0.38;
    effectiveDensity = (950.0 * 0.15) + (1580.0 * 0.85);
    effectiveCostPerKg = (3.5 * 0.15) + (45.0 * 0.85);
    configNote = " (Conceptual Plastic Liner & Carbon Overwrap Factor Applied)";
  }

  let t_m = (P_Pa * R_m) / denominator_Pa;
  t_m = t_m * configThicknessFactor;

  const t_mm = t_m * 1000.0;
  const V_m3 = Math.PI * D_m * L_m * t_m;
  const M_kg = effectiveDensity * V_m3;
  const cost_USD = M_kg * effectiveCostPerKg;

  const steps = [
    { name: 'Internal Radius (R)', formula: 'R = D / 2', value: `${R_m.toFixed(4)} m (${(D_mm/2).toFixed(1)} mm)`, description: 'Calculated internal radius from input diameter' },
    { name: 'Pressure Conversion (P)', formula: 'P = P_MPa × 10⁶', value: `${P_MPa.toFixed(2)} MPa = ${P_Pa.toLocaleString()} Pa`, description: 'Converted design pressure to Pascals' },
    { name: 'Allowable Stress Condition (SE - 0.6P)', formula: 'Denominator = (S × E) - (0.6 × P)', value: `${(denominator_Pa / 1e6).toFixed(2)} MPa`, description: 'Verified positive stress safety margin (SE - 0.6P > 0)' },
    { name: 'Wall Thickness Calculation (t)', formula: 't = (P × R) / (S × E - 0.6 × P)' + configNote, value: `${t_mm.toFixed(2)} mm`, description: 'Computed minimum preliminary wall thickness' },
    { name: 'Estimated Wall Material Volume (V)', formula: 'V ≈ π × D × L × t', value: `${V_m3.toFixed(4)} m³ (${(V_m3 * 1000).toFixed(2)} L)`, description: 'Approximated volume of wall material' },
    { name: 'Estimated Shell Mass (M)', formula: 'M = ρ × V', value: `${M_kg.toFixed(2)} kg`, description: `Calculated mass using density ρ = ${effectiveDensity.toFixed(1)} kg/m³` },
    { name: 'Estimated Material Cost', formula: 'Cost = M × costPerKg', value: `$${cost_USD.toFixed(2)} USD`, description: `Calculated material cost at $${effectiveCostPerKg.toFixed(2)} / kg` }
  ];

  return {
    materialName: material.name,
    configurationName: request.configurationName,
    isValid: true,
    validationMessage: "Preliminary design parameters validated successfully. Strength criteria SE - 0.6P > 0 satisfied.",
    wallThicknessMm: t_mm,
    estimatedVolumeM3: V_m3,
    estimatedMassKg: M_kg,
    estimatedCostUsd: cost_USD,
    disclaimer: "IMPORTANT: This application provides preliminary engineering estimates for academic and decision-support purposes.",
    calculationSteps: steps
  };
}

// Auth API Calls
export async function registerApi(formData) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return data;
}

export async function loginApi(credentials) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Invalid email or password');
  return data;
}

export async function logoutApi() {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
  } catch (e) {}
}

export async function fetchCurrentUserApi() {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) return null;
  return await res.json();
}

export async function forgotPasswordApi(email) {
  const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return await res.json();
}

export async function resetPasswordApi(payload) {
  const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Password reset failed');
  return data;
}



// Admin APIs
export async function fetchAdminUsersApi() {
  const res = await fetch(`${API_BASE_URL}/admin/users`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch admin users');
  return await res.json();
}

export async function toggleAdminUserStatusApi(id) {
  const res = await fetch(`${API_BASE_URL}/admin/users/${id}/status`, {
    method: 'PUT',
    headers: getAuthHeaders()
  });
  return await res.json();
}

export async function updateAdminUserRoleApi(id, role) {
  const res = await fetch(`${API_BASE_URL}/admin/users/${id}/role`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ role })
  });
  return await res.json();
}

export async function fetchAdminStatsApi() {
  const res = await fetch(`${API_BASE_URL}/admin/stats`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch admin stats');
  return await res.json();
}

// REST API calls for Engineering Design
export async function fetchMaterials() {
  try {
    const res = await fetch(`${API_BASE_URL}/materials`);
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (e) {
    return INITIAL_MATERIALS;
  }
}

export async function fetchConfigurations() {
  try {
    const res = await fetch(`${API_BASE_URL}/configurations`);
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (e) {
    return CONFIGURATIONS;
  }
}

export async function calculateDesignApi(requestData) {
  try {
    const res = await fetch(`${API_BASE_URL}/design/calculate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestData)
    });
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (e) {
    return runLocalCalculation(requestData);
  }
}

export async function compareMaterialsApi(requestData) {
  try {
    const res = await fetch(`${API_BASE_URL}/design/compare`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestData)
    });
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (e) {
    const materials = INITIAL_MATERIALS;
    const results = materials.map(m => runLocalCalculation({ ...requestData, materialName: m.name }));
    const validResults = results.filter(r => r.isValid);
    
    let preferredCost = validResults.length ? validResults.reduce((min, r) => r.estimatedCostUsd < min.estimatedCostUsd ? r : min).materialName : 'None';
    let preferredWeight = validResults.length ? validResults.reduce((min, r) => r.estimatedMassKg < min.estimatedMassKg ? r : min).materialName : 'None';
    let preferredThickness = validResults.length ? validResults.reduce((min, r) => r.wallThicknessMm < min.wallThicknessMm ? r : min).materialName : 'None';

    return {
      materialResults: results,
      preferredMaterialCost: preferredCost,
      preferredMaterialWeight: preferredWeight,
      preferredMaterialThickness: preferredThickness
    };
  }
}

export async function recommendMaterialApi(requestData) {
  try {
    const res = await fetch(`${API_BASE_URL}/design/recommend`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestData)
    });
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (e) {
    const priority = requestData.optimizationPriority || 'Balanced';
    const materials = INITIAL_MATERIALS;
    const validResults = materials.map(m => runLocalCalculation({ ...requestData, materialName: m.name })).filter(r => r.isValid);
    
    if (validResults.length === 0) {
      return { recommendedMaterial: 'None', rationale: 'No valid materials satisfied stress safety requirements.', score: 0, allMaterialScores: [] };
    }

    let wC = 0.4, wW = 0.4, wT = 0.2;
    if (priority === 'Cost') { wC = 0.7; wW = 0.2; wT = 0.1; }
    else if (priority === 'Weight' || priority === 'Mass') { wC = 0.2; wW = 0.7; wT = 0.1; }

    const maxCost = Math.max(...validResults.map(r => r.estimatedCostUsd)) || 1;
    const maxMass = Math.max(...validResults.map(r => r.estimatedMassKg)) || 1;
    const maxThickness = Math.max(...validResults.map(r => r.wallThicknessMm)) || 1;

    const scores = validResults.map(r => {
      const cn = r.estimatedCostUsd / maxCost;
      const wn = r.estimatedMassKg / maxMass;
      const tn = r.wallThicknessMm / maxThickness;
      const score = (wC * cn) + (wW * wn) + (wT * tn);
      return {
        materialName: r.materialName,
        score,
        normalizedCost: cn,
        normalizedMass: wn,
        normalizedThickness: tn,
        wallThicknessMm: r.wallThicknessMm,
        massKg: r.estimatedMassKg,
        costUsd: r.estimatedCostUsd
      };
    });

    scores.sort((a, b) => a.score - b.score);
    const best = scores[0];

    return {
      recommendedMaterial: best.materialName,
      optimizationPriority: priority,
      score: best.score,
      rationale: `${best.materialName} is preferred according to the '${priority}' optimization priority (weighted score: ${best.score.toFixed(3)}). It offers an optimal balance of estimated cost ($${best.costUsd.toFixed(2)}), mass (${best.massKg.toFixed(2)} kg), and thickness (${best.wallThicknessMm.toFixed(2)} mm).`,
      allMaterialScores: scores
    };
  }
}

export function evaluateRecommendation(requestData) {
  const L_mm = parseFloat(requestData.cylinderLengthMm) || 0;
  const maxL_mm = parseFloat(requestData.maxAllowableLengthMm) || 1500;
  const D_mm = parseFloat(requestData.cylinderDiameterMm) || 0;
  const maxD_mm = parseFloat(requestData.maxAllowableDiameterMm) || 400;

  if (L_mm > maxL_mm) {
    return {
      isValid: false,
      validationError: `Design cannot be evaluated because the entered cylinder length (${L_mm} mm) exceeds the maximum allowable length (${maxL_mm} mm).`
    };
  }

  if (D_mm > maxD_mm) {
    return {
      isValid: false,
      validationError: `Design cannot be evaluated because the entered cylinder diameter (${D_mm} mm) exceeds the maximum allowable diameter (${maxD_mm} mm).`
    };
  }

  const priority = requestData.optimizationPriority || 'Balanced';
  const P_MPa = parseFloat(requestData.designPressureMpa) || 35;
  const materials = INITIAL_MATERIALS;

  const allResults = materials.map(m => {
    const res = runLocalCalculation({ ...requestData, materialName: m.name });
    return { material: m, result: res };
  });

  const validCandidates = allResults.filter(item => item.result.isValid);
  const invalidCandidates = allResults.filter(item => !item.result.isValid);

  if (validCandidates.length === 0) {
    return {
      isValid: false,
      validationError: `No candidate materials satisfied the stress safety requirement (SE - 0.6P > 0) for ${P_MPa} MPa pressure.`
    };
  }

  let wC = 0.4, wW = 0.4, wT = 0.2;
  if (priority === 'Cost') { wC = 0.7; wW = 0.2; wT = 0.1; }
  else if (priority === 'Weight' || priority === 'Mass') { wC = 0.2; wW = 0.7; wT = 0.1; }

  const maxCost = Math.max(...validCandidates.map(c => c.result.estimatedCostUsd)) || 1;
  const maxMass = Math.max(...validCandidates.map(c => c.result.estimatedMassKg)) || 1;
  const maxThickness = Math.max(...validCandidates.map(c => c.result.wallThicknessMm)) || 1;

  const scores = validCandidates.map(c => {
    const r = c.result;
    const cn = r.estimatedCostUsd / maxCost;
    const wn = r.estimatedMassKg / maxMass;
    const tn = r.wallThicknessMm / maxThickness;
    const score = (wC * cn) + (wW * wn) + (wT * tn);
    return {
      materialName: r.materialName,
      materialType: c.material.type,
      score,
      normalizedCost: cn,
      normalizedMass: wn,
      normalizedThickness: tn,
      wallThicknessMm: r.wallThicknessMm,
      massKg: r.estimatedMassKg,
      costUsd: r.estimatedCostUsd
    };
  });

  scores.sort((a, b) => a.score - b.score);
  const bestMaterial = scores[0].materialName;

  let recommendedConfig = 'Type I';
  let isConceptualConfig = false;

  const isMetallic = bestMaterial.includes('Aluminium') || bestMaterial.includes('Steel');

  if (P_MPa <= 35 && isMetallic && priority !== 'Weight') {
    recommendedConfig = 'Type I';
    isConceptualConfig = false;
  } else if (bestMaterial.includes('Carbon') || priority === 'Weight') {
    recommendedConfig = 'Type IV';
    isConceptualConfig = true;
  } else {
    recommendedConfig = 'Type III';
    isConceptualConfig = true;
  }

  const rationale = `Selected based on the entered storage capacity (${requestData.capacityLiters} L), design pressure (${P_MPa} MPa), cylinder geometry (D=${D_mm} mm, L=${L_mm} mm), material properties, estimated shell mass (${scores[0].massKg.toFixed(2)} kg), estimated material cost ($${scores[0].costUsd.toFixed(2)}) and selected '${priority}' optimization priority.`;

  return {
    isValid: true,
    recommendedMaterial: bestMaterial,
    recommendedConfiguration: recommendedConfig,
    isConceptualConfig,
    optimizationPriority: priority,
    rationale,
    allMaterialScores: scores,
    invalidCandidates: invalidCandidates.map(c => ({
      materialName: c.material.name,
      reason: 'Not suitable for preliminary calculation (SE - 0.6P <= 0 condition failed)'
    })),
    alternativeMaterials: {
      recommended: bestMaterial,
      metallicAlternatives: scores.filter(s => s.materialName !== bestMaterial && !s.materialType.includes('Composite')),
      conceptualAlternatives: [
        { name: 'E-Glass/Epoxy', note: 'Conceptual — detailed composite mechanics not implemented.' },
        { name: 'Carbon/Epoxy', note: 'Conceptual — detailed composite mechanics not implemented.' },
        { name: 'Type III (Metal Liner + Composite Overwrap)', note: 'Conceptual — detailed composite mechanics not implemented.' },
        { name: 'Type IV (Polymer Liner + Composite Overwrap)', note: 'Conceptual — detailed composite mechanics not implemented.' }
      ]
    }
  };
}

export async function fetchHistoryApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/history`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (e) {
    const saved = localStorage.getItem('hydro_history');
    return saved ? JSON.parse(saved) : [];
  }
}

export function saveLocalHistory(record) {
  try {
    const existing = JSON.parse(localStorage.getItem('hydro_history') || '[]');
    const newRecord = { ...record, id: Date.now(), createdAt: new Date().toISOString() };
    const updated = [newRecord, ...existing];
    localStorage.setItem('hydro_history', JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}

export function deleteLocalHistory(id) {
  try {
    const existing = JSON.parse(localStorage.getItem('hydro_history') || '[]');
    const updated = existing.filter(r => r.id !== id);
    localStorage.setItem('hydro_history', JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}
