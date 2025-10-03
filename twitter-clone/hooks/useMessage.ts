import { useEffect, useRef, useState } from "react";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  Timestamp,
  or,
  and
} from "firebase/firestore";

import { db } from "@/config/firebase";

interface ChatMessage {
  fromId: string;
  toId: string;
  content: string;
  timestamp: number;
}

export const useMessage = (myUserId: string, otherUserId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (!myUserId || !otherUserId) return;

    // Create a query to get messages between the two users
    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      or(
        and(
          where("fromId", "==", myUserId),
          where("toId", "==", otherUserId)
        ),
        and(
          where("fromId", "==", otherUserId),
          where("toId", "==", myUserId)
        )
      ),
      orderBy("timestamp", "asc")
    );

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        messagesData.push({
          fromId: data.fromId,
          toId: data.toId,
          content: data.content,
          timestamp: data.timestamp?.toMillis() || Date.now(),
        });
      });
      setMessages(messagesData);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [myUserId, otherUserId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !myUserId || !otherUserId) return;

    try {
      const messagesRef = collection(db, "messages");
      await addDoc(messagesRef, {
        fromId: myUserId,
        toId: otherUserId,
        content: newMessage.trim(),
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
    scrollViewRef,
  };
};