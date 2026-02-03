const { chatRoomService } = require("../../services/v1/chat.service");

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

module.exports = { chatRoomController };
