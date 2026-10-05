package com.hydrogen.cylinder.service;

import com.hydrogen.cylinder.model.CylinderConfiguration;
import com.hydrogen.cylinder.repository.CylinderConfigurationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConfigurationService {

    private final CylinderConfigurationRepository repository;

    public ConfigurationService(CylinderConfigurationRepository repository) {
        this.repository = repository;
    }

    public List<CylinderConfiguration> getAllConfigurations() {
        return repository.findAll();
    }
}
