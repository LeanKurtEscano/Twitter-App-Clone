package com.example.twitter_clone.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.socket.config.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Collections;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Autowired
    private JwtDecoder jwtDecoder;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app");
        registry.enableSimpleBroker("/topic", "/queue");
        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    // Extract JWT token from Authorization header
                    String authHeader = accessor.getFirstNativeHeader("Authorization");
                    if (authHeader != null && authHeader.startsWith("Bearer ")) {
                        String token = authHeader.substring(7);

                        try {
                            // Decode and validate JWT
                            var jwt = jwtDecoder.decode(token);
                            String userId = jwt.getClaimAsString("sub"); // Clerk's user ID

                            // Create authentication object
                            Authentication auth = new UsernamePasswordAuthenticationToken(
                                    userId,
                                    null,
                                    Collections.singletonList(new SimpleGrantedAuthority("USER"))
                            );

                            // Set authenticated user
                            accessor.setUser(auth);

                            System.out.println("✅ WebSocket authenticated for user: " + userId);

                        } catch (JwtException e) {
                            System.err.println("❌ WebSocket JWT validation failed: " + e.getMessage());
                            return null; // Reject connection
                        }
                    } else {
                        System.err.println("❌ WebSocket connection missing Authorization header");
                        return null; // Reject connection
                    }
                }

                return message;
            }
        });
    }
}