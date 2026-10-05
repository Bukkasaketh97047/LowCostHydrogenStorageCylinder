package com.hydrogen.cylinder.engine;

import com.hydrogen.cylinder.dto.DesignRequest;
import com.hydrogen.cylinder.dto.DesignResult;
import com.hydrogen.cylinder.model.Material;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class CylinderCalculationEngine {

    public DesignResult calculate(DesignRequest request, Material material) {
        DesignResult result = new DesignResult();
        result.setMaterialName(material.getName());
        result.setConfigurationName(request.getConfigurationName());

        double P_MPa = request.getDesignPressureMpa();
        double P_Pa = P_MPa * 1e6;

        double D_mm = request.getCylinderDiameterMm();
        double D_m = D_mm / 1000.0;

        double L_mm = request.getCylinderLengthMm();
        double L_m = L_mm / 1000.0;

        double E = request.getEfficiencyFactor();
        double S_MPa = material.getAllowableStress();
        double S_Pa = S_MPa * 1e6;
        double density = material.getDensity();
        double costPerKg = material.getCostPerKg();

        double denominator_Pa = (S_Pa * E) - (0.6 * P_Pa);

        if (denominator_Pa <= 0) {
            result.setIsValid(false);
            result.setValidationMessage(String.format(
                    "Failure: Material allowable stress condition (SE - 0.6P = %.2f MPa) is <= 0. Material cannot safely sustain design pressure of %.2f MPa.",
                    denominator_Pa / 1e6, P_MPa
            ));
            result.setWallThicknessMm(0.0);
            result.setEstimatedVolumeM3(0.0);
            result.setEstimatedMassKg(0.0);
            result.setEstimatedCostUsd(0.0);
            result.setCalculationSteps(new ArrayList<>());
            return result;
        }

        double R_m = D_m / 2.0;
        double configThicknessFactor = 1.0;
        double effectiveDensity = density;
        double effectiveCostPerKg = costPerKg;
        String configNote = "";

        if ("Type III".equalsIgnoreCase(request.getConfigurationName())) {
            // Composite metal liner + carbon overwrap conceptual approximation
            configThicknessFactor = 0.50; 
            effectiveDensity = (density * 0.3) + (1580.0 * 0.7); // composite blend density
            effectiveCostPerKg = (costPerKg * 0.3) + (38.0 * 0.7); // composite blend cost per kg
            configNote = " (Conceptual Composite Overwrap Factor Applied)";
        } else if ("Type IV".equalsIgnoreCase(request.getConfigurationName())) {
            // Composite plastic liner + carbon overwrap conceptual approximation
            configThicknessFactor = 0.38;
            effectiveDensity = (950.0 * 0.15) + (1580.0 * 0.85); // HDPE + Carbon
            effectiveCostPerKg = (3.5 * 0.15) + (45.0 * 0.85); // HDPE + Carbon cost per kg
            configNote = " (Conceptual Plastic Liner & Carbon Overwrap Factor Applied)";
        }

        // Base Type I calculation formula: t = (P * R) / (S * E - 0.6 * P)
        double t_m = (P_Pa * R_m) / denominator_Pa;
        t_m = t_m * configThicknessFactor;

        double t_mm = t_m * 1000.0;

        // Wall volume: V ≈ π * D * L * t
        double V_m3 = Math.PI * D_m * L_m * t_m;

        // Mass: M = ρ * V
        double M_kg = effectiveDensity * V_m3;

        // Cost: Cost = M * costPerKg
        double cost_USD = M_kg * effectiveCostPerKg;

        result.setIsValid(true);
        result.setValidationMessage("Preliminary design parameters validated successfully. Strength criteria SE - 0.6P > 0 satisfied.");
        result.setWallThicknessMm(t_mm);
        result.setEstimatedVolumeM3(V_m3);
        result.setEstimatedMassKg(M_kg);
        result.setEstimatedCostUsd(cost_USD);

        // Build step-by-step calculation breakdown
        List<DesignResult.CalculationStep> steps = new ArrayList<>();
        steps.add(new DesignResult.CalculationStep(
                "Internal Radius (R)",
                "R = D / 2",
                String.format("%.4f m (%.1f mm)", R_m, D_mm / 2.0),
                "Calculated internal radius from input diameter"
        ));
        steps.add(new DesignResult.CalculationStep(
                "Pressure Conversion (P)",
                "P = P_MPa × 10⁶",
                String.format("%.2f MPa = %.0f Pa", P_MPa, P_Pa),
                "Converted design pressure to Pascals"
        ));
        steps.add(new DesignResult.CalculationStep(
                "Allowable Stress Condition (SE - 0.6P)",
                "Denominator = (S × E) - (0.6 × P)",
                String.format("%.2f MPa", denominator_Pa / 1e6),
                "Verified positive stress safety margin (SE - 0.6P > 0)"
        ));
        steps.add(new DesignResult.CalculationStep(
                "Wall Thickness Calculation (t)",
                "t = (P × R) / (S × E - 0.6 × P)" + configNote,
                String.format("%.2f mm", t_mm),
                "Computed minimum preliminary wall thickness"
        ));
        steps.add(new DesignResult.CalculationStep(
                "Estimated Wall Material Volume (V)",
                "V ≈ π × D × L × t",
                String.format("%.4f m³ (%.2f L)", V_m3, V_m3 * 1000.0),
                "Approximated volume of wall material"
        ));
        steps.add(new DesignResult.CalculationStep(
                "Estimated Shell Mass (M)",
                "M = ρ × V",
                String.format("%.2f kg", M_kg),
                String.format("Calculated mass using density ρ = %.1f kg/m³", effectiveDensity)
        ));
        steps.add(new DesignResult.CalculationStep(
                "Estimated Material Cost",
                "Cost = M × costPerKg",
                String.format("$%.2f USD", cost_USD),
                String.format("Calculated material cost at $%.2f / kg", effectiveCostPerKg)
        ));

        result.setCalculationSteps(steps);
        return result;
    }
}
