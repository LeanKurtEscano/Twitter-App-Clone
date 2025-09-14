package com.example.twitter_clone.repo;



import com.example.twitter_clone.model.Post;
import com.example.twitter_clone.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUser(User user);
    List<Post> findByUserId(Long userId);
}