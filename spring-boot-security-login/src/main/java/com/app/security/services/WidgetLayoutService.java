package com.app.security.services;

import com.app.models.WidgetLayout;

import java.util.List;

public interface WidgetLayoutService {
    WidgetLayout createWidgetLayout(WidgetLayout widgetLayout);
    WidgetLayout updateWidgetLayout(String id, WidgetLayout widgetLayout);
    void deleteWidgetLayout(String id);
    List<WidgetLayout> getAllWidgetLayouts();
    WidgetLayout getWidgetLayoutById(String id);
}
