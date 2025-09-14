package com.example.twitter_clone.repo;


import com.example.twitter_clone.model.Notification;
import com.example.twitter_clone.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByTo(User to);
    List<Notification> findByToId(Long toUserId);
    List<Notification> findByToOrderByCreatedAtDesc(User toUser);

}
