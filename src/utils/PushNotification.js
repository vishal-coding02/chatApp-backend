const admin = require("../config/firebase.js");
const PushToken = require("../modules/notification/notification.model.js");

const sendPushNotification = async (userId, payload) => {
  try {
    const tokenDoc = await PushToken.findOne({ userId });

    if (!tokenDoc) {
      console.log("Token not found in DB");
      return;
    }

    const message = {
      token: tokenDoc.fcmToken,

      data: {
        title: payload.title || "New Message",
        body: payload.body || "",
        type: payload.data?.type || "",
        chatId: payload.data?.chatId?.toString() || "",
      },
    };

    await admin.messaging().send(message);
    console.log("Push sent successfully");
  } catch (error) {
    console.error("FCM full error:", error);
    if (
      error.code === "messaging/registration-token-not-registered" ||
      error.code === "messaging/invalid-registration-token"
    ) {
      await PushToken.findOneAndDelete({ userId });
    }
  }
};

module.exports = { sendPushNotification };
