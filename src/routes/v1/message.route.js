const express = require("express");
const messageRouter = express.Router();

const { verifyToken } = require("../../libs/auth/JwtToken");
const {
  sendMessageController,
} = require("../../controllers/v1/message.controller");

messageRouter.post(
  "/api/v1/message/sendMessage",
  verifyToken,
  sendMessageController,
);

module.exports = messageRouter;
