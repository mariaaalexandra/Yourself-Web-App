package com.app.repository;

import com.app.models.InventoryVendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryVendorRepository extends JpaRepository<InventoryVendor, Long> {
    // Custom query methods can be defined here
}
