package com.app.security.services;


import com.app.models.AppointmentCalendar;
import com.app.repository.AppointmentCalendarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentCalendarServiceImpl implements AppointmentCalendarService {

    @Autowired
    private AppointmentCalendarRepository appointmentRepository;

    @Override
    public List<AppointmentCalendar> findAll() {
        return appointmentRepository.findAll();
    }

    @Override
    public AppointmentCalendar findById(Long id) {
        return appointmentRepository.findById(id).orElse(null);
    }

    @Override
    public AppointmentCalendar save(AppointmentCalendar appointment) {
        return appointmentRepository.save(appointment);
    }

    @Override
    public void deleteById(Long id) {
        appointmentRepository.deleteById(id);
    }
}
