package com.hydrogen.cylinder.engine;

import com.hydrogen.cylinder.dto.DesignResult;
import com.hydrogen.cylinder.dto.RecommendationResult;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Component
public class RecommendationEngine {

    public RecommendationResult recommend(List<DesignResult> validResults, String priority) {
        RecommendationResult recResult = new RecommendationResult();
        recResult.setOptimizationPriority(priority);

        if (validResults == null || validResults.isEmpty()) {
            recResult.setRecommendedMaterial("None");
            recResult.setRationale("No valid material options satisfied the stress and safety criteria.");
            recResult.setScore(0.0);
            recResult.setAllMaterialScores(new ArrayList<>());
            return recResult;
        }

        // Determine weights according to priority
        double wC, wW, wT;
        if ("Weight".equalsIgnoreCase(priority) || "Mass".equalsIgnoreCase(priority)) {
            wC = 0.20; wW = 0.70; wT = 0.10;
        } else if ("Cost".equalsIgnoreCase(priority)) {
            wC = 0.70; wW = 0.20; wT = 0.10;
        } else {
            // Balanced (default)
            wC = 0.40; wW = 0.40; wT = 0.20;
        }

        // Find max values for normalization
        double maxCost = validResults.stream().mapToDouble(DesignResult::getEstimatedCostUsd).max().orElse(1.0);
        double maxMass = validResults.stream().mapToDouble(DesignResult::getEstimatedMassKg).max().orElse(1.0);
        double maxThickness = validResults.stream().mapToDouble(DesignResult::getWallThicknessMm).max().orElse(1.0);

        if (maxCost == 0) maxCost = 1.0;
        if (maxMass == 0) maxMass = 1.0;
        if (maxThickness == 0) maxThickness = 1.0;

        List<RecommendationResult.MaterialScoringDetail> scores = new ArrayList<>();

        for (DesignResult res : validResults) {
            double cn = res.getEstimatedCostUsd() / maxCost;
            double wn = res.getEstimatedMassKg() / maxMass;
            double tn = res.getWallThicknessMm() / maxThickness;

            double score = (wC * cn) + (wW * wn) + (wT * tn);

            scores.add(new RecommendationResult.MaterialScoringDetail(
                    res.getMaterialName(),
                    score,
                    cn,
                    wn,
                    tn,
                    res.getWallThicknessMm(),
                    res.getEstimatedMassKg(),
                    res.getEstimatedCostUsd()
            ));
        }

        // Sort by score ascending (lowest score is best)
        scores.sort(Comparator.comparingDouble(RecommendationResult.MaterialScoringDetail::getScore));

        RecommendationResult.MaterialScoringDetail best = scores.get(0);

        recResult.setRecommendedMaterial(best.getMaterialName());
        recResult.setScore(best.getScore());
        recResult.setAllMaterialScores(scores);

        String rationaleText = String.format(
                "%s is preferred according to the '%s' optimization priority (weighted score: %.3f). " +
                "It offers an optimal balance of estimated material cost ($%.2f), shell mass (%.2f kg), and wall thickness (%.2f mm).",
                best.getMaterialName(), priority, best.getScore(), best.getCostUsd(), best.getMassKg(), best.getWallThicknessMm()
        );
        recResult.setRationale(rationaleText);

        return recResult;
    }
}
