import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     avatar: {
//       type: String,
//       default: "",
//     },
//     blockedUsers: [
//   {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//   },
// ],

//   },
//   { timestamps: true }
// );




const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: function () {
        return this.fullName || "";
      },
    },

    fullName: {
      type: String,
    },

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },

    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
export default User;
