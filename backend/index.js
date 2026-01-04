const express = require("express");
const path = require("path");

const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();
const protect = require("./middleware/authMiddleware");
const app = express();
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");

app.use(cors());
app.use(express.json());
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

mongoose.connect(process.env.MONGO_URI).then(()=>console.log("MongoDB Connected")).catch((err)=>console.log(err));

app.get("/",(req,res)=>{
    res.send("chat server is running");
});

app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "You are authorized", userId: req.userId });
});

app.use("/api/auth",authRoutes);

app.use(express.static(path.join(__dirname, "client", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});


const PORT = process.env.PORT || 5000;
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
let onlineUsers = new Set();
io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    onlineUsers.add(userId);

    io.emit("onlineUsers", Array.from(onlineUsers));
  });

  socket.on("disconnect", () => {
    onlineUsers.forEach((id) => {
      if (io.sockets.adapter.rooms.get(id)?.has(socket.id)) {
        onlineUsers.delete(id);
      }
    });

    io.emit("onlineUsers", Array.from(onlineUsers));
  });
});



server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
