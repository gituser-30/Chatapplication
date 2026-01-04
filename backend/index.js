// // const express = require("express");
// // const path = require("path");

// // const mongoose = require("mongoose");
// // const cors = require("cors");
// // const authRoutes = require("./routes/authRoutes");
// // require("dotenv").config();
// // const protect = require("./middleware/authMiddleware");
// // const app = express();
// // const userRoutes = require("./routes/userRoutes");
// // const messageRoutes = require("./routes/messageRoutes");

// // app.use(cors());
// // app.use(express.json());
// // app.use("/api/messages", messageRoutes);
// // app.use("/api/users", userRoutes);

// // mongoose.connect(process.env.MONGO_URI).then(()=>console.log("MongoDB Connected")).catch((err)=>console.log(err));

// // app.get("/",(req,res)=>{
// //     res.send("chat server is running");
// // });

// // app.get("/api/protected", protect, (req, res) => {
// //   res.json({ message: "You are authorized", userId: req.userId });
// // });

// // app.use("/api/auth",authRoutes);

// // app.use(express.static(path.join(__dirname, "client", "dist")));

// // app.get("*", (req, res) => {
// //   res.sendFile(path.join(__dirname, "client", "index.html"));
// // });


// // const PORT = process.env.PORT || 5000;
// // const http = require("http");
// // const { Server } = require("socket.io");

// // const server = http.createServer(app);

// // const io = new Server(server, {
// //   cors: {
// //     origin: "http://localhost:5173",
// //     methods: ["GET", "POST"],
// //   },
// // });
// // let onlineUsers = new Set();
// // io.on("connection", (socket) => {
// //   socket.on("join", (userId) => {
// //     onlineUsers.add(userId);

// //     io.emit("onlineUsers", Array.from(onlineUsers));
// //   });

// //   socket.on("disconnect", () => {
// //     onlineUsers.forEach((id) => {
// //       if (io.sockets.adapter.rooms.get(id)?.has(socket.id)) {
// //         onlineUsers.delete(id);
// //       }
// //     });

// //     io.emit("onlineUsers", Array.from(onlineUsers));
// //   });
// // });



// // server.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });


// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import http from "http";
// import { Server } from "socket.io";
// import path from "path";
// import { fileURLToPath } from "url";

// import authRoutes from "./routes/authRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import messageRoutes from "./routes/messageRoutes.js";
// import protect from "./middleware/authMiddleware.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// /* ===== FIX __dirname (IMPORTANT IN ES6) ===== */
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// /* ===== Middlewares ===== */
// app.use(cors());
// app.use(express.json());

// /* ===== API Routes ===== */
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/messages", messageRoutes);

// /* ===== Test Routes ===== */
// app.get("/", (req, res) => {
//   res.send("chat server is running");
// });

// app.get("/api/protected", protect, (req, res) => {
//   res.json({ message: "You are authorized", userId: req.userId });
// });

// /* ===== MongoDB ===== */
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.error(err));

// /* ===== Serve React (Production) ===== */
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "client", "dist")));

//   app.use((req, res) => {
//   res.sendFile(
//     path.resolve(__dirname, "client", "dist", "index.html")
//   );
// });

// }

// /* ===== Socket.IO ===== */
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//   },
// });

// let onlineUsers = new Set();

// // io.on("connection", (socket) => {
// //   socket.on("join", (userId) => {
// //     onlineUsers.add(userId);
// //     io.emit("onlineUsers", Array.from(onlineUsers));
// //   });

// //   socket.on("disconnect", () => {
// //     onlineUsers.forEach((id) => {
// //       if (io.sockets.adapter.rooms.get(id)?.has(socket.id)) {
// //         onlineUsers.delete(id);
// //       }
// //     });
// //     io.emit("onlineUsers", Array.from(onlineUsers));
// //   });
// // });


// io.on("connection", (socket) => {
//   socket.on("join", (userId) => {
//     socket.join(userId); // ✅ CRITICAL
//     console.log(`User ${userId} joined their room`);
//   });

//   socket.on("sendMessage", ({ receiverId, message }) => {
//     io.to(receiverId).emit("receiveMessage", message);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });


// /* ===== Start Server ===== */
// server.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import protect from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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

