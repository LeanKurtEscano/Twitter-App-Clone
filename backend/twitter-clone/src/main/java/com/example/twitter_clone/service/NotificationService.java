package com.example.twitter_clone.service;

import com.example.twitter_clone.exception.NotFoundException;
import com.example.twitter_clone.model.Notification;
import com.example.twitter_clone.model.User;
import com.example.twitter_clone.repo.NotificationRepository;
import com.example.twitter_clone.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepo;

    @Autowired
    private UserRepository userRepo;



    public List<Notification> getNotifications(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        return notificationRepo.findByToOrderByCreatedAtDesc(user);
    }

    public void deleteNotification(Long notificationId) {
        Notification notification = notificationRepo.findById(notificationId)
                .orElseThrow(() -> new NotFoundException("Notification not found"));
        notificationRepo.delete(notification);
    }


}
