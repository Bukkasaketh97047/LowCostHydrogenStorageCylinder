package com.hydrogen.cylinder.dto;

import java.util.List;

public class DesignResult {

    private String materialName;
    private String configurationName;
    private Double wallThicknessMm;
    private Double estimatedVolumeM3;
    private Double estimatedMassKg;
    private Double estimatedCostUsd;
    private Boolean isValid;
    private String validationMessage;
    private String disclaimer;

    // Calculation breakdown steps
    private List<CalculationStep> calculationSteps;

    public static class CalculationStep {
        private String name;
        private String formula;
        private String value;
        private String description;

        public CalculationStep(String name, String formula, String value, String description) {
            this.name = name;
            this.formula = formula;
            this.value = value;
            this.description = description;
        }

        public String getName() { return name; }
        public String getFormula() { return formula; }
        public String getValue() { return value; }
        public String getDescription() { return description; }
    }

    public DesignResult() {
        this.disclaimer = "IMPORTANT: This application provides preliminary engineering estimates for academic and decision-support purposes. It is not a certified pressure-vessel design tool and must not be used as a final manufacturing or safety specification.";
    }

    public String getMaterialName() { return materialName; }
    public void setMaterialName(String materialName) { this.materialName = materialName; }

    public String getConfigurationName() { return configurationName; }
    public void setConfigurationName(String configurationName) { this.configurationName = configurationName; }

    public Double getWallThicknessMm() { return wallThicknessMm; }
    public void setWallThicknessMm(Double wallThicknessMm) { this.wallThicknessMm = wallThicknessMm; }

    public Double getEstimatedVolumeM3() { return estimatedVolumeM3; }
    public void setEstimatedVolumeM3(Double estimatedVolumeM3) { this.estimatedVolumeM3 = estimatedVolumeM3; }

    public Double getEstimatedMassKg() { return estimatedMassKg; }
    public void setEstimatedMassKg(Double estimatedMassKg) { this.estimatedMassKg = estimatedMassKg; }

    public Double getEstimatedCostUsd() { return estimatedCostUsd; }
    public void setEstimatedCostUsd(Double estimatedCostUsd) { this.estimatedCostUsd = estimatedCostUsd; }

    public Boolean getIsValid() { return isValid; }
    public void setIsValid(Boolean isValid) { this.isValid = isValid; }

    public String getValidationMessage() { return validationMessage; }
    public void setValidationMessage(String validationMessage) { this.validationMessage = validationMessage; }

    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }

    public List<CalculationStep> getCalculationSteps() { return calculationSteps; }
    public void setCalculationSteps(List<CalculationStep> calculationSteps) { this.calculationSteps = calculationSteps; }
}
