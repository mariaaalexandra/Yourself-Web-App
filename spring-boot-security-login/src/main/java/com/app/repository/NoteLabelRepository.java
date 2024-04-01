package com.app.repository;


import com.app.models.BoardLabel;
import com.app.models.Label;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface NoteLabelRepository extends JpaRepository<Label, Integer> {

    List<Label> findAll(Sort sort);

    List<Label> findByTitleContaining(String title);
    @Query(value = "SELECT l.* FROM label l INNER JOIN label_user_id li ON l.id = li.label_id WHERE li.user_id = :userId", nativeQuery = true)
    List<Label> findByUserId(@Param("userId") Long userId);

}
