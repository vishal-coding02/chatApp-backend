require("dotenv").config();

const { app } = require("./app");
const { connectDB } = require("./src/config/db");
const http = require("http");
const { setupSocket } = require("./src/config/socket");

const PORT = process.env.PORT;

const server = http.createServer(app);

setupSocket(server);

connectDB();

server.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
});
