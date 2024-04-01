package com.app.security.services;

import com.app.models.Tag;
import java.util.List;

public interface TagService {
    Tag createTag(Tag tag);
    Tag updateTag(String id, Tag tagData);
    void deleteTag(String id);
    List<Tag> getAllTags();
    Tag getTagById(String id);

    List<Tag> getTagsByUserId(Long userId);
}
