package com.hydrogen.cylinder.model;

import jakarta.persistence.*;

@Entity
@Table(name = "configurations")
public class CylinderConfiguration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // Type I, Type III, Type IV

    @Column(length = 1000)
    private String description;

    private String constructionType; // All-metal, Hoop-wrapped composite, Fully-wrapped composite

    private Boolean isConceptualOnly; // true for Type III & IV if conceptual mechanics used

    public CylinderConfiguration() {}

    public CylinderConfiguration(String name, String description, String constructionType, Boolean isConceptualOnly) {
        this.name = name;
        this.description = description;
        this.constructionType = constructionType;
        this.isConceptualOnly = isConceptualOnly;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getConstructionType() { return constructionType; }
    public void setConstructionType(String constructionType) { this.constructionType = constructionType; }

    public Boolean getIsConceptualOnly() { return isConceptualOnly; }
    public void setIsConceptualOnly(Boolean isConceptualOnly) { this.isConceptualOnly = isConceptualOnly; }
}
