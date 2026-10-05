package com.hydrogen.cylinder.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;

public class DesignRequest {

    @NotNull(message = "Storage capacity is required")
    @DecimalMin(value = "0.01", message = "Capacity must be greater than 0")
    private Double capacityLiters;

    @NotNull(message = "Design pressure is required")
    @DecimalMin(value = "0.01", message = "Pressure must be greater than 0")
    private Double designPressureMpa;

    @NotNull(message = "Cylinder diameter is required")
    @DecimalMin(value = "1.0", message = "Diameter must be greater than 0")
    private Double cylinderDiameterMm;

    @NotNull(message = "Cylinder length is required")
    @DecimalMin(value = "1.0", message = "Length must be greater than 0")
    private Double cylinderLengthMm;

    @NotNull(message = "Material is required")
    private String materialName;

    @NotNull(message = "Configuration is required")
    private String configurationName; // Type I, Type III, Type IV

    private String optimizationPriority; // Cost, Weight, Balanced

    @NotNull(message = "Efficiency factor is required")
    @DecimalMin(value = "0.01", message = "Efficiency factor must be greater than 0")
    @DecimalMax(value = "1.0", message = "Efficiency factor must be less than or equal to 1")
    private Double efficiencyFactor;

    public DesignRequest() {}

    public Double getCapacityLiters() { return capacityLiters; }
    public void setCapacityLiters(Double capacityLiters) { this.capacityLiters = capacityLiters; }

    public Double getDesignPressureMpa() { return designPressureMpa; }
    public void setDesignPressureMpa(Double designPressureMpa) { this.designPressureMpa = designPressureMpa; }

    public Double getCylinderDiameterMm() { return cylinderDiameterMm; }
    public void setCylinderDiameterMm(Double cylinderDiameterMm) { this.cylinderDiameterMm = cylinderDiameterMm; }

    public Double getCylinderLengthMm() { return cylinderLengthMm; }
    public void setCylinderLengthMm(Double cylinderLengthMm) { this.cylinderLengthMm = cylinderLengthMm; }

    public String getMaterialName() { return materialName; }
    public void setMaterialName(String materialName) { this.materialName = materialName; }

    public String getConfigurationName() { return configurationName; }
    public void setConfigurationName(String configurationName) { this.configurationName = configurationName; }

    public String getOptimizationPriority() { return optimizationPriority; }
    public void setOptimizationPriority(String optimizationPriority) { this.optimizationPriority = optimizationPriority; }

    public Double getEfficiencyFactor() { return efficiencyFactor; }
    public void setEfficiencyFactor(Double efficiencyFactor) { this.efficiencyFactor = efficiencyFactor; }
}
