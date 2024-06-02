package com.app.controllers;


import com.app.models.ResourceCalendar;
import com.app.security.services.ResourceCalendarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/resources")
public class ResourceCalendarController {

    @Autowired
    private ResourceCalendarService resourceService;

    @GetMapping
    public List<ResourceCalendar> getAllResources() {
        return resourceService.findAll();
    }

    @GetMapping("/{id}")
    public ResourceCalendar getResourceById(@PathVariable Long id) {
        return resourceService.findById(id);
    }

    @PostMapping
    public ResourceCalendar createResource(@RequestBody ResourceCalendar resource) {
        return resourceService.save(resource);
    }

    @PutMapping("/{id}")
    public ResourceCalendar updateResource(@PathVariable Long id, @RequestBody ResourceCalendar resource) {
        ResourceCalendar existingResource = resourceService.findById(id);
        if (existingResource != null) {
            resource.setId(id);
            return resourceService.save(resource);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void deleteResource(@PathVariable Long id) {
        resourceService.deleteById(id);
    }
}
