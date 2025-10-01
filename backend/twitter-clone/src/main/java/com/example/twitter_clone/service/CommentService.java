package com.example.twitter_clone.service;


import com.example.twitter_clone.controller.NotificationController;
import com.example.twitter_clone.dto.CommentDTO;
import com.example.twitter_clone.exception.NotFoundException;
import com.example.twitter_clone.model.Comment;
import com.example.twitter_clone.model.Notification;
import com.example.twitter_clone.model.Post;
import com.example.twitter_clone.model.User;
import com.example.twitter_clone.repo.CommentRepository;
import com.example.twitter_clone.repo.NotificationRepository;
import com.example.twitter_clone.repo.PostRepository;
import com.example.twitter_clone.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepo;


    @Autowired
    private PostRepository postRepo;


    @Autowired
    private UserRepository userRepo;


    @Autowired
    private NotificationRepository notificationRepo;

    @Autowired
    private NotificationController notificationController;

    public void createComment(CommentDTO dto) {
        User user = userRepo.findByClerkId(dto.getClerkUserId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        Post post = postRepo.findById(dto.getPostId())
                .orElseThrow(() -> new NotFoundException("Post not found"));

        Comment comment = Comment.builder()
                .user(user)
                .post(post)
                .content(dto.getContent())
                .build();

        commentRepo.save(comment);


        if (!post.getUser().getId().equals(user.getId())) {
            Notification notification = Notification.builder()
                    .from(user)
                    .to(post.getUser())
                    .type("comment")
                    .post(post)
                    .comment(comment)
                    .build();
            notificationRepo.save(notification);

            notificationController.sendNotificationToUser(
                    String.valueOf(post.getUser().getId()),
                    notification
            );
        }


    }

    public List<Comment> getAllComments(Long postId) {
        Post post = postRepo.findById(postId)
                .orElseThrow(() -> new NotFoundException("Post not found"));

        return commentRepo.findByPostOrderByCreatedAtDesc(post);
    }


    @Transactional
    public void deleteComment(Long commentId) {
        Comment comment = commentRepo.findById(commentId).orElseThrow(() -> new NotFoundException("comment not found"));
        commentRepo.delete(comment);
    }


}
