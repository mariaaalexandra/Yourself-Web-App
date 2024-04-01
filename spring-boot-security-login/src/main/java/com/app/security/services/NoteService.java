package com.app.security.services;

import com.app.models.Label;
import com.app.models.Note;
import java.util.List;

public interface NoteService {
    Note createNote(Note note);
    Note updateNote(int id, Note note);

    Note updateNoteSubtasks(int id, Note noteDetails);

    Note updateNoteLabels(int id, Note noteDetails);

    void deleteNote(int id);
    Note getNoteById(int id);
    List<Note> getAllNotes();

    List<Note> getAllNotesForUser(Long userId);

}
