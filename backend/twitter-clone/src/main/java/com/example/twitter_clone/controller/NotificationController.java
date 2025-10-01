package com.example.twitter_clone.controller;


import com.example.twitter_clone.dto.NotificationDTO;
import com.example.twitter_clone.model.Notification;
import com.example.twitter_clone.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();


    @GetMapping("/user/{clerkUserId}")
    public ResponseEntity<?> getNotifications(@PathVariable String clerkUserId) {

        List<NotificationDTO> notifications = notificationService.getNotifications(clerkUserId);

        return ResponseEntity.ok(notifications);
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long notificationId) {
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.ok(Map.of("message", "Notification deleted successfully"));
    }




    @GetMapping(value = "/stream/{userId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamNotifications(@PathVariable String userId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);

        emitters.put(userId, emitter);


        try {
            emitter.send(SseEmitter.event()
                    .name("connected")
                    .data("Connected to notification stream"));
        } catch (IOException e) {
            emitters.remove(userId);
        }


        emitter.onCompletion(() -> {
            emitters.remove(userId);
            System.out.println("SSE completed for user: " + userId);
        });

        emitter.onTimeout(() -> {
            emitters.remove(userId);
            System.out.println("SSE timeout for user: " + userId);
        });

        emitter.onError((e) -> {
            emitters.remove(userId);
            System.out.println("SSE error for user: " + userId);
        });

        return emitter;
    }

    // Method to send notification to specific user via SSE
    public void sendNotificationToUser(String userId, Notification notification) {
        SseEmitter emitter = emitters.get(userId);
        if (emitter != null) {
            try {
                NotificationDTO notificationDTO = NotificationDTO.fromEntity(notification);
                emitter.send(SseEmitter.event()
                        .name("notification")
                        .data(notificationDTO));
            } catch (IOException e) {
                emitters.remove(userId);
                System.err.println("Failed to send notification to user: " + userId);
            }
        }
    }


    @PatchMapping("/user/{userId}/read-all")
    public ResponseEntity<Void> markAllAsRead(@PathVariable String userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.noContent().build();
    }

}



