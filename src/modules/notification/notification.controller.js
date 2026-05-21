const PushToken = require("./notification.model");

const savePushToken = async (req, res) => {
  try {
    const { fcmToken, device } = req.body;
    const userId = req.user.id;

    if (!fcmToken) {
      return res.status(400).json({ message: "Token missing" });
    }

    const deviceName = device || "unknown";

    let tokenDoc = await PushToken.findOne({ userId });

    if (!tokenDoc) {
      await PushToken.create({
        userId,
        tokens: [{ fcmToken, device: deviceName }],
      });
      return res.status(200).json({ message: "Token saved" });
    }

    const existingDeviceIndex = tokenDoc.tokens.findIndex(
      (t) => t.device === deviceName,
    );

    if (existingDeviceIndex !== -1) {
      tokenDoc.tokens[existingDeviceIndex].fcmToken = fcmToken;
    } else {
      tokenDoc.tokens.push({ fcmToken, device: deviceName });
    }

    await tokenDoc.save();

    res.status(200).json({ message: "Token saved" });
  } catch (error) {
    console.error("Save token error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { savePushToken };
