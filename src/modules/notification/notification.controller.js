const PushToken = require("./notification.model");

const savePushToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    const userId = req.user.id;

    if (!fcmToken) {
      return res.status(400).json({ message: "Token missing" });
    }

    await PushToken.findOneAndUpdate(
      { userId },
      { fcmToken },
      { upsert: true, new: true },
    );

    res.status(200).json({ message: "Token saved" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { savePushToken };
