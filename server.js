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

const onlineUsers = new Set();

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);

  socket.on("identify", (userId) => {
    socket.userId = userId;
    onlineUsers.add(userId.toString());

    io.emit("onlineUsers", Array.from(onlineUsers));
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

  socket.on("typing", ({ room, from }) => {
    socket.to(room).emit("userTyping", { userId: from, room });
  });

  socket.on("stopTyping", ({ room, from }) => {
    socket.to(room).emit("userStopTyping", { userId: from, room });
  });

  socket.on("disconnect", () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId.toString());
      io.emit("onlineUsers", Array.from(onlineUsers));
    }
    console.log("socket disconnected:");
  });
});

connectDB();

server.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
});
