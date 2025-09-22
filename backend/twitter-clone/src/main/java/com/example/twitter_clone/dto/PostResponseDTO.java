package com.example.twitter_clone.dto;


import com.example.twitter_clone.model.User;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.example.twitter_clone.model.Comment;
import com.example.twitter_clone.model.Post;
import java.util.stream.Collectors;



@Data
public class PostResponseDTO {
    private Long id;
    private String content;
    private String image;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private UserPostDTO user;


    private List<UserPostDTO> likes; // safe list
    private List<CommentDTO> comments;

    private PostResponseDTO retweetOf;

    @Data
    public static class CommentDTO {
        private Long id;
        private String content;
        private LocalDateTime createdAt;
        private UserPostDTO user;
    }

    @Data
    public static class UserPostDTO {
        private Long id;
        private  String clerkId;
        private String firstName;
        private String lastName;
        private String username;
        private String profilePicture;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    // ---------------- Mappers ---------------- //

    public static PostResponseDTO fromEntity(Post post ,List<Comment> comments) {
        PostResponseDTO dto = new PostResponseDTO();
        dto.setId(post.getId());
        dto.setContent(post.getContent());
        dto.setImage(post.getImage());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());

        // Map user
        dto.setUser(toUserPostDTO(post.getUser()));

        // Map likes safely
        dto.setLikes(post.getLikes() == null
                ? List.of()
                : post.getLikes().stream()
                .map(PostResponseDTO::toUserPostDTO)
                .collect(Collectors.toList())
        );

        // Map comments safely by detaching first
        List<CommentDTO> commentDTOs = comments.stream()
                .map(PostResponseDTO :: toCommentDTO)
                .collect(Collectors.toList());

        dto.setComments(commentDTOs);

        if (post.getRetweetOf() != null) {
            Post original = post.getRetweetOf();
            dto.setRetweetOf(new PostResponseDTO());
            dto.getRetweetOf().setId(original.getId());
            dto.getRetweetOf().setContent(original.getContent());
            dto.getRetweetOf().setImage(original.getImage());
            dto.getRetweetOf().setLikes(original.getLikes().stream().map(PostResponseDTO :: toUserPostDTO).collect(Collectors.toList()));
            dto.getRetweetOf().setCreatedAt(original.getCreatedAt());
            dto.getRetweetOf().setUpdatedAt(original.getUpdatedAt());
            dto.getRetweetOf().setUser(toUserPostDTO(original.getUser()));
        }

        return dto;
    }

    public static CommentDTO toCommentDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUser(toUserPostDTO(comment.getUser()));
        return dto;
    }

    private static UserPostDTO toUserPostDTO(User user) {
        UserPostDTO dto = new UserPostDTO();
        dto.setId(user.getId());
        dto.setClerkId(user.getClerkId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setUsername(user.getUsername());
        dto.setProfilePicture(user.getProfilePicture());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }
}
