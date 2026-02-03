const express = require("express");
const refresTokenRouter = express.Router();
const { refreshToken } = require("../../libs/auth/JwtToken");

refresTokenRouter.post("/api/v1/refreshToken", refreshToken);

module.exports = refresTokenRouter;
