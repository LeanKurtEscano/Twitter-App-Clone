package com.example.twitter_clone.model;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import jakarta.persistence.Entity;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Follow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "follower_id")
    @JsonBackReference
    private User follower;

    @ManyToOne
    @JoinColumn(name = "followed_id")
    @JsonBackReference
    private User followed;

    @Transient
    public Long getFollowerId() {
        return follower != null ? follower.getId() : null;
    }

    @Transient
    public Long getFollowedId() {
        return followed != null ? followed.getId() : null;
    }

    private LocalDateTime followedAt = LocalDateTime.now();
}