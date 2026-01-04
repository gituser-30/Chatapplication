import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightChatbar from "../components/RightChatbar";
import socket from "../socket";
import { getUsers } from "../services/userService";
const HomePage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [clearChatFn, setClearChatFn] = useState(null);
  const [blockUserFn, setBlockUserFn] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  useEffect(() => {
    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("onlineUsers");
    };
  }, []);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };

    fetchUsers();
  }, []);
  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
      <div
        className="glass-wrapper d-flex"
        style={{ width: "95%", height: "92%" }}
      >
        {/* Sidebar */}
        <div
          className={`sidebar ${isMobileChatOpen ? "d-none d-md-flex" : ""}`}
          style={{ width: "280px" }}
        >
          <Sidebar
            users={users}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            setIsMobileChatOpen={setIsMobileChatOpen}
          />
        </div>

        {/* Chat */}
        <div className={`chat-area flex-grow-1 ${
      !isMobileChatOpen ? "d-none d-md-flex" : ""
    }`}>
          <ChatContainer
            selectedUser={selectedUser}
            onClearChatReady={setClearChatFn}
            onBlockUserReady={setBlockUserFn}
          />
        </div>

        {/* Right Panel */}
        {selectedUser && (
          <div className="right-panel d-none d-md-flex" style={{ width: "300px" }}>
            <RightChatbar
              selectedUser={selectedUser}
              onClearChat={clearChatFn}
              onBlockUser={blockUserFn}
              isOnline={onlineUsers.includes(selectedUser?._id)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
