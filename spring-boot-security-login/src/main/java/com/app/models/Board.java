package com.app.models;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;
import java.util.Set;

@Entity
public class Board implements Serializable {
    public static final long serialVervionUID = 68548L;


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private String icon;

    private String lastActivity;


    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BoardList> lists;


    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BoardLabel> labels;


    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "board_members", joinColumns = @JoinColumn(name = "board_id"))
    private List<Member> members;

    // Constructors
    public Board() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getLastActivity() {
        return lastActivity;
    }

    public void setLastActivity(String lastActivity) {
        this.lastActivity = lastActivity;
    }

    public List<BoardList> getLists() {
        return lists;
    }

    public void setLists(List<BoardList> lists) {
        this.lists = lists;
    }

    public List<BoardLabel> getLabels() {
        return labels;
    }

    public void setLabels(List<BoardLabel> labels) {
        this.labels = labels;
    }

    public List<Member> getMembers() {
        return members;
    }

    public void setMembers(List<Member> members) {
        this.members = members;
    }
}
