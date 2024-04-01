package com.app.models;

import javax.persistence.*;

import java.io.Serializable;

@Embeddable
public class Member implements Serializable {
    public static final long serialVervionUID = 68548L;


    private Long member_id;

    private String name;

    private String avatar;

    // Constructors
    public Member() {
    }

    public Member(String name, String avatar) {
        this.name = name;
        this.avatar = avatar;
    }

    // Getters and setters
    public Long getMember_id() {
        return member_id;
    }

    public void setMember_id(Long member_id) {
        this.member_id = member_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

}
