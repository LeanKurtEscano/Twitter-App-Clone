package com.example.twitter_clone.model;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User who created the post
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"followers", "following", "posts", "comments"})
    private User user;

    @Column(length = 280)
    private String content;

    @Column(columnDefinition = "TEXT DEFAULT ''")
    private String image;

    // Likes (many users can like many posts)
    @ManyToMany
    @JoinTable(
            name = "post_likes",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Builder.Default
    @JsonIgnoreProperties({"followers","following","posts","comments"})
    private Set<User> likes = new HashSet<>();

    // Comments (one post has many comments)
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Comment> comments = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "retweet_post_id")
    @JsonIgnoreProperties({"likes", "comments", "retweetOf"})
    private Post retweetOf;


    @OneToMany(mappedBy = "retweetOf", cascade = CascadeType.ALL)
    @Builder.Default
    @JsonIgnoreProperties({"likes", "comments", "retweetOf"})
    private Set<Post> retweets = new HashSet<>();


    @Column(updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void setLastUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isRetweet() {
        return retweetOf != null;
    }
}
