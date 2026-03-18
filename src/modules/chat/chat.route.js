const express = require("express");
const chatRouter = express.Router();

const { verifyToken } = require("../../libs/auth/JwtToken");
const {
  chatRoomController,
  myChatsController,
  getPendingRequestsController,
  acceptMessageRequestController,
  chatDeleteController,
} = require("../chat/chat.controller");

chatRouter.get("/api/chats", verifyToken, myChatsController);
chatRouter.get(
  "/api/chats/requests",
  verifyToken,
  getPendingRequestsController,
);
chatRouter.post("/api/chats", verifyToken, chatRoomController);
chatRouter.patch(
  "/api/chats/:chatId/accept",
  verifyToken,
  acceptMessageRequestController,
);
chatRouter.delete("/api/chats/:chatId", verifyToken, chatDeleteController);

module.exports = chatRouter;
