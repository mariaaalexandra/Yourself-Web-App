package com.app.security.services;

import com.app.models.Note;

import com.app.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NoteServiceImpl implements NoteService {

    private final NoteRepository noteRepository;

    @Autowired
    public NoteServiceImpl(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    @Override
    public Note createNote(Note note) {
        // Handle file saving logic for taskImage here if necessary
        return noteRepository.save(note);
    }

    @Override
    public Note updateNote(int id, Note noteDetails) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found for this id :: " + id));
        note.setTitle(noteDetails.getTitle());
        note.setLabel(noteDetails.getLabel());
        note.setSubtasks(noteDetails.getSubtasks());
        note.setArchived(noteDetails.isArchived());
        note.setTrashed(noteDetails.isTrashed());
        // Handle file update logic for taskImage here if necessary
        return noteRepository.save(note);
    }

    @Override
    public Note updateNoteSubtasks(int id, Note noteDetails) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found for this id :: " + id));

        note.setSubtasks(noteDetails.getSubtasks());

        // Handle file update logic for taskImage here if necessary
        return noteRepository.save(note);
    }

    @Override
    public Note updateNoteLabels(int id, Note noteDetails) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found for this id :: " + id));

        note.setLabels(noteDetails.getLabels());

        // Handle file update logic for taskImage here if necessary
        return noteRepository.save(note);
    }

    @Override
    public void deleteNote(int id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found for this id :: " + id));
        noteRepository.delete(note);
    }

    @Override
    public Note getNoteById(int id) {
        return noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found for this id :: " + id));
    }

    @Override
    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }

    @Override
    public List<Note> getAllNotesForUser(Long userId) {
        return noteRepository.findByUserId(userId);
    }
}
