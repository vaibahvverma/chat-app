import { useEffect } from "react";
import { useSocketContext } from "./SocketContext.jsx";
import useConversation from "../zustand/useConversation.js";
import sound from "../assets/notification.mp3";

const useGetSocketMessage = () => {
  const { socket } = useSocketContext();

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      // Read current state directly from Zustand store to avoid stale closure
      const { messages, setMessage, selectedConversation } =
        useConversation.getState();

      // Only append if this message belongs to the currently open conversation
      const isRelevant =
        selectedConversation &&
        (newMessage.senderId === selectedConversation._id ||
          newMessage.receiverId === selectedConversation._id);

      if (isRelevant) {
        // Prevent duplicate messages (sender already added it via HTTP response)
        const alreadyExists = messages.some((m) => m._id === newMessage._id);
        if (!alreadyExists) {
          const notification = new Audio(sound);
          notification.play().catch(() => {}); // ignore autoplay policy errors
          setMessage([...messages, newMessage]);
        }
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket]); // only re-register when socket changes, NOT on every message
};

export default useGetSocketMessage;
