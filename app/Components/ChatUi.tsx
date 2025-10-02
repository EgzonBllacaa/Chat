"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";

type Friend = {
  id: string;
  displayName: string;
  friendshipId: string;
  photoURL?: string; // Add this for friend's profile picture
};

type Message = {
  id: string;
  text: string;
  senderId: string;
  timestamp: Timestamp;
};

const ChatUi = ({ friend }: { friend: Friend }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const lastMessageRef = useRef<HTMLDivElement>(null);

  // Getting latest message
  useEffect(() => {
    if (!friend?.friendshipId) return;

    const messagesRef = collection(
      db,
      "friendships",
      friend.friendshipId,
      "messages"
    );
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [friend]);
  // Scroll to the latest message
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  // Sending message easy
  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return; // Prevent empty messages

    try {
      const messageRef = collection(
        db,
        "friendships",
        friend.friendshipId,
        "messages"
      );
      await addDoc(messageRef, {
        text: newMessage,
        senderId: user?.uid,
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  const formatTime = (timestamp: Timestamp | undefined): string => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center pl-14 p-4 border-b  bg-white">
        <Image
          width={40}
          height={40}
          src={friend?.photoURL || "https://picsum.photos/200/300"}
          className="w-10 h-10 rounded-full"
          alt={friend.displayName}
        />
        <div className="ml-3 text-zinc-600">
          <span className="text-lg font-bold">
            {friend.displayName.charAt(0).toUpperCase() +
              friend.displayName.slice(1)}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-2 overflow-y-scroll min-h-0 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === user?.uid ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                message.senderId === user?.uid
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none border border-zinc-200"
              }`}
            >
              <p>{message.text}</p>
              <span
                className={`text-xs block mt-1 ${
                  message.senderId === user?.uid
                    ? "text-blue-200"
                    : "text-gray-400 hover:text-gray-900"
                }`}
              >
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        ))}
        <div ref={lastMessageRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 border-t  bg-white ">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 placeholder:text-zinc-400 text-zinc-600 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatUi;
