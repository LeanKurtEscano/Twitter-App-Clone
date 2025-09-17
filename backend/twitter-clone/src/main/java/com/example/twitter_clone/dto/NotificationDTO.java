package com.example.twitter_clone.dto;

import java.time.LocalDateTime;


import com.example.twitter_clone.model.Notification;
import lombok.*;
import java.time.LocalDateTime;




import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private Long id;
    private String type;
    private LocalDateTime createdAt;

    // From user info
    private UserBasicDTO from;

    // Optional post info
    private PostBasicDTO post;

    // Optional comment info
    private CommentBasicDTO comment;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserBasicDTO {
        private String firstName;
        private String lastName;
        private String username;
        private String profilePicture;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PostBasicDTO {
        private String content;
        private String image;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CommentBasicDTO {
        private String content;
    }

    public static NotificationDTO fromEntity(Notification notif) {
        if (notif == null) return null;

        return NotificationDTO.builder()
                .id(notif.getId())
                .type(notif.getType())
                .createdAt(notif.getCreatedAt())
                .from(notif.getFrom() != null ? UserBasicDTO.builder()
                        .firstName(notif.getFrom().getFirstName())
                        .lastName(notif.getFrom().getLastName())
                        .username(notif.getFrom().getUsername())
                        .profilePicture(notif.getFrom().getProfilePicture())
                        .build() : null)
                .post(notif.getPost() != null ? PostBasicDTO.builder()
                        .content(notif.getPost().getContent())
                        .image(notif.getPost().getImage())
                        .build() : null)
                .comment(notif.getComment() != null ? CommentBasicDTO.builder()
                        .content(notif.getComment().getContent())
                        .build() : null)
                .build();
    }
}