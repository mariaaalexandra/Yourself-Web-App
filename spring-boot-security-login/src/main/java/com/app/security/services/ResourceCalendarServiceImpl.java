package com.app.security.services;


import com.app.models.ResourceCalendar;
import com.app.repository.ResourceCalendarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceCalendarServiceImpl implements ResourceCalendarService {

    @Autowired
    private ResourceCalendarRepository resourceRepository;

    @Override
    public List<ResourceCalendar> findAll() {
        return resourceRepository.findAll();
    }

    @Override
    public ResourceCalendar findById(Long id) {
        return resourceRepository.findById(id).orElse(null);
    }

    @Override
    public ResourceCalendar save(ResourceCalendar resource) {
        return resourceRepository.save(resource);
    }

    @Override
    public void deleteById(Long id) {
        resourceRepository.deleteById(id);
    }
}
