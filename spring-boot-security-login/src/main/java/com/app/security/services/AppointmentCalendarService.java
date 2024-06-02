package com.app.security.services;

import com.app.models.AppointmentCalendar;

import java.util.List;

public interface AppointmentCalendarService {
    List<AppointmentCalendar> findAll();
    AppointmentCalendar findById(Long id);
    AppointmentCalendar save(AppointmentCalendar appointment);
    void deleteById(Long id);
}
