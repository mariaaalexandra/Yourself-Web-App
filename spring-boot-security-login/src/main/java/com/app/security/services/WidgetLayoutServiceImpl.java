package com.app.security.services;

import com.app.models.WidgetLayout;
import com.app.repository.ShortcutsRepository;
import com.app.repository.WidgetLayoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WidgetLayoutServiceImpl implements WidgetLayoutService {

    @Autowired
    private WidgetLayoutRepository widgetLayoutRepository;


    @Override
    public WidgetLayout createWidgetLayout(WidgetLayout widgetLayout) {
        System.out.println("Received widget layout: " + widgetLayout);
        System.out.println("Received widget layout: id " + widgetLayout.getId());
        return widgetLayoutRepository.save(widgetLayout);
    }

    @Override
    public WidgetLayout updateWidgetLayout(String id, WidgetLayout widgetLayoutDetails) {
        WidgetLayout existingWidgetLayout = widgetLayoutRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("WidgetLayout not found with id: " + id));
        existingWidgetLayout.setCols(widgetLayoutDetails.getCols());
        existingWidgetLayout.setRows(widgetLayoutDetails.getRows());
        existingWidgetLayout.setX(widgetLayoutDetails.getX());
        existingWidgetLayout.setY(widgetLayoutDetails.getY());
        existingWidgetLayout.setComponentType(widgetLayoutDetails.getComponentType());
        return widgetLayoutRepository.save(existingWidgetLayout);
    }

    @Override
    public void deleteWidgetLayout(String id) {
        widgetLayoutRepository.deleteById(id);
    }

    @Override
    public List<WidgetLayout> getAllWidgetLayouts() {
        return widgetLayoutRepository.findAll();
    }

    @Override
    public WidgetLayout getWidgetLayoutById(String id) {
        return widgetLayoutRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("WidgetLayout not found with id: " + id));
    }
}
