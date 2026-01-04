const RightChatbar = ({ selectedUser, isOnline }) => {
  if (!selectedUser) return null;

  return (
    <div className="h-100 p-3 right-panel">
      <div className="profile-card text-center">

        {/* Avatar + Status */}
        <div className="position-relative mx-auto mb-3" style={{ width: "80px" }}>
          <div
            className="profile-avatar d-flex align-items-center justify-content-center"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              fontSize: "30px",
            }}
          >
            {selectedUser.name.charAt(0).toUpperCase()}
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

        <h5 className="mb-1">{selectedUser.name}</h5>
        <small className="text-muted">
          {isOnline ? "Online" : "Offline"}
        </small>

        <hr />

        <p className="small mb-1">
          <strong>Status:</strong>{" "}
          <span className={isOnline ? "text-success" : "text-secondary"}>
            {isOnline ? "Active" : "Offline"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default RightChatbar;
