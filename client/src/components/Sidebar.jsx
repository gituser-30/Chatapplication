import { useEffect, useState } from "react";
import { getUsers } from "../services/userService";

const Sidebar = ({ users = [], selectedUser, setSelectedUser,setIsMobileChatOpen, }) => {
  return (
    <div className="sidebar-users">
        <h2 className="text-primary">Chats</h2>
  {users.length === 0 ? (
    <div className="text-muted text-center mt-4">
      No users found
    </div>
  ) : (
    users.map((user) => (
      <div
        key={user._id}
        className={`sidebar-user ${
          selectedUser?._id === user._id ? "active" : ""
        }`}
        onClick={() => {
  setSelectedUser(user);
   if (setIsMobileChatOpen) {
    setIsMobileChatOpen(true);
  }
}}
      >
        <div className="avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div className="user-info">
          <div className="user-name">{user.name}</div>
          {/* <div className="user-email">{user.email}</div> */}
        </div>
      </div>
    ))
  )}
</div>

  );
};

export default Sidebar;
