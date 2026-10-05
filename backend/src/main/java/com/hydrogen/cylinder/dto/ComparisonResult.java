package com.hydrogen.cylinder.dto;

import java.util.List;

public class ComparisonResult {
    private List<DesignResult> materialResults;
    private String preferredMaterialCost;
    private String preferredMaterialWeight;
    private String preferredMaterialThickness;

    public ComparisonResult() {}

    public List<DesignResult> getMaterialResults() { return materialResults; }
    public void setMaterialResults(List<DesignResult> materialResults) { this.materialResults = materialResults; }

    public String getPreferredMaterialCost() { return preferredMaterialCost; }
    public void setPreferredMaterialCost(String preferredMaterialCost) { this.preferredMaterialCost = preferredMaterialCost; }

    public String getPreferredMaterialWeight() { return preferredMaterialWeight; }
    public void setPreferredMaterialWeight(String preferredMaterialWeight) { this.preferredMaterialWeight = preferredMaterialWeight; }

    public String getPreferredMaterialThickness() { return preferredMaterialThickness; }
    public void setPreferredMaterialThickness(String preferredMaterialThickness) { this.preferredMaterialThickness = preferredMaterialThickness; }
}
