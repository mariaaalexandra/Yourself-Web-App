package com.app.security.services;

import com.app.models.Shortcuts;
import com.app.repository.ShortcutsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShortcutsServiceImpl implements ShortcutsService {

    @Autowired
    private ShortcutsRepository shortcutsRepository;

    @Override
    public Shortcuts createShortcut(Shortcuts shortcuts) {
        return shortcutsRepository.save(shortcuts);
    }

    @Override
    public Shortcuts updateShortcut(String id, Shortcuts shortcutsData) {
        Shortcuts shortcuts = shortcutsRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Shortcut not found with id: " + id));
        shortcuts.setLabel(shortcutsData.getLabel());
        shortcuts.setDescription(shortcutsData.getDescription());
        shortcuts.setIcon(shortcutsData.getIcon());
        shortcuts.setLink(shortcutsData.getLink());
        shortcuts.setUseRouter(shortcutsData.getUseRouter());
        return shortcutsRepository.save(shortcuts);
    }

    @Override
    public void deleteShortcut(String id) {
        shortcutsRepository.deleteById(id);
    }

    @Override
    public List<Shortcuts> getAllShortcuts() {
        return shortcutsRepository.findAll();
    }

    @Override
    public Shortcuts getShortcutById(String id) {
        return shortcutsRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Shortcut not found with id: " + id));
    }
}
