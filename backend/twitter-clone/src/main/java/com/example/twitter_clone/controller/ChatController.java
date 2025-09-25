package com.example.twitter_clone.controller;



// ChatController.java
import com.example.twitter_clone.dto.ChatMessageDTO;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.security.core.Authentication;
import org.springframework.messaging.handler.annotation.Header;
import java.security.Principal;

@Controller
public class ChatController {
    private final SimpMessagingTemplate template;

    public ChatController(SimpMessagingTemplate template) {
        this.template = template;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(ChatMessageDTO message, Principal principal) {
        // Get authenticated user ID from JWT
        String authenticatedUserId = principal.getName();

        // Security check: ensure sender matches authenticated user
        if (!authenticatedUserId.equals(message.getFromId())) {
            System.err.println("⚠️ Security violation: User " + authenticatedUserId +
                    " tried to send message as " + message.getFromId());
            return; // Reject message
        }

        // Set server timestamp
        message.setTimestamp(System.currentTimeMillis());

        // TODO: Save message to database here
        // messageService.saveMessage(message);

        System.out.println("📤 Sending message from " + message.getFromId() +
                " to " + message.getToId() + ": " + message.getContent());

        // Send to recipient's private queue
        template.convertAndSendToUser(
                message.getToId(),
                "/queue/messages",
                message
        );

        // Optionally send delivery confirmation back to sender
        template.convertAndSendToUser(
                message.getFromId(),
                "/queue/delivery-status",
                createDeliveryStatus(message, "SENT")
        );
    }

    private Object createDeliveryStatus(ChatMessageDTO message, String status) {
        return new Object() {
            public final String messageId = String.valueOf(message.getTimestamp());
            public final String status = "SENT";
            public final long timestamp = System.currentTimeMillis();
        };
    }
}