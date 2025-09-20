package com.example.twitter_clone.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User who triggered the notification
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "from_user_id", nullable = false)
    @JsonIgnoreProperties({"followers", "following", "posts", "comments", "hibernateLazyInitializer", "handler"})
    private User from;

    // User who receives the notification
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "to_user_id", nullable = false)
    @JsonIgnoreProperties({"followers", "following", "posts", "comments", "hibernateLazyInitializer", "handler"})
    private User to;

    @Column(nullable = false)
    private String type;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "post_id",
            foreignKey = @ForeignKey(
                    name = "fk_notifications_posts",
                    foreignKeyDefinition = "FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE SET NULL"
            )
    )
    private Post post;

    // Related comment (optional)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "comment_id",
            foreignKey = @ForeignKey(
                    name = "fk_notifications_comments",
                    foreignKeyDefinition = "FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE SET NULL"
            )
    )
    private Comment comment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "notification_id",
            foreignKey = @ForeignKey(
                    name = "fk_notifications_notifications",
                    foreignKeyDefinition = "FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE SET NULL"
            )
    )
    private Notification notification;

    @Column(updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void setLastUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}