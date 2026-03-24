const Message = require("../message/message.model");
const ChatRoom = require("../chat/chat.model");
const Users = require("../user/user.model");

const sendMessageService = async (data, userId) => {
  const { chatRoomId, text } = data;

  if (!text || text.trim() === "") {
    throw new Error("message text required");
  }

  const user = await Users.findById(userId);
  if (!user) {
    throw new Error("user not found");
  }

  const chat = await ChatRoom.findById(chatRoomId);
  if (!chat) {
    throw new Error("chat not exist");
  }

  const isParticipant = chat.participants.some(
    (p) => p.toString() === userId.toString(),
  );

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

  if (chat.deletedBy.length > 0) {
    chat.deletedBy = [];
  }

  chat.lastMessage = text;
  chat.lastMessageAt = new Date();
  chat.hasMessage = true;
  await chat.save();

  return newMessage;
};

const getMessageService = async (conversationId, lastCreatedAt, limit = 20) => {
  let query = { chatRoomId: conversationId };

  if (lastCreatedAt) {
    query.createdAt = { $lt: new Date(lastCreatedAt) };
  }

  const messages = await Message.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  if (!messages.length) {
    throw new Error("messages not found");
  }

  return {
    messages: messages.reverse(),
    hasMore: messages.length === limit,
  };
};

const messageDeleteService = async (messageId, user) => {
  const message = await Message.findById(messageId);

  if (!message) {
    throw new Error("Message not found");
  }

  if (message.senderId.toString() !== user.id.toString()) {
    throw new Error("You can only delete your own messages");
  }

  const chat = await ChatRoom.findById(message.chatRoomId);

  if (!chat) {
    throw new Error("Chat not found");
  }

  const isLastMessage = chat.lastMessage === message.text;

  await Message.findByIdAndDelete(messageId);

  let updatedChat = null;

  if (isLastMessage) {
    const previousMessage = await Message.findOne({
      chatRoomId: chat._id,
    }).sort({ createdAt: -1 });

    if (previousMessage) {
      chat.lastMessage = previousMessage.text;
      chat.lastMessageAt = previousMessage.createdAt;
    } else {
      chat.lastMessage = "";
      chat.lastMessageAt = null;
      chat.hasMessage = false;
    }

    await chat.save();
    updatedChat = chat;
  }

  return { updatedChat };
};

module.exports = {
  sendMessageService,
  getMessageService,
  messageDeleteService,
};
