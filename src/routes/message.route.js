const express = require("express");
const messageRouter = express.Router();

const { verifyToken } = require("../libs/auth/JwtToken");
const {
  sendMessageController,
  getMessageController,
} = require("../controllers/message.controller");

messageRouter.get("/api/message/:id", verifyToken, getMessageController);
messageRouter.post(
  "/api/message/sendMessage",
  verifyToken,
  sendMessageController,
);

module.exports = messageRouter;
