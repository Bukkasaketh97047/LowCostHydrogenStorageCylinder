package com.hydrogen.cylinder.config;

import com.hydrogen.cylinder.model.CylinderConfiguration;
import com.hydrogen.cylinder.model.Material;
import com.hydrogen.cylinder.model.Role;
import com.hydrogen.cylinder.model.User;
import com.hydrogen.cylinder.repository.CylinderConfigurationRepository;
import com.hydrogen.cylinder.repository.MaterialRepository;
import com.hydrogen.cylinder.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final MaterialRepository materialRepository;
    private final CylinderConfigurationRepository configRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(MaterialRepository materialRepository,
                           CylinderConfigurationRepository configRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.materialRepository = materialRepository;
        this.configRepository = configRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Seed materials
        if (materialRepository.count() == 0) {
            materialRepository.save(new Material(
                    "Aluminium 6061-T6",
                    "Metallic (Light Alloy)",
                    2700.0,
                    240.0,
                    4.50,
                    "ASM Material Data / Engineering Handbooks",
                    "Standard aerospace and automotive structural aluminum alloy. High corrosion resistance and lightweight."
            ));

            materialRepository.save(new Material(
                    "304 Stainless Steel",
                    "Metallic (Austenitic Steel)",
                    8000.0,
                    205.0,
                    3.20,
                    "ASME Boiler & Pressure Vessel Code (BPVC)",
                    "High ductility, excellent toughness and hydrogen embrittlement resistance, but heavy weight."
            ));

            materialRepository.save(new Material(
                    "E-Glass/Epoxy",
                    "Composite (Glass Fiber)",
                    2000.0,
                    450.0,
                    12.50,
                    "Composite Materials Handbook (MIL-HDBK-17)",
                    "Moderate strength composite material with good dielectric properties and low raw material cost."
            ));

            materialRepository.save(new Material(
                    "Carbon/Epoxy",
                    "Composite (Carbon Fiber)",
                    1550.0,
                    750.0,
                    42.00,
                    "Torayca T700 / Advanced Composite Specifications",
                    "Ultra-high strength-to-weight ratio. Preferred for lightweight high-pressure Type III & Type IV storage."
            ));
        }

        // Seed configurations
        if (configRepository.count() == 0) {
            configRepository.save(new CylinderConfiguration(
                    "Type I",
                    "Monolithic all-metal pressure vessel (Aluminium alloy or Steel). Heavy weight, lowest manufacturing complexity.",
                    "All-metal construction",
                    false
            ));

            configRepository.save(new CylinderConfiguration(
                    "Type III",
                    "Seamless thin metallic liner (Aluminum or Steel) fully overwrapped with carbon composite filament winding.",
                    "Metal Liner + Full Composite Wrap",
                    true
            ));

            configRepository.save(new CylinderConfiguration(
                    "Type IV",
                    "Non-metallic high-density polyethylene (HDPE) liner fully overwrapped with carbon composite filament winding.",
                    "Polymer Liner + Full Composite Wrap",
                    true
            ));
        }

        // Seed demo accounts
        if (userRepository.count() == 0) {
            userRepository.save(new User(
                    "Standard User",
                    "user@hydrogen.edu",
                    passwordEncoder.encode("Password123!"),
                    Role.USER,
                    true
            ));

            userRepository.save(new User(
                    "System Administrator",
                    "admin@hydrogen.sys",
                    passwordEncoder.encode("AdminSecret123!"),
                    Role.ADMIN,
                    true
            ));
        }
    }
}
