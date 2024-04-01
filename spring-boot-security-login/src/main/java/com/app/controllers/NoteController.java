package com.app.controllers;

import com.app.models.Label;
import com.app.models.Note;
import com.app.security.services.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "http://localhost:8081")
public class NoteController {

    private final NoteService noteService;

    @Autowired
    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public ResponseEntity<Note> createNote(@RequestBody Note note) {
        Note createdNote = noteService.createNote(note);
        return new ResponseEntity<>(createdNote, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(@PathVariable int id,
                                           @RequestBody Note note) {
        Note updatedNote = noteService.updateNote(id, note);
        return ResponseEntity.ok(updatedNote);
    }

    @PutMapping("/updateSubtasks")
    public ResponseEntity<Note> updateNoteSubtasks(@RequestParam int id, @RequestBody Note note) {
        Note updatedNote = noteService.updateNoteSubtasks(id, note);
        return ResponseEntity.ok(updatedNote);
    }

    @PutMapping("/updateLabels")
    public ResponseEntity<Note> updateNoteLabels(@RequestParam int id, @RequestBody Note note) {
        Note updatedNote = noteService.updateNoteLabels(id, note);
        return ResponseEntity.ok(updatedNote);
    }



    @RequestMapping(value = "/remove", method = RequestMethod.POST)
    public ResponseEntity<Void> deleteNote(@RequestParam int id) {
        noteService.deleteNote(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Note> getNoteById(@PathVariable int id) {
        Note note = noteService.getNoteById(id);
        return ResponseEntity.ok(note);
    }


    @GetMapping
    public ResponseEntity<List<Note>> getAllNoteForUser(@RequestParam Long id) {
        return ResponseEntity.ok(noteService.getAllNotesForUser(id));
    }
}
