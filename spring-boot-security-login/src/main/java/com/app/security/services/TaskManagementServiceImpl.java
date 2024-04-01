package com.app.security.services;

import com.app.models.TaskManagement;

import com.app.repository.TaskManagementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskManagementServiceImpl implements TaskManagementService {

    @Autowired
    private TaskManagementRepository taskManagementRepository;

    @Override
    public TaskManagement findById(int id) {
        return taskManagementRepository.findById(id).orElse(null);
    }

    @Override
    public List<TaskManagement> findAll() {
        return taskManagementRepository.findAll();
    }

    @Override
    public TaskManagement save(TaskManagement taskManagement) {
        return taskManagementRepository.save(taskManagement);
    }


    @Override
    public List<TaskManagement> findByUserId(Long userId) {
        return taskManagementRepository.findByUserId(userId);
    }


    @Override
    public void deleteById(int id) {
        taskManagementRepository.deleteById(id);
    }

    @Override
    public TaskManagement updateTask(int id, TaskManagement taskDetails) {
        TaskManagement task = taskManagementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id " + id));

        task.setTitle(taskDetails.getTitle());
        task.setType(taskDetails.getType());
        task.setNotes(taskDetails.getNotes());
        task.setCompleted(taskDetails.isCompleted());
        task.setDueDate(taskDetails.getDueDate());
        task.setPriority(taskDetails.getPriority());
        task.setTags(taskDetails.getTags());
        task.setOrder(taskDetails.getOrder());
        // Update other fields as necessary

        return taskManagementRepository.save(task);
    }

    // Implement more methods as required
}
