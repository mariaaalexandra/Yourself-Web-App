package com.app.repository;

import com.app.models.InventoryBrand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryBrandRepository extends JpaRepository<InventoryBrand, Long> {
    // Custom query methods can be defined here
}
