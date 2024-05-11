package com.app.security.services;

import com.app.models.ConstructiveFeedback;
import com.app.repository.ConstructiveFeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConstructiveFeedbackServiceImpl implements ConstructiveFeedbackService {

    @Autowired
    private ConstructiveFeedbackRepository constructiveFeedbackRepository;

    @Override
    public ConstructiveFeedback createFeedback(ConstructiveFeedback constructiveFeedback) {
        return constructiveFeedbackRepository.save(constructiveFeedback);
    }

    @Override
    public List<ConstructiveFeedback> getAllFeedback() {
        return constructiveFeedbackRepository.findAll();
    }
}
