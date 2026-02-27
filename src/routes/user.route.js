const express = require("express");
const userRouter = express.Router();

const { verifyToken } = require("../libs/auth/JwtToken");
const {
  fetchUsersController,
  userProfileController,
} = require("../controllers/user.controller");

userRouter.get("/api/users/profile/:id", verifyToken, userProfileController);
userRouter.get("/api/users", verifyToken, fetchUsersController);

module.exports = userRouter;
