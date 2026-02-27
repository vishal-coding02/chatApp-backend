const express = require("express");
const authRouter = express.Router();

const {
  signUpController,
  loginController,
  logoutController,
} = require("../controllers/auth.controller");

authRouter.post("/api/auth/signUp", signUpController);
authRouter.post("/api/auth/login", loginController);
authRouter.post("/api/auth/logout", logoutController);

module.exports = authRouter;
