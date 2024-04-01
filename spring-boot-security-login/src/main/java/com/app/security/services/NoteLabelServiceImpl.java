package com.app.security.services;

import com.app.models.Label;

import com.app.repository.NoteLabelRepository;
import com.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoteLabelServiceImpl implements NoteLabelService {

    private final NoteLabelRepository noteLabelRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    public NoteLabelServiceImpl(NoteLabelRepository noteLabelRepository) {
        this.noteLabelRepository = noteLabelRepository;
    }

    @Override
    public Label createNoteLabel(Label label) {
        // Save the label with the associated user
        return noteLabelRepository.save(label);
    }


    @Override
    public Label updateNoteLabel(int id, Label labelDetails) {
        Label label = noteLabelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NoteLabel not found for this id :: " + id));
        label.setTitle(labelDetails.getTitle());
        label.setActive(labelDetails.isActive());
        return noteLabelRepository.save(label);
    }

    @Override
    public void deleteNoteLabel(int id) {
        Label label = noteLabelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NoteLabel not found for this id :: " + id));
        noteLabelRepository.delete(label);
    }

    @Override
    public Label getNoteLabelById(int id) {
        return noteLabelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NoteLabel not found for this id :: " + id));
    }

    @Override
    public List<Label> getAllNoteLabelsForUser(Long userId) {
        return noteLabelRepository.findByUserId(userId);
    }




}
