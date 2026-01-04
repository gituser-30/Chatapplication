import express from "express";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

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

export default router;
