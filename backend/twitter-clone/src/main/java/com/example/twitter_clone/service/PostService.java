package com.example.twitter_clone.service;


import ch.qos.logback.core.BasicStatusManager;
import com.example.twitter_clone.controller.NotificationController;
import com.example.twitter_clone.dto.PostDTO;
import com.example.twitter_clone.dto.PostResponseDTO;
import com.example.twitter_clone.dto.RetweetDTO;
import com.example.twitter_clone.exception.NotFoundException;
import com.example.twitter_clone.model.Comment;
import com.example.twitter_clone.model.Notification;
import com.example.twitter_clone.model.Post;
import com.example.twitter_clone.model.User;
import com.example.twitter_clone.repo.CommentRepository;
import com.example.twitter_clone.repo.NotificationRepository;
import com.example.twitter_clone.repo.PostRepository;
import com.example.twitter_clone.repo.UserRepository;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private CommentRepository commentRepo;


    @Autowired
    private CommentService commentService;

    @Autowired
    private NotificationRepository notificationRepo;



    @Autowired
    private NotificationController notificationController;

    /*
      public List<Post> getAllPost() {
            return postRepo.findAll();
        }
    
        public List<PostResponseDTO> getAllPost() {
            List<Post> post = postRepo.findAll();
            return post.stream().map(PostResponseDTO :: fromEntity)
                    .collect(Collectors.toList());
        }
    
    
    */
public List<PostResponseDTO> getAllPosts() {
    List<Post> posts = postRepo.findAllOrderByCreatedAtDesc();

    return posts.stream()
            .map(post -> {
                List<Comment> postComments = commentService.getAllComments(post.getId());
                return PostResponseDTO.fromEntity(post, postComments);
            })
            .collect(Collectors.toList());
}




    public Post getPostById(Long id) {
        return postRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Post not found with id " + id));
    }


    public List<PostResponseDTO> getPostsByUser(User user) {
        List<Post> posts = postRepo.findByUserOrderByCreatedAtDesc(user);

        return posts.stream()
                .map(post ->  {
                    List<Comment> comments =  commentService.getAllComments(post.getId());
                    return PostResponseDTO.fromEntity(post, comments);

                }).collect(Collectors.toList());
    }


    public String toggleLike(Long postId, String userClerkId) {
        Post post = postRepo.findById(postId)
                .orElseThrow(() -> new NotFoundException("Post not found"));

        User user = userRepo.findByClerkId(userClerkId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        // Defensive: ensure post.getLikes() is a Set
        Set<User> likes = post.getLikes();

        if (likes.contains(user)) {
            // unlike
            likes.remove(user);
            postRepo.save(post);
            return "Post unliked successfully";
        } else {
            // like
            likes.add(user);
            postRepo.save(post);

            if (!post.getUser().getClerkId().equals(userClerkId)) {
                Notification notification = Notification.builder()
                        .from(user)
                        .to(post.getUser())
                        .type("like")
                        .post(post)
                        .build();
                notificationRepo.save(notification);


                notificationController.sendNotificationToUser(
                        String.valueOf(post.getUser().getId()),
                        notification
                );
            }

            return "Post liked successfully";
        }
    }


    public Post createPost(PostDTO postDTO) {
        // Find the user by id or username inside the DTO (you need to include it there)
        User user = userRepo.findByClerkId(postDTO.getClerkUserId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        Post post = Post.builder()
                .user(user)
                .content(postDTO.getContent())
                .image(postDTO.getImage() != null ? postDTO.getImage() : "")
                .build();

        return postRepo.save(post);
    }



    @Transactional
    public void deletePost(Long postId) {
        commentRepo.deleteByPostId(postId);

        postRepo.deleteLikesByPostId(postId);

        postRepo.deletePostById(postId);
    }



    public void retweetPost(Long postId, RetweetDTO dto) {
        User user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post originalPost = postRepo.findById(postId)
                .orElseThrow(() -> new RuntimeException("Original post not found"));

        // Check if the user already retweeted this post
        Optional<Post> existingRetweet = postRepo.findByUserAndRetweetOf(user, originalPost);

        if (existingRetweet.isPresent()) {

            postRepo.delete(existingRetweet.get());
            return;

        }


        Post retweet = Post.builder()
                .user(user)
                .content(dto.getComment())
                .retweetOf(originalPost)
                .build();

        postRepo.save(retweet);


        Notification notification = Notification.builder()
                .from(user)
                .to(originalPost.getUser())
                .type("retweet")
                .post(originalPost)
                .build();

        notificationController.sendNotificationToUser(
                String.valueOf(originalPost.getUser().getId()),
                notification
        );

        if (!user.equals(originalPost.getUser())) {
            notificationRepo.save(notification);
        }

    }


    public List<PostResponseDTO> searchPostsLatest(String keyword) {
        List<Post> posts = postRepo.findByContentContainingIgnoreCaseOrderByCreatedAtDesc(keyword);

        return posts.stream().map(
                post ->  {
                    List<Comment> comments = commentService.getAllComments(post.getId());
                    return  PostResponseDTO.fromEntity(post, comments);
                }
        ).collect(Collectors.toList());
    }


    public List<PostResponseDTO> searchMostTrendingPosts(String keyword) {
        List<Post> posts = postRepo.findAllOrderByLikesDescWithKeyword(keyword);

        return posts.stream().map(
                post ->  {
                    List<Comment> comments = commentService.getAllComments(post.getId());
                    return  PostResponseDTO.fromEntity(post, comments);
                }
        ).collect(Collectors.toList());
    }



}




