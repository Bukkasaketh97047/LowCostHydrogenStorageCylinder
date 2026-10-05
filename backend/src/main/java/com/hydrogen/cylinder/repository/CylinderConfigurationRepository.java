package com.hydrogen.cylinder.repository;

import com.hydrogen.cylinder.model.CylinderConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CylinderConfigurationRepository extends JpaRepository<CylinderConfiguration, Long> {
    Optional<CylinderConfiguration> findByNameIgnoreCase(String name);
}
