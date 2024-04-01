package com.app.models;

import javax.persistence.*;

@Entity
public class InventoryCategory {
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public InventoryCategory getParentCategory() {
        return parentCategory;
    }

    public void setParentCategory(InventoryCategory parentCategory) {
        this.parentCategory = parentCategory;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String slug;

    @ManyToOne
    private InventoryCategory parentCategory;

    // Getters and Setters
}
