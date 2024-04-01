package com.app.repository;

import com.app.models.Label;
import com.app.models.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Integer> {
    @Query(value = "SELECT n.* FROM note n INNER JOIN note_user_id ni ON n.id = ni.note_id WHERE ni.user_id = :userId", nativeQuery = true)
    List<Note> findByUserId(@Param("userId") Long userId);
}
