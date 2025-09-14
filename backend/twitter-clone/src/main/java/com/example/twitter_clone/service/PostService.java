package com.example.twitter_clone.service;


import com.example.twitter_clone.dto.PostDTO;
import com.example.twitter_clone.exception.NotFoundException;
import com.example.twitter_clone.model.Notification;
import com.example.twitter_clone.model.Post;
import com.example.twitter_clone.model.User;
import com.example.twitter_clone.repo.NotificationRepository;
import com.example.twitter_clone.repo.PostRepository;
import com.example.twitter_clone.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepo;

    @Autowired
    private UserRepository userRepo;



    @Autowired
    private NotificationRepository notificationRepo;



    public List<Post> getAllPost() {
        return postRepo.findAllByOrderByCreatedAtDesc();

    }


    public Post getPostById(Long id) {
        return postRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Post not found with id " + id));
    }


    public List<Post> getPostsByUser(User user) {
        return postRepo.findByUserOrderByCreatedAtDesc(user);
    }


    public Post createPost(PostDTO postDTO) {
        // Find the user by id or username inside the DTO (you need to include it there)
        User user = userRepo.findById(postDTO.getUserId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        Post post = Post.builder()
                .user(user)
                .content(postDTO.getContent())
                .image(postDTO.getImage() != null ? postDTO.getImage() : "")
                .build();

        return postRepo.save(post);
    }


    public String toggleLike(Long postId, Long userId) {
        Post post = postRepo.findById(postId)
                .orElseThrow(() -> new NotFoundException("Post not found"));

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        boolean isLiked = post.getLikes().contains(user);

        if (isLiked) {
            // unlike
            post.getLikes().remove(user);
            postRepo.save(post);
            return "Post unliked successfully";
        } else {
            // like
            post.getLikes().add(user);
            postRepo.save(post);

            // create notification if not liking own post
            if (!post.getUser().getId().equals(userId)) {
                Notification notification = Notification.builder()
                        .from(user)
                        .to(post.getUser())
                        .type("like")
                        .post(post)
                        .build();
                notificationRepo.save(notification);
            }

            return "Post liked successfully";
        }
    }

    public void deletePost(Long postId) {
        Post post = postRepo.findById(postId)
                .orElseThrow(() -> new NotFoundException("Post not found"));
        postRepo.delete(post);
    }
}




