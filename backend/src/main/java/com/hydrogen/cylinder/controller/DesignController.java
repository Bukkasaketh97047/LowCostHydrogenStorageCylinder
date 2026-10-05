package com.hydrogen.cylinder.controller;

import com.hydrogen.cylinder.dto.*;
import com.hydrogen.cylinder.service.DesignService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/design")
@CrossOrigin(origins = "*")
public class DesignController {

    private final DesignService designService;

    public DesignController(DesignService designService) {
        this.designService = designService;
    }

    @PostMapping("/calculate")
    public ResponseEntity<DesignResult> calculateDesign(@Valid @RequestBody DesignRequest request) {
        return ResponseEntity.ok(designService.calculateDesign(request));
    }

    @PostMapping("/compare")
    public ResponseEntity<ComparisonResult> compareMaterials(@RequestBody ComparisonRequest request) {
        return ResponseEntity.ok(designService.compareMaterials(request));
    }

    @PostMapping("/recommend")
    public ResponseEntity<RecommendationResult> recommendMaterial(@RequestBody RecommendationRequest request) {
        return ResponseEntity.ok(designService.recommendMaterial(request));
    }
}
