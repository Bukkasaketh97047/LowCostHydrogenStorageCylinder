package com.hydrogen.cylinder.repository;

import com.hydrogen.cylinder.model.CalculationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CalculationRecordRepository extends JpaRepository<CalculationRecord, Long> {
    List<CalculationRecord> findAllByOrderByCreatedAtDesc();
    List<CalculationRecord> findByUserEmailOrderByCreatedAtDesc(String userEmail);
}
