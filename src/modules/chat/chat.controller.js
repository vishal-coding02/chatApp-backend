const {
  chatRoomService,
  myChatsService,
  getPendingRequestsService,
  acceptMessageRequestService,
  chatDeleteService,
} = require("../chat/chat.service");

const chatRoomController = async (req, res) => {
  try {
    const chatRoom = await chatRoomService(req.body);

    return res.status(201).json({
      success: true,
      message: "new chat created",
      roomId: chatRoom._id,
    });
  } catch (err) {
    if (err.message === "Chat room already exists") {
      return res.status(409).json({ success: false, error: err.message });
    }
    if (
      err.message === "participant1 not found" ||
      err.message === "participant2 not found"
    ) {
      return res.status(404).json({ success: false, error: err.message });
    }

    return res.status(500).json({ success: false, error: err.message });
  }
};

const myChatsController = async (req, res) => {
  try {
    const { id } = req.user;
    const chats = await myChatsService(id);

    return res
      .status(200)
      .json({ success: true, message: "chats fached successfully", chats });
  } catch (err) {
    if (err.message === "chat not exist") {
      return res.status(404).json({ success: false, error: err.message });
    }

    return res.status(500).json({ success: false, error: err.message });
  }
};

const getPendingRequestsController = async (req, res) => {
  try {
    const { id } = req.user;

    const requests = await getPendingRequestsService(id);

    return res.status(200).json({
      success: true,
      requests,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

const acceptMessageRequestController = async (req, res) => {
  try {
    const userID = req.user.id;
    const { chatId } = req.params;

    const updatedChat = await acceptMessageRequestService(chatId, userID);

    return res.status(200).json({
      success: true,
      message: "Request accepted",
      chat: updatedChat,
    });
  } catch (err) {
    if (
      err.message === "chat not exist" ||
      err.message === "participant not found"
    ) {
      return res.status(404).json({ success: false, error: err.message });
    }

    return res.status(500).json({ success: false, error: err.message });
  }
};

const chatDeleteController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;

    await chatDeleteService(userId, chatId);

    return res.status(200).json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (err) {
    if (err.message === "chat not exist") {
      return res.status(404).json({ success: false, message: err.message });
    }
    if (err.message === "not allowed") {
      return res.status(403).json({ success: false, message: err.message });
    }
    return res.status(400).json({
      success: false,
      error: err.message || "Failed to delete chat",
    });
  }
};

module.exports = {
  chatRoomController,
  myChatsController,
  getPendingRequestsController,
  acceptMessageRequestController,
  chatDeleteController,
};
