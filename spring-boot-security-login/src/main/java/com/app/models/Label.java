package com.app.models;


import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
public class Label implements Serializable {
    public static final long serialVervionUID = 68548L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "label_user_id", joinColumns = @JoinColumn(name = "label_id"))
    @Column(name = "user_id")
    private List<Long> userId;

    public List<Long> getUserId() {
        return userId;
    }

    public void setUserId(List<Long> userId) {
        this.userId = userId;
    }

    private String title;
    private boolean active;

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

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

}
