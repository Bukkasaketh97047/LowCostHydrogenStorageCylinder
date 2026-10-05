package com.hydrogen.cylinder.service;

import com.hydrogen.cylinder.model.CalculationRecord;
import com.hydrogen.cylinder.model.Role;
import com.hydrogen.cylinder.model.User;
import com.hydrogen.cylinder.repository.CalculationRecordRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CalculationHistoryService {

    private final CalculationRecordRepository repository;

    public CalculationHistoryService(CalculationRecordRepository repository) {
        this.repository = repository;
    }

    public List<CalculationRecord> getAllRecordsForCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User) {
            User user = (User) auth.getPrincipal();
            if (user.getRole() == Role.ADMIN) {
                return repository.findAllByOrderByCreatedAtDesc();
            }
            return repository.findByUserEmailOrderByCreatedAtDesc(user.getEmail());
        }
        return repository.findAllByOrderByCreatedAtDesc();
    }

    public void deleteRecord(Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User) {
            User user = (User) auth.getPrincipal();
            repository.findById(id).ifPresent(rec -> {
                if (user.getRole() == Role.ADMIN || (rec.getUserEmail() != null && rec.getUserEmail().equalsIgnoreCase(user.getEmail()))) {
                    repository.deleteById(id);
                }
            });
        } else {
            repository.deleteById(id);
        }
    }

    public void clearAllHistory() {
        repository.deleteAll();
    }
}
