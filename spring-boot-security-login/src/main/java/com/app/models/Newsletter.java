package com.app.models;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import com.app.repository.NewsletterRepository;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Newsletter {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private String id;
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email cannot be empty")
    private String email;

    public String getId() {
        return id;
    }

    public void setId(String _id) {
        this.id = _id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String _email) {
        this.email = _email;
    }

    Newsletter()
    {
        this.id = null;
        this.email = null;
    }

    Newsletter(String _id, String _email) {
        this.email = _email;
        this.id = _id;
    }
}
