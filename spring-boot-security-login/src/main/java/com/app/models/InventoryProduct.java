package com.app.models;

import javax.persistence.*;
import java.util.List;

@Entity
public class InventoryProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Double getCost() {
        return cost;
    }

    public void setCost(Double cost) {
        this.cost = cost;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public InventoryCategory getCategory() {
        return category;
    }

    public void setCategory(InventoryCategory category) {
        this.category = category;
    }

    public List<InventoryTag> getTags() {
        return tags;
    }

    public void setTags(List<InventoryTag> tags) {
        this.tags = tags;
    }

    public InventoryBrand getBrand() {
        return brand;
    }

    public void setBrand(InventoryBrand brand) {
        this.brand = brand;
    }

    public InventoryVendor getVendor() {
        return vendor;
    }

    public void setVendor(InventoryVendor vendor) {
        this.vendor = vendor;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    private String name;
    private String description;
    private Integer stock;
    private Double cost;
    private Double price;
    private String thumbnail;
    private Boolean active;

    @ManyToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    private InventoryCategory category;

    @ManyToMany(cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(
            name = "inventory_product_tag", // Name of the join table
            joinColumns = @JoinColumn(name = "product_id"), // Column for the product ID
            inverseJoinColumns = @JoinColumn(name = "tag_id") // Column for the tag ID
    )
    private List<InventoryTag> tags;

    @ManyToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    private InventoryBrand brand;

    @ManyToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    private InventoryVendor vendor;

    @ElementCollection
    private List<String> images;

    // Getters and Setters
}
