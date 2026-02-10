const express = require("express");
const messageRouter = express.Router();

const { verifyToken } = require("../../libs/auth/JwtToken");
const {
  sendMessageController,
  getMessageController,
} = require("../../controllers/v1/message.controller");

messageRouter.get("/api/v1/message/:id", verifyToken, getMessageController);
messageRouter.post(
  "/api/v1/message/sendMessage",
  verifyToken,
  sendMessageController,
);

module.exports = messageRouter;
