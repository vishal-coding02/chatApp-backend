const express = require("express");
const callRouter = express.Router();

const { verifyToken } = require("../../libs/auth/JwtToken");

const {
  callsController,
  markCallsReadController,
  getTurnCredentials,
  removeCallLogController,
} = require("../call/call.controller");

callRouter.get("/api/calls/history", verifyToken, callsController);
callRouter.get("/api/calls/history/:chatId", verifyToken, callsController);
callRouter.get("/api/calls/ice-servers", verifyToken, getTurnCredentials);
callRouter.patch("/api/calls/read", verifyToken, markCallsReadController);
callRouter.patch("/api/calls/:id", verifyToken, removeCallLogController);
callRouter.patch("/api/calls/all", verifyToken, removeCallLogController);

module.exports = callRouter;
