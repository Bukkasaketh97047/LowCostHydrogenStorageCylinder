package com.hydrogen.cylinder.controller;

import com.hydrogen.cylinder.model.CalculationRecord;
import com.hydrogen.cylinder.service.CalculationHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
public class CalculationHistoryController {

    private final CalculationHistoryService historyService;

    public CalculationHistoryController(CalculationHistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping
    public ResponseEntity<List<CalculationRecord>> getAllRecords() {
        return ResponseEntity.ok(historyService.getAllRecordsForCurrentUser());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long id) {
        historyService.deleteRecord(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearHistory() {
        historyService.clearAllHistory();
        return ResponseEntity.noContent().build();
    }
}
