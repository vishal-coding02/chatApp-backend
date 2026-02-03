const express = require("express");
const chatRouter = express.Router();

const { verifyToken } = require("../../libs/auth/JwtToken");
const { chatRoomController } = require("../../controllers/v1/chat.controller");

chatRouter.post("/api/v1/chats", verifyToken, chatRoomController);

module.exports = chatRouter;
