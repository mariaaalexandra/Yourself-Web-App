package com.app.controllers;

import com.app.models.InventoryProduct;
import com.app.models.InventoryTag;
import com.app.repository.InventoryProductRepository;
import com.app.security.services.InventoryProductService;
import com.app.security.services.InventoryTagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:8081")
public class InventoryProductController {

    private final InventoryProductService productService;

    private final InventoryTagService tagService;

    @Autowired
    public InventoryProductController(InventoryProductService productService, InventoryTagService tagService) {
        this.productService = productService;
        this.tagService = tagService;
    }

    @PostMapping
    public ResponseEntity<InventoryProduct> addProduct(@RequestBody InventoryProduct product) {
        InventoryProduct savedProduct = productService.addProduct(product);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<InventoryProduct>> getAllProducts() {
        List<InventoryProduct> products = productService.getAllProducts();
        if (products.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @PutMapping("/update")
    public ResponseEntity<InventoryProduct> updateProduct(@RequestParam Long productId, @RequestBody InventoryProduct productDetails) {
        InventoryProduct updatedProduct = productService.updateProduct(productId, productDetails);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteProduct(@RequestParam Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/addTag")
    public ResponseEntity<InventoryTag> createTag(@RequestBody InventoryTag tag) {
        return ResponseEntity.ok(tagService.createTag(tag));
    }

    @GetMapping("/getTags")
    public ResponseEntity<List<InventoryTag>> getAllTags() {
        return ResponseEntity.ok(tagService.getAllTags());
    }

    @PostMapping("/addTagToProduct")
    public ResponseEntity<InventoryProduct> addTagToProduct(@RequestParam Long productId, @RequestBody InventoryTag tag) {
        InventoryProduct updatedProduct = productService.addTagToProduct(productId, tag);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/removeTag")
    public ResponseEntity<?> removeTagFromProduct(@RequestParam Long productId, @RequestParam Long tagId) {
        productService.removeTagFromProduct(productId, tagId);
        return ResponseEntity.ok().build();
    }
}


