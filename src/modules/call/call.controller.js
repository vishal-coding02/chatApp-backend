const { missedCallsService } = require("./call.service");

const missedCallsController = async (req, res) => {
  try {
    const { id } = req.user;
    const missCalls = await missedCallsService(id);

    return res.status(200).json({
      success: true,
      message: "misscalls fetched successfully",
      missCalls,
    });
  } catch (err) {
    if (err.message === "user not found") {
      return res.status(404).json({ success: false, message: err.message });
    }
    if (err.message === "no misscalls found") {
      return res.status(204).json({ success: false, message: err.message });
    }
    return res.status(204).json({ success: false, message: err.message });
  }
};

module.exports = { missedCallsController };
