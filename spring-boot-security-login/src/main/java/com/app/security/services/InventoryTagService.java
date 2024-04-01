package com.app.security.services;


import com.app.models.InventoryTag;

import java.util.List;

public interface InventoryTagService {
    InventoryTag createTag(InventoryTag tag);

    List<InventoryTag> getAllTags();

}
