const { Server } = require("socket.io");

const onlineUsers = new Set();

const setupSocket = (server) => {
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
      onlineUsers.add(userId.toString());

      io.emit("onlineUsers", Array.from(onlineUsers));
    });

    socket.on("joinRooms", ({ user, room }) => {
      const roomID = room;
      socket.join(roomID);
      console.log(`${user} connected with ${roomID}`);
    });

    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId);
      console.log("user leave room", roomId);
    });

    socket.on("sendMessage", ({ from, room, message, messageId }) => {
      socket.to(room).emit("message", { from, message, messageId });
      socket.emit("message", { from, message, messageId, self: true });
    });

    socket.on(
      "lastMessageUpdate",
      ({ room, chatId, lastMessage, lastMessageAt }) => {
        socket.to(room).emit("lastMessage", {
          chatId,
          lastMessage,
          lastMessageAt,
        });

        socket.emit("lastMessage", {
          chatId,
          lastMessage,
          lastMessageAt,
        });
      },
    );

    socket.on("typing", ({ room, from }) => {
      socket.to(room).emit("userTyping", { userId: from, room });
    });

    socket.on("stopTyping", ({ room, from }) => {
      socket.to(room).emit("userStopTyping", { userId: from, room });
    });

    socket.on("deleteMessage", ({ messageId, room }) => {
      socket.to(room).emit("messageDeleted", { messageId });
    });

    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId.toString());
        io.emit("onlineUsers", Array.from(onlineUsers));
      }
      console.log("socket disconnected:");
    });
  });
};

module.exports = { setupSocket };
