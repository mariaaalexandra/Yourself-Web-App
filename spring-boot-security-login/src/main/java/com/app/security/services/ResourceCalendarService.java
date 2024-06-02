package com.app.security.services;

import com.app.models.ResourceCalendar;


import java.util.List;

public interface ResourceCalendarService {
    List<ResourceCalendar> findAll();
    ResourceCalendar findById(Long id);
    ResourceCalendar save(ResourceCalendar resource);
    void deleteById(Long id);
}
