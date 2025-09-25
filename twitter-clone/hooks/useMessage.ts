import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuth } from "@clerk/clerk-expo";

const expo_url = process.env.EXPO_PUBLIC_IP_URL;
interface ChatMessage {
  fromId: string;
  toId: string;
  content: string;
  timestamp: number;
}

export const useMessage = (myUserId: string, otherUserId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [connected, setConnected] = useState(false); 
  const clientRef = useRef<Client | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const setupClient = async () => {
      const token = await getToken(); // ✅ wait for Clerk token

      const client = new Client({
        webSocketFactory: () => new SockJS(`${expo_url}/ws`),
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        reconnectDelay: 5000,
        onConnect: () => {
          if (!isMounted) return;
          console.log("✅ Connected to WebSocket");
          setConnected(true);

          client.subscribe("/user/queue/messages", (msg) => {
            const body: ChatMessage = JSON.parse(msg.body);
            setMessages((prev) => [...prev, body]);
          });
        },
        onDisconnect: () => {
          console.log("❌ Disconnected from WebSocket");
          setConnected(false);
        },
      });

      client.activate();
      clientRef.current = client;
    };

    setupClient();

    return () => {
      isMounted = false;
      clientRef.current?.deactivate();
      clientRef.current = null;
    };
  }, [myUserId, getToken]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    if (!connected || !clientRef.current) {
      console.warn("⚠️ Cannot send message, not connected yet");
      return;
    }

    const msg: ChatMessage = {
      fromId: myUserId,
      toId: otherUserId,
      content: newMessage,
      timestamp: Date.now(),
    };

    clientRef.current.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(msg),
    });

    setMessages((prev) => [...prev, msg]); 
    setNewMessage("");
  };

  return { messages, newMessage, setNewMessage, sendMessage, connected };
};
