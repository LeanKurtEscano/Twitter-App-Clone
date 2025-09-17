package com.example.twitter_clone.repo;


import com.example.twitter_clone.model.Notification;
import com.example.twitter_clone.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByTo(User to);
    List<Notification> findByToId(Long toUserId);
    @Query("SELECT n FROM Notification n JOIN FETCH n.from LEFT JOIN FETCH n.post LEFT JOIN FETCH n.comment WHERE n.to.id = :userId ORDER BY n.createdAt DESC")
    List<Notification> findByToIdOrderByCreatedAtDesc(@Param("userId") Long userId);
    List<Notification> findByToOrderByCreatedAtDesc(User toUser);

}
