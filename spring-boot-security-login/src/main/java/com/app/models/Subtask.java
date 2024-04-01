package com.app.models;

import javax.persistence.Embeddable;

@Embeddable
public class Subtask {
    private String title;
    private boolean completed;

    // Constructors, Getters, and Setters
    public Subtask() {
    }

    public Subtask(String description, boolean completed) {
        this.title = description;
        this.completed = completed;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}
