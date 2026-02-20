require("dotenv").config();

const { app } = require("./app");
const { connectDB } = require("./src/libs/db");
const http = require("http");

const PORT = process.env.PORT;

const server = http.createServer(app);

const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);

  socket.on("identify", (userId) => {
    socket.userId = userId;
    console.log("user identified:", userId);
  });

  socket.on("joinRooms", ({ user, room }) => {
    const roomID = room;
    socket.join(roomID);
    console.log(`${user} connected with ${roomID}`);
  });

  socket.on("sendMessage", ({ from, room, message }) => {
    socket.to(room).emit("message", { from, message });
    socket.emit("message", { from, message, self: true });
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected:", socket.id);
  });
});

connectDB();

server.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
});
