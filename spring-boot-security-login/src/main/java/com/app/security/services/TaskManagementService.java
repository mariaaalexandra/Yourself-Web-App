package com.app.security.services;

import com.app.models.TaskManagement;

import java.util.List;

public interface TaskManagementService {
    TaskManagement findById(int id);
    List<TaskManagement> findAll();
    TaskManagement save(TaskManagement taskManagement);

    List<TaskManagement> findByUserId(Long userId);

    void deleteById(int id);


    TaskManagement updateTask(int id, TaskManagement taskDetails);
    // Add more methods as required


}
