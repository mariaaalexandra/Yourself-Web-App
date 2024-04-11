package com.app.security.services;

import com.app.models.Shortcuts;

import java.util.List;

public interface ShortcutsService {
    Shortcuts createShortcut(Shortcuts shortcuts);
    Shortcuts updateShortcut(String id, Shortcuts shortcutsData);
    void deleteShortcut(String id);
    List<Shortcuts> getAllShortcuts();
    Shortcuts getShortcutById(String id);
}
