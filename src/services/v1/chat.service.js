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

  const newChat = {
    participants: [participant1._id, participant2._id],
    createdBy: participant1._id,
    lastMessage: lastMessage || "",
    status: "pending",
  };

  const createdChat = await ChatRoom.create(newChat);

  return createdChat;
};

module.exports = { chatRoomService };
