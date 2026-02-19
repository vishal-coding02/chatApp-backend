const express = require("express");
const userRouter = express.Router();

const { verifyToken } = require("../../libs/auth/JwtToken");
const {
  fetchUsersController,
  userProfileController,
} = require("../../controllers/v1/user.controller");

userRouter.get("/api/v1/users/profile/:id", verifyToken, userProfileController);
userRouter.get("/api/v1/users", verifyToken, fetchUsersController);

module.exports = userRouter;
