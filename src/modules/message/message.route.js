const express = require("express");
const messageRouter = express.Router();

const { verifyToken } = require("../../libs/auth/JwtToken");

const {
  sendMessageController,
  getMessageController,
  messageDeleteController,
} = require("../message/message.controller");

messageRouter.get(
  "/api/messages/:conversationId",
  verifyToken,
  getMessageController,
);
messageRouter.post("/api/messages", verifyToken, sendMessageController);
messageRouter.delete(
  "/api/messages/:messageId",
  verifyToken,
  messageDeleteController,
);
module.exports = messageRouter;
