const express = require("express");
const chatRouter = express.Router();

const { verifyToken } = require("../libs/auth/JwtToken");
const {
  chatRoomController,
  myChatsController,
  getPendingRequestsController,
  acceptMessageRequestController,
} = require("../controllers/chat.controller");

chatRouter.get(
  "/api/chats/requests",
  verifyToken,
  getPendingRequestsController,
);
chatRouter.get("/api/chats/:id", verifyToken, myChatsController);
chatRouter.post("/api/chats", verifyToken, chatRoomController);
chatRouter.patch(
  "/api/chats/acceptChat",
  verifyToken,
  acceptMessageRequestController,
);

module.exports = chatRouter;
