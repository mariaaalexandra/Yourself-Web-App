package com.app.repository;

import com.app.models.WidgetLayout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WidgetLayoutRepository extends JpaRepository<WidgetLayout, String> {
}
