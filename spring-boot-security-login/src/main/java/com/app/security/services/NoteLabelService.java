package com.app.security.services;

import com.app.models.Label;
import java.util.List;

public interface NoteLabelService {
    Label createNoteLabel(Label label);

    Label updateNoteLabel(int id, Label label);

    void deleteNoteLabel(int id);

    Label getNoteLabelById(int id);

    List<Label> getAllNoteLabelsForUser(Long userId);

}
