package com.example.twitter_clone.controller;


import com.example.twitter_clone.dto.CommentDTO;
import com.example.twitter_clone.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;




    @PostMapping("/comment")
    public ResponseEntity<?> createComment(@RequestBody CommentDTO dto){

        commentService.createComment(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body("Comment Created");

    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<?> getPostComments(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getAllComments(postId));
    }


    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.ok(Map.of("message", "Comment deleted successfully"));
    }

}
