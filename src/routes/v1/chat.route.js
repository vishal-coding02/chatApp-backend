const express = require("express");
const chatRouter = express.Router();

const { verifyToken } = require("../../libs/auth/JwtToken");
const {
  chatRoomController,
  myChatsController,
  getPendingRequestsController,
  acceptMessageRequestController,
} = require("../../controllers/v1/chat.controller");

chatRouter.get(
  "/api/v1/chats/requests",
  verifyToken,
  getPendingRequestsController,
);
chatRouter.get("/api/v1/chats/:id", verifyToken, myChatsController);
chatRouter.post("/api/v1/chats", verifyToken, chatRoomController);
chatRouter.patch(
  "/api/v1/chats/acceptChat",
  verifyToken,
  acceptMessageRequestController,
);

module.exports = chatRouter;
