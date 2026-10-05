package com.hydrogen.cylinder.dto;

import java.util.List;

public class RecommendationResult {

    private String recommendedMaterial;
    private String optimizationPriority;
    private String rationale;
    private Double score;
    private List<MaterialScoringDetail> allMaterialScores;

    public static class MaterialScoringDetail {
        private String materialName;
        private Double score;
        private Double normalizedCost;
        private Double normalizedMass;
        private Double normalizedThickness;
        private Double wallThicknessMm;
        private Double massKg;
        private Double costUsd;

        public MaterialScoringDetail(String materialName, Double score, Double normalizedCost, Double normalizedMass, Double normalizedThickness, Double wallThicknessMm, Double massKg, Double costUsd) {
            this.materialName = materialName;
            this.score = score;
            this.normalizedCost = normalizedCost;
            this.normalizedMass = normalizedMass;
            this.normalizedThickness = normalizedThickness;
            this.wallThicknessMm = wallThicknessMm;
            this.massKg = massKg;
            this.costUsd = costUsd;
        }

        public String getMaterialName() { return materialName; }
        public Double getScore() { return score; }
        public Double getNormalizedCost() { return normalizedCost; }
        public Double getNormalizedMass() { return normalizedMass; }
        public Double getNormalizedThickness() { return normalizedThickness; }
        public Double getWallThicknessMm() { return wallThicknessMm; }
        public Double getMassKg() { return massKg; }
        public Double getCostUsd() { return costUsd; }
    }

    public RecommendationResult() {}

    public String getRecommendedMaterial() { return recommendedMaterial; }
    public void setRecommendedMaterial(String recommendedMaterial) { this.recommendedMaterial = recommendedMaterial; }

    public String getOptimizationPriority() { return optimizationPriority; }
    public void setOptimizationPriority(String optimizationPriority) { this.optimizationPriority = optimizationPriority; }

    public String getRationale() { return rationale; }
    public void setRationale(String rationale) { this.rationale = rationale; }

    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }

    public List<MaterialScoringDetail> getAllMaterialScores() { return allMaterialScores; }
    public void setAllMaterialScores(List<MaterialScoringDetail> allMaterialScores) { this.allMaterialScores = allMaterialScores; }
}
