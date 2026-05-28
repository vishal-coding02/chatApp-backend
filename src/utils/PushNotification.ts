import admin from "../config/firebase";
import PushToken from "../modules/notification/notification.model";
import type {
  NotificationPayload,
  TokenItem,
} from "../interfaces/notification";

const sendPushNotification = async (
  userId: string,
  payload: NotificationPayload,
): Promise<void> => {
  try {
    const tokenDoc = await PushToken.findOne({
      userId,
    });

    if (!tokenDoc || tokenDoc.tokens.length === 0) {
      console.log("Token not found in DB");
      return;
    }

    for (const item of tokenDoc.tokens as TokenItem[]) {
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
      } catch (error: any) {
        console.error("FCM full error:", error);

        if (
          error.code === "messaging/registration-token-not-registered" ||
          error.code === "messaging/invalid-registration-token"
        ) {
          tokenDoc.tokens = tokenDoc.tokens.filter(
            (t: TokenItem) => t.fcmToken !== item.fcmToken,
          ) as typeof tokenDoc.tokens;

          await tokenDoc.save();
        }
      }
    }
  } catch (error: any) {
    console.error(error);
  }
};

export { sendPushNotification };
