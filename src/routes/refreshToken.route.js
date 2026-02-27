const express = require("express");
const refresTokenRouter = express.Router();
const { refreshToken } = require("../libs/auth/JwtToken");

refresTokenRouter.post("/api/refreshToken", refreshToken);

module.exports = refresTokenRouter;
