import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // 👇 Unified name handling (supports old and new users)
    name: {
      type: String,
      default: function () {
        return this.fullName || ""; // Fallback for old records
      },
    },

    // 👇 Many older users used "fullName"
    fullName: {
      type: String,
    },

    // 👇 Required fields
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    // 👇 Blocked users array
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Export model
export default mongoose.model("User", userSchema);
