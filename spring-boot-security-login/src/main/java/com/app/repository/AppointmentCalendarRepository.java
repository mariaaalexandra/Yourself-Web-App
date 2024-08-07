package com.app.repository;

import com.app.models.AppointmentCalendar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppointmentCalendarRepository extends JpaRepository<AppointmentCalendar, Long> {
}
