const Message = require("../../models/v1/message.model");
const ChatRoom = require("../../models/v1/chat.model");
const Users = require("../../models/v1/users.model");

const sendMessageService = async (data, userId) => {
  const { chatRoomId, text } = data;

  const user = await Users.findById(userId);
  if (!user) {
    throw new Error("user not found");
  }

  const chat = await ChatRoom.findById(chatRoomId);
  if (!chat) {
    throw new Error("chat not exist");
  }

  const isParticipant = chat.participants.includes(userId);
  if (!isParticipant) {
    throw new Error("not allowed in this chat");
  }

  if (chat.status === "pending") {
    const alreadySent = await Message.findOne({
      chatRoomId: chat._id,
      senderId: userId,
    });

    if (alreadySent) {
      throw new Error("chat request pending, wait for accept");
    }
  }

  const newMessage = await Message.create({
    senderId: userId,
    chatRoomId: chat._id,
    text: text,
  });

  chat.lastMessage = text;
  chat.lastMessageAt = new Date();
  chat.hasMessage = true;
  await chat.save();

  return newMessage;
};

const getMessageService = async (chatID) => {
  const messages = await Message.find({ chatRoomId: chatID });

  if (!messages) {
    throw new Error("messages not found");
  }

  return messages;
};

module.exports = { sendMessageService, getMessageService };
