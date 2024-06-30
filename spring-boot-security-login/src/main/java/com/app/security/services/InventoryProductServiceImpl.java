package com.app.security.services;

import com.app.models.*;
import com.app.repository.InventoryProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.EntityNotFoundException;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class InventoryProductServiceImpl implements InventoryProductService {

    @PersistenceContext
    private EntityManager entityManager;

    private final InventoryProductRepository productRepository;

    @Autowired
    public InventoryProductServiceImpl(InventoryProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public InventoryProduct addProduct(InventoryProduct product) {
        if (product.getBrand() != null && product.getBrand().getId() != null) {
            InventoryBrand managedBrand = entityManager.merge(product.getBrand());
            product.setBrand(managedBrand);
        }

        if (product.getCategory() != null && product.getCategory().getId() != null) {
            InventoryCategory managedCategory = entityManager.merge(product.getCategory());
            product.setCategory(managedCategory);
        }

        if (product.getVendor() != null && product.getVendor().getId() != null) {
            InventoryVendor managedVendor = entityManager.merge(product.getVendor());
            product.setVendor(managedVendor);
        }

        if (product.getTags() != null && !product.getTags().isEmpty()) {
            Set<InventoryTag> managedTags = new HashSet<>();
            for (InventoryTag tag : product.getTags()) {
                if (tag.getId() != null) {
                    InventoryTag managedTag = entityManager.merge(tag);
                    managedTags.add(managedTag);
                } else {
                    entityManager.persist(tag);
                    managedTags.add(tag);
                }
            }
            product.setTags(new ArrayList<>(managedTags));
        }

        return productRepository.save(product);
    }

    public List<InventoryProduct> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public InventoryProduct updateProduct(Long productId, InventoryProduct updatedProduct) {
        InventoryProduct existingProduct = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id " + productId));

        // Update all fields
        existingProduct.setName(updatedProduct.getName());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setStock(updatedProduct.getStock());
        existingProduct.setCost(updatedProduct.getCost());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setThumbnail(updatedProduct.getThumbnail());
        existingProduct.setActive(updatedProduct.getActive());

        // For relationships, ensure you handle them appropriately
        // This might involve checking if they are different and only updating if necessary
        existingProduct.setCategory(updatedProduct.getCategory());
        existingProduct.setTags(updatedProduct.getTags());
        existingProduct.setBrand(updatedProduct.getBrand());
        existingProduct.setVendor(updatedProduct.getVendor());
        existingProduct.setImages(updatedProduct.getImages());

        return productRepository.save(existingProduct);
    }

    // Remove this method implementation
    @Override
    public void deleteProduct(Long productId) {
        productRepository.deleteById(productId);
    }

    @Override
    public InventoryProduct addTagToProduct(Long productId, InventoryTag tag) {
        InventoryProduct product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
        product.getTags().add(tag);
        return productRepository.save(product);
    }

    @Override
    public InventoryProduct removeTagFromProduct(Long productId, Long tagId) {
        InventoryProduct product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        product.setTags(product.getTags().stream()
                .filter(tag -> !tag.getId().equals(tagId))
                .collect(Collectors.toList()));

        return productRepository.save(product);
    }



}
