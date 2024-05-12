package com.app.models;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class WidgetLayout {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private String id;
    private int cols;
    private int rows;
    private int x;
    private int y;
    private String componentType; // To identify the component

    // Getters
    public String getId() {
        return id;
    }

    public int getCols() {
        return cols;
    }

    public int getRows() {
        return rows;
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }

    public String getComponentType() {
        return componentType;
    }

    // Setters
    public void setId(String id) {
        this.id = id;
    }

    public void setCols(int cols) {
        this.cols = cols;
    }

    public void setRows(int rows) {
        this.rows = rows;
    }

    public void setX(int x) {
        this.x = x;
    }

    public void setY(int y) {
        this.y = y;
    }

    public void setComponentType(String componentType) {
        this.componentType = componentType;
    }
}
