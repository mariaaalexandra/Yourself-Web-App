package com.app.security.services;

import com.app.models.InventoryProduct;
import com.app.models.InventoryTag;

import java.util.List;
import java.util.Optional;


public interface InventoryProductService {
    InventoryProduct addProduct(InventoryProduct product);

    List<InventoryProduct> getAllProducts();

    InventoryProduct updateProduct(Long productId, InventoryProduct productDetails);

    // Remove this method declaration
    void deleteProduct(Long productId);

   InventoryProduct addTagToProduct(Long productId, InventoryTag tag);

    InventoryProduct removeTagFromProduct(Long productId, Long tagId);
}
