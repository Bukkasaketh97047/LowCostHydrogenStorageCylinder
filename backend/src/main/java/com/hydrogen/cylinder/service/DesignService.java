package com.hydrogen.cylinder.service;

import com.hydrogen.cylinder.dto.*;
import com.hydrogen.cylinder.engine.CylinderCalculationEngine;
import com.hydrogen.cylinder.engine.RecommendationEngine;
import com.hydrogen.cylinder.model.CalculationRecord;
import com.hydrogen.cylinder.model.Material;
import com.hydrogen.cylinder.model.User;
import com.hydrogen.cylinder.repository.CalculationRecordRepository;
import com.hydrogen.cylinder.repository.MaterialRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class DesignService {

    private final CylinderCalculationEngine calculationEngine;
    private final RecommendationEngine recommendationEngine;
    private final MaterialRepository materialRepository;
    private final CalculationRecordRepository recordRepository;

    public DesignService(CylinderCalculationEngine calculationEngine,
                         RecommendationEngine recommendationEngine,
                         MaterialRepository materialRepository,
                         CalculationRecordRepository recordRepository) {
        this.calculationEngine = calculationEngine;
        this.recommendationEngine = recommendationEngine;
        this.materialRepository = materialRepository;
        this.recordRepository = recordRepository;
    }

    public DesignResult calculateDesign(DesignRequest request) {
        Material material = materialRepository.findByNameIgnoreCase(request.getMaterialName())
                .orElseThrow(() -> new IllegalArgumentException("Material not found: " + request.getMaterialName()));

        DesignResult result = calculationEngine.calculate(request, material);

        // Link calculation to current authenticated user if logged in
        String currentUserEmail = null;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User) {
            currentUserEmail = ((User) auth.getPrincipal()).getEmail();
        }

        CalculationRecord record = new CalculationRecord();
        record.setUserEmail(currentUserEmail);
        record.setCapacityLiters(request.getCapacityLiters());
        record.setDesignPressureMpa(request.getDesignPressureMpa());
        record.setCylinderDiameterMm(request.getCylinderDiameterMm());
        record.setCylinderLengthMm(request.getCylinderLengthMm());
        record.setEfficiencyFactor(request.getEfficiencyFactor());
        record.setSelectedMaterialName(material.getName());
        record.setSelectedConfigurationName(request.getConfigurationName());
        record.setOptimizationPriority(request.getOptimizationPriority() != null ? request.getOptimizationPriority() : "Balanced");
        record.setWallThicknessMm(result.getWallThicknessMm());
        record.setEstimatedVolumeM3(result.getEstimatedVolumeM3());
        record.setEstimatedMassKg(result.getEstimatedMassKg());
        record.setEstimatedCostUsd(result.getEstimatedCostUsd());
        record.setIsValid(result.getIsValid());
        record.setValidationMessage(result.getValidationMessage());

        recordRepository.save(record);

        return result;
    }

    public ComparisonResult compareMaterials(ComparisonRequest request) {
        List<Material> targetMaterials;
        if (request.getMaterialNames() != null && !request.getMaterialNames().isEmpty()) {
            targetMaterials = request.getMaterialNames().stream()
                    .map(name -> materialRepository.findByNameIgnoreCase(name).orElse(null))
                    .filter(m -> m != null)
                    .toList();
        } else {
            targetMaterials = materialRepository.findAll();
        }

        List<DesignResult> results = new ArrayList<>();
        for (Material mat : targetMaterials) {
            DesignRequest singleReq = new DesignRequest();
            singleReq.setCapacityLiters(request.getCapacityLiters());
            singleReq.setDesignPressureMpa(request.getDesignPressureMpa());
            singleReq.setCylinderDiameterMm(request.getCylinderDiameterMm());
            singleReq.setCylinderLengthMm(request.getCylinderLengthMm());
            singleReq.setEfficiencyFactor(request.getEfficiencyFactor());
            singleReq.setMaterialName(mat.getName());
            singleReq.setConfigurationName(request.getConfigurationName());

            results.add(calculationEngine.calculate(singleReq, mat));
        }

        ComparisonResult compRes = new ComparisonResult();
        compRes.setMaterialResults(results);

        List<DesignResult> validResults = results.stream().filter(DesignResult::getIsValid).toList();
        if (!validResults.isEmpty()) {
            DesignResult minCost = validResults.stream().min(Comparator.comparingDouble(DesignResult::getEstimatedCostUsd)).orElse(validResults.get(0));
            DesignResult minWeight = validResults.stream().min(Comparator.comparingDouble(DesignResult::getEstimatedMassKg)).orElse(validResults.get(0));
            DesignResult minThick = validResults.stream().min(Comparator.comparingDouble(DesignResult::getWallThicknessMm)).orElse(validResults.get(0));

            compRes.setPreferredMaterialCost(minCost.getMaterialName());
            compRes.setPreferredMaterialWeight(minWeight.getMaterialName());
            compRes.setPreferredMaterialThickness(minThick.getMaterialName());
        }

        return compRes;
    }

    public RecommendationResult recommendMaterial(RecommendationRequest request) {
        List<Material> allMaterials = materialRepository.findAll();
        List<DesignResult> results = new ArrayList<>();

        for (Material mat : allMaterials) {
            DesignRequest singleReq = new DesignRequest();
            singleReq.setCapacityLiters(request.getCapacityLiters());
            singleReq.setDesignPressureMpa(request.getDesignPressureMpa());
            singleReq.setCylinderDiameterMm(request.getCylinderDiameterMm());
            singleReq.setCylinderLengthMm(request.getCylinderLengthMm());
            singleReq.setEfficiencyFactor(request.getEfficiencyFactor());
            singleReq.setMaterialName(mat.getName());
            singleReq.setConfigurationName(request.getConfigurationName());

            DesignResult res = calculationEngine.calculate(singleReq, mat);
            if (res.getIsValid()) {
                results.add(res);
            }
        }

        String priority = request.getOptimizationPriority() != null ? request.getOptimizationPriority() : "Balanced";
        return recommendationEngine.recommend(results, priority);
    }
}
