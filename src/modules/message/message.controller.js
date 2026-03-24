const {
  sendMessageService,
  getMessageService,
  messageDeleteService,
} = require("../message/message.service");

const sendMessageController = async (req, res) => {
  try {
    const { id } = req.user;
    const result = await sendMessageService(req.body, id);

    return res
      .status(201)
      .json({ success: true, message: "message sent successfully", result });
  } catch (err) {
    if (
      err.message === "not allowed in this chat" ||
      err.message === "chat request pending, wait for accept"
    ) {
      return res.status(403).json({ success: false, error: err.message });
    }
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

const getMessageController = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { lastCreatedAt, limit } = req.query;

    const result = await getMessageService(
      conversationId,
      lastCreatedAt,
      parseInt(limit) || 20,
    );

    return res.status(200).json({
      success: true,
      message: "message fetched successfully",
      messages: result.messages,
      hasMore: result.hasMore,
    });
  } catch (err) {
    if (err.message === "messages not found") {
      return res.status(404).json({ success: false, error: err.message });
    }
    return res.status(400).json({ success: false, error: err.message });
  }
};

const messageDeleteController = async (req, res) => {
  try {
    const { messageId } = req.params;
    const result = await messageDeleteService(messageId, req.user);
    res.status(200).json({
      success: true,
      messaage: "Message deleted successfully",
      updatedChat: result.updatedChat,
    });
  } catch (err) {
    if (err.message === "Message not found") {
      return res.status(404).json({ success: false, message: err.message });
    }
    if (err.message === "You can only delete your own messages") {
      return res.status(403).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  sendMessageController,
  getMessageController,
  messageDeleteController,
};
