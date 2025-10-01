package com.example.twitter_clone.controller;


import com.example.twitter_clone.dto.LikePostDTO;
import com.example.twitter_clone.dto.PostDTO;
import com.example.twitter_clone.dto.PostResponseDTO;
import com.example.twitter_clone.dto.RetweetDTO;
import com.example.twitter_clone.model.Post;
import com.example.twitter_clone.model.User;
import com.example.twitter_clone.service.PostService;
import com.example.twitter_clone.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private UserService userService;


  //<List<PostResponseDTO>>
    @GetMapping("/allPosts")
    public ResponseEntity<?>  getAllPosts() {
        System.out.println(postService.getAllPosts());
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @GetMapping("{postId}")
    public ResponseEntity<?> getPost(@PathVariable Long postId) {
        Post post = postService.getPostById(postId); // your service method
        return ResponseEntity.ok(post);
    }



    @GetMapping("/user/{username}")
    public ResponseEntity<?> getUserPosts(@PathVariable String username) {
        System.out.println(username);
        User user = userService.getUserByUsername(username);
        List<PostResponseDTO> posts = postService.getPostsByUser(user);
        return ResponseEntity.ok(posts);
    }


    @PostMapping("/posts")
    public ResponseEntity<Post> createPost(@RequestBody PostDTO postDTO) {
        System.out.println(postDTO);
        Post post = postService.createPost(
              postDTO
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(post);
    }

    @PostMapping("/{postId}/retweet")
    public ResponseEntity<?> retweetPost(@PathVariable Long postId, @RequestBody RetweetDTO dto ){


        postService.retweetPost(postId,dto);


        return ResponseEntity.ok("Successfully Retweeted Post");
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<?> likePost(@PathVariable Long postId,
                                      @RequestBody LikePostDTO likeDTO) {
        String message = postService.toggleLike(postId, likeDTO.getUserClerkId());
        return ResponseEntity.ok(Map.of("message", message));
    }




    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable Long postId) {
        postService.deletePost(postId);
        return ResponseEntity.ok(Map.of("message", "Post deleted successfully"));
    }


    @GetMapping("/search")
    public ResponseEntity<?> searchPosts(
            @RequestParam String query,
            @RequestParam(required = false) String topic
    ) {
        System.out.println("Post search request");
        System.out.println("Query: " + query);
        System.out.println("Topic: " + topic);

        List<PostResponseDTO> posts;

        if ("top".equalsIgnoreCase(topic)) {
            posts = postService.searchMostTrendingPosts(query);
        } else {
            posts = postService.searchPostsLatest(query);
        }

        System.out.println(posts);
        return ResponseEntity.ok(posts);
    }


}
