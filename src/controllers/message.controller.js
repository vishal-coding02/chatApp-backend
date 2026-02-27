const {
  sendMessageService,
  getMessageService,
} = require("../services/message.service");

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
    const messages = await getMessageService(req.params.id);
    return res.status(200).json({
      success: true,
      message: "message fetched successfully",
      messages,
    });
  } catch (err) {
    if (err.message === "messages not found") {
      return res.status(404).json({
        success: false,
        error: err.message,
      });
    }

    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

module.exports = { sendMessageController, getMessageController };
