package com.example.twitter_clone.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;





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
    @ManyToOne(optional = false)
    @JoinColumn(name = "from_user_id", nullable = false)
    private User from;

    // User who receives the notification
    @ManyToOne(optional = false)
    @JoinColumn(name = "to_user_id", nullable = false)
    private User to;

    // Type of notification: FOLLOW, LIKE, COMMENT

    @Column(nullable = false)
    private String type;

    // Related post (optional, e.g. like/comment notifications)
    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    // Related comment (optional, e.g. comment notifications)
    @ManyToOne
    @JoinColumn(name = "comment_id")
    private Comment comment;

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
