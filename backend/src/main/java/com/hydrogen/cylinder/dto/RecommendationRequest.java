package com.hydrogen.cylinder.dto;

public class RecommendationRequest {
    private Double capacityLiters;
    private Double designPressureMpa;
    private Double cylinderDiameterMm;
    private Double cylinderLengthMm;
    private Double efficiencyFactor;
    private String configurationName;
    private String optimizationPriority; // Cost, Weight, Balanced

    public RecommendationRequest() {}

    public Double getCapacityLiters() { return capacityLiters; }
    public void setCapacityLiters(Double capacityLiters) { this.capacityLiters = capacityLiters; }

    public Double getDesignPressureMpa() { return designPressureMpa; }
    public void setDesignPressureMpa(Double designPressureMpa) { this.designPressureMpa = designPressureMpa; }

    public Double getCylinderDiameterMm() { return cylinderDiameterMm; }
    public void setCylinderDiameterMm(Double cylinderDiameterMm) { this.cylinderDiameterMm = cylinderDiameterMm; }

    public Double getCylinderLengthMm() { return cylinderLengthMm; }
    public void setCylinderLengthMm(Double cylinderLengthMm) { this.cylinderLengthMm = cylinderLengthMm; }

    public Double getEfficiencyFactor() { return efficiencyFactor; }
    public void setEfficiencyFactor(Double efficiencyFactor) { this.efficiencyFactor = efficiencyFactor; }

    public String getConfigurationName() { return configurationName; }
    public void setConfigurationName(String configurationName) { this.configurationName = configurationName; }

    public String getOptimizationPriority() { return optimizationPriority; }
    public void setOptimizationPriority(String optimizationPriority) { this.optimizationPriority = optimizationPriority; }
}
