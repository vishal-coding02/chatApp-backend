const ChatRoom = require("../chat/chat.model");
const Users = require("../user/user.model");

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
    deletedBy: [],
  };

  const createdChat = await ChatRoom.create(newChat);

  return createdChat;
};

const myChatsService = async (id) => {
  const chats = await ChatRoom.find({
    $or: [
      { createdBy: id, deletedBy: { $ne: id } },
      {
        $and: [
          { participants: id },
          { status: "active" },
          { deletedBy: { $ne: id } },
        ],
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

const acceptMessageRequestService = async (chatId, userID) => {
  const chat = await ChatRoom.findById(chatId);

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

const chatDeleteService = async (userId, chatId) => {
  const chat = await ChatRoom.findById(chatId);

  if (!chat) {
    throw new Error("chat not exist");
  }

  const isParticipant = chat.participants.some(
    (p) => p.toString() === userId.toString(),
  );

  if (!isParticipant) {
    throw new Error("not allowed");
  }

  const alreadyDeleted = chat.deletedBy.some(
    (id) => id.toString() === userId.toString(),
  );

  if (!alreadyDeleted) {
    chat.deletedBy.push(userId);
    await chat.save();
  }

  return true;
};

module.exports = {
  chatRoomService,
  myChatsService,
  getPendingRequestsService,
  acceptMessageRequestService,
  chatDeleteService,
};
