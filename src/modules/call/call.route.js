const express = require("express");
const callRouter = express.Router();

const { verifyToken } = require("../../libs/auth/JwtToken");

const { missedCallsController } = require("../call/call.controller");

callRouter.get("/api/calls/missed", verifyToken, missedCallsController);

module.exports = callRouter;
