package com.app.controllers;

import com.app.models.WidgetLayout;
import com.app.security.services.WidgetLayoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/widgets")
@CrossOrigin(origins = "http://localhost:8081")
public class WidgetLayoutController {
    @Autowired
    private WidgetLayoutService widgetLayoutService;

    // POST method to create a new widget layout
    @PostMapping
    public ResponseEntity<WidgetLayout> createWidget(@RequestBody WidgetLayout widgetLayout) {
        // Add logic to save widgetLayout using service
        return ResponseEntity.ok(widgetLayoutService.createWidgetLayout(widgetLayout));
    }

    // GET method to retrieve all widget layouts
    @GetMapping
    public ResponseEntity<List<WidgetLayout>> getAllWidgetLayouts() {
        return ResponseEntity.ok(widgetLayoutService.getAllWidgetLayouts());
    }

    // PUT method to update a widget layout
    @PutMapping("/{id}")
    public ResponseEntity<WidgetLayout> updateWidget(@PathVariable String id, @RequestBody WidgetLayout widgetLayout) {
        return ResponseEntity.ok(widgetLayoutService.updateWidgetLayout(id, widgetLayout));
    }

    // DELETE method to delete a widget layout
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWidgetLayout(@PathVariable String id) {
        widgetLayoutService.deleteWidgetLayout(id);
        return ResponseEntity.noContent().build();
    }

    // GET method to retrieve a single widget layout by ID
    @GetMapping("/{id}")
    public ResponseEntity<WidgetLayout> getWidgetLayoutById(@PathVariable String id) {
        return ResponseEntity.ok(widgetLayoutService.getWidgetLayoutById(id));
    }
}
