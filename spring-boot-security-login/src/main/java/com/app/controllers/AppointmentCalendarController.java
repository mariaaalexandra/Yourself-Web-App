package com.app.controllers;


import com.app.models.AppointmentCalendar;
import com.app.security.services.AppointmentCalendarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentCalendarController {

    @Autowired
    private AppointmentCalendarService appointmentService;

    @GetMapping
    public List<AppointmentCalendar> getAllAppointments() {
        return appointmentService.findAll();
    }

    @GetMapping("/{id}")
    public AppointmentCalendar getAppointmentById(@PathVariable Long id) {
        return appointmentService.findById(id);
    }

    @PostMapping
    public AppointmentCalendar createAppointment(@RequestBody AppointmentCalendar appointment) {
        return appointmentService.save(appointment);
    }

    @PutMapping("/{id}")
    public AppointmentCalendar updateAppointment(@PathVariable Long id, @RequestBody AppointmentCalendar appointment) {
        AppointmentCalendar existingAppointment = appointmentService.findById(id);
        if (existingAppointment != null) {
            appointment.setId(id);
            return appointmentService.save(appointment);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteById(id);
    }
}
