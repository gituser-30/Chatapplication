// import { useEffect, useRef, useState } from "react";
// import socket from "../socket";
// import { getMessages, sendMessage, clearChat } from "../services/messageService";
// import { blockUser } from "../services/userService";

// const ChatContainer = ({ selectedUser, onClearChat, onBlockUser }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const messagesEndRef = useRef(null);
//     const [onlineUsers, setOnlineUsers] = useState([]);
//   /* =========================
//      LOAD MESSAGES
//      ========================= */
//   useEffect(() => {
//     if (!selectedUser) return;

//     const fetchMessages = async () => {
//       try {
//         const data = await getMessages(selectedUser._id);
//         setMessages(data);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchMessages();
//   }, [selectedUser]);

//   /* =========================
//      SOCKET
//      ========================= */
//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));

//     if (user?.id) {
//       socket.emit("join", user.id);
//     }

//     socket.on("receiveMessage", (data) => {
//       setMessages((prev) => [...prev, data]);
//     });
//     socket.on("onlineUsers", (users) => {
//   setOnlineUsers(users);
// });

//     return () => {
//   socket.off("receiveMessage");
//   socket.off("onlineUsers");
// };

//   }, []);

//   /* =========================
//      AUTO SCROLL
//      ========================= */
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   /* =========================
//      SEND MESSAGE
//      ========================= */
//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim()) return;

//     const user = JSON.parse(localStorage.getItem("user"));

//     const messageData = {
//       sender: user.id,
//       receiverId: selectedUser._id,
//       text: newMessage,
//     };

//     try {
//       await sendMessage(selectedUser._id, newMessage);
//       socket.emit("sendMessage", {
//   receiverId,
//   message: savedMessage,
// });


//       setMessages((prev) => [...prev, messageData]);
//       setNewMessage("");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   /* =========================
//      CLEAR CHAT (EXPOSED)
//      ========================= */
//   const handleClearChat = async () => {
//     if (!window.confirm("Clear this chat?")) return;
//     await clearChat(selectedUser._id);
//     setMessages([]);
//   };

//   /* =========================
//      BLOCK USER (EXPOSED)
//      ========================= */
//   const handleBlockUser = async () => {
//     if (!window.confirm("Block this user?")) return;
//     await blockUser(selectedUser._id);
//     setMessages([]);
//     window.location.reload(); // simple for now
//   };

//   /* expose handlers to parent */
//   useEffect(() => {
//     if (onClearChat) onClearChat(handleClearChat);
//     if (onBlockUser) onBlockUser(handleBlockUser);
//   }, [selectedUser]);

//   if (!selectedUser) {
//     return (
//       <div className="h-100 d-flex align-items-center justify-content-center text-muted">
//         Select a user to start chatting
//       </div>
//     );
//   }

//   return (
//     <div className="chat-area">
//       {/* Header */}
//       <div className="chat-header">
//   <button
//     className="back-btn d-md-none"
//     onClick={() => setIsMobileChatOpen(false)}
//   >
//     ←
//   </button>

//   <strong>{selectedUser.name}</strong>
// </div>

//       {/* Messages */}
//       <div className="chat-messages">
//         {messages.map((msg, index) => {
//           const loggedUser = JSON.parse(localStorage.getItem("user"));
//           const isMe = msg.sender === loggedUser.id;

//           return (
//             <div
//               key={index}
//               className={`mb-3 d-flex ${
//                 isMe ? "justify-content-end" : "justify-content-start"
//               }`}
//             >
//               <div className={`px-3 py-2 ${isMe ? "message-me" : "message-other"}`}>
//                 {msg.text}
//               </div>
//             </div>
//           );
//         })}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//       <form className="chat-input" onSubmit={handleSend}>
//         <input
//           className="form-control"
//           placeholder="Type a message..."
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//         />
//         <button className="btn px-4">Send</button>
//       </form>
//     </div>
//   );
// };

// export default ChatContainer;


import { useEffect, useRef, useState } from "react";
import socket from "../socket";
import { getMessages, sendMessage, clearChat } from "../services/messageService";
import { blockUser } from "../services/userService";

const ChatContainer = ({ selectedUser, onClearChat, onBlockUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

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
     SOCKET SETUP
     ========================= */
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.id) {
      socket.emit("join", user.id); // ✅ join personal room
    }

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  /* =========================
     AUTO SCROLL
     ========================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =========================
     SEND MESSAGE (FIXED)
     ========================= */
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      // 1️⃣ Save message to DB
      const savedMessage = await sendMessage(
        selectedUser._id,
        newMessage
      );

      // 2️⃣ Emit message to receiver
      socket.emit("sendMessage", {
        receiverId: selectedUser._id,
        message: savedMessage,
      });

      // 3️⃣ Update sender UI
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

  /* expose handlers */
  useEffect(() => {
    if (onClearChat) onClearChat(handleClearChat);
    if (onBlockUser) onBlockUser(handleBlockUser);
  }, [selectedUser]);

  if (!selectedUser) {
    return (
      <div className="h-100 d-flex align-items-center justify-content-center text-muted">
        Select a user to start chatting
      </div>
    );
  }

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="chat-area">
      {/* Header */}
      <div className="chat-header">
        <strong>{selectedUser.name || selectedUser.fullName}</strong>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg, index) => {
          const isMe = msg.sender === loggedUser.id;

          return (
            <div
              key={index}
              className={`mb-3 d-flex ${
                isMe ? "justify-content-end" : "justify-content-start"
              }`}
            >
              <div
                className={`px-3 py-2 ${
                  isMe ? "message-me" : "message-other"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
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

