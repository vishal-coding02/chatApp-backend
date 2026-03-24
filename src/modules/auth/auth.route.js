const express = require("express");
const authRouter = express.Router();

const {
  signUpController,
  loginController,
  logoutController,
  verifyEmailController,
} = require("../auth/auth.controller");

const { loginLimit, signupLimit } = require("../../middlewares/RateLimit");

authRouter.post("/api/auth/signup", signupLimit, signUpController);
authRouter.post("/api/auth/login", loginLimit, loginController);
authRouter.post("/api/auth/verify-email", verifyEmailController);
authRouter.post("/api/auth/logout", logoutController);

module.exports = authRouter;
