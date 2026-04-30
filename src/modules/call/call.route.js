const express = require("express");
const callRouter = express.Router();

const { verifyToken } = require("../../libs/auth/JwtToken");

const {
  callsController,
  markCallsReadController,
} = require("../call/call.controller");

callRouter.get("/api/calls/history", verifyToken, callsController);
callRouter.patch("/api/calls/read", verifyToken, markCallsReadController);

module.exports = callRouter;
