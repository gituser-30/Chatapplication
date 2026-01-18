import express from "express";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/debug", (req, res) => {
  res.json({ ok: true, message: "userRoutes loaded" });
});

/**
 * Get all users except logged-in user
 */
router.get("/", protect, async (req, res) => {
  try {
    const users = await User.find({
  _id: { $ne: req.userId },
})
  .select("-password")
  .lean();

const formattedUsers = users.map(user => ({
  ...user,
  name: user.fullName, // 👈 mapping
}));
    

res.json(formattedUsers);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// BLOCK USER
router.put("/block/:userId", protect, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    const targetUserId = req.params.userId;

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // prevent duplicate block
    if (currentUser.blockedUsers?.includes(targetUserId)) {
      return res.status(400).json({ message: "User already blocked" });
    }

    currentUser.blockedUsers = currentUser.blockedUsers || [];
    currentUser.blockedUsers.push(targetUserId);

    await currentUser.save();

    res.json({ message: "User blocked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to block user" });
  }
});



export default router;
