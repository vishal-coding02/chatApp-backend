import dotenv from "dotenv";
dotenv.config();

import { app } from "./app";
import { connectDB } from "./src/config/db";
import http from "http";
import { setupSocket } from "./src/config/socket";

const PORT = Number(process.env.PORT) || 5000;

const server = http.createServer(app);

setupSocket(server);

connectDB();

server.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
});
