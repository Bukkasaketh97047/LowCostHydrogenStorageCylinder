package com.hydrogen.cylinder.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "design_requests")
public class CalculationRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime createdAt;

    private String userEmail; // Associated user email owner

    private Double capacityLiters;
    private Double designPressureMpa;
    private Double cylinderDiameterMm;
    private Double cylinderLengthMm;
    private Double efficiencyFactor;
    private String selectedMaterialName;
    private String selectedConfigurationName;
    private String optimizationPriority;

    private Double wallThicknessMm;
    private Double estimatedVolumeM3;
    private Double estimatedMassKg;
    private Double estimatedCostUsd;
    private Boolean isValid;
    private String validationMessage;

    public CalculationRecord() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

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

    public String getSelectedMaterialName() { return selectedMaterialName; }
    public void setSelectedMaterialName(String selectedMaterialName) { this.selectedMaterialName = selectedMaterialName; }

    public String getSelectedConfigurationName() { return selectedConfigurationName; }
    public void setSelectedConfigurationName(String selectedConfigurationName) { this.selectedConfigurationName = selectedConfigurationName; }

    public String getOptimizationPriority() { return optimizationPriority; }
    public void setOptimizationPriority(String optimizationPriority) { this.optimizationPriority = optimizationPriority; }

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
}
