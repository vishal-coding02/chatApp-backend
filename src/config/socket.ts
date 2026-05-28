import { Server } from "socket.io";
import client from "../libs/redisClient";
import { addCallRecordService } from "../modules/call/call.service";
import http from "http";
import type { CustomSocket } from "../interfaces/socket";

let io: Server;

const setupSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket: CustomSocket) => {
    console.log("socket connected:", socket.id);

    socket.on("identify", async (userId: string) => {
      socket.userId = userId;
      socket.join(userId);
      await client.sAdd("onlineUsers", userId);
      const users = await client.sMembers("onlineUsers");
      io.emit("onlineUsers", users);
    });

    socket.on("joinRooms", ({ room }: { room: string }) => {
      socket.join(room);
    });

    socket.on("leaveRoom", (roomId: string) => {
      socket.leave(roomId);
    });

    socket.on(
      "sendMessage",
      ({
        from,
        room,
        message,
        messageId,
      }: {
        from: string;
        room: string;
        message: string;
        messageId: string;
      }) => {
        socket.to(room).emit("message", { from, message, messageId });
        socket.emit("message", { from, message, messageId, self: true });
      },
    );

    socket.on(
      "lastMessageUpdate",
      ({
        room,
        chatId,
        lastMessage,
        lastMessageAt,
      }: {
        room: string;
        chatId: string;
        lastMessage: string;
        lastMessageAt: Date | string;
      }) => {
        socket
          .to(room)
          .emit("lastMessage", { chatId, lastMessage, lastMessageAt });
        socket.emit("lastMessage", { chatId, lastMessage, lastMessageAt });
      },
    );

    socket.on("typing", ({ room, from }: { room: string; from: string }) => {
      socket.to(room).emit("userTyping", { userId: from, room });
    });

    socket.on(
      "stopTyping",
      ({ room, from }: { room: string; from: string }) => {
        socket.to(room).emit("userStopTyping", { userId: from, room });
      },
    );

    socket.on(
      "deleteMessage",
      ({ messageId, room }: { messageId: string; room: string }) => {
        socket.to(room).emit("messageDeleted", { messageId });
      },
    );

    socket.on(
      "call:initiate",
      async ({
        to,
        from,
        callerName,
        callType,
        chatId,
      }: {
        to: string;
        from: string;
        callerName: string;
        callType: "audio";
        chatId: String;
      }) => {
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

    socket.on("call:accept", ({ to }: { to: string }) => {
      if (!socket.userId) return;
      client.sAdd("busyUsers", socket.userId);
      client.sAdd("busyUsers", to.toString());

      client.set(`callPartner:${socket.userId}`, to.toString());
      client.set(`callPartner:${to}`, socket.userId);

      socket.to(to).emit("call:accepted", { from: socket.userId });
      socket.to(socket.userId).emit("call:answered_elsewhere");
    });

    socket.on(
      "call:reject",
      async ({
        to,
        reason,
      }: {
        to: string;
        reason: "rejected" | "no_answer";
      }) => {
        if (!socket.userId) return;

        socket.to(to).emit("call:rejected", { reason });

        const chatId = await client.get(`callChat:${socket.userId}`);

        if (!chatId) return;

        let status: "rejected" | "missed" = "rejected";

        if (reason === "no_answer") {
          status = "missed";
        }

        if (reason === "rejected") {
          status = "rejected";
        }

        const callRecord = await addCallRecordService({
          chatId,
          callerId: to,
          receiverId: socket.userId,
          callStatus: status,
          callType: "audio",
          callDuration: 0,
        });

        io.to(chatId).emit("call-record-saved", {
          _id: callRecord._id,
          chatId: callRecord.chatId,
          callerId: callRecord.callerId,
          receiverId: callRecord.receiverId,
          callStatus: callRecord.callStatus,
          callType: callRecord.callType,
          callDuration: callRecord.callDuration,
          createdAt: callRecord.createdAt,
        });

        if (status === "missed") {
          io.to(socket.userId).emit("missed-call");
        }
      },
    );

    socket.on(
      "call:end",
      async ({
        to,
        type,
        duration,
      }: {
        to: string;
        type: "ongoing" | "trying";
        duration: number;
      }) => {
        if (!socket.userId) return;

        if (type === "ongoing") {
          client.sRem("busyUsers", socket.userId);
          client.sRem("busyUsers", to.toString());

          client.del(`callPartner:${socket.userId}`);
          client.del(`callPartner:${to}`);
          socket.to(to).emit("call:ended");

          const chatId = await client.get(`callChat:${socket.userId}`);
          if (!chatId) return;
          const callRecord = await addCallRecordService({
            chatId,
            callerId: socket.userId,
            receiverId: to,
            callStatus: "received",
            callType: "audio",
            callDuration: duration || 0,
          });

          io.to(chatId).emit("call-record-saved", {
            _id: callRecord._id,
            chatId: callRecord.chatId,
            callerId: callRecord.callerId,
            receiverId: callRecord.receiverId,
            callStatus: callRecord.callStatus,
            callType: callRecord.callType,
            callDuration: callRecord.callDuration,
            createdAt: callRecord.createdAt,
          });
        }

        if (type === "trying") {
          socket.to(to).emit("call:cancelled");

          const chatId = await client.get(`callChat:${socket.userId}`);
          if (!chatId) return;
          const callRecord = await addCallRecordService({
            chatId,
            callerId: socket.userId,
            receiverId: to,
            callStatus: "missed",
            callType: "audio",
            callDuration: 0,
          });

          io.to(chatId).emit("call-record-saved", {
            _id: callRecord._id,
            chatId: callRecord.chatId,
            callerId: callRecord.callerId,
            receiverId: callRecord.receiverId,
            callStatus: callRecord.callStatus,
            callType: callRecord.callType,
            callDuration: callRecord.callDuration,
            createdAt: callRecord.createdAt,
          });

          io.to(to).emit("missed-call");
        }
      },
    );

    socket.on(
      "webrtc:offer",
      ({ to, offer }: { to: string; offer: RTCSessionDescriptionInit }) => {
        if (!socket.userId) return;
        socket.to(to).emit("webrtc:offer", { from: socket.userId, offer });
      },
    );

    socket.on(
      "webrtc:answer",
      ({ to, answer }: { to: string; answer: RTCSessionDescriptionInit }) => {
        if (!socket.userId) return;
        socket.to(to).emit("webrtc:answer", { from: socket.userId, answer });
      },
    );

    socket.on(
      "webrtc:ice",
      ({ to, candidate }: { to: string; candidate: RTCIceCandidateInit }) => {
        if (!socket.userId) return;
        socket.to(to).emit("webrtc:ice", { from: socket.userId, candidate });
      },
    );

    socket.on("disconnect", async () => {
      if (socket.userId) {
        const wasBusy = await client.sIsMember("busyUsers", socket.userId);

        await client.sRem("busyUsers", socket.userId);
        await client.sRem("onlineUsers", socket.userId);

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

const getIO = (): Server => io;

export { setupSocket, getIO };
