package com.app.controllers;

import com.app.models.TaskManagement;

import com.app.security.services.TaskManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/task-management")
@CrossOrigin(origins = "http://localhost:8081")
public class TaskManagementController {

    @Autowired
    private TaskManagementService taskManagementService;

    @GetMapping("/taskId")
    public TaskManagement findById(@RequestParam int id) {
        return taskManagementService.findById(id);
    }

    @GetMapping
    public List<TaskManagement> findAll() {
        return taskManagementService.findAll();
    }

    @PostMapping
    public TaskManagement save(@RequestBody TaskManagement taskManagement) {
        return taskManagementService.save(taskManagement);
    }

    @DeleteMapping("/delete")
    public void deleteById(@RequestParam int id) {
        taskManagementService.deleteById(id);
    }

    @GetMapping("/user")
    public List<TaskManagement> findByUserId(@RequestParam Long userId) {
        return taskManagementService.findByUserId(userId);
    }

    @PutMapping("/update")
    public TaskManagement updateTask(@RequestParam int id, @RequestBody TaskManagement taskDetails) {
        return taskManagementService.updateTask(id, taskDetails);
    }
}
