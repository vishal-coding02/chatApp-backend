const express = require("express");
const userRouter = express.Router();

const { verifyToken } = require("../../libs/auth/JwtToken");
const {
  fetchUsersController,
  userProfileController,
} = require("../user/user.controller");

userRouter.get("/api/users", verifyToken, fetchUsersController);
userRouter.get("/api/users/profile/:id", verifyToken, userProfileController);

module.exports = userRouter;
