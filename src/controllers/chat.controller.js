const {
  chatRoomService,
  myChatsService,
  getPendingRequestsService,
  acceptMessageRequestService,
} = require("../services/chat.service");

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
    const { id } = req.params;
    const chats = await myChatsService(id);

    return res
      .status(200)
      .json({ success: true, message: "chats fached successfully", chats });
  } catch (err) {
    if (err.message === "no chats found") {
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

    const updatedChat = await acceptMessageRequestService(req.body, userID);

    return res.status(200).json({
      success: true,
      message: "Request accepted",
      chat: updatedChat,
    });
  } catch (err) {
    if (
      er.message === "chat not exist" ||
      err.message === "participant not found"
    ) {
      return res.statsu(404).json({ success: false, error: err.message });
    }

    return res.statsu(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  chatRoomController,
  myChatsController,
  getPendingRequestsController,
  acceptMessageRequestController,
};
