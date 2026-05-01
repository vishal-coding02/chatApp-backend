const express = require("express");
const callRouter = express.Router();

const { verifyToken } = require("../../libs/auth/JwtToken");

const {
  callsController,
  markCallsReadController,
  getTurnCredentials,
} = require("../call/call.controller");

callRouter.get("/api/calls/history", verifyToken, callsController);
callRouter.get("/api/calls/ice-servers", verifyToken, getTurnCredentials);
callRouter.patch("/api/calls/read", verifyToken, markCallsReadController);

module.exports = callRouter;
