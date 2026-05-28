export interface NotificationPayload {
  title?: string;

  body?: string;

  data?: {
    type?: string;
    chatId?: string;
  };
}

export interface TokenItem {
  fcmToken: string;
}
