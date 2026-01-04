// =======================
// Imports (ES Modules)
// =======================
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";

// Routes & Middleware
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import protect from "./middleware/authMiddleware.js";

// =======================
// Config
// =======================
dotenv.config();

const app = express();
const server = http.createServer(app);

// __dirname fix for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =======================
// Middleware
// =======================
app.use(cors({
  origin: "*", // allow Render + frontend
  methods: ["GET", "POST"]
}));
app.use(express.json());

// =======================
// API Routes
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "You are authorized", userId: req.userId });
});

// =======================
// MongoDB
// =======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error:", err));

// =======================
// Serve React Frontend
// =======================
app.use(express.static(path.join(__dirname, "../client/build")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});


// =======================
// Socket.IO
// =======================
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let onlineUsers = new Set();

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("join", (userId) => {
    onlineUsers.add(userId);
    io.emit("onlineUsers", [...onlineUsers]);
  });

  socket.on("disconnect", () => {
    onlineUsers.forEach((id) => {
      if (io.sockets.adapter.rooms.get(id)?.has(socket.id)) {
        onlineUsers.delete(id);
      }
    });
    io.emit("onlineUsers", [...onlineUsers]);
    console.log("🔴 User disconnected:", socket.id);
  });
});

// =======================
// Server Start
// =======================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
