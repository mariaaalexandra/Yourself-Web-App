package com.app.repository;

import com.app.models.BoardLabel;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardLabelRepository extends JpaRepository<BoardLabel, Integer> {
}
