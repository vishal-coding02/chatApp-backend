import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import authRouter from "./src/modules/auth/auth.route";
import refresTokenRouter from "./src/modules/auth/refreshToken.route";
import userRouter from "./src/modules/user/user.route";
import chatRouter from "./src/modules/chat/chat.route";
import messageRouter from "./src/modules/message/message.route";
import callRouter from "./src/modules/call/call.route";
import notificationRouter from "./src/modules/notification/notification.route";

import corsConfig from "./src/config/cors";

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
app.use(notificationRouter);
app.use(refresTokenRouter);

export { app };
