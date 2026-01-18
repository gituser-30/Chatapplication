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
// router.post("/", protect, async (req, res) => {
//   try {
//     const { receiverId, text } = req.body;

//     const message = await Message.create({
//       sender: req.userId,
//       receiver: receiverId,
//       text,
//     });

//     res.status(201).json(message);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

router.post("/", protect, async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    // 🛑 1. Fetch receiver user
    const receiver = await User.findById(receiverId);

    // 🛑 2. Check if receiver has blocked the sender
    if (receiver.blockedUsers?.includes(req.userId)) {
      return res.status(403).json({ message: "You are blocked by this user" });
    }

    // 🛑 3. Check if sender has blocked receiver (optional)
    const sender = await User.findById(req.userId);
    if (sender.blockedUsers?.includes(receiverId)) {
      return res.status(403).json({ message: "You have blocked this user" });
    }

    // 4️⃣ Save message normally
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
