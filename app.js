const express = require("express");
const authRouter = require("./src/routes/v1/auth.route");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const refresTokenRouter = require("./src/routes/v1/refreshToken.route");
const userRouter = require("./src/routes/v1/user.route");
const chatRouter = require("./src/routes/v1/chat.route");

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// routes
app.use(authRouter);
app.use(userRouter);
app.use(chatRouter);
app.use(refresTokenRouter);

module.exports = { app };
