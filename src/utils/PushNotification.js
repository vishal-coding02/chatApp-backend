const admin = require("../config/firebase.js");
const PushToken = require("../modules/notification/notification.model.js");

const sendPushNotification = async (userId, payload) => {
  try {
    const tokenDoc = await PushToken.findOne({
      userId,
    });

    if (!tokenDoc || tokenDoc.tokens.length === 0) {
      console.log("Token not found in DB");
      return;
    }

    for (const item of tokenDoc.tokens) {
      try {
        const message = {
          token: item.fcmToken,

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
          tokenDoc.tokens = tokenDoc.tokens.filter(
            (t) => t.fcmToken !== item.fcmToken,
          );

          await tokenDoc.save();
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  sendPushNotification,
};
