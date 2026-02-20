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
      minlength: [3, "User name must be at least 3 characters long"],
      unique: true,
    },
    userEmail: {
      type: String,
      unique: true,
      required: true,
    },
    userPassword: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long"],
      required: [true, "Password is required"],
    },
    profilePic: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Users = mongoose.model("users", userSchema);

module.exports = Users;
