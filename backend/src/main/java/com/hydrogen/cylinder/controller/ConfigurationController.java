package com.hydrogen.cylinder.controller;

import com.hydrogen.cylinder.model.CylinderConfiguration;
import com.hydrogen.cylinder.service.ConfigurationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/configurations")
@CrossOrigin(origins = "*")
public class ConfigurationController {

    private final ConfigurationService configurationService;

    public ConfigurationController(ConfigurationService configurationService) {
        this.configurationService = configurationService;
    }

    @GetMapping
    public ResponseEntity<List<CylinderConfiguration>> getAllConfigurations() {
        return ResponseEntity.ok(configurationService.getAllConfigurations());
    }
}
