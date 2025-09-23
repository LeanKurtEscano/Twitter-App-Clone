import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuth } from "@clerk/clerk-expo";
interface ChatMessage {
    fromId: string;
    toId: string;
    content: string;
    timestamp: number;
}

export const useMessage = (myUserId: string, otherUserId: string) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const clientRef = useRef<Client | null>(null);
    const { getToken } = useAuth();

    useEffect(() => {
        const client = new Client({
            // Using SockJS
            webSocketFactory: () => new SockJS("http://192.168.1.5:8080/ws"),
           
            connectHeaders: {
                Authorization: `Bearer ${getToken()}`,
            },
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("Connected");

                // Subscribe to my personal queue
                client.subscribe("/user/queue/messages", (msg) => {
                    const body: ChatMessage = JSON.parse(msg.body);
                    setMessages((prev) => [...prev, body]);
                });
            },
        });

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, [myUserId]);

    const sendMessage = () => {
        if (!newMessage.trim()) return;

        const msg: ChatMessage = {
            fromId: myUserId,
            toId: otherUserId,
            content: newMessage,
            timestamp: Date.now(),
        };

        clientRef.current?.publish({
            destination: "/app/chat.send",
            body: JSON.stringify(msg),
        });

        setMessages((prev) => [...prev, msg]); // optimistic update
        setNewMessage("");
    };

    return { messages, newMessage, setNewMessage, sendMessage };
};
