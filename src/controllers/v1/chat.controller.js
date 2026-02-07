
const {
  chatRoomService,
  myChatsService,
  getPendingRequestsService
} = require("../../services/v1/chat.service");

const chatRoomController = async (req, res) => {
  try {
    const chatRoom = await chatRoomService(req.body);

    return res.status(201).json({
      success: true,
      message: "new chat created",
      roomId: chatRoom._id,
    });
  } catch (err) {
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


module.exports = { chatRoomController, myChatsController , getPendingRequestsController};
