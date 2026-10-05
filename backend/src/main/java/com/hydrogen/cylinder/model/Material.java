package com.hydrogen.cylinder.model;

import jakarta.persistence.*;

@Entity
@Table(name = "materials")
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String type; // e.g. Metallic, Composite

    @Column(nullable = false)
    private Double density; // kg/m^3

    @Column(nullable = false)
    private Double allowableStress; // MPa (Yield or Design reference stress S)

    @Column(nullable = false)
    private Double costPerKg; // USD/kg

    private String source;

    @Column(length = 1000)
    private String notes;

    public Material() {}

    public Material(String name, String type, Double density, Double allowableStress, Double costPerKg, String source, String notes) {
        this.name = name;
        this.type = type;
        this.density = density;
        this.allowableStress = allowableStress;
        this.costPerKg = costPerKg;
        this.source = source;
        this.notes = notes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Double getDensity() { return density; }
    public void setDensity(Double density) { this.density = density; }

    public Double getAllowableStress() { return allowableStress; }
    public void setAllowableStress(Double allowableStress) { this.allowableStress = allowableStress; }

    public Double getCostPerKg() { return costPerKg; }
    public void setCostPerKg(Double costPerKg) { this.costPerKg = costPerKg; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
