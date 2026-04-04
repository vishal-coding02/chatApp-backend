const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userFullName: {
      type: String,
      required: [true, "Full Name is required"],
    },
    userName: {
      type: String,
      required: [true, "User name is required"],
      unique: true,
      index: true,
    },
    userEmail: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    userPassword: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long"],
      required: [true, "Password is required"],
    },
    profilePic: {
      type: String,
      required: false,
    },
    isVerified: {
      type: Boolean,
      required: true,
    },
    verificationToken: {
      type: String,
      required: false,
    },
    tokenExpiry: Date,
  },
  { timestamps: true },
);

const Users = mongoose.model("users", userSchema);

module.exports = Users;
