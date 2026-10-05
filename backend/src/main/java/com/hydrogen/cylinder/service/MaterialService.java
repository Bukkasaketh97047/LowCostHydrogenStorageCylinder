package com.hydrogen.cylinder.service;

import com.hydrogen.cylinder.model.Material;
import com.hydrogen.cylinder.repository.MaterialRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MaterialService {

    private final MaterialRepository materialRepository;

    public MaterialService(MaterialRepository materialRepository) {
        this.materialRepository = materialRepository;
    }

    public List<Material> getAllMaterials() {
        return materialRepository.findAll();
    }

    public Optional<Material> getMaterialByName(String name) {
        return materialRepository.findByNameIgnoreCase(name);
    }

    public Optional<Material> getMaterialById(Long id) {
        return materialRepository.findById(id);
    }
}
