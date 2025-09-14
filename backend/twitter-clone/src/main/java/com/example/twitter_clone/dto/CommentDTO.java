package com.example.twitter_clone.dto;


import lombok.Data;

@Data
public class CommentDTO {
    private Long userId;   // who is commenting
    private Long postId;   // which post
    private String content;
}
