import express from "express";
import Message from "../models/Message.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Get messages between logged-in user and selected user
 */
router.get("/:userId", protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.userId, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.userId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Send message
 */
router.post("/", protect, async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    const message = await Message.create({
      sender: req.userId,
      receiver: receiverId,
      text,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Clear chat between two users
 */
router.delete("/clear/:userId", protect, async (req, res) => {
  try {
    await Message.deleteMany({
      $or: [
        { sender: req.userId, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.userId },
      ],
    });

    res.json({ message: "Chat cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
