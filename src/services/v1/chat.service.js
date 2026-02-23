const ChatRoom = require("../../models/v1/chat.model");
const Users = require("../../models/v1/users.model");

const chatRoomService = async (data) => {
  const { participant1ID, participant2ID, lastMessage } = data;

  const participant1 = await Users.findById(participant1ID);

  if (!participant1) {
    throw new Error("participant1 not found");
  }

  const participant2 = await Users.findById(participant2ID);

  if (!participant2) {
    throw new Error("participant2 not found");
  }

  const chatExists = await ChatRoom.findOne({
    participants: { $all: [participant1._id, participant2._id] },
  });

  if (chatExists) {
    throw new Error("Chat room already exists");
  }

  const newChat = {
    participants: [participant1._id, participant2._id],
    createdBy: participant1._id,
    lastMessage: lastMessage || "",
    status: "pending",
    hasMessage: false,
  };

  const createdChat = await ChatRoom.create(newChat);

  return createdChat;
};

const myChatsService = async (id) => {
  const chats = await ChatRoom.find({
    $or: [
      { createdBy: id },
      {
        $and: [{ participants: id }, { status: "active" }],
      },
    ],
  })
    .populate("participants", "userFullName userName profilePic")
    .sort({ updatedAt: -1 });

  if (chats.length === 0) {
    throw new Error("no chats found");
  }

  return chats;
};

const getPendingRequestsService = async (userId) => {
  const requests = await ChatRoom.find({
    status: "pending",
    hasMessage: true,
    participants: userId,
    createdBy: { $ne: userId },
  })
    .populate("participants", "userFullName userName profilePic")
    .sort({ updatedAt: -1 });

  return requests;
};

const acceptMessageRequestService = async (data, userID) => {
  const { chatRoomId } = data;

  const chat = await ChatRoom.findById(chatRoomId);

  if (!chat) {
    throw new Error("chat not exist");
  }

  const isParticipant = chat.participants.some((p) => p.toString() === userID);

  if (!isParticipant) {
    throw new Error("participant not found");
  }

  chat.status = "active";
  await chat.save();

  return chat;
};

module.exports = {
  chatRoomService,
  myChatsService,
  getPendingRequestsService,
  acceptMessageRequestService,
};
