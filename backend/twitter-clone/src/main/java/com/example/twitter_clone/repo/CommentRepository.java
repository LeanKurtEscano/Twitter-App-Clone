package com.example.twitter_clone.repo;

import com.example.twitter_clone.model.Comment;
import com.example.twitter_clone.model.Post;
import com.example.twitter_clone.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPost(Post post);
    List<Comment> findByPostId(Long postId);
    List<Comment> findByUser(User user);
    List<Comment> findByUserId(Long userId);

    List<Comment> findByPostOrderByCreatedAtDesc(Post post);
}