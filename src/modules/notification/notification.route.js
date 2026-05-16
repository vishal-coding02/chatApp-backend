const express = require("express");

const { verifyToken } = require("../../libs/auth/JwtToken");
const { savePushToken } = require("../notification/notification.controller");

const notificationRouter = express.Router();

notificationRouter.post(
  "/api/notification/save-token",
  verifyToken,
  savePushToken,
);

module.exports = notificationRouter;
