const { callsService, markCallsReadService } = require("./call.service");
const twilio = require("twilio")

const callsController = async (req, res) => {
  try {
    const { id } = req.user;
    const callsHistory = await callsService(id);

    return res.status(200).json({
      success: true,
      message: "calls fetched successfully",
      calls: callsHistory,
    });
  } catch (err) {
    if (err.message === "user not found") {
      return res.status(404).json({ success: false, message: err.message });
    }
    if (err.message === "no calls found") {
      return res.status(204).json({ success: false, message: err.message });
    }
    return res.status(204).json({ success: false, message: err.message });
  }
};

const markCallsReadController = async (req, res) => {
  try {
    const { id } = req.user;
    await markCallsReadService(id);
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

const getTurnCredentials = async (req, res) => {
  try {
    const token = await client.tokens.create();

    return res.status(200).json({
      iceServers: token.iceServers,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to get TURN credentials" });
  }
};

module.exports = {
  callsController,
  markCallsReadController,
  getTurnCredentials,
};
