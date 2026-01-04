import { blockUser } from "../services/userService";

const RightChatbar = ({ selectedUser, onlineUsers = [], onBlock }) => {
  if (!selectedUser) return null;

  const isOnline = onlineUsers.includes(selectedUser._id);
  const displayName = selectedUser.name || selectedUser.fullName || "User";

  const handleBlock = async () => {
    const confirmBlock = window.confirm(
      `Are you sure you want to block ${displayName}?`
    );

    if (!confirmBlock) return;

    try {
      await blockUser(selectedUser._id);
      alert("User blocked successfully");

      if (onBlock) onBlock(); // parent cleanup
    } catch (err) {
      console.error(err);
      alert("Failed to block user");
    }
  };

  return (
    <div className="h-100 p-3 right-panel">
      <div className="profile-card text-center">

        {/* Avatar + Status */}
        <div
          className="position-relative mx-auto mb-3"
          style={{ width: "80px" }}
        >
          <div
            className="profile-avatar d-flex align-items-center justify-content-center"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              fontSize: "30px",
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>

          {/* Online Dot */}
          <span
            style={{
              position: "absolute",
              bottom: "5px",
              right: "5px",
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              backgroundColor: isOnline ? "#22c55e" : "#6b7280",
              border: "2px solid #0b1220",
            }}
          />
        </div>

        <h5 className="mb-1">{displayName}</h5>
        <small className="text-muted">
          {isOnline ? "Online" : "Offline"}
        </small>

        <hr />

        <p className="small mb-3">
          <strong>Status:</strong>{" "}
          <span className={isOnline ? "text-success" : "text-secondary"}>
            {isOnline ? "Active now" : "Offline"}
          </span>
        </p>

        {/* BLOCK BUTTON */}
        <button
          className="btn btn-outline-danger btn-sm w-100"
          onClick={handleBlock}
        >
          🚫 Block User
        </button>
      </div>
    </div>
  );
};

export default RightChatbar;
