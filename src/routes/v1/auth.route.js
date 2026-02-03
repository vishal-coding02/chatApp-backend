const express = require("express");
const authRouter = express.Router();

const {
  signUpController,
  loginController,
  logoutController,
} = require("../../controllers/v1/auth.controller");

authRouter.post("/api/v1/auth/signUp", signUpController);
authRouter.post("/api/v1/auth/login", loginController);
authRouter.post("/api/v1/auth/logout", logoutController);

module.exports = authRouter;
