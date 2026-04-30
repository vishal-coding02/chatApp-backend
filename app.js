const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const authRouter = require("./src/modules/auth/auth.route");
const refresTokenRouter = require("./src/modules/auth/refreshToken.route");
const userRouter = require("./src/modules/user/user.route");
const chatRouter = require("./src/modules/chat/chat.route");
const messageRouter = require("./src/modules/message/message.route");
const callRouter = require("./src/modules/call/call.route");

const corsConfig = require("./src/config/cors");

const app = express();

app.use(cookieParser());
app.use(corsConfig);

app.set("trust proxy", 1);
app.use(helmet());

app.use(express.json());

// routes
app.use(authRouter);
app.use(userRouter);
app.use(chatRouter);
app.use(messageRouter);
app.use(callRouter);
app.use(refresTokenRouter);

module.exports = { app };
