package com.app.models;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
public class Card implements Serializable {
    public static final long serialVervionUID = 68548L;


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private Long boardId;


    @Column(name = "list_id")
    private Long listId;
    private int position;

    private String title;

    private String description;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BoardLabel> labels;

    private String dueDate; // Stored as a String, consider converting to a Date/LocalDateTime

    // Constructors
    public Card() {
    }

    // Add constructor with fields, getters, and setters...

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBoardId() {
        return boardId;
    }

    public void setBoardId(Long boardId) {
        this.boardId = boardId;
    }

    public Long getListId() {
        return listId;
    }

    public void setListId(Long listId) {
        this.listId = listId;
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<BoardLabel> getLabels() {
        return labels;
    }

    public void setLabels(List<BoardLabel> labels) {
        this.labels = labels;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

}
