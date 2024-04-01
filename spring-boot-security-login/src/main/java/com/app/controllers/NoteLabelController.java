package com.app.controllers;

import com.app.models.Label;

import com.app.security.services.NoteLabelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/noteLabels")
@CrossOrigin(origins = "http://localhost:8081")
public class NoteLabelController {

    private final NoteLabelService noteLabelService;

    @Autowired
    public NoteLabelController(NoteLabelService noteLabelService) {
        this.noteLabelService = noteLabelService;
    }

    @PostMapping
    public ResponseEntity<Label> createNoteLabel(@RequestBody Label label) {
        return ResponseEntity.ok(noteLabelService.createNoteLabel(label));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Label> updateNoteLabel(@PathVariable int id, @RequestBody Label label) {
        return ResponseEntity.ok(noteLabelService.updateNoteLabel(id, label));
    }

    @RequestMapping(value = "/remove", method = RequestMethod.POST)
    public ResponseEntity<Void> deleteNoteLabel(@RequestParam int id) {
        noteLabelService.deleteNoteLabel(id);
        return ResponseEntity.noContent().build();
    }



    @GetMapping("/{id}")
    public ResponseEntity<Label> getNoteLabelById(@PathVariable int id) {
        return ResponseEntity.ok(noteLabelService.getNoteLabelById(id));
    }

    @GetMapping
    public ResponseEntity<List<Label>> getAllNoteLabels(@RequestParam Long id) {
        return ResponseEntity.ok(noteLabelService.getAllNoteLabelsForUser(id));
    }
}
