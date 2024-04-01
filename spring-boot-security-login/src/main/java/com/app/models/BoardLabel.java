package com.app.models;

import javax.persistence.*;
import java.io.Serializable;

@Entity
public class BoardLabel implements Serializable {
    public static final long serialVervionUID = 68548L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "board_id")
    private Long boardId;

    private String title;

    // Constructors
    public BoardLabel() {
    }

    public BoardLabel(Long boardId, String title) {
        this.boardId = boardId;
        this.title = title;
    }

    // Getters and setters
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

}
