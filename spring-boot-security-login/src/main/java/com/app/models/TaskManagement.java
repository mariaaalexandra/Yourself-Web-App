package com.app.models;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
public class TaskManagement implements Serializable {
    public static final long serialVersionUID = 68548L;  // Corrected typo in serialVersionUID

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    public List<Long> getUserId() {
        return userId;
    }

    public void setUserId(List<Long> userId) {
        this.userId = userId;
    }

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "task_user_id", joinColumns = @JoinColumn(name = "task_id"))
    @Column(name = "user_id")
    private List<Long> userId;

    private String title;
    private String type;
    private String notes;
    private boolean completed;
    private String dueDate;
    private int priority;

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    @ElementCollection
    private List<String> tags;

    @Column(name = "task_order")  // Renamed column to avoid using SQL reserved keyword
    private int order;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public int getPriority() {
        return priority;
    }

    public void setPriority(int priority) {
        this.priority = priority;
    }



    public int getOrder() {
        return order;
    }

    public void setOrder(int order) {
        this.order = order;
    }





}
