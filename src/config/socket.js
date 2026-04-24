const { Server } = require("socket.io");
const client = require("../libs/redisClient");
const { addCallRecordService } = require("../modules/call/call.service");

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
      socket.join(userId);
      await client.sAdd("onlineUsers", userId.toString());
      const users = await client.sMembers("onlineUsers");
      io.emit("onlineUsers", users);
    });

    socket.on("joinRooms", ({ user, room }) => {
      socket.join(room);
    });

    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId);
    });

    socket.on("sendMessage", ({ from, room, message, messageId }) => {
      socket.to(room).emit("message", { from, message, messageId });
      socket.emit("message", { from, message, messageId, self: true });
    });

    socket.on(
      "lastMessageUpdate",
      ({ room, chatId, lastMessage, lastMessageAt }) => {
        socket
          .to(room)
          .emit("lastMessage", { chatId, lastMessage, lastMessageAt });
        socket.emit("lastMessage", { chatId, lastMessage, lastMessageAt });
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

    socket.on(
      "call:initiate",
      async ({ to, from, callerName, callType, chatId }) => {
        const isBusy = await client.sIsMember("busyUsers", to.toString());
        client.set(`callChat:${socket.userId}`, chatId.toString());
        client.set(`callChat:${to}`, chatId.toString());

        if (isBusy) {
          socket.emit("call:busy", { userId: to });
          socket.to(to).emit("call:incoming", { from, callerName, callType });
          return;
        }
        socket.to(to).emit("call:incoming", { from, callerName, callType });
      },
    );

    socket.on("call:accept", ({ to }) => {
      if (!socket.userId) return;
      client.sAdd("busyUsers", socket.userId.toString());
      client.sAdd("busyUsers", to.toString());

      client.set(`callPartner:${socket.userId}`, to.toString());
      client.set(`callPartner:${to}`, socket.userId.toString());

      socket.to(to).emit("call:accepted", { from: socket.userId });
      socket.to(socket.userId).emit("call:answered_elsewhere");
    });

    socket.on("call:reject", async ({ to, reason }) => {
      if (!socket.userId) return;
      socket.to(to).emit("call:rejected", { reason });

      const chatId = await client.get(`callChat:${socket.userId}`);

      await addCallRecordService({
        chatId,
        callerId: to,
        receiverId: socket.userId,
        callStatus: "missed",
        callType: "audio",
        callDuration: 0,
      });
    });

    socket.on("call:end", async ({ to, type, duration }) => {
      if (!socket.userId) return;

      if (type === "ongoing") {
        client.sRem("busyUsers", socket.userId.toString());
        client.sRem("busyUsers", to.toString());

        client.del(`callPartner:${socket.userId}`);
        client.del(`callPartner:${to}`);
        socket.to(to).emit("call:ended");

        const chatId = await client.get(`callChat:${socket.userId}`);
        await addCallRecordService({
          chatId,
          callerId: socket.userId,
          receiverId: to,
          callStatus: "received",
          callType: "audio",
          callDuration: duration || 0,
        });
      }

      if (type === "trying") {
        socket.to(to).emit("call:cancelled");

        const chatId = await client.get(`callChat:${socket.userId}`);
        await addCallRecordService({
          chatId,
          callerId: socket.userId,
          receiverId: to,
          callStatus: "missed",
          callType: "audio",
          callDuration: 0,
        });
      }
    });

    socket.on("webrtc:offer", ({ to, offer }) => {
      if (!socket.userId) return;
      socket.to(to).emit("webrtc:offer", { from: socket.userId, offer });
    });

    socket.on("webrtc:answer", ({ to, answer }) => {
      if (!socket.userId) return;
      socket.to(to).emit("webrtc:answer", { from: socket.userId, answer });
    });

    socket.on("webrtc:ice", ({ to, candidate }) => {
      if (!socket.userId) return;
      socket.to(to).emit("webrtc:ice", { from: socket.userId, candidate });
    });

    socket.on("disconnect", async () => {
      if (socket.userId) {
        const wasBusy = await client.sIsMember(
          "busyUsers",
          socket.userId.toString(),
        );

        await client.sRem("busyUsers", socket.userId.toString());
        await client.sRem("onlineUsers", socket.userId.toString());

        if (wasBusy) {
          const partnerId = await client.get(`callPartner:${socket.userId}`);
          if (partnerId) {
            await client.sRem("busyUsers", partnerId);
            await client.del(`callPartner:${socket.userId}`);
            await client.del(`callPartner:${partnerId}`);
            socket.to(partnerId).emit("call:ended");
          }
        }

        const users = await client.sMembers("onlineUsers");
        io.emit("onlineUsers", users);
      }
    });
  });
};

module.exports = { setupSocket };
