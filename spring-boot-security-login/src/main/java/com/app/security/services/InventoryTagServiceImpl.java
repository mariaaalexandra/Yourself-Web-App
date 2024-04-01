package com.app.security.services;

import com.app.models.InventoryProduct;
import com.app.models.InventoryTag;

import com.app.repository.InventoryProductRepository;
import com.app.repository.InventoryTagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class InventoryTagServiceImpl implements InventoryTagService {

    private final InventoryTagRepository tagRepository;

    private final InventoryProductRepository productRepository;

    @Autowired
    public InventoryTagServiceImpl(InventoryTagRepository tagRepository, InventoryProductRepository productRepository) {
        this.tagRepository = tagRepository;
        this.productRepository = productRepository;
    }

    @Override
    public InventoryTag createTag(InventoryTag tag) {
        return tagRepository.save(tag);
    }

    @Override
    public List<InventoryTag> getAllTags() {
        return tagRepository.findAllNonNullTitles();
    }


}
