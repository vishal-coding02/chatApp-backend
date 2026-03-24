const { Server } = require("socket.io");
const client = require("../libs/redisClient");

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("socket connected:", socket.id);

    socket.on("identify", async (userId) => {
      socket.userId = userId;

      await client.sAdd("onlineUsers", userId.toString());

      const users = await client.sMembers("onlineUsers");
      io.emit("onlineUsers", users);
    });

    // Join Rooms
    socket.on("joinRooms", ({ user, room }) => {
      const roomID = room;
      socket.join(roomID);
    });

    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId);
      console.log("user leave room", roomId);
    });

    // Send Message
    socket.on("sendMessage", ({ from, room, message, messageId }) => {
      socket.to(room).emit("message", { from, message, messageId });
      socket.emit("message", { from, message, messageId, self: true });
    });

    // Set lastMessage
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

    // Typing Indicator
    socket.on("typing", ({ room, from }) => {
      socket.to(room).emit("userTyping", { userId: from, room });
    });

    // Stop typing indicator
    socket.on("stopTyping", ({ room, from }) => {
      socket.to(room).emit("userStopTyping", { userId: from, room });
    });

    // delete message
    socket.on("deleteMessage", ({ messageId, room }) => {
      socket.to(room).emit("messageDeleted", { messageId });
    });

    // users disconnected
    socket.on("disconnect", async () => {
      if (socket.userId) {
        await client.sRem("onlineUsers", socket.userId.toString());

        const users = await client.sMembers("onlineUsers");
        io.emit("onlineUsers", users);
      }
    });
  });
};

module.exports = { setupSocket };
