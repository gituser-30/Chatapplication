

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import protect from "./middleware/authMiddleware.js";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

// 🔧 FIX __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://dbatuscholarhub-chatapp.onrender.com"
  ],
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);



app.use(express.static(path.join(__dirname, "client", "dist")));



// SPA fallback (Express v5 safe)
app.use((req, res, next) => {
  if (req.method !== "GET") return next();
  if (req.path.startsWith("/api")) return next();

  res.sendFile(
    path.resolve(__dirname, "client", "dist", "index.html")
  );
});



app.get("/", (req, res) => {
  res.send("chat server is running");
});

app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "You are authorized", userId: req.userId });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://dbatuscholarhub-chatapp.onrender.com"
    ],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log("User joined room:", userId);
  });

  socket.on("sendMessage", ({ receiverId, message }) => {
    io.to(receiverId.toString()).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

