package com.app.repository;

import com.app.models.ResourceCalendar;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceCalendarRepository extends JpaRepository<ResourceCalendar, Long> {
}
