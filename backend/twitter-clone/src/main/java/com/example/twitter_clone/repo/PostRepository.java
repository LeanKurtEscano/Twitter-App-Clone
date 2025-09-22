package com.example.twitter_clone.repo;



import com.example.twitter_clone.model.Post;
import com.example.twitter_clone.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUser(User user);
    List<Post> findByUserId(Long userId);
    List<Post> findAllByOrderByCreatedAtDesc();
    List<Post> findByUserOrderByCreatedAtDesc(User user);

    @Query("SELECT p FROM Post p LEFT JOIN FETCH p.user ORDER BY p.createdAt DESC")
    List<Post> findAllOrderByCreatedAtDesc();
    Optional<Post>findByUserAndRetweetOf(User user, Post post);

    @Modifying
    @Query(value = "DELETE FROM post_likes WHERE post_id = :postId", nativeQuery = true)
    void deleteLikesByPostId(@Param("postId") Long postId);

    @Modifying
    @Query("DELETE FROM Post p WHERE p.id = :postId")
    void deletePostById(@Param("postId") Long postId);

}