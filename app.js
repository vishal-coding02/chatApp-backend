const express = require("express");
const authRouter = require("./src/routes/auth.route");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const refresTokenRouter = require("./src/routes/refreshToken.route");
const userRouter = require("./src/routes/user.route");
const chatRouter = require("./src/routes/chat.route");
const messageRouter = require("./src/routes/message.route");

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// routes
app.use(authRouter);
app.use(userRouter);
app.use(chatRouter);
app.use(messageRouter);
app.use(refresTokenRouter);

module.exports = { app };
