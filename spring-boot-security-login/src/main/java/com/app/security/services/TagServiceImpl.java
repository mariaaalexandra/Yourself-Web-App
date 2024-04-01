package com.app.security.services;

import com.app.models.Tag;


import com.app.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagServiceImpl implements TagService {

    @Autowired
    private TagRepository tagRepository;

    @Override
    public Tag createTag(Tag tag) {
        return tagRepository.save(tag);
    }

    @Override
    public Tag updateTag(String id, Tag tagData) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tag not found with id: " + id));
        tag.setTitle(tagData.getTitle());
        tag.setUserId(tagData.getUserId());

        return tagRepository.save(tag);
    }

    @Override
    public void deleteTag(String id) {
        tagRepository.deleteById(id);
    }

    @Override
    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }

    @Override
    public Tag getTagById(String id) {
        return tagRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tag not found with id: " + id));
    }

    @Override
    public List<Tag> getTagsByUserId(Long userId) {
        return tagRepository.findByUserId(userId);
    }
}
