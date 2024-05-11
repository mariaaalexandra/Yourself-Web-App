package com.app.security.services;

import com.app.models.ConstructiveFeedback;

import java.util.List;

public interface ConstructiveFeedbackService {
    ConstructiveFeedback createFeedback(ConstructiveFeedback constructiveFeedback);
    List<ConstructiveFeedback> getAllFeedback();
}
