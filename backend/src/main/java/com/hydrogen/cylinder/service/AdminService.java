package com.hydrogen.cylinder.service;

import com.hydrogen.cylinder.dto.UserDto;
import com.hydrogen.cylinder.model.Role;
import com.hydrogen.cylinder.model.User;
import com.hydrogen.cylinder.repository.CalculationRecordRepository;
import com.hydrogen.cylinder.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final CalculationRecordRepository recordRepository;

    public AdminService(UserRepository userRepository, CalculationRecordRepository recordRepository) {
        this.userRepository = userRepository;
        this.recordRepository = recordRepository;
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream().map(UserDto::new).toList();
    }

    @Transactional
    public UserDto toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        user.setEnabled(!user.getEnabled());
        return new UserDto(userRepository.save(user));
    }

    @Transactional
    public UserDto updateUserRole(Long userId, String newRoleStr) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        Role role = Role.valueOf(newRoleStr.toUpperCase());
        user.setRole(role);
        return new UserDto(userRepository.save(user));
    }

    public Map<String, Object> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("usersCount", userRepository.countByRole(Role.USER));
        stats.put("adminsCount", userRepository.countByRole(Role.ADMIN));
        stats.put("totalCalculationsCount", recordRepository.count());
        return stats;
    }
}
