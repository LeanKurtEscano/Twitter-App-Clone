package com.example.twitter_clone.service;

import com.example.twitter_clone.dto.NotificationDTO;
import com.example.twitter_clone.exception.NotFoundException;
import com.example.twitter_clone.model.Notification;
import com.example.twitter_clone.model.User;
import com.example.twitter_clone.repo.NotificationRepository;
import com.example.twitter_clone.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepo;

    @Autowired
    private UserRepository userRepo;


    @Transactional(readOnly = true)
    public List<NotificationDTO> getNotifications(String clerkUserId) {
        Long userId = userRepo.findByClerkId(clerkUserId)
                .orElseThrow(() -> new NotFoundException("User not found"))
                .getId();

        return notificationRepo.findByToIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationDTO::fromEntity)
                .collect(Collectors.toList());
    }


    public void deleteNotification(Long notificationId) {
        Notification notification = notificationRepo.findById(notificationId)
                .orElseThrow(() -> new NotFoundException("Notification not found"));
        notificationRepo.delete(notification);
    }

    public void markAllAsRead(String userId) {
        List<Notification> unreadNotifications = notificationRepo
                .findByToUserIdAndIsReadFalse(userId);

        unreadNotifications.forEach(notification -> notification.setRead(true));

        notificationRepo.saveAll(unreadNotifications);
    }


}
