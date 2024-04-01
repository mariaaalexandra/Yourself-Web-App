package com.app.models;

import org.springframework.web.multipart.MultipartFile;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
public class Note implements Serializable {
    public static final long serialVervionUID = 68548L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;

    @ElementCollection
    private List<String> labels;

    public List<String> getLabels() {
        return labels;
    }

    public void setLabels(List<String> labels) {
        this.labels = labels;
    }

    public List<Long> getUserId() {
        return userId;
    }

    public void setUserId(List<Long> userId) {
        this.userId = userId;
    }



    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "note_user_id", joinColumns = @JoinColumn(name = "note_id"))
    @Column(name = "user_id")
    private List<Long> userId;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "note_subtask", joinColumns = @JoinColumn(name = "note_id"))
    private List<Subtask> subtasks;

    public List<Subtask> getSubtasks() {
        return subtasks;
    }

    public void setSubtasks(List<Subtask> subtasks) {
        this.subtasks = subtasks;
    }

    private boolean isArchived;

    private boolean isTrashed;

    @Transient
    private MultipartFile taskImage;

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

    public List getLabel() {
        return labels;
    }

    public void setLabel(List label) {
        this.labels = label;
    }


    public boolean isArchived() {
        return isArchived;
    }

    public void setArchived(boolean archived) {
        isArchived = archived;
    }

    public boolean isTrashed() {
        return isTrashed;
    }

    public void setTrashed(boolean trashed) {
        isTrashed = trashed;
    }

    public MultipartFile getTaskImage() {
        return taskImage;
    }

    public void setTaskImage(MultipartFile taskImage) {
        this.taskImage = taskImage;
    }


}
