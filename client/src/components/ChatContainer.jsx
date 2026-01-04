import { useEffect, useRef, useState } from "react";
import socket from "../socket";
import { getMessages, sendMessage, clearChat } from "../services/messageService";
import { blockUser } from "../services/userService";

const ChatContainer = ({ selectedUser, onClearChat, onBlockUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const activeChatRef = useRef(null);

  /* =========================
     TRACK ACTIVE CHAT
     ========================= */
  useEffect(() => {
    activeChatRef.current = selectedUser?._id?.toString() || null;
  }, [selectedUser]);

  /* =========================
     LOAD MESSAGES
     ========================= */
  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      try {
        const data = await getMessages(selectedUser._id);
        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
  }, [selectedUser]);

  /* =========================
     SOCKET (ONLY ONCE)
     ========================= */
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.id) {
      socket.emit("join", user.id);
    }

    const handleReceiveMessage = (message) => {
      const senderId = message.sender?.toString();
      const receiverId = message.receiver?.toString();

      if (
        activeChatRef.current &&
        (senderId === activeChatRef.current ||
          receiverId === activeChatRef.current)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, []);

  /* =========================
     AUTO SCROLL
     ========================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =========================
     SEND MESSAGE
     ========================= */
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const savedMessage = await sendMessage(
        selectedUser._id,
        newMessage
      );

      socket.emit("sendMessage", {
        receiverId: selectedUser._id,
        message: savedMessage,
      });

      setMessages((prev) => [...prev, savedMessage]);
      setNewMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     CLEAR CHAT
     ========================= */
  const handleClearChat = async () => {
    if (!window.confirm("Clear this chat?")) return;
    await clearChat(selectedUser._id);
    setMessages([]);
  };

  /* =========================
     BLOCK USER
     ========================= */
  const handleBlockUser = async () => {
    if (!window.confirm("Block this user?")) return;
    await blockUser(selectedUser._id);
    setMessages([]);
    window.location.reload();
  };

  useEffect(() => {
    if (onClearChat) onClearChat(handleClearChat);
    if (onBlockUser) onBlockUser(handleBlockUser);
  }, [selectedUser]);

  if (!selectedUser) {
    return (
      <div className="h-100 d-flex align-items-center justify-content-center text-warning">
        Select a user to start chatting. This Website is for helping Students in their Studies 
        Be careful While doing Conversation with Other users.
      </div>
    );
  }

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="chat-area">
      <div className="chat-header">
        <strong>{selectedUser.name || selectedUser.fullName}</strong>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => {
          const isMe = msg.sender?.toString() === loggedUser.id;

          return (
            <div
              key={index}
              className={`mb-3 d-flex ${
                isMe ? "justify-content-end" : "justify-content-start"
              }`}
            >
              <div className={`px-3 py-2 ${isMe ? "message-me" : "message-other"}`}>
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={handleSend}>
        <input
          className="form-control"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="btn px-4">Send</button>
      </form>
    </div>
  );
};

export default ChatContainer;

