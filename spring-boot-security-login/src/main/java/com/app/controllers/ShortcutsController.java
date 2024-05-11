package com.app.controllers;

import com.app.models.Shortcuts;
import com.app.security.services.ShortcutsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shortcuts")
@CrossOrigin(origins = "http://localhost:8081")
public class ShortcutsController {

    @Autowired
    private ShortcutsService shortcutsService;

    @PostMapping
    public ResponseEntity<Shortcuts> createShortcut(@RequestBody Shortcuts shortcuts) {
        return ResponseEntity.ok(shortcutsService.createShortcut(shortcuts));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Shortcuts> updateShortcut(@PathVariable String id, @RequestBody Shortcuts shortcuts) {
        return ResponseEntity.ok(shortcutsService.updateShortcut(id, shortcuts));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShortcut(@PathVariable String id) {
        shortcutsService.deleteShortcut(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Shortcuts>> getAllShortcuts() {
        return ResponseEntity.ok(shortcutsService.getAllShortcuts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shortcuts> getShortcutById(@PathVariable String id) {
        return ResponseEntity.ok(shortcutsService.getShortcutById(id));
    }
}
