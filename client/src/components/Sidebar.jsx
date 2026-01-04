

import { useEffect, useState } from "react";
import socket from "../socket";

const Sidebar = ({
  users = [],
  selectedUser,
  setSelectedUser,
  setIsMobileChatOpen,
}) => {
  const [unreadCounts, setUnreadCounts] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  /* =========================
     SOCKET LISTENER
     ========================= */
  useEffect(() => {
    const handleReceiveMessage = (message) => {
      const senderId = message.sender?.toString();

      // Update last message preview
      setLastMessages((prev) => ({
        ...prev,
        [senderId]: message.text,
      }));

      // Increase unread count if chat not open
      if (!selectedUser || selectedUser._id !== senderId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [senderId]: (prev[senderId] || 0) + 1,
        }));
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    return () => socket.off("receiveMessage", handleReceiveMessage);
  }, [selectedUser]);

  /* =========================
     HANDLE USER CLICK
     ========================= */
  const handleSelectUser = (user) => {
    setSelectedUser(user);

    // Clear unread count
    setUnreadCounts((prev) => ({
      ...prev,
      [user._id]: 0,
    }));

    if (setIsMobileChatOpen) {
      setIsMobileChatOpen(true);
    }
  };

  /* =========================
     FILTER USERS (SEARCH)
     ========================= */
  const filteredUsers = users.filter((user) => {
    const name =
      (user.name || user.fullName || "").toLowerCase();
    const email = (user.email || "").toLowerCase();

    return (
      name.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="sidebar-users">
      <h2 className="text-primary">Chats</h2>

      {/* 🔍 SEARCH BAR */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search user..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredUsers.length === 0 ? (
        <div className="text-muted text-center mt-4">
          No users found
        </div>
      ) : (
        filteredUsers.map((user) => {
          const displayName = user.name || user.fullName || "User";
          const unread = unreadCounts[user._id] || 0;

          return (
            <div
              key={user._id}
              className={`sidebar-user ${
                selectedUser?._id === user._id ? "active" : ""
              }`}
              onClick={() => handleSelectUser(user)}
            >
              {/* Avatar */}
              <div className="avatar">
                {displayName.charAt(0).toUpperCase()}
              </div>

              {/* User Info */}
              <div className="user-info">
                <div className="user-name">{displayName}</div>
                <div className="last-message text-muted">
                  {lastMessages[user._id] || "No messages yet"}
                </div>
              </div>

              {/* Unread Badge */}
              {unread > 0 && (
                <span className="unread-badge">
                  {unread}
                </span>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Sidebar;

