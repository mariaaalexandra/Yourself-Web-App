package com.app.controllers;

import com.app.models.ConstructiveFeedback;
import com.app.security.services.ConstructiveFeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/constructivefeedback")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ConstructiveFeedbackController {


    @Autowired
    private ConstructiveFeedbackService constructiveFeedbackService;

    @PostMapping
    public ResponseEntity<ConstructiveFeedback> createFeedback(@RequestBody ConstructiveFeedback constructiveFeedback) {
        return ResponseEntity.ok(constructiveFeedbackService.createFeedback(constructiveFeedback));
    }

    @GetMapping
    public ResponseEntity<List<ConstructiveFeedback>> getAllFeedback() {
        return ResponseEntity.ok(constructiveFeedbackService.getAllFeedback());
    }
}
